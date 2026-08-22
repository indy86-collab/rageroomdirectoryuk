import {
  ACTIVITY_DEFINITIONS,
  OCCASION_DEFINITIONS,
  getActivityDefinition,
  getOccasionDefinition,
  matchesOccasionDefinition,
  type ActivityDefinition,
  type OccasionDefinition,
} from "@/lib/discovery"
import {
  getCanonicalCityLocation,
  listingMatchesCanonicalCity,
  type CanonicalCityLocation,
} from "@/lib/location"
import type { Listing } from "@/types/listing"

export type LocationDiscoveryType = "activity" | "occasion"

export const STRONG_DISCOVERY_LOCATION_MINIMUM = 3
export const POSSIBLE_DISCOVERY_LOCATION_MINIMUM = 2

/**
 * Two-listing pages need an explicit editorial decision. This prevents a
 * blanket threshold of two from turning every sparse inventory change into a
 * new indexable route.
 */
export const APPROVED_TWO_VENUE_DISCOVERY_PAGES = new Set([
  "occasion:birthdays:birmingham",
  "occasion:hen-parties:birmingham",
  "occasion:hen-parties:london",
  "occasion:stag-parties:birmingham",
  "occasion:stag-parties:london",
])

export interface LocationDiscoveryPageData {
  type: LocationDiscoveryType
  category: ActivityDefinition | OccasionDefinition
  location: CanonicalCityLocation
  listings: Listing[]
  href: string
  qualification: "strong" | "approved-two-venue"
}

export interface DiscoveryBreadcrumb {
  label: string
  href?: string
}

function pageKey(
  type: LocationDiscoveryType,
  categorySlug: string,
  locationSlug: string
) {
  return `${type}:${categorySlug}:${locationSlug}`
}

