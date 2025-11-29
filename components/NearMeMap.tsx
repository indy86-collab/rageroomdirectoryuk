"use client"

import { useState, useEffect } from "react"
import { Listing } from "@prisma/client"
import Link from "next/link"

interface NearMeMapProps {
  listings: Listing[]
}

export default function NearMeMap({ listings }: NearMeMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [sortedListings, setSortedListings] = useState<Listing[]>(listings)

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          setLocationError("Unable to detect your location. Showing all venues.")
        }
      )
    } else {
      setLocationError("Geolocation is not supported by your browser.")
    }
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

  // Get map center (user location or UK center)
  const mapCenter = userLocation || { lat: 54.7024, lng: -3.2766 } // Center of UK
  const zoom = userLocation ? 6 : 6

  // Google Maps embed URL (check for API key at runtime)
  // Note: NEXT_PUBLIC_ env vars are available in client components
  const hasApiKey = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const mapUrl = hasApiKey
    ? `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=${mapCenter.lat},${mapCenter.lng}&zoom=${zoom}`
    : null

  return (
    <div className="space-y-6">
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
        {mapUrl ? (
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
                  {listing.price && (
                    <p className="text-sm text-zinc-300 mt-2">
                      From £{listing.price.toFixed(0)} per person
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

