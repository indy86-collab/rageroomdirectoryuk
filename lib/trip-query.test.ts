import { describe, expect, it } from "vitest"
import {
  EXAMPLE_TRIP_QUERY,
  applyTripOverrides,
  buildFindHref,
  buildTripLocationIndex,
  parseTripQuery,
  tripGuideIntent,
  tripPlannerGroup,
} from "./trip-query"
import type { Listing } from "@/types/listing"

const now = new Date(2026, 8, 1, 12, 0, 0)

const locations = [
  { kind: "city" as const, name: "Birmingham", slug: "birmingham" },
  { kind: "city" as const, name: "Leeds", slug: "leeds" },
  { kind: "city" as const, name: "Manchester", slug: "manchester" },
]

function listing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "1",
    name: "Example Rage Room",
    description: "A verified rage room.",
    city: "Birmingham",
    region: "West Midlands",
    postcode: "B1 1AA",
    location: { lat: 52.48, lng: -1.89 },
    website: "https://example.com",
    phone: null,
    price: 30,
    activities: ["rage-room"],
    occasions: ["birthdays"],
    image: "/images/example.jpg",
    verified: true,
    googlePlaceId: null,
    slug: "example-rage-room",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  }
}

describe("parseTripQuery", () => {
  it("parses the Birmingham birthday sample sentence", () => {
    const parsed = parseTripQuery(EXAMPLE_TRIP_QUERY, { locations, now })

    expect(parsed.location).toMatchObject({
      kind: "city",
      name: "Birmingham",
      slug: "birmingham",
    })
    expect(parsed.groupSize).toBe(6)
    expect(parsed.budgetPerPerson).toBe(35)
    expect(parsed.occasions).toEqual(["birthdays"])
    expect(parsed.activities).toEqual(["rage-room"])
    expect(parsed.date?.iso).toBe("2026-09-05")
    expect(parsed.date?.label).toMatch(/Sat.*5.*Sep/)
  })

  it("prefers a postcode origin when one is present", () => {
    const parsed = parseTripQuery("Rage room near B1 1AA for 4 people", { locations, now })
    expect(parsed.location).toMatchObject({
      kind: "postcode",
      name: "B1 1AA",
    })
    expect(parsed.groupSize).toBe(4)
  })

  it("extracts hen parties, axe throwing and a weekend date", () => {
    const parsed = parseTripQuery(
      "Hen party in Leeds this weekend, rage room plus axe throwing, under £40 each.",
      { locations, now }
    )
    expect(parsed.location?.slug).toBe("leeds")
    expect(parsed.occasions).toEqual(["hen-parties"])
    expect(parsed.activities).toEqual(["rage-room", "axe-throwing"])
    expect(parsed.budgetPerPerson).toBe(40)
    expect(parsed.date?.iso).toBe("2026-09-05")
  })

  it("defaults to rage-room when no activity is mentioned", () => {
    const parsed = parseTripQuery("Birmingham for 6", { locations, now })
    expect(parsed.activities).toEqual(["rage-room"])
  })
})

describe("trip query helpers", () => {
  it("applies chip overrides without losing the original sentence", () => {
    const parsed = parseTripQuery(EXAMPLE_TRIP_QUERY, { locations, now })
    const next = applyTripOverrides(parsed, { people: "8", budget: "30" }, locations)
    expect(next.raw).toBe(EXAMPLE_TRIP_QUERY)
    expect(next.groupSize).toBe(8)
    expect(next.budgetPerPerson).toBe(30)
    expect(next.location?.name).toBe("Birmingham")
  })

  it("builds a shareable /find href", () => {
    expect(
      buildFindHref(EXAMPLE_TRIP_QUERY, {
        city: "birmingham",
        people: "6",
        budget: "35",
        occasion: "birthdays",
      })
    ).toContain("/find?query=")
  })

  it("maps birthday plans onto the party guide and friends affiliate group", () => {
    const parsed = parseTripQuery(EXAMPLE_TRIP_QUERY, { locations, now })
    expect(tripGuideIntent(parsed)).toBe("party")
    expect(tripPlannerGroup(parsed)).toBe("friends")
  })

  it("indexes listing cities for longest-name matching", () => {
    const index = buildTripLocationIndex([
      listing(),
      listing({
        id: "2",
        city: "Newcastle upon Tyne",
        region: "Tyne and Wear",
        slug: "newcastle",
      }),
    ])
    expect(index.some((entry) => entry.slug === "birmingham")).toBe(true)
    expect(index.some((entry) => entry.slug === "newcastle-upon-tyne")).toBe(true)
  })
})
