import type { Listing } from "@/types/listing"
import type { VenueSearchResult, VenueShortlistItem } from "./types"

export function listingToVenueSearchResult(listing: Listing): VenueSearchResult {
  return {
    id: listing.id,
    name: listing.name,
    city: listing.city,
    region: listing.region,
    price: listing.price,
    priceNote: listing.priceNote ?? null,
    website: listing.website,
    listingPath: `/listing/${listing.slug || listing.id}`,
    groupSizeMin: listing.groupSizeMin ?? null,
    groupSizeMax: listing.groupSizeMax ?? null,
    hasCorporateGroups: Boolean(listing.features?.includes("corporate-groups")),
    sessionLengths: listing.sessionLengths ?? null,
  }
}

export function toShortlistItem(
  venue: VenueSearchResult,
  notes = ""
): VenueShortlistItem {
  return {
    listingId: venue.id,
    name: venue.name,
    city: venue.city,
    region: venue.region,
    price: venue.price,
    priceNote: venue.priceNote,
    website: venue.website,
    listingPath: venue.listingPath,
    groupSizeMin: venue.groupSizeMin,
    groupSizeMax: venue.groupSizeMax,
    hasCorporateGroups: venue.hasCorporateGroups,
    notes,
  }
}

export function displayOrCheck(value: string | number | null | undefined) {
  if (value == null || value === "") return "Check with venue"
  return String(value)
}
