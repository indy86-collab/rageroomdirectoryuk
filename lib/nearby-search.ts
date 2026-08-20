import { calculateDistance } from "@/lib/distance"
import type { Listing, ListingPriceUnit } from "@/types/listing"

export interface NearbyListingResult {
  id: string
  slug: string
  name: string
  city: string
  region: string
  postcode: string
  distanceMiles: number
  price: number | null
  priceUnit: ListingPriceUnit | null
  bookingUrl: string | null
  verified: boolean
}

export function findNearestListings(
  listings: Listing[],
  origin: { lat: number; lng: number },
  limit = 6
): NearbyListingResult[] {
  return listings
    .filter(
      (listing) =>
        listing.verified &&
        typeof listing.location?.lat === "number" &&
        typeof listing.location?.lng === "number"
    )
    .map((listing) => ({
      id: listing.id,
      slug: listing.slug || listing.id,
      name: listing.name,
      city: listing.city,
      region: listing.region,
      postcode: listing.postcode,
      distanceMiles: calculateDistance(
        origin.lat,
        origin.lng,
        listing.location.lat as number,
        listing.location.lng as number
      ),
      price: listing.price,
      priceUnit: listing.priceUnit ?? null,
      bookingUrl: listing.bookingUrl || listing.website,
      verified: listing.verified,
    }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, Math.max(1, Math.min(limit, 20)))
}
