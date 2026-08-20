export interface ListingLocation {
  lat: number | null
  lng: number | null
}

export const LISTING_LOCATION_TYPES = ["fixed-venue", "mobile-service"] as const

export type ListingLocationType = (typeof LISTING_LOCATION_TYPES)[number]

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

export const LISTING_ACTIVITIES = [
  "rage-room",
  "axe-throwing",
  "paint-splatter",
  "car-smash",
  "escape-room",
  "archery",
  "vr",
  "airsoft-target",
  "mobile-rage-room",
] as const

export type ListingActivity = (typeof LISTING_ACTIVITIES)[number]

export const LISTING_OCCASIONS = [
  "birthdays",
  "stag-parties",
  "hen-parties",
  "corporate-team-building",
  "date-nights",
  "families",
  "kids",
] as const

export type ListingOccasion = (typeof LISTING_OCCASIONS)[number]

export const LISTING_PRICE_UNITS = [
  "per-person",
  "per-room",
  "per-group",
] as const

export type ListingPriceUnit = (typeof LISTING_PRICE_UNITS)[number]

export const LISTING_DURATION_TYPES = [
  "activity-time",
  "total-booking",
  "published-session",
] as const

export type ListingDurationType = (typeof LISTING_DURATION_TYPES)[number]

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
  /** Defaults to fixed-venue for legacy records. Mobile services must publish serviceAreas. */
  locationType?: ListingLocationType
  streetAddress?: string | null
  city: string
  region: string
  postcode: string
  serviceAreas?: string[] | null
  location: ListingLocation
  website: string | null
  bookingUrl?: string | null
  phone: string | null
  /** Lowest supported price for the listing's primary published activity. Never a calculated package division. */
  price: number | null
  priceCurrency?: "GBP" | null
  priceUnit?: ListingPriceUnit | null
  priceNote?: string | null
  ageMin?: number | null
  minimumAgeNote?: string | null
  openingHours?: string[] | null
  lastVerified?: string | null
  sessionLengths?: number[] | null
  sessionDurationType?: ListingDurationType | null
  sessionDurationNote?: string | null
  groupSizeMin?: number | null
  groupSizeMax?: number | null
  groupSizeNote?: string | null
  features?: ListingFeature[] | null
  /** Structured discovery categories. At least one supported activity is required. */
  activities: ListingActivity[]
  /** Evidence-backed occasion suitability; an empty array means not yet confirmed. */
  occasions: ListingOccasion[]
  walkInsAccepted?: boolean | null
  onlineBooking?: boolean | null
  giftVouchers?: boolean | null
  corporatePackages?: boolean | null
  privateHire?: boolean | null
  accessibility?: boolean | null
  rating?: number | null
  reviewCount?: number | null
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
