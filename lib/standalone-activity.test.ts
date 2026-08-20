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
    const paint = bySlug("splatter-art-studio-glasgow")

    expect(axe.activities).toEqual(["axe-throwing"])
    expect(paint.activities).toEqual(["paint-splatter"])
    expect(axe.verified).toBe(true)
    expect(paint.verified).toBe(true)
    expect(getListingExperienceLabel(axe)).toBe("Axe Throwing")
    expect(getListingExperienceSummary(paint)).toBe("Paint Splatter")
  })

  it("keeps standalone, rage-plus-paint and multi-activity paint records distinct", () => {
    expect(bySlug("splatter-art-studio-glasgow").activities).toEqual([
      "paint-splatter",
    ])
    expect(bySlug("escape-time-lichfield").activities).toEqual([
      "rage-room",
      "paint-splatter",
    ])
    expect(bySlug("the-activity-dome-weston-super-mare").activities).toEqual([
      "rage-room",
      "axe-throwing",
      "paint-splatter",
      "archery",
      "airsoft-target",
    ])
  })

  it("represents mobile operators without a fabricated venue address", async () => {
    const mobile = bySlug("rage-room-events-mobile-uk")

    expect(mobile.locationType).toBe("mobile-service")
    expect(mobile.postcode).toBe("")
    expect(mobile.location).toEqual({ lat: null, lng: null })
    expect(mobile.serviceAreas).toEqual(["United Kingdom"])
    expect(mobile.activities).toContain("paint-splatter")
    expect(await getListingsByCity("UK-wide")).toEqual([])
    expect(await getListingsByRegion("United Kingdom")).toEqual([])
    expect((await getListingsNearCity("UK-wide")).allForSchema).toEqual([])
    expect(await getDistinctCities()).not.toContain("UK-wide")
    expect(await getDistinctRegions()).not.toContain("United Kingdom")
  })

  it("uses LocalBusiness schema for fixed venues and Organization for mobile services", () => {
    const fixed = bySlug("splatter-art-studio-glasgow")
    const mobile = bySlug("rage-room-events-mobile-uk")

    expect(getListingSchemaBusinessType(fixed)).toEqual([
      "LocalBusiness",
      "EntertainmentBusiness",
    ])
    expect(getListingSchemaAddress(fixed)).toMatchObject({
      "@type": "PostalAddress",
      addressLocality: "Glasgow",
      postalCode: "G1 5QN",
    })
    expect(getListingSchemaBusinessType(mobile)).toBe("Organization")
    expect(getListingSchemaAddress(mobile)).toBeUndefined()
    expect(getListingSchemaAreaServed(mobile)).toEqual([
      { "@type": "Country", name: "United Kingdom" },
    ])
  })
})
