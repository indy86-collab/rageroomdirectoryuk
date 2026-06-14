export interface ListingLocation {
  lat: number | null
  lng: number | null
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
