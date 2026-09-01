import { describe, expect, it } from "vitest"
import { parseTripQuery } from "./trip-query"
import { formatTripExperience, formatTripPrice, rankTripListings } from "./trip-search"
import type { Listing } from "@/types/listing"

const now = new Date(2026, 8, 1, 12, 0, 0)
const birmingham = { lat: 52.4862, lng: -1.8904 }

const locations = [{ kind: "city" as const, name: "Birmingham", slug: "birmingham" }]

function listing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "base",
    name: "Base venue",
    description: "A rage room.",
    city: "Birmingham",
    region: "West Midlands",
    postcode: "B1 1AA",
    location: { ...birmingham },
    website: "https://example.com",
    bookingUrl: "https://example.com/book",
    phone: null,
    price: 30,
    priceUnit: "per-person",
    activities: ["rage-room"],
    occasions: ["birthdays"],
    groupSizeMin: 1,
    groupSizeMax: 8,
    image: null,
    verified: true,
    googlePlaceId: null,
    slug: "base-venue",
    createdAt: "2026-01-01T00:00:00.000Z",
    onlineBooking: true,
    ...overrides,
  }
}

describe("rankTripListings", () => {
  const query = parseTripQuery(
    "Find me a rage room near Birmingham for six people next Saturday. We want something suitable for a birthday and ideally under £35 each.",
    { locations, now }
  )

  it("keeps a group-max-4 venue out of Option A for a party of six", () => {
    const tooSmall = listing({
      id: "small",
      slug: "small-room",
      name: "Tiny smash",
      groupSizeMax: 4,
      location: birmingham,
      price: 20,
    })
    const good = listing({
      id: "good",
      slug: "good-room",
      name: "Party smash",
      location: { lat: 52.37, lng: -1.89 },
      price: 30,
    })
    const combo = listing({
      id: "combo",
      slug: "combo-room",
      name: "Smash and axes",
      activities: ["rage-room", "axe-throwing"],
      location: { lat: 52.33, lng: -1.89 },
      price: 34,
    })

    const result = rankTripListings([tooSmall, good, combo], birmingham, query)
    expect(result.options[0]?.listing.slug).toBe("good-room")
    expect(result.options[0]?.optionLabel).toBe("A")
    expect(result.options.some((row) => row.listing.slug === "small-room")).toBe(false)
    expect(result.more.some((row) => row.listing.slug === "small-room")).toBe(true)
  })

  it("ranks an in-budget rage room above a farther combo venue", () => {
    const cheapClose = listing({
      id: "cheap",
      slug: "cheap-room",
      price: 28,
      location: { lat: 52.45, lng: -1.89 },
    })
    const comboFar = listing({
      id: "combo-far",
      slug: "combo-far",
      activities: ["rage-room", "axe-throwing"],
      price: 34,
      location: { lat: 52.2, lng: -1.89 },
    })

    const result = rankTripListings([comboFar, cheapClose], birmingham, query)
    expect(result.options[0]?.listing.slug).toBe("cheap-room")
    expect(result.options[1]?.listing.slug).toBe("combo-far")
  })
})

describe("trip option copy", () => {
  it("formats experience and per-person price for option cards", () => {
    expect(
      formatTripExperience(
        { activities: ["rage-room", "axe-throwing"] },
        ["rage-room", "axe-throwing"]
      )
    ).toBe("Rage Room + Axe Throwing")
    expect(formatTripPrice({ price: 30, priceUnit: "per-person" })).toBe("£30/person")
    expect(formatTripPrice({ price: null, priceUnit: null })).toBe("Price on request")
  })
})
