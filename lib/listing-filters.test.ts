import { describe, expect, it } from "vitest"
import listingsJson from "@/data/listings.json"
import { filterAndSortListings, type ListingFilterState } from "@/lib/listing-filters"
import type { Listing } from "@/types/listing"

const listings = listingsJson as Listing[]
const defaults: ListingFilterState = {
  activities: [],
  occasions: [],
  city: "",
  maxPerPersonPrice: null,
  visitorAge: null,
  groupSize: null,
  minimumRating: null,
  onlineBookingOnly: false,
  corporateOnly: false,
  verifiedOnly: false,
  maximumDistanceMiles: null,
  sortBy: "name",
}

function run(overrides: Partial<ListingFilterState> = {}) {
  return filterAndSortListings(listings, { ...defaults, ...overrides })
}

describe("listing discovery filters", () => {
  it("returns the complete inventory after reset", () => {
    expect(run()).toHaveLength(85)
  })

  it("uses AND semantics for combined activities", () => {
    const axe = run({ activities: ["axe-throwing"] })
    const rageAndAxe = run({ activities: ["rage-room", "axe-throwing"] })
    expect(axe).toHaveLength(29)
    expect(rageAndAxe).toHaveLength(14)
    expect(axe.some((listing) => listing.slug === "just-axing-swansea")).toBe(true)
    expect(rageAndAxe.some((listing) => listing.slug === "just-axing-swansea")).toBe(false)
    expect(rageAndAxe.every((listing) =>
      listing.activities.includes("rage-room") && listing.activities.includes("axe-throwing")
    )).toBe(true)
  })

  it("keeps standalone venues in their actual activities only", () => {
    expect(run({ activities: ["axe-throwing"] }).some(
      (listing) => listing.slug === "axe-yard-prison-island-belfast"
    )).toBe(true)
    expect(run({ activities: ["rage-room"] }).some(
      (listing) => listing.slug === "axe-yard-prison-island-belfast"
    )).toBe(false)
    expect(run({ activities: ["paint-splatter"] }).some(
      (listing) => listing.slug === "splatter-art-studio-glasgow"
    )).toBe(true)
  })

  it("returns the audited paint inventory with strict AND semantics", () => {
    const paint = run({ activities: ["paint-splatter"] })
    const rageAndPaint = run({ activities: ["rage-room", "paint-splatter"] })
    const axeAndPaint = run({ activities: ["axe-throwing", "paint-splatter"] })
    const rageAxeAndPaint = run({
      activities: ["rage-room", "axe-throwing", "paint-splatter"],
    })

    expect(paint).toHaveLength(34)
    expect(rageAndPaint).toHaveLength(12)
    expect(axeAndPaint.map((listing) => listing.slug)).toEqual([
      "the-activity-dome-weston-super-mare",
    ])
    expect(rageAxeAndPaint.map((listing) => listing.slug)).toEqual([
      "the-activity-dome-weston-super-mare",
    ])
    expect(rageAndPaint.every((listing) =>
      listing.activities.includes("rage-room") &&
      listing.activities.includes("paint-splatter")
    )).toBe(true)
  })

  it("combines paint and city filters without leaking nearby venues", () => {
    const result = run({ city: "Sheffield", activities: ["paint-splatter"] })
    expect(result.map((listing) => listing.slug)).toEqual([
      "off-the-canvas-sheffield",
      "splatter-central-sheffield",
    ])
  })

  it("only returns explicitly assigned occasions", () => {
    for (const occasion of ["birthdays", "corporate-team-building", "date-nights", "kids"] as const) {
      expect(run({ occasions: [occasion] }).every((listing) => listing.occasions.includes(occasion))).toBe(true)
    }
  })

  it("combines city, activity and occasion filters", () => {
    const result = run({
      city: "Maidstone",
      activities: ["axe-throwing"],
      occasions: ["date-nights"],
    })
    expect(result.map((listing) => listing.slug)).toEqual(["rage-out-maidstone-maidstone"])
  })

  it("does not compare per-room and per-group prices as per-person values", () => {
    const result = run({ maxPerPersonPrice: 25 })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((listing) =>
      listing.priceUnit === "per-person" && listing.price != null && listing.price <= 25
    )).toBe(true)
  })

  it("excludes unknown age and group constraints from constrained searches", () => {
    const byAge = run({ visitorAge: 10 })
    expect(byAge.every((listing) => listing.ageMin != null && listing.ageMin <= 10)).toBe(true)
    const byGroup = run({ groupSize: 8 })
    expect(byGroup.every((listing) =>
      listing.groupSizeMin != null && listing.groupSizeMax != null &&
      listing.groupSizeMin <= 8 && listing.groupSizeMax >= 8
    )).toBe(true)
  })

  it("requires explicit true values for boolean filters", () => {
    expect(run({ onlineBookingOnly: true }).every((listing) => listing.onlineBooking === true)).toBe(true)
    expect(run({ corporateOnly: true }).every((listing) => listing.corporatePackages === true)).toBe(true)
  })
})
