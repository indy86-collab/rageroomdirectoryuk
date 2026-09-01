import { getCityCentroid } from "@/lib/city-centroids"
import { calculateDistance } from "@/lib/distance"
import {
  formatPriceAmount,
  getActivityLabel,
  getListingHref,
  getListingPrimaryAction,
} from "@/lib/discovery"
import {
  getCanonicalCityLocation,
  listingMatchesCanonicalCity,
  regionToSlug,
} from "@/lib/location"
import type { TripLocation, TripQuery } from "@/lib/trip-query"
import type { Listing, ListingActivity } from "@/types/listing"

export const TRIP_RADIUS_MILES = 40
export const TRIP_OPTION_COUNT = 3

export type RankedTripListing = {
  listing: Listing
  distanceMiles: number
  score: number
  fitsGroup: boolean
  withinBudget: boolean | null
  occasionMatch: boolean
  optionLabel: string
}

function hasValidLocation(listing: Listing) {
  return (
    typeof listing.location?.lat === "number" &&
    typeof listing.location?.lng === "number" &&
    Number.isFinite(listing.location.lat) &&
    Number.isFinite(listing.location.lng)
  )
}

function listingFitsGroup(listing: Listing, groupSize: number | null) {
  if (groupSize == null) return true
  if (listing.groupSizeMax != null && groupSize > listing.groupSizeMax) return false
  if (listing.groupSizeMin != null && groupSize < listing.groupSizeMin) return false
  return true
}

function listingWithinBudget(listing: Listing, budget: number | null): boolean | null {
  if (budget == null) return null
  if (listing.price == null || listing.priceUnit !== "per-person") return null
  return listing.price <= budget
}

function listingMatchesOccasion(listing: Listing, query: TripQuery) {
  if (query.occasions.length === 0) return false
  return query.occasions.some((occasion) => listing.occasions.includes(occasion))
}

function primaryActivity(query: TripQuery): ListingActivity {
  return query.activities.includes("rage-room")
    ? "rage-room"
    : (query.activities[0] ?? "rage-room")
}

export function formatTripExperience(
  listing: Pick<Listing, "activities">,
  preferred: ListingActivity[] = []
) {
  const ordered = [
    ...preferred.filter((activity) => listing.activities.includes(activity)),
    ...listing.activities.filter((activity) => !preferred.includes(activity)),
  ]
  const labels = [...new Set(ordered.map((activity) => getActivityLabel(activity)))]
  if (labels.length === 0) return "Rage room"
  if (labels.length === 1) return labels[0]
  return `${labels[0]} + ${labels.slice(1, 3).join(" + ")}`
}

export function formatTripPrice(listing: Pick<Listing, "price" | "priceUnit">) {
  if (listing.price == null || listing.priceUnit == null) return "Price on request"
  if (listing.priceUnit === "per-person") return `${formatPriceAmount(listing.price)}/person`
  const unit =
    listing.priceUnit === "per-room"
      ? "per room"
      : listing.priceUnit === "per-group"
        ? "per group"
        : listing.priceUnit
  return `${formatPriceAmount(listing.price)} ${unit}`
}

export function listingIsBirthdaySuitable(listing: Listing) {
  return (
    listing.occasions.includes("birthdays") ||
    Boolean(listing.features?.includes("birthday-parties"))
  )
}

function averageOrigin(listings: Listing[]): { lat: number; lng: number } | null {
  const located = listings.filter(hasValidLocation)
  if (located.length === 0) return null
  const sum = located.reduce(
    (acc, listing) => ({
      lat: acc.lat + (listing.location.lat as number),
      lng: acc.lng + (listing.location.lng as number),
    }),
    { lat: 0, lng: 0 }
  )
  return {
    lat: sum.lat / located.length,
    lng: sum.lng / located.length,
  }
}

export function listingsForTripLocation(listings: Listing[], location: TripLocation) {
  if (location.kind === "postcode") return []
  if (location.kind === "region") {
    return listings.filter(
      (listing) =>
        listing.locationType !== "mobile-service" &&
        regionToSlug(listing.region) === location.slug
    )
  }
  const canonical = getCanonicalCityLocation(location.name)
  return listings.filter(
    (listing) =>
      listing.locationType !== "mobile-service" &&
      listingMatchesCanonicalCity(listing, canonical)
  )
}

