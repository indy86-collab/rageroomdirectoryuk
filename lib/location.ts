import type { Listing } from "@/types/listing"

export type CanonicalLocationMatchMode = "city" | "city-or-region"

export interface CanonicalCityLocation {
  name: string
  slug: string
  matchMode: CanonicalLocationMatchMode
}

/**
 * Central exceptions for the site's canonical city architecture.
 *
 * London has always treated listings whose structured region is London as
 * part of the London city hub (for example Croydon and Romford). No distance
 * or "near London" inference is used. Every other city is an exact city match.
 */
export const CANONICAL_CITY_MATCH_OVERRIDES: Readonly<
  Record<string, CanonicalLocationMatchMode>
> = {
  london: "city-or-region",
}

/**
 * Converts a city name to a URL-friendly slug
 * Example: "Newcastle upon Tyne" -> "newcastle-upon-tyne"
 */
export function cityToSlug(city: string): string {
  return city
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
}

export function getCanonicalCityLocation(city: string): CanonicalCityLocation {
  const name = city.trim()
  const slug = cityToSlug(name)
  return {
    name,
    slug,
    matchMode: CANONICAL_CITY_MATCH_OVERRIDES[slug] ?? "city",
  }
}

export function listingMatchesCanonicalCity(
  listing: Pick<Listing, "city" | "region">,
  location: CanonicalCityLocation
): boolean {
  const cityMatches = cityToSlug(listing.city) === location.slug
  if (cityMatches) return true
  return (
    location.matchMode === "city-or-region" &&
    regionToSlug(listing.region) === location.slug
  )
}

/**
 * Converts a slug back to a displayable city name
 * Example: "newcastle-upon-tyne" -> "Newcastle Upon Tyne"
 * Note: This is a simple reverse; it may not perfectly match the original
 */
export function slugToCity(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/**
 * Converts a region name to a URL-friendly slug
 */
export function regionToSlug(region: string): string {
  return region
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Converts a region slug back to a displayable region name
 */
export function slugToRegion(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}





