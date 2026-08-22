import { describe, expect, it } from "vitest"
import { EDITORIAL_CITY_GUIDES } from "@/lib/city-guides"
import { getCityHeroImagePath } from "@/lib/city-images"
import { PRIORITY_SEO_CITIES } from "@/lib/priority-seo-cities"
import listingsData from "@/data/listings.json"

describe("city hero images", () => {
  it("has a hero photo for every listing city and priority city", () => {
    const cities = new Set<string>([
      ...PRIORITY_SEO_CITIES,
      ...EDITORIAL_CITY_GUIDES.map((guide) => guide.city),
      ...listingsData
        .filter((listing) => listing.locationType !== "mobile-service")
        .map((listing) => listing.city),
    ])

    const missing = [...cities]
      .filter((city) => !getCityHeroImagePath(city))
      .sort()

    expect(missing).toEqual([])
  })
})
