import { describe, expect, it } from "vitest"
import listingsData from "@/data/listings.json"
import { cityToSlug, getCanonicalCityLocation, listingMatchesCanonicalCity, regionToSlug } from "@/lib/location"
import {
  MIN_PRICE_SAMPLE_FOR_RANGE,
  buildInsightsStats,
  citationClipboardText,
  flagshipReportCitation,
  formatInsightCitationMonth,
  getPublishedInsightPages,
  insightArticleDates,
  isInsightPagePublished,
} from "./insights-stats"
import type { Listing } from "@/types/listing"

function listing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "1",
    name: "Example Rage Room",
    description: "A verified rage room.",
    city: "London",
    region: "London",
    postcode: "SW1A 1AA",
    location: { lat: 51.5, lng: -0.12 },
    website: "https://example.com",
    phone: null,
    price: 35,
    priceUnit: "per-person",
    activities: ["rage-room"],
    occasions: [],
    image: "/images/example.jpg",
    verified: true,
    googlePlaceId: null,
    slug: "example-rage-room",
    createdAt: "2026-01-01T00:00:00.000Z",
    lastVerified: "2026-08-01",
    ...overrides,
  }
}

describe("insights statistics", () => {
  it("counts verified listings and overlapping activities separately", () => {
    const stats = buildInsightsStats([
      listing({
        id: "1",
        slug: "one",
        activities: ["rage-room", "axe-throwing"],
      }),
      listing({
        id: "2",
        slug: "two",
        city: "Birmingham",
        region: "West Midlands",
        activities: ["rage-room", "paint-splatter"],
      }),
      listing({
        id: "3",
        slug: "three",
        city: "Leeds",
        region: "Yorkshire",
        activities: ["axe-throwing"],
      }),
      listing({
        id: "hidden",
        slug: "hidden",
        verified: false,
        activities: ["rage-room", "car-smash"],
      }),
    ])

    expect(stats.analysedListings).toBe(4)
    expect(stats.verifiedListings).toBe(3)
    expect(stats.rageRooms).toBe(2)
    expect(stats.axeThrowing).toBe(2)
    expect(stats.paintSplatter).toBe(1)
    expect(stats.carSmash).toBe(0)
    expect(stats.rageRooms + stats.axeThrowing + stats.paintSplatter).toBeGreaterThan(
      stats.verifiedListings
    )
    expect(stats.activityCombinations.map((row) => row.label)).toEqual([])
  })

  it("reports activity combinations only when at least two verified venues share them", () => {
    const stats = buildInsightsStats([
      listing({
        id: "1",
        slug: "one",
        activities: ["rage-room", "axe-throwing"],
      }),
      listing({
        id: "2",
        slug: "two",
        city: "Birmingham",
        region: "West Midlands",
        activities: ["rage-room", "axe-throwing"],
      }),
      listing({
        id: "3",
        slug: "three",
        city: "Leeds",
        region: "Yorkshire",
        activities: ["rage-room", "paint-splatter"],
      }),
    ])

    expect(stats.activityCombinations).toEqual([
      expect.objectContaining({
        label: "Rage Room + Axe Throwing",
        count: 2,
        href: "/activities/rage-rooms?activities=axe-throwing#venues",
      }),
    ])
  })

  it("does not treat unknown or null prices as zero and never averages mixed units", () => {
    const stats = buildInsightsStats([
      listing({ id: "1", slug: "person-a", price: 20, priceUnit: "per-person" }),
      listing({ id: "2", slug: "person-b", city: "Leeds", region: "Yorkshire", price: 40, priceUnit: "per-person" }),
      listing({ id: "3", slug: "room", city: "Bath", region: "Somerset", price: 90, priceUnit: "per-room" }),
      listing({
        id: "4",
        slug: "unknown",
        city: "Derby",
        region: "Derbyshire",
        price: null,
        priceUnit: null,
      }),
      listing({
        id: "5",
        slug: "zero-not-unknown",
        city: "York",
        region: "Yorkshire",
        price: 0,
        priceUnit: "per-person",
      }),
    ])

    expect(stats.pricing.unavailable).toBe(1)
    expect(stats.pricing.usable).toBe(4)
    expect(stats.pricing.byUnit.find((row) => row.unit === "per-person")?.count).toBe(3)
    expect(stats.pricing.byUnit.find((row) => row.unit === "per-room")?.count).toBe(1)
    expect(stats.pricing.byUnit.find((row) => row.unit === "per-person")?.average).toBeNull()
    expect(stats.pricing.byUnit.find((row) => row.unit === "per-room")?.average).toBeNull()
  })

  it("publishes per-person ranges only when the sample is large enough", () => {
    const listings = Array.from({ length: MIN_PRICE_SAMPLE_FOR_RANGE }, (_, index) =>
      listing({
        id: String(index + 1),
        slug: `venue-${index + 1}`,
        city: `City ${index + 1}`,
        region: `Region ${index + 1}`,
        price: 10 * (index + 1),
        priceUnit: "per-person",
      })
    )
    listings.push(
      listing({
        id: "room",
        slug: "room-rate",
        city: "Hull",
        region: "Yorkshire",
        price: 80,
        priceUnit: "per-room",
      })
    )

    const stats = buildInsightsStats(listings)
    const perPerson = stats.pricing.byUnit.find((row) => row.unit === "per-person")
    const perRoom = stats.pricing.byUnit.find((row) => row.unit === "per-room")

    expect(perPerson).toMatchObject({
      count: MIN_PRICE_SAMPLE_FOR_RANGE,
      minimum: 10,
      maximum: 50,
      average: 30,
    })
    expect(perRoom).toMatchObject({
      count: 1,
      minimum: null,
      maximum: null,
      average: null,
    })
  })

  it("excludes unverified and mobile-service listings from city counts", () => {
    const stats = buildInsightsStats([
      listing({ id: "1", slug: "london", city: "London", region: "London" }),
      listing({
        id: "2",
        slug: "unverified",
        city: "Manchester",
        region: "Greater Manchester",
        verified: false,
      }),
      listing({
        id: "3",
        slug: "mobile",
        city: "Bristol",
        region: "South West",
        locationType: "mobile-service",
        activities: ["rage-room", "mobile-rage-room"],
      }),
    ])

    expect(stats.citiesRepresented).toBe(1)
    expect(stats.topCities.map((row) => row.label)).toEqual(["London"])
    expect(stats.mobileRageRooms).toBe(1)
    expect(stats.topCities[0]?.href).toBe("/city/london")
  })

  it("counts occasion suitability from evidence-backed occasion fields only", () => {
    const stats = buildInsightsStats([
      listing({
        id: "1",
        slug: "birthday",
        occasions: ["birthdays"],
        features: ["birthday-parties"],
      }),
      listing({
        id: "2",
        slug: "corporate",
        city: "Leeds",
        region: "Yorkshire",
        occasions: ["corporate-team-building", "stag-parties"],
      }),
      listing({
        id: "3",
        slug: "feature-only",
        city: "Bath",
        region: "Somerset",
        occasions: [],
        features: ["corporate-groups", "hen-stag-parties"],
      }),
    ])

    expect(stats.birthdayVenues).toBe(1)
    expect(stats.corporateVenues).toBe(1)
    expect(stats.stagVenues).toBe(1)
    expect(stats.stagOrHenVenues).toBe(1)
  })

  it("builds citation text with RageRoom Directory attribution, date and source URL", () => {
    const stats = buildInsightsStats([listing()])
    const rageRooms = stats.citations.find((item) => item.id === "rage-rooms")
    expect(rageRooms?.statement).toContain("1 venue offering rage-room experiences")
    expect(rageRooms?.statement).toContain("verified UK directory dataset")
    expect(citationClipboardText(rageRooms!.statement)).toBe(
      `${rageRooms!.statement} — Source: RageRoom Directory`
    )
    expect(
      citationClipboardText(rageRooms!.statement, {
        asOf: "August 2026",
        sourceUrl: "https://www.rageroomdirectory.co.uk/insights",
      })
    ).toBe(
      `${rageRooms!.statement} — Source: RageRoom Directory, August 2026. https://www.rageroomdirectory.co.uk/insights`
    )
    expect(
      citationClipboardText(rageRooms!.statement, {
        asOf: "August 2026",
        sourceUrl: "https://www.rageroomdirectory.co.uk/insights",
      })
    ).not.toContain("<a")
    expect(formatInsightCitationMonth("2026-08-20T12:00:00.000Z")).toBe("August 2026")
  })

  it("builds a plain-text flagship report citation", () => {
    const citation = flagshipReportCitation(
      "2026-08-20T00:00:00.000Z",
      "https://www.rageroomdirectory.co.uk/uk-rage-room-report-2026"
    )
    expect(citation).toBe(
      "RageRoom Directory, UK Rage Room Report 2026, updated August 2026. https://www.rageroomdirectory.co.uk/uk-rage-room-report-2026"
    )
    expect(citation).not.toContain("<a")
    expect(citation).not.toContain("rageroom.co.uk")
  })

  it("does not set Article dateModified before the page was published", () => {
    expect(insightArticleDates("2026-08-27", "2026-08-20T00:00:00.000Z")).toEqual({
      datePublished: "2026-08-27",
      dateModified: "2026-08-27",
    })
    expect(insightArticleDates("2026-08-27", "2026-09-01T00:00:00.000Z")).toEqual({
      datePublished: "2026-08-27",
      dateModified: "2026-09-01",
    })
  })

  it("only publishes insight pages when the dataset is useful enough", () => {
    const thin = buildInsightsStats([listing(), listing({ id: "2", slug: "two", verified: false })])
    expect(getPublishedInsightPages(thin)).toEqual([])
    expect(isInsightPagePublished("rage-rooms-by-city", thin)).toBe(false)

    const rich = buildInsightsStats(
      Array.from({ length: 6 }, (_, index) =>
        listing({
          id: String(index + 1),
          slug: `venue-${index + 1}`,
          city: `City ${index + 1}`,
          region: `Region ${index + 1}`,
          activities: index % 2 === 0 ? ["rage-room", "axe-throwing"] : ["rage-room"],
          price: 25,
          priceUnit: "per-person",
        })
      )
    )
    expect(getPublishedInsightPages(rich)).toEqual([
      "rage-room-prices",
      "rage-rooms-by-city",
      "rage-rooms-by-region",
      "rage-room-activities",
    ])
  })

  it("uses the latest lastVerified date rather than treating missing dates as now", () => {
    const stats = buildInsightsStats([
      listing({ id: "1", slug: "older", lastVerified: "2026-01-02", createdAt: "2025-01-01T00:00:00.000Z" }),
      listing({
        id: "2",
        slug: "newer",
        city: "Leeds",
        region: "Yorkshire",
        lastVerified: "2026-08-19",
        createdAt: "2026-01-01T00:00:00.000Z",
      }),
    ])
    expect(stats.lastUpdated.startsWith("2026-08-19")).toBe(true)
  })
})

