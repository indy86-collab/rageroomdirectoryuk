"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, LocateFixed, SlidersHorizontal } from "lucide-react"
import type {
  Listing,
  ListingActivity,
  ListingOccasion,
} from "@/types/listing"
import { LISTING_ACTIVITIES, LISTING_OCCASIONS } from "@/types/listing"
import {
  ACTIVITY_DEFINITIONS,
  OCCASION_DEFINITIONS,
} from "@/lib/discovery"
import { calculateDistance } from "@/lib/distance"
import {
  filterAndSortListings,
  type ListingSortOption,
} from "@/lib/listing-filters"
import { trackDiscoveryFilterApplied } from "@/lib/analytics"

interface ListingFiltersProps {
  listings: Listing[]
  onFiltered: (filtered: Listing[]) => void
  showActivities?: boolean
  showOccasions?: boolean
  discoveryContext?: {
    surface: "activity" | "occasion" | "directory"
    slug?: string
  }
}

interface Coordinates {
  lat: number
  lng: number
}

const controlClass =
  "w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white focus:border-rage-500 focus:outline-none focus:ring-1 focus:ring-rage-500"

export default function ListingFilters({
  listings,
  onFiltered,
  showActivities = true,
  showOccasions = true,
  discoveryContext = { surface: "directory" },
}: ListingFiltersProps) {
  const [urlStateReady, setUrlStateReady] = useState(false)
  const [activities, setActivities] = useState<ListingActivity[]>([])
  const [occasions, setOccasions] = useState<ListingOccasion[]>([])
  const [city, setCity] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [visitorAge, setVisitorAge] = useState("")
  const [groupSize, setGroupSize] = useState("")
  const [minimumRating, setMinimumRating] = useState("")
  const [onlineBookingOnly, setOnlineBookingOnly] = useState(false)
  const [corporateOnly, setCorporateOnly] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [distanceMiles, setDistanceMiles] = useState("")
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [sortBy, setSortBy] = useState<ListingSortOption>("newest")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const lastTrackedFilterState = useRef<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const selectedActivities = (params.get("activities")?.split(",") ?? []).filter(
      (value): value is ListingActivity => LISTING_ACTIVITIES.includes(value as ListingActivity)
    )
    const selectedOccasions = (params.get("occasions")?.split(",") ?? []).filter(
      (value): value is ListingOccasion => LISTING_OCCASIONS.includes(value as ListingOccasion)
    )
    const selectedSort = params.get("sort") as ListingSortOption | null
    setActivities(selectedActivities)
    setOccasions(selectedOccasions)
    setCity(params.get("city") ?? "")
    setMaxPrice(params.get("maxPrice") ?? "")
    setVisitorAge(params.get("age") ?? "")
    setGroupSize(params.get("group") ?? "")
    setMinimumRating(params.get("rating") ?? "")
    setOnlineBookingOnly(params.get("online") === "1")
    setCorporateOnly(params.get("corporate") === "1")
    setVerifiedOnly(params.get("verified") === "1")
    setSortBy(
      selectedSort && ["newest", "price-asc", "price-desc", "rating", "distance", "name"].includes(selectedSort)
        ? selectedSort
        : "newest"
    )
    setUrlStateReady(true)
  }, [])

  useEffect(() => {
    if (!urlStateReady) return
    const params = new URLSearchParams()
    if (activities.length) params.set("activities", activities.join(","))
    if (occasions.length) params.set("occasions", occasions.join(","))
    if (city) params.set("city", city)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (visitorAge) params.set("age", visitorAge)
    if (groupSize) params.set("group", groupSize)
    if (minimumRating) params.set("rating", minimumRating)
    if (onlineBookingOnly) params.set("online", "1")
    if (corporateOnly) params.set("corporate", "1")
    if (verifiedOnly) params.set("verified", "1")
    if (sortBy !== "newest" && sortBy !== "distance") params.set("sort", sortBy)
    const query = params.toString()
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`
    window.history.replaceState(window.history.state, "", nextUrl)
  }, [
    activities,
    city,
    corporateOnly,
    groupSize,
    maxPrice,
    minimumRating,
    occasions,
    onlineBookingOnly,
    sortBy,
    urlStateReady,
    verifiedOnly,
    visitorAge,
  ])

  const cities = useMemo(
    () => [...new Set(listings.map((listing) => listing.city).filter(Boolean))].sort(),
    [listings]
  )
  const listedPrices = useMemo(
    () => listings
      .filter((listing) => listing.priceUnit === "per-person")
      .map((listing) => listing.price)
      .filter((price): price is number => price != null),
    [listings]
  )
  const highestPrice = listedPrices.length ? Math.ceil(Math.max(...listedPrices)) : 100

  useEffect(() => {
    const maxPriceValue = maxPrice ? Number(maxPrice) : null
    const visitorAgeValue = visitorAge ? Number(visitorAge) : null
    const groupSizeValue = groupSize ? Number(groupSize) : null
    const ratingValue = minimumRating ? Number(minimumRating) : null
    const distanceValue = distanceMiles ? Number(distanceMiles) : null

    const distanceFor = (listing: Listing) => {
      if (
        !userLocation ||
        typeof listing.location?.lat !== "number" ||
        typeof listing.location?.lng !== "number"
      ) {
        return null
      }
      return calculateDistance(
        userLocation.lat,
        userLocation.lng,
        listing.location.lat,
        listing.location.lng
      )
    }

    const filtered = filterAndSortListings(
      listings,
      {
        activities,
        occasions,
        city,
        maxPerPersonPrice: maxPriceValue,
        visitorAge: visitorAgeValue,
        groupSize: groupSizeValue,
        minimumRating: ratingValue,
        onlineBookingOnly,
        corporateOnly,
        verifiedOnly,
        maximumDistanceMiles: distanceValue,
        sortBy,
      },
      distanceFor
    )

    onFiltered(filtered)
    if (urlStateReady) {
      const filterState = new URLSearchParams({
        ...(activities.length ? { activities: activities.join(",") } : {}),
        ...(occasions.length ? { occasions: occasions.join(",") } : {}),
        ...(city ? { city } : {}),
        ...(maxPrice ? { maxPrice } : {}),
        ...(visitorAge ? { age: visitorAge } : {}),
        ...(groupSize ? { group: groupSize } : {}),
        ...(minimumRating ? { rating: minimumRating } : {}),
        ...(onlineBookingOnly ? { online: "1" } : {}),
        ...(corporateOnly ? { corporate: "1" } : {}),
        ...(verifiedOnly ? { verified: "1" } : {}),
        ...(distanceMiles ? { distance: distanceMiles } : {}),
        ...(sortBy !== "newest" ? { sort: sortBy } : {}),
      }).toString()

      if (filterState && filterState !== lastTrackedFilterState.current) {
        trackDiscoveryFilterApplied({
          surface: discoveryContext.surface,
          slug: discoveryContext.slug,
          filterState,
          resultCount: filtered.length,
        })
      }
      lastTrackedFilterState.current = filterState
    }
  }, [
    activities,
    city,
    corporateOnly,
    distanceMiles,
    groupSize,
    listings,
    maxPrice,
    minimumRating,
    occasions,
    onlineBookingOnly,
    onFiltered,
    sortBy,
    userLocation,
    verifiedOnly,
    visitorAge,
    urlStateReady,
    discoveryContext.surface,
    discoveryContext.slug,
  ])

  const toggleActivity = (activity: ListingActivity) => {
    setActivities((current) =>
      current.includes(activity)
        ? current.filter((value) => value !== activity)
        : [...current, activity]
    )
  }

  const toggleOccasion = (occasion: ListingOccasion) => {
    setOccasions((current) =>
      current.includes(occasion)
        ? current.filter((value) => value !== occasion)
        : [...current, occasion]
    )
  }

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("error")
      return
    }
    setLocationStatus("loading")
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ lat: coords.latitude, lng: coords.longitude })
        setDistanceMiles((current) => current || "25")
        setSortBy("distance")
        setLocationStatus("ready")
      },
      () => setLocationStatus("error"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    )
  }

  const reset = () => {
    setActivities([])
    setOccasions([])
    setCity("")
    setMaxPrice("")
    setVisitorAge("")
    setGroupSize("")
    setMinimumRating("")
    setOnlineBookingOnly(false)
    setCorporateOnly(false)
    setVerifiedOnly(false)
    setDistanceMiles("")
    setUserLocation(null)
    setLocationStatus("idle")
    setSortBy("newest")
  }

  return (
    <aside className="mb-8 rounded-lg border border-zinc-800 bg-[#181818] p-4 sm:p-5" aria-label="Venue filters">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((open) => !open)}
          className="flex min-h-11 flex-1 items-center gap-2 text-left text-lg font-bold text-white lg:pointer-events-none"
          aria-expanded={mobileFiltersOpen}
        >
          <SlidersHorizontal className="h-5 w-5 text-rage-500" />
          Filter venues
          <ChevronDown className={`ml-auto h-4 w-4 transition-transform lg:hidden ${mobileFiltersOpen ? "rotate-180" : ""}`} />
        </button>
        <button type="button" onClick={reset} className="min-h-11 text-xs font-bold uppercase tracking-wider text-rage-400 hover:text-rage-300">
          Reset
        </button>
      </div>

      <div className={`${mobileFiltersOpen ? "block" : "hidden"} mt-5 space-y-6 lg:block`}>
        {showActivities && <fieldset>
          <legend className="mb-2 text-sm font-bold text-white">Activities</legend>
          <p className="mb-3 text-xs text-zinc-500">Select more than one to find venue combinations.</p>
          <div className="space-y-2">
            {ACTIVITY_DEFINITIONS.filter((activity) =>
              listings.some((listing) => listing.activities.includes(activity.value))
            ).map((activity) => (
              <label key={activity.value} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={activities.includes(activity.value)}
                  onChange={() => toggleActivity(activity.value)}
                  className="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-rage-500 focus:ring-rage-500"
                />
                <span aria-hidden="true">{activity.emoji}</span>
                {activity.shortLabel}
              </label>
            ))}
          </div>
        </fieldset>}

        {showOccasions && <fieldset>
          <legend className="mb-2 text-sm font-bold text-white">Occasions</legend>
          <div className="space-y-2">
            {OCCASION_DEFINITIONS.filter((definition) =>
              listings.some((listing) => definition.values.some((value) => listing.occasions.includes(value)))
            ).flatMap((definition) =>
              definition.values.length === 1
                ? [{ value: definition.values[0], label: definition.shortLabel, emoji: definition.emoji }]
                : definition.values.map((value) => ({
                    value,
                    label: value === "kids" ? "Kids" : "Families",
                    emoji: definition.emoji,
                  }))
            ).map((occasion) => (
              <label key={occasion.value} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={occasions.includes(occasion.value)}
                  onChange={() => toggleOccasion(occasion.value)}
                  className="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-rage-500 focus:ring-rage-500"
                />
                <span aria-hidden="true">{occasion.emoji}</span>
                {occasion.label}
              </label>
            ))}
          </div>
        </fieldset>}

        <div>
          <label htmlFor="filter-city" className="mb-2 block text-sm font-bold text-white">Location</label>
          <select id="filter-city" value={city} onChange={(event) => setCity(event.target.value)} className={controlClass}>
            <option value="">All UK locations</option>
            {cities.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <label htmlFor="filter-distance" className="text-sm font-bold text-white">Distance</label>
            <button type="button" onClick={requestLocation} className="inline-flex items-center gap-1 text-xs font-semibold text-rage-400 hover:text-rage-300">
              <LocateFixed className="h-3.5 w-3.5" />
              {locationStatus === "loading" ? "Locating…" : locationStatus === "ready" ? "Location set" : "Use my location"}
            </button>
          </div>
          <select
            id="filter-distance"
            value={distanceMiles}
            onChange={(event) => setDistanceMiles(event.target.value)}
            disabled={!userLocation}
            className={`${controlClass} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <option value="">Any distance</option>
            {[10, 25, 50, 100].map((miles) => <option key={miles} value={miles}>Within {miles} miles</option>)}
          </select>
          {locationStatus === "error" && <p role="status" className="mt-2 text-xs text-amber-400">Location access was unavailable. You can still filter by city.</p>}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 xl:grid-cols-2">
          <div>
            <label htmlFor="filter-price" className="mb-2 block text-xs font-bold text-white">Max per-person price</label>
            <input id="filter-price" type="number" min="0" max={highestPrice} placeholder="e.g. 30" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className={controlClass} />
          </div>
          <div>
            <label htmlFor="filter-age" className="mb-2 block text-xs font-bold text-white">Participant age</label>
            <input id="filter-age" type="number" min="4" max="100" placeholder="e.g. 14" value={visitorAge} onChange={(event) => setVisitorAge(event.target.value)} className={controlClass} />
          </div>
          <div>
            <label htmlFor="filter-group" className="mb-2 block text-xs font-bold text-white">Group size</label>
            <input id="filter-group" type="number" min="1" max="100" placeholder="e.g. 6" value={groupSize} onChange={(event) => setGroupSize(event.target.value)} className={controlClass} />
          </div>
          <div>
            <label htmlFor="filter-rating" className="mb-2 block text-xs font-bold text-white">Minimum rating</label>
            <select id="filter-rating" value={minimumRating} onChange={(event) => setMinimumRating(event.target.value)} className={controlClass}>
              <option value="">Any rating</option>
              <option value="3">3.0+</option>
              <option value="4">4.0+</option>
              <option value="4.5">4.5+</option>
            </select>
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="sr-only">Booking options</legend>
          {[
            { label: "Online booking", checked: onlineBookingOnly, change: setOnlineBookingOnly },
            { label: "Corporate packages", checked: corporateOnly, change: setCorporateOnly },
            { label: "Verified venues only", checked: verifiedOnly, change: setVerifiedOnly },
          ].map((option) => (
            <label key={option.label} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" checked={option.checked} onChange={(event) => option.change(event.target.checked)} className="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-rage-500 focus:ring-rage-500" />
              {option.label}
            </label>
          ))}
        </fieldset>

        <div>
          <label htmlFor="filter-sort" className="mb-2 block text-sm font-bold text-white">Sort by</label>
          <select id="filter-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value as ListingSortOption)} className={controlClass}>
            <option value="newest">Newest first</option>
            <option value="price-asc">Per-person price: low to high</option>
            <option value="price-desc">Per-person price: high to low</option>
            <option value="rating">Highest rated</option>
            <option value="distance" disabled={!userLocation}>Nearest first</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>
    </aside>
  )
}
