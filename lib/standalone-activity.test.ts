import { describe, expect, it } from "vitest"
import listingsData from "@/data/listings.json"
import {
  getDistinctCities,
  getDistinctRegions,
  getListingsByCity,
  getListingsByRegion,
  getListingsNearCity,
} from "@/lib/listings"
import {
  getListingExperienceLabel,
  getListingExperienceSummary,
} from "@/lib/discovery"
import {
  getListingSchemaAddress,
  getListingSchemaAreaServed,
  getListingSchemaBusinessType,
} from "@/lib/listing-schema"
import type { Listing } from "@/types/listing"

const listings = listingsData as Listing[]
const bySlug = (slug: string) =>
  listings.find((listing) => listing.slug === slug) as Listing

describe("standalone and mobile activity inventory", () => {
  it("supports verified listings without the rage-room activity", () => {
    const axe = bySlug("just-axing-swansea")
    const paint = bySlug("splatter-room-studio-london")

    expect(axe.activities).toEqual(["axe-throwing"])
    expect(paint.activities).toEqual(["paint-splatter"])
    expect(axe.verified).toBe(true)
    expect(paint.verified).toBe(true)
    expect(getListingExperienceLabel(axe)).toBe("Axe Throwing")
    expect(getListingExperienceSummary(paint)).toBe("Paint Splatter")
  })

  it("represents mobile operators without a fabricated venue address", async () => {
    const mobile = bySlug("rage-room-events-mobile-uk")

    expect(mobile.locationType).toBe("mobile-service")
    expect(mobile.postcode).toBe("")
    expect(mobile.location).toEqual({ lat: null, lng: null })
    expect(mobile.serviceAreas).toEqual(["United Kingdom"])
    expect(await getListingsByCity("UK-wide")).toEqual([])
    expect(await getListingsByRegion("United Kingdom")).toEqual([])
    expect((await getListingsNearCity("UK-wide")).allForSchema).toEqual([])
    expect(await getDistinctCities()).not.toContain("UK-wide")
    expect(await getDistinctRegions()).not.toContain("United Kingdom")
  })

  it("uses LocalBusiness schema for fixed venues and Organization for mobile services", () => {
    const fixed = bySlug("just-axing-swansea")
    const mobile = bySlug("rage-room-events-mobile-uk")

    expect(getListingSchemaBusinessType(fixed)).toEqual([
      "LocalBusiness",
      "EntertainmentBusiness",
    ])
    expect(getListingSchemaAddress(fixed)).toMatchObject({
      "@type": "PostalAddress",
      addressLocality: "Swansea",
      postalCode: "SA7 9AG",
    })
    expect(getListingSchemaBusinessType(mobile)).toBe("Organization")
    expect(getListingSchemaAddress(mobile)).toBeUndefined()
    expect(getListingSchemaAreaServed(mobile)).toEqual([
      { "@type": "Country", name: "United Kingdom" },
    ])
  })
})
