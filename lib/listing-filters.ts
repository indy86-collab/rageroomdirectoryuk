import type { Listing, ListingActivity, ListingOccasion } from "@/types/listing"

export type ListingSortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "distance"
  | "name"

export interface ListingFilterState {
  activities: ListingActivity[]
  occasions: ListingOccasion[]
  city: string
  maxPerPersonPrice: number | null
  visitorAge: number | null
  groupSize: number | null
  minimumRating: number | null
  onlineBookingOnly: boolean
  corporateOnly: boolean
  verifiedOnly: boolean
  maximumDistanceMiles: number | null
  sortBy: ListingSortOption
}

export function filterAndSortListings(
  listings: Listing[],
  filters: ListingFilterState,
  distanceFor: (listing: Listing) => number | null = () => null
) {
  const filtered = listings.filter((listing) => {
    // Multi-select categories deliberately use AND: every selected value must
    // be explicitly present on the listing.
    if (!filters.activities.every((activity) => listing.activities.includes(activity))) return false
    if (!filters.occasions.every((occasion) => listing.occasions.includes(occasion))) return false
    if (filters.city && listing.city !== filters.city) return false
    if (filters.verifiedOnly && !listing.verified) return false
    if (filters.onlineBookingOnly && listing.onlineBooking !== true) return false
    if (filters.corporateOnly && listing.corporatePackages !== true) return false
    if (
      filters.maxPerPersonPrice != null &&
      (listing.price == null ||
        listing.priceUnit !== "per-person" ||
        listing.price > filters.maxPerPersonPrice)
    ) return false
    if (
      filters.visitorAge != null &&
      (listing.ageMin == null || listing.ageMin > filters.visitorAge)
    ) return false
    if (
      filters.groupSize != null &&
      (listing.groupSizeMin == null ||
        listing.groupSizeMax == null ||
        filters.groupSize < listing.groupSizeMin ||
        filters.groupSize > listing.groupSizeMax)
    ) return false
    if (
      filters.minimumRating != null &&
      (listing.rating == null || listing.rating < filters.minimumRating)
    ) return false
    if (filters.maximumDistanceMiles != null) {
      const distance = distanceFor(listing)
      if (distance == null || distance > filters.maximumDistanceMiles) return false
    }
    return true
  })

  return filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case "price-asc": {
        const aPrice = a.priceUnit === "per-person" ? a.price : null
        const bPrice = b.priceUnit === "per-person" ? b.price : null
        return (aPrice ?? Number.POSITIVE_INFINITY) - (bPrice ?? Number.POSITIVE_INFINITY)
      }
      case "price-desc": {
        const aPrice = a.priceUnit === "per-person" ? a.price : null
        const bPrice = b.priceUnit === "per-person" ? b.price : null
        if (aPrice == null && bPrice == null) return 0
        if (aPrice == null) return 1
        if (bPrice == null) return -1
        return bPrice - aPrice
      }
      case "rating":
        return (b.rating ?? Number.NEGATIVE_INFINITY) - (a.rating ?? Number.NEGATIVE_INFINITY)
      case "distance":
        return (distanceFor(a) ?? Number.POSITIVE_INFINITY) - (distanceFor(b) ?? Number.POSITIVE_INFINITY)
      case "name":
        return a.name.localeCompare(b.name)
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })
}
