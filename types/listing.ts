export interface ListingLocation {
  lat: number | null
  lng: number | null
}

export const LISTING_FEATURES = [
  "byo-smashables",
  "corporate-groups",
  "birthday-parties",
  "hen-stag-parties",
  "couples",
  "mobile-experience",
  "accessible-venue",
  "video-recording",
] as const

export type ListingFeature = (typeof LISTING_FEATURES)[number]

export interface ListingMedia {
  type: "image" | "video"
  url: string
  thumbnailUrl?: string | null
  alt: string
  caption?: string | null
  width?: number | null
  height?: number | null
  credit?: string | null
  sourceUrl?: string | null
  /** True only when the venue/creator has authorised directory use. */
  authorised: boolean
}

export interface Listing {
  id: string
  name: string
  description: string
  city: string
  region: string
  postcode: string
  location: ListingLocation
  website: string | null
  bookingUrl?: string | null
  phone: string | null
  price: number | null
  priceNote?: string | null
  ageMin?: number | null
  openingHours?: string[] | null
  lastVerified?: string | null
  sessionLengths?: number[] | null
  groupSizeMin?: number | null
  groupSizeMax?: number | null
  features?: ListingFeature[] | null
  media?: ListingMedia[] | null
  packages?: Array<{
    name: string
    price?: number | null
    priceNote?: string | null
    description?: string | null
    url?: string | null
  }> | null
  sourceUrl?: string | null
  image: string | null
  verified: boolean
  googlePlaceId: string | null
  slug: string | null
  createdAt: string
}

export interface ListingWithReviews extends Listing {
  reviews: []
}
