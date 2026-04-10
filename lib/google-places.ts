/**
 * Google Places API integration for fetching reviews
 * 
 * To use this:
 * 1. Get a Google Places API key from: https://console.cloud.google.com/
 * 2. Enable "Places API" in your Google Cloud project
 * 3. Add GOOGLE_PLACES_API_KEY to your .env file
 */

export interface GoogleReview {
  author_name: string
  author_url?: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

/**
 * Full review payload from Place Details. Note: Google's API returns at most 5 review
 * objects in `reviews` regardless of user_ratings_total — see
 * https://developers.google.com/maps/documentation/places/web-service/details
 */
export interface GooglePlaceReviewData {
  reviews: GoogleReview[]
  /** Google's aggregate star rating for the place */
  rating: number | null
  /** Total number of reviews on Google (e.g. 133) — not the length of `reviews` */
  userRatingsTotal: number | null
}

interface GooglePlaceDetails {
  result: {
    reviews?: GoogleReview[]
    rating?: number
    user_ratings_total?: number
  }
}

export async function getGooglePlaceReviewData(placeId: string): Promise<GooglePlaceReviewData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    console.warn("GOOGLE_PLACES_API_KEY not set. Google reviews will not be fetched.")
    return { reviews: [], rating: null, userRatingsTotal: null }
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews,rating,user_ratings_total&key=${apiKey}`

    const response = await fetch(url, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error(`Google Places API error: ${response.status}`)
      return { reviews: [], rating: null, userRatingsTotal: null }
    }

    const data: GooglePlaceDetails = await response.json()

    const result = data.result
    if (!result) {
      return { reviews: [], rating: null, userRatingsTotal: null }
    }

    return {
      reviews: result.reviews ?? [],
      rating: result.rating ?? null,
      userRatingsTotal: result.user_ratings_total ?? null,
    }
  } catch (error) {
    console.error("Error fetching Google reviews:", error)
    return { reviews: [], rating: null, userRatingsTotal: null }
  }
}

/** @deprecated Prefer getGooglePlaceReviewData — Google only returns up to 5 reviews; use userRatingsTotal for totals */
export async function getGoogleReviews(placeId: string): Promise<GoogleReview[]> {
  const data = await getGooglePlaceReviewData(placeId)
  return data.reviews
}

export async function getGooglePlaceRating(placeId: string): Promise<{
  rating: number | null
  totalRatings: number | null
}> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    return { rating: null, totalRatings: null }
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total&key=${apiKey}`
    
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      return { rating: null, totalRatings: null }
    }

    const data: GooglePlaceDetails = await response.json()

    return {
      rating: data.result?.rating || null,
      totalRatings: data.result?.user_ratings_total || null,
    }
  } catch (error) {
    console.error("Error fetching Google rating:", error)
    return { rating: null, totalRatings: null }
  }
}





