"use client"

import { useState, useEffect } from "react"
import type { Listing } from "@/types/listing"
import Link from "next/link"
import TrackedBookingLink from "@/components/TrackedBookingLink"
import type { NearbyListingResult } from "@/lib/nearby-search"
import { formatListingPrice } from "@/lib/discovery"

interface NearMeMapProps {
  listings: Listing[]
}

export default function NearMeMap({ listings }: NearMeMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [sortedListings, setSortedListings] = useState<Listing[]>(listings)
  const [postcode, setPostcode] = useState("")
  const [postcodeResults, setPostcodeResults] = useState<NearbyListingResult[]>([])
  const [postcodeLabel, setPostcodeLabel] = useState("")
  const [postcodeStatus, setPostcodeStatus] = useState<"idle" | "loading" | "error">("idle")
  const [postcodeError, setPostcodeError] = useState("")
  const [mapLoaded, setMapLoaded] = useState(false)

  async function searchPostcode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPostcodeStatus("loading")
    setPostcodeError("")
    try {
      const response = await fetch(`/api/nearby?postcode=${encodeURIComponent(postcode)}`, {
        cache: "no-store",
      })
      const result = (await response.json()) as {
        postcode?: string
        results?: NearbyListingResult[]
        error?: string
      }
      if (!response.ok) throw new Error(result.error || "Unable to search that postcode")
      setPostcodeResults(result.results || [])
      setPostcodeLabel(result.postcode || postcode)
      setPostcodeStatus("idle")
    } catch (error) {
      setPostcodeResults([])
      setPostcodeStatus("error")
      setPostcodeError(error instanceof Error ? error.message : "Unable to search that postcode")
    }
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        const map: Record<number, string> = {
          1: "Location permission denied. Showing all venues.",
          2: "Location unavailable. Showing all venues.",
          3: "Location request timed out. Showing all venues.",
        }
        setLocationError(map[error.code] ?? "Unable to detect your location. Showing all venues.")
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 60_000,
      }
    )
  }, [])

  useEffect(() => {
    if (userLocation && listings.length > 0) {
      // Sort listings by distance
      const listingsWithDistance = listings
        .map((listing) => {
          const location = listing.location as { lat: number; lng: number } | null
          if (!location) return { listing, distance: Infinity }

          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            location.lat,
            location.lng
          )
          return { listing, distance }
        })
        .sort((a, b) => a.distance - b.distance)
        .map((item) => item.listing)

      setSortedListings(listingsWithDistance)
    }
  }, [userLocation, listings])

  // Haversine formula to calculate distance
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // When we have the user's location, zoom in to a city-level view;
  // otherwise show the whole UK centred.
  const mapCenter = userLocation || { lat: 54.7024, lng: -3.2766 }
  const zoom = userLocation ? 10 : 6

  // Google Maps embed URL (check for API key at runtime)
  // Note: NEXT_PUBLIC_ env vars are available in client components
  const hasApiKey = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const mapUrl = hasApiKey
    ? `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=${mapCenter.lat},${mapCenter.lng}&zoom=${zoom}`
    : null

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4 sm:p-5">
        <h3 className="text-lg font-semibold text-white">Find the closest venue by postcode</h3>
        <p className="mt-1 text-sm text-zinc-300">
          Your postcode is used only for this search and is not stored. Results stay on this page, so no thin postcode URLs are created for search engines.
        </p>
        <form onSubmit={searchPostcode} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="nearby-postcode">UK postcode</label>
          <input
            id="nearby-postcode"
            value={postcode}
            onChange={(event) => setPostcode(event.target.value)}
            placeholder="e.g. SW1A 1AA"
            autoComplete="postal-code"
            required
            maxLength={12}
            className="min-h-[44px] flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-4 text-white placeholder:text-zinc-600 focus:border-orange-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={postcodeStatus === "loading"}
            className="min-h-[44px] rounded-md bg-orange-500 px-5 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {postcodeStatus === "loading" ? "Searching…" : "Find nearest venues"}
          </button>
        </form>
        {postcodeStatus === "error" && (
          <p role="alert" className="mt-3 text-sm text-red-300">{postcodeError}</p>
        )}
      </div>

      {postcodeResults.length > 0 && (
        <section aria-live="polite">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Closest verified rage rooms to {postcodeLabel}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {postcodeResults.map((result) => (
              <article key={result.id} className="rounded-lg border border-zinc-800 bg-[#1a1a1a] p-4">
                <Link href={`/listing/${result.slug}`} className="font-semibold text-white hover:text-orange-500">
                  {result.name}
                </Link>
                <p className="mt-1 text-sm text-zinc-400">
                  {result.city}{result.region ? `, ${result.region}` : ""}
                </p>
                <p className="mt-2 font-medium text-orange-500">{result.distanceMiles.toFixed(1)} miles away</p>
                <p className="mt-1 text-sm text-zinc-300">
                  {formatListingPrice(result) ?? "Price not provided"}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                  <Link href={`/listing/${result.slug}`} className="text-orange-500 hover:text-orange-400">View details</Link>
                  {result.bookingUrl && (
                    <TrackedBookingLink
                      href={result.bookingUrl}
                      venueSlug={result.slug}
                      venueCity={result.city}
                      context={{ pageType: "search_results", discoveryLocation: "near_me" }}
                      ctaPlacement="near_me_results"
                      className="text-zinc-300 hover:text-white"
                    >
                      Book direct
                    </TrackedBookingLink>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-500">Postcode geocoding by Postcodes.io.</p>
        </section>
      )}

      {userLocation && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 text-sm">
            ✓ Location detected! Showing rage rooms sorted by distance from you.
          </p>
        </div>
      )}

      {locationError && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">{locationError}</p>
        </div>
      )}

      {/* Google Maps Embed */}
      <div className="w-full h-96 rounded-lg overflow-hidden border border-zinc-700">
        {mapUrl && mapLoaded ? (
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
            title="Rage Rooms Map"
          />
        ) : mapUrl ? (
          <button
            type="button"
            onClick={() => setMapLoaded(true)}
            className="flex h-full w-full flex-col items-center justify-center bg-zinc-800 p-6 text-center text-zinc-300 hover:bg-zinc-700 hover:text-white"
          >
            <span className="font-semibold">Load interactive Google Map</span>
            <span className="mt-2 max-w-md text-sm text-zinc-400">
              The map loads only when requested and will contact Google, which may receive device and request information.
            </span>
          </button>
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-zinc-400 mb-4">Interactive map coming soon</p>
              <p className="text-sm text-zinc-500">
                Browse rage rooms by city using the directory below
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Nearby Listings (if location detected) */}
      {userLocation && sortedListings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Rage Rooms Near You (Sorted by Distance)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedListings.slice(0, 6).map((listing) => {
              const location = listing.location as { lat: number; lng: number } | null
              const distance = location
                ? calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    location.lat,
                    location.lng
                  )
                : null

              return (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.slug || listing.id}`}
                  className="bg-[#1a1a1a] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-4 transition-all"
                >
                  <h4 className="text-white font-semibold mb-2">{listing.name}</h4>
                  <p className="text-sm text-zinc-400 mb-1">
                    {listing.city}
                    {listing.region && `, ${listing.region}`}
                  </p>
                  {distance !== null && (
                    <p className="text-sm text-orange-500 font-medium">
                      {distance < 1
                        ? `${Math.round(distance * 1000)}m away`
                        : `${distance.toFixed(1)} km away`}
                    </p>
                  )}
                  {formatListingPrice(listing) && (
                    <p className="text-sm text-zinc-300 mt-2">
                      {formatListingPrice(listing)}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
