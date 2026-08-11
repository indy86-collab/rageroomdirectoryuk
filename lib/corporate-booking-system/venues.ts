import type { Listing } from "@/types/listing"
import type { VenueProfile } from "./types"

export type DirectoryVenueOption = {
  id: string
  slug: string | null
  name: string
  city: string
  website: string | null
  phone: string | null
  price: number | null
  groupSizeMax: number | null
  sessionLengths: number[] | null
}

export function listingToDirectoryOption(listing: Listing): DirectoryVenueOption {
  return {
    id: listing.id,
    slug: listing.slug,
    name: listing.name,
    city: listing.city,
    website: listing.website,
    phone: listing.phone,
    price: listing.price,
    groupSizeMax: listing.groupSizeMax ?? null,
    sessionLengths: listing.sessionLengths ?? null,
  }
}

/** Prefill workspace venue fields from a directory listing (editable afterwards). */
export function prefillVenueFromListing(
  current: VenueProfile,
  listing: Listing
): VenueProfile {
  return {
    ...current,
    businessName: current.businessName || listing.name,
    city: current.city || listing.city,
    website: current.website || listing.website || "",
    telephone: current.telephone || listing.phone || "",
    publicStartingPrice:
      current.publicStartingPrice ?? listing.price ?? null,
    maxGroupSize: current.maxGroupSize ?? listing.groupSizeMax ?? null,
    typicalSessionMinutes:
      current.typicalSessionMinutes ??
      listing.sessionLengths?.[0] ??
      current.typicalSessionMinutes,
    address:
      current.address ||
      [listing.city, listing.region, listing.postcode].filter(Boolean).join(", "),
    listingId: listing.id,
    listingSlug: listing.slug,
  }
}