describe("insights statistics against the current listings dataset", () => {
  const listings = listingsData as Listing[]
  const stats = buildInsightsStats(listings)
  const verified = listings.filter((item) => item.verified === true)
  const fixed = verified.filter((item) => item.locationType !== "mobile-service")

  it("recalculates headline counts independently from the repository dataset", () => {
    expect(stats.analysedListings).toBe(listings.length)
    expect(stats.verifiedListings).toBe(verified.length)
    expect(stats.verifiedListings).toBe(78)
    expect(stats.rageRooms).toBe(45)
    expect(stats.axeThrowing).toBe(24)
    expect(stats.paintSplatter).toBe(34)
    expect(stats.carSmash).toBe(3)
    expect(stats.mobileRageRooms).toBe(4)
    expect(stats.citiesRepresented).toBe(58)
    expect(stats.regionsRepresented).toBe(42)
    expect(stats.birthdayVenues).toBe(52)
    expect(stats.corporateVenues).toBe(46)
    expect(stats.stagVenues).toBe(33)
    expect(stats.henVenues).toBe(35)
    expect(stats.stagOrHenVenues).toBe(35)
    expect(stats.pricing.usable).toBe(48)
    expect(stats.pricing.unavailable).toBe(30)
    expect(stats.lastUpdated.startsWith("2026-08-31")).toBe(true)
  })

  it("keeps unknown prices distinct from zero and does not average mixed units", () => {
    expect(verified.some((item) => item.price === 0)).toBe(false)
    expect(stats.pricing.unavailable).toBe(
      verified.filter(
        (item) =>
          typeof item.price !== "number" ||
          item.priceUnit == null ||
          !["per-person", "per-room", "per-group"].includes(item.priceUnit)
      ).length
    )
    expect(stats.pricing.byUnit.find((row) => row.unit === "per-person")).toMatchObject({
      count: 34,
      minimum: 11,
      maximum: 45,
      average: 29,
    })
    expect(stats.pricing.byUnit.find((row) => row.unit === "per-room")).toMatchObject({
      count: 10,
      minimum: 30,
      maximum: 75,
      average: 48,
    })
    expect(stats.pricing.byUnit.find((row) => row.unit === "per-group")).toMatchObject({
      count: 4,
      minimum: null,
      maximum: null,
      average: null,
    })
  })

  it("counts overlapping activities without treating them as unique venues", () => {
    expect(
      stats.rageRooms + stats.axeThrowing + stats.paintSplatter + stats.carSmash + stats.mobileRageRooms
    ).toBeGreaterThan(stats.verifiedListings)
    expect(stats.mobileRageRooms).toBeGreaterThan(
      verified.filter((item) => item.locationType === "mobile-service").length
    )
  })

  it("ranks cities from recorded city fields on fixed venues only", () => {
    expect(stats.topCities[0]).toMatchObject({ label: "Birmingham", count: 4, href: "/city/birmingham" })
    expect(stats.topCities[1]).toMatchObject({ label: "London", count: 4, href: "/city/london" })
    expect(stats.allCities.find((row) => /uk-wide/i.test(row.label))).toBeUndefined()
    expect(stats.topRegions[0]).toMatchObject({ label: "London", count: 5, href: "/region/london" })

    const londonCityField = fixed.filter((item) => cityToSlug(item.city) === "london").length
    const londonRegionField = fixed.filter((item) => regionToSlug(item.region) === "london").length
    const londonCanonical = fixed.filter((item) =>
      listingMatchesCanonicalCity(item, getCanonicalCityLocation("London"))
    ).length

    expect(londonCityField).toBe(4)
    expect(londonRegionField).toBe(5)
    expect(londonCanonical).toBe(6)
    expect(stats.allCities.find((row) => row.key === "london")?.count).toBe(londonCityField)
    expect(stats.allRegions.find((row) => row.key === "london")?.count).toBe(londonRegionField)
    expect(londonCanonical).not.toBe(londonCityField)
  })

  it("separates fixed venues, mobile operators and mobile rage-room offerings", () => {
    expect(stats.fixedLocationVenues + stats.mobileServiceVenues).toBe(stats.verifiedListings)
    expect(stats.mobileRageRooms).toBeGreaterThanOrEqual(stats.mobileServiceVenues)
    expect(stats.multiActivityVenues).toBeGreaterThan(0)
  })

  it("publishes occasion percentages from evidence-backed fields only", () => {
    expect(stats.birthdayPercent).toBe(Math.round((stats.birthdayVenues / stats.verifiedListings) * 100))
    expect(stats.corporatePercent).toBe(Math.round((stats.corporateVenues / stats.verifiedListings) * 100))
    expect(stats.stagPercent).toBe(Math.round((stats.stagVenues / stats.verifiedListings) * 100))
    expect(stats.henPercent).toBe(Math.round((stats.henVenues / stats.verifiedListings) * 100))
    expect(stats.occasions.find((row) => row.key === "birthdays")?.href).toBe("/occasions/birthdays")
  })

  it("lists high-demand cities without a verified fixed city-field listing as coverage gaps", () => {
    expect(stats.coverageGaps.some((row) => row.key === "nottingham")).toBe(true)
    expect(stats.allCities.some((row) => row.key === "nottingham")).toBe(false)
    expect(stats.coverageGaps.every((row) => row.href.startsWith("/city/"))).toBe(true)
  })
})
