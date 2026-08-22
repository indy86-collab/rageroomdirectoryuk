import { describe, expect, it } from "vitest"
import listingsData from "@/data/listings.json"
import {
  getByoRageRoomListings,
  getCheapestRageRoomRows,
  getPaintAgeRows,
  getPaintCityGroups,
  getPaintPriceRows,
  getRageRoomAgeLimitRows,
  getSmashAndPaintListings,
} from "@/lib/listing-comparisons"
import type { Listing } from "@/types/listing"

const listings = listingsData as Listing[]

describe("listing comparison pages", () => {
  it("keeps per-person prices separate from room and group rates", () => {
    const { perPerson, perRoomOrGroup } = getCheapestRageRoomRows(listings)

    expect(perPerson.length).toBeGreaterThan(0)
    expect(perPerson.every((row) => row.priceUnit === "per-person")).toBe(true)
    expect(perRoomOrGroup.every((row) => row.priceUnit !== "per-person")).toBe(true)

    const personPrices = perPerson.map((row) => row.price)
    expect(personPrices).toEqual([...personPrices].sort((a, b) => a - b))
  })

  it("sorts known age limits before venues that still need confirmation", () => {
    const { known, unknown } = getRageRoomAgeLimitRows(listings)

    expect(known.length).toBeGreaterThan(0)
    expect(known.every((row) => row.ageMin != null)).toBe(true)
    expect(unknown.every((row) => row.ageMin == null)).toBe(true)

    const ages = known.map((row) => row.ageMin as number)
    expect(ages).toEqual([...ages].sort((a, b) => a - b))
  })

  it("only lists BYO venues with the verified feature flag", () => {
    const byo = getByoRageRoomListings(listings)
    expect(byo.every((listing) => listing.features?.includes("byo-smashables"))).toBe(true)
    expect(byo.every((listing) => listing.activities.includes("rage-room"))).toBe(true)
  })

  it("keeps paint per-person prices separate from room and group rates", () => {
    const { perPerson, perRoomOrGroup } = getPaintPriceRows(listings)

    expect(perPerson.length).toBeGreaterThan(0)
    expect(perPerson.every((row) => row.priceUnit === "per-person")).toBe(true)
    expect(perRoomOrGroup.every((row) => row.priceUnit !== "per-person")).toBe(true)
    expect(perPerson.every((row) => row.listing.activities.includes("paint-splatter"))).toBe(true)
  })

  it("only treats smash-and-paint venues as both activities", () => {
    const combo = getSmashAndPaintListings(listings)
    expect(combo.length).toBeGreaterThan(0)
    expect(
      combo.every(
        (listing) =>
          listing.activities.includes("paint-splatter") && listing.activities.includes("rage-room")
      )
    ).toBe(true)
  })

  it("groups paint venues by city without inventing extra locations", () => {
    const groups = getPaintCityGroups(listings)
    const london = groups.find((group) => group.city === "London")
    expect(london?.listings.length).toBeGreaterThanOrEqual(3)
    expect(getPaintAgeRows(listings).known.every((row) => row.ageMin != null)).toBe(true)
  })
})
