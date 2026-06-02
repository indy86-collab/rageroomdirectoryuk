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
  phone: string | null
  price: number | null
  image: string | null
  verified: boolean
  googlePlaceId: string | null
  slug: string | null
  createdAt: string
}

export interface ListingWithReviews extends Listing {
  reviews: []
}
