import { cityToSlug } from "@/lib/location"

/**
 * High-demand UK cities that must appear in the sitemap and static params
 * even when we have zero in-city listings (nearby venues still render).
 */
export const PRIORITY_SEO_CITIES = [
  "Manchester",
  "Leeds",
  "Glasgow",
  "Sheffield",
  "Bristol",
  "Nottingham",
  "Cardiff",
  "Hull",
  "Coventry",
  "Southampton",
  "Northampton",
  "Belfast",
  "York",
  "Oxford",
  "Cambridge",
  "Swansea",
] as const

/** Top cities for programmatic /rage-room-prices/[city] pages. */
export const CITY_PRICE_PAGE_CITIES = [
  "London",
  "Birmingham",
  "Manchester",
  "Leeds",
  "Glasgow",
  "Liverpool",
  "Sheffield",
  "Bristol",
  "Nottingham",
  "Cardiff",
  "Hull",
  "Edinburgh",
  "Newcastle",
  "Leicester",
  "Brighton",
] as const

export function getPrioritySeoCitySlugs(): string[] {
  return PRIORITY_SEO_CITIES.map((city) => cityToSlug(city))
}

export function mergeCitiesWithPriority(existingCities: string[]): string[] {
  const set = new Set(existingCities.map((c) => c.trim()).filter(Boolean))
  for (const city of PRIORITY_SEO_CITIES) {
    set.add(city)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}
