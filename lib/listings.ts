import listingsData from "@/data/listings.json"
import type {
  Listing,
  ListingActivity,
  ListingOccasion,
  ListingWithReviews,
} from "@/types/listing"
import { getCanonicalCityLocation, listingMatchesCanonicalCity } from "@/lib/location"

let cachedListings: Listing[] | null = null

function loadListings(): Listing[] {
  if (!cachedListings) {
    cachedListings = listingsData as Listing[]
  }
  return cachedListings
}

function sortByCreatedAtDesc(listings: Listing[]): Listing[] {
  return [...listings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

function matchesSearch(listing: Listing, searchTerm: string): boolean {
  const term = searchTerm.toLowerCase()
  return (
    listing.name.toLowerCase().includes(term) ||
    listing.city.toLowerCase().includes(term) ||
    listing.region.toLowerCase().includes(term) ||
    listing.postcode.toLowerCase().includes(term)
  )
}

function hasValidLocation(listing: Listing): boolean {
  const loc = listing.location
  return (
    loc != null &&
    typeof loc.lat === "number" &&
    typeof loc.lng === "number" &&
    Number.isFinite(loc.lat) &&
    Number.isFinite(loc.lng)
  )
}

export async function getFeaturedListings(
  limit: number = 6,
  options?: { excludeSlugs?: string[] }
): Promise<Listing[]> {
  const allListings = sortByCreatedAtDesc(loadListings())

  const exclude = new Set(options?.excludeSlugs ?? [])
  const pool =
    exclude.size === 0
      ? allListings
      : allListings.filter((l) => !l.slug || !exclude.has(l.slug))

  if (pool.length <= limit) {
    return pool
  }

  const today = new Date()
  const epoch = new Date(1970, 0, 1)
  const daysSinceEpoch = Math.floor(
    (today.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24)
  )

  const startIndex = daysSinceEpoch % pool.length
  const rotatedListings = [...pool.slice(startIndex), ...pool.slice(0, startIndex)]

  return rotatedListings.slice(0, limit)
}

export async function searchListings(
  query: string | undefined,
  limit?: number
): Promise<Listing[]> {
  let results = sortByCreatedAtDesc(loadListings())

  if (query && query.trim() !== "") {
    const searchTerm = query.trim()
    results = results.filter((l) => matchesSearch(l, searchTerm))
  }

  return limit ? results.slice(0, limit) : results
}

export async function getListingById(id: string): Promise<Listing | null> {
  return loadListings().find((l) => l.id === id) ?? null
}

export async function getListingBySlug(
  slug: string
): Promise<ListingWithReviews | null> {
  const listing = loadListings().find((l) => l.slug === slug)
  if (!listing) return null
  return { ...listing, reviews: [] }
}

export async function getListingWithReviews(
  idOrSlug: string
): Promise<ListingWithReviews | null> {
  const listings = loadListings()
  const bySlug = listings.find((l) => l.slug === idOrSlug)
  if (bySlug) return { ...bySlug, reviews: [] }

  const byId = listings.find((l) => l.id === idOrSlug)
  if (byId) return { ...byId, reviews: [] }

  return null
}

export async function getAllListingsForAdmin(): Promise<Listing[]> {
  return sortByCreatedAtDesc(loadListings())
}

export async function getListingByIdForAdmin(
  id: string
): Promise<Listing | null> {
  return getListingById(id)
}

export async function getListingsByCity(city: string): Promise<Listing[]> {
  const normalizedWithHyphens = city.replace(/\s+/g, "-")
  const normalizedWithSpaces = city.replace(/-/g, " ")

  return sortByCreatedAtDesc(
    loadListings().filter((l) => {
      const c = l.city.toLowerCase()
      return (
        c === normalizedWithHyphens.toLowerCase() ||
        c === normalizedWithSpaces.toLowerCase() ||
        c === city.toLowerCase()
      )
    })
  )
}

export async function getListingsWithLocation(): Promise<Listing[]> {
  return sortByCreatedAtDesc(loadListings().filter(hasValidLocation))
}

export async function getDistinctCities(): Promise<string[]> {
  const cities = new Set<string>()
  for (const listing of loadListings()) {
    const city = listing.city.trim()
    if (city) cities.add(city)
  }
  return [...cities].sort()
}

export async function getListingsByRegion(region: string): Promise<Listing[]> {
  return sortByCreatedAtDesc(
    loadListings().filter(
      (l) => l.region.toLowerCase() === region.toLowerCase()
    )
  )
}

export async function getSimilarListings(
  currentListingId: string,
  city: string,
  limit: number = 4,
  currentLocation?: { lat: number; lng: number }
): Promise<Listing[]> {
  const listings = sortByCreatedAtDesc(
    loadListings().filter(
      (l) =>
        l.city.toLowerCase() === city.toLowerCase() &&
        l.id !== currentListingId
    )
  ).slice(0, limit * 2)

  if (currentLocation) {
    const { calculateDistance } = await import("./distance")

    return listings
      .map((listing) => {
        const location = listing.location
        if (!hasValidLocation(listing)) return { listing, distance: Infinity }

        const distance = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          location.lat as number,
          location.lng as number
        )
        return { listing, distance }
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)
      .map((item) => item.listing)
  }

  return listings.slice(0, limit)
}

export async function getDistinctRegions(): Promise<string[]> {
  const regions = new Set<string>()
  for (const listing of loadListings()) {
    const region = listing.region.trim()
    if (region) regions.add(region)
  }
  return [...regions].sort()
}

export async function getListingsByActivity(
  activity: ListingActivity
): Promise<Listing[]> {
  return sortByCreatedAtDesc(
    loadListings().filter((listing) => listing.activities.includes(activity))
  )
}

export async function getListingsByOccasions(
  occasions: ListingOccasion[]
): Promise<Listing[]> {
  return sortByCreatedAtDesc(
    loadListings().filter((listing) =>
      occasions.some((occasion) => listing.occasions.includes(occasion))
    )
  )
}

export interface ListingWithDistance extends Listing {
  distanceMiles: number
}

export interface ListingsNearCityResult {
  inCity: Listing[]
  nearby: ListingWithDistance[]
  allForSchema: Listing[]
}

/**
 * Listings in a city plus nearby venues within a radius (for guide pages).
 * Canonical city matching comes from lib/location. London explicitly includes
 * structured region === "London" listings; other cities require an exact city.
 */
export async function getListingsNearCity(
  city: string,
  options?: { radiusMiles?: number; nearbyLimit?: number }
): Promise<ListingsNearCityResult> {
  const radiusMiles = options?.radiusMiles ?? 40
  const nearbyLimit = options?.nearbyLimit ?? 5
  const canonicalLocation = getCanonicalCityLocation(city)
  const inCity = sortByCreatedAtDesc(
    loadListings().filter((listing) =>
      listingMatchesCanonicalCity(listing, canonicalLocation)
    )
  )

  const inCityIds = new Set(inCity.map((l) => l.id))
  const { getCityCentroid } = await import("./city-centroids")
  const centroid = getCityCentroid(city)

  if (!centroid) {
    return { inCity, nearby: [], allForSchema: inCity }
  }

  const { calculateDistance } = await import("./distance")

  const nearby = sortByCreatedAtDesc(loadListings())
    .filter((l) => !inCityIds.has(l.id) && hasValidLocation(l))
    .map((listing) => {
      const distanceMiles = calculateDistance(
        centroid.lat,
        centroid.lng,
        listing.location!.lat as number,
        listing.location!.lng as number
      )
      return { ...listing, distanceMiles }
    })
    .filter((l) => l.distanceMiles <= radiusMiles)
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, nearbyLimit)

  return {
    inCity,
    nearby,
    allForSchema: [...inCity, ...nearby],
  }
}