export function resolveNamedOrigin(
  location: TripLocation,
  listings: Listing[]
): { lat: number; lng: number } | null {
  if (location.kind === "postcode") return null
  const centroid = getCityCentroid(location.name) ?? getCityCentroid(location.slug)
  if (centroid) return centroid
  return averageOrigin(listingsForTripLocation(listings, location))
}

export async function geocodeUkPostcode(postcode: string) {
  try {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`,
      { signal: AbortSignal.timeout(6_000), cache: "force-cache" }
    )
    if (!response.ok) return null
    const payload = (await response.json()) as {
      result?: { postcode?: string; latitude?: number; longitude?: number }
    }
    const lat = payload.result?.latitude
    const lng = payload.result?.longitude
    if (typeof lat !== "number" || typeof lng !== "number") return null
    return { lat, lng, postcode: payload.result?.postcode || postcode }
  } catch {
    return null
  }
}

function scoreListing(
  listing: Listing,
  distanceMiles: number,
  query: TripQuery
) {
  const fitsGroup = listingFitsGroup(listing, query.groupSize)
  const withinBudget = listingWithinBudget(listing, query.budgetPerPerson)
  const occasionMatch = listingMatchesOccasion(listing, query)
  const extraRequested = query.activities.filter(
    (activity) => activity !== primaryActivity(query) && listing.activities.includes(activity)
  ).length

  let score = 80 - distanceMiles * 2
  if (query.groupSize != null) {
    if (listing.groupSizeMax == null && listing.groupSizeMin == null) score += 8
    else if (fitsGroup) score += 40
    else score -= 60
  }
  if (withinBudget === true) score += 30
  else if (withinBudget === false) score -= 25
  else if (query.budgetPerPerson != null) score += 6
  if (occasionMatch) score += 20
  if (listing.onlineBooking) score += 8
  if (extraRequested > 0) score += 12
  else if (listing.activities.length > 1) score += 4

  return { score, fitsGroup, withinBudget, occasionMatch }
}

export function rankTripListings(
  listings: Listing[],
  origin: { lat: number; lng: number },
  query: TripQuery,
  options?: { radiusMiles?: number; optionCount?: number }
) {
  const radiusMiles = options?.radiusMiles ?? TRIP_RADIUS_MILES
  const optionCount = options?.optionCount ?? TRIP_OPTION_COUNT
  const required = primaryActivity(query)

  const ranked = listings
    .filter(
      (listing) =>
        listing.verified &&
        listing.locationType !== "mobile-service" &&
        hasValidLocation(listing) &&
        listing.activities.includes(required)
    )
    .map((listing) => {
      const distanceMiles = calculateDistance(
        origin.lat,
        origin.lng,
        listing.location.lat as number,
        listing.location.lng as number
      )
      const scored = scoreListing(listing, distanceMiles, query)
      return {
        listing,
        distanceMiles,
        ...scored,
        optionLabel: "",
      } satisfies RankedTripListing
    })
    .filter((row) => row.distanceMiles <= radiusMiles)
    .sort((left, right) => {
      if (left.fitsGroup !== right.fitsGroup) return left.fitsGroup ? -1 : 1
      if (right.score !== left.score) return right.score - left.score
      return left.distanceMiles - right.distanceMiles
    })

  const fitting = ranked.filter((row) => row.fitsGroup)
  const overflow = ranked.filter((row) => !row.fitsGroup)
  const optionSource = fitting.length > 0 ? fitting : ranked
  const topOptions = optionSource.slice(0, optionCount).map((row, index) => ({
    ...row,
    optionLabel: String.fromCharCode(65 + index),
  }))
  const optionIds = new Set(topOptions.map((row) => row.listing.id))
  const more = [...fitting, ...overflow]
    .filter((row) => !optionIds.has(row.listing.id))
    .map((row) => ({ ...row, optionLabel: "" }))

  return { options: topOptions, more }
}

export function tripOptionHref(listing: Listing) {
  const action = getListingPrimaryAction(listing)
  return action.kind === "booking" ? action.href : getListingHref(listing)
}
