import { getCityContent } from "@/lib/city-content"
import type { Listing } from "@/types/listing"

/**
 * In-city inventory is useful on its own. Nearby-only pages must also have
 * curated local context so we do not index hundreds of interchangeable pages.
 */
export function isIndexableLocationPage({
  city,
  inCity,
  nearby,
}: {
  city: string
  inCity: Listing[]
  nearby: Listing[]
}) {
  const verifiedInCity = inCity.filter((listing) => listing.verified).length
  const verifiedNearby = nearby.filter((listing) => listing.verified).length

  // Index pages that support a real comparison, not one-venue doorway pages.
  if (verifiedInCity >= 2) return true
  return getCityContent(city) != null && verifiedInCity + verifiedNearby >= 3
}

export function isIndexableRegionPage(listings: Listing[]) {
  return listings.filter((listing) => listing.verified).length >= 3
}
