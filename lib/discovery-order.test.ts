import { describe, expect, it } from "vitest"
import data from "@/data/listings.json"
import type { Listing } from "@/types/listing"
import { orderDiscoveryListings } from "./discovery-order"

const listings = data as Listing[]
describe("discovery relevance", () => {
  it("puts rage rooms ahead of related activities without removing or mutating inventory", () => {
    const originalIds = listings.map(l => l.id)
    const ordered = orderDiscoveryListings(listings, "London")
    const lastRage = ordered.reduce((last, l, index) => l.activities.includes("rage-room") ? index : last, -1)
    const firstRelated = ordered.findIndex(l => !l.activities.includes("rage-room"))
    expect(lastRage).toBeLessThan(firstRelated)
    expect(ordered).toHaveLength(listings.length)
    expect(listings.map(l => l.id)).toEqual(originalIds)
  })
  it("keeps an exact named activity search ahead of generic rage-room recommendations", () => {
    const studio = listings.find(l => l.name === "Kedi Studio")!
    expect(studio).toBeDefined()
    expect(orderDiscoveryListings(listings, "  KEDI STUDIO  ")[0].id).toBe(studio.id)
  })
})
