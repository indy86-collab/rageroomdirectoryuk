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
  if (inCity.some((listing) => listing.verified)) return true
  return (
    nearby.some((listing) => listing.verified) && getCityContent(city) != null
  )
}
