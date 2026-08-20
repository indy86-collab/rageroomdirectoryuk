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
    expect(run()).toHaveLength(43)
  })

  it("uses AND semantics for combined activities", () => {
    const axe = run({ activities: ["axe-throwing"] })
    const rageAndAxe = run({ activities: ["rage-room", "axe-throwing"] })
    expect(rageAndAxe.map((listing) => listing.id)).toEqual(
      axe.map((listing) => listing.id)
    )
    expect(rageAndAxe.every((listing) =>
      listing.activities.includes("rage-room") && listing.activities.includes("axe-throwing")
    )).toBe(true)
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