export function getCanonicalDiscoveryLocations(
  listings: Listing[]
): CanonicalCityLocation[] {
  const locations = new Map<string, CanonicalCityLocation>()
  for (const listing of listings) {
    if (listing.locationType === "mobile-service") continue
    const location = getCanonicalCityLocation(listing.city)
    if (!location.slug || locations.has(location.slug)) continue
    locations.set(location.slug, location)
  }
  return [...locations.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export function getDiscoveryLocation(
  listings: Listing[],
  locationSlug: string
) {
  return getCanonicalDiscoveryLocations(listings).find(
    (location) => location.slug === locationSlug
  )
}

export function getListingsForDiscoveryLocation(
  listings: Listing[],
  location: CanonicalCityLocation
) {
  return listings.filter(
    (listing) =>
      listing.locationType !== "mobile-service" &&
      listing.verified &&
      listingMatchesCanonicalCity(listing, location)
  )
}

export function getDiscoveryLandingPageHref(
  type: LocationDiscoveryType,
  categorySlug: string,
  locationSlug: string
) {
  const parent = type === "activity" ? "activities" : "occasions"
  return `/${parent}/${categorySlug}/${locationSlug}`
}

export function isDiscoveryLandingPageEligible({
  type,
  categorySlug,
  locationSlug,
  matchingVenueCount,
}: {
  type: LocationDiscoveryType
  categorySlug: string
  locationSlug: string
  matchingVenueCount: number
}) {
  if (matchingVenueCount >= STRONG_DISCOVERY_LOCATION_MINIMUM) return true
  return (
    matchingVenueCount >= POSSIBLE_DISCOVERY_LOCATION_MINIMUM &&
    APPROVED_TWO_VENUE_DISCOVERY_PAGES.has(
      pageKey(type, categorySlug, locationSlug)
    )
  )
}

export function getLocationDiscoveryPageData({
  type,
  categorySlug,
  locationSlug,
  listings,
}: {
  type: LocationDiscoveryType
  categorySlug: string
  locationSlug: string
  listings: Listing[]
}): LocationDiscoveryPageData | null {
  const location = getDiscoveryLocation(listings, locationSlug)
  const category =
    type === "activity"
      ? getActivityDefinition(categorySlug)
      : getOccasionDefinition(categorySlug)
  if (!location || !category) return null

  const locationListings = getListingsForDiscoveryLocation(listings, location)
  const matchingListings = locationListings.filter((listing) =>
    type === "activity"
      ? listing.activities.includes((category as ActivityDefinition).value)
      : matchesOccasionDefinition(listing, category as OccasionDefinition)
  )
  if (
    !isDiscoveryLandingPageEligible({
      type,
      categorySlug,
      locationSlug,
      matchingVenueCount: matchingListings.length,
    })
  ) {
    return null
  }

  return {
    type,
    category,
    location,
    listings: matchingListings,
    href: getDiscoveryLandingPageHref(type, categorySlug, locationSlug),
    qualification:
      matchingListings.length >= STRONG_DISCOVERY_LOCATION_MINIMUM
        ? "strong"
        : "approved-two-venue",
  }
}

export function getEligibleLocationDiscoveryPages(
  listings: Listing[],
  type?: LocationDiscoveryType
) {
  const pageTypes: LocationDiscoveryType[] = type
    ? [type]
    : ["activity", "occasion"]
  const locations = getCanonicalDiscoveryLocations(listings)
  const pages: LocationDiscoveryPageData[] = []

  for (const pageType of pageTypes) {
    const categories =
      pageType === "activity" ? ACTIVITY_DEFINITIONS : OCCASION_DEFINITIONS
    for (const category of categories) {
      for (const location of locations) {
        const page = getLocationDiscoveryPageData({
          type: pageType,
          categorySlug: category.slug,
          locationSlug: location.slug,
          listings,
        })
        if (page) pages.push(page)
      }
    }
  }

  return pages.sort((a, b) => a.href.localeCompare(b.href))
}

export function getDiscoveryBreadcrumbs(
  page: Pick<LocationDiscoveryPageData, "type" | "category" | "location">
): DiscoveryBreadcrumb[] {
  const parentLabel = page.type === "activity" ? "Activities" : "Occasions"
  const parentHref = page.type === "activity" ? "/activities" : "/occasions"
  return [
    { label: "Home", href: "/" },
    { label: parentLabel, href: parentHref },
    {
      label: page.category.label,
      href: `${parentHref}/${page.category.slug}`,
    },
    { label: page.location.name },
  ]
}

export function getLocationDiscoveryTitle(page: LocationDiscoveryPageData) {
  if (page.type === "activity") {
    const activity = page.category as ActivityDefinition
    return activity.value === "rage-room"
      ? `Rage Rooms in ${page.location.name}`
      : `${activity.label} in ${page.location.name}`
  }
  const occasion = page.category as OccasionDefinition
  return `${occasion.heroTitle} in ${page.location.name}`
}

export function getLocationDiscoveryDescription(
  page: LocationDiscoveryPageData
) {
  const count = page.listings.length
  const venues = `${count} verified ${count === 1 ? "venue" : "venues"}`
  if (page.type === "activity") {
    const activity = page.category as ActivityDefinition
    return activity.value === "rage-room"
      ? `Compare ${venues} in ${page.location.name}. Check published rage-room prices, age guidance, activities and booking options.`
      : `Compare ${venues} offering ${activity.shortLabel.toLowerCase()} in ${page.location.name}, with published prices, age guidance and booking options.`
  }
  const occasion = page.category as OccasionDefinition
  return `Compare ${venues} in ${page.location.name} with confirmed suitability for ${occasion.shortLabel.toLowerCase()}. Check rage-room prices, group details and booking options.`
}

export function getLocationDiscoveryMetadata(page: LocationDiscoveryPageData) {
  return {
    title: getLocationDiscoveryTitle(page),
    description: getLocationDiscoveryDescription(page),
    alternates: { canonical: page.href },
  }
}
