import { describe, expect, it } from "vitest"
import {
  WIDGET_ATTRIBUTION_REL,
  buildWidgetEmbedHtml,
  buildWidgetEmbedSrc,
  buildWidgetLocationIndex,
  sanitiseWidgetActivity,
  sanitiseWidgetLocationSlug,
  sanitiseWidgetShowTitle,
  searchWidgetLocations,
} from "./widget-search"
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
    activities: ["rage-room"],
    occasions: [],
    image: "/images/example.jpg",
    verified: true,
    googlePlaceId: null,
    slug: "example-rage-room",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  }
}

describe("widget search", () => {
  const index = buildWidgetLocationIndex([
    listing(),
    listing({
      id: "2",
      slug: "birmingham",
      city: "Birmingham",
      region: "West Midlands",
    }),
    listing({
      id: "3",
      slug: "axe-only",
      city: "Leeds",
      region: "Yorkshire",
      activities: ["axe-throwing"],
    }),
    listing({
      id: "4",
      slug: "unverified",
      city: "Manchester",
      region: "Greater Manchester",
      verified: false,
    }),
    listing({
      id: "5",
      slug: "mobile-uk",
      city: "UK-wide",
      region: "United Kingdom",
      locationType: "mobile-service",
      activities: ["rage-room", "mobile-rage-room"],
    }),
  ])

  it("matches towns and cities from verified activity inventory", () => {
    const result = searchWidgetLocations("birmingham", index)
    expect(result).toMatchObject({
      status: "matches",
      queryKind: "city",
    })
    if (result.status === "matches") {
      expect(result.matches[0]).toMatchObject({
        type: "city",
        name: "Birmingham",
        href: "/city/birmingham",
        venueCount: 1,
      })
    }
  })

  it("classifies complete UK postcodes without sending them as city matches", () => {
    expect(searchWidgetLocations("SW1A 1AA", index)).toEqual({
      status: "postcode",
      queryKind: "postcode",
      postcode: "SW1A 1AA",
    })
  })

  it("handles empty, short and unknown locations without throwing", () => {
    expect(searchWidgetLocations("  ", index).status).toBe("empty")
    expect(searchWidgetLocations("x", index).status).toBe("invalid")
    expect(searchWidgetLocations("atlantis", index)).toMatchObject({
      status: "none",
      queryKind: "city",
    })
  })

  it("does not include unverified listings, other activities or mobile services in the default index", () => {
    expect(index.cities.map((city) => city.name).sort()).toEqual(["Birmingham", "London"])
    expect(index.cities.find((city) => city.name === "Manchester")).toBeUndefined()
    expect(index.cities.find((city) => city.name === "Leeds")).toBeUndefined()
    expect(index.cities.find((city) => city.name === "UK-wide")).toBeUndefined()
  })

  it("sanitises embed query parameters", () => {
    expect(sanitiseWidgetActivity('rage-room"><script>')).toBe("rage-room")
    expect(sanitiseWidgetActivity("axe-throwing")).toBe("axe-throwing")
    expect(sanitiseWidgetLocationSlug("London!@#")).toBe("london")
    expect(sanitiseWidgetLocationSlug('"><img src=x>')).toBe("imgsrcx")
    expect(sanitiseWidgetShowTitle("0")).toBe(false)
    expect(sanitiseWidgetShowTitle("1")).toBe(true)
    expect(sanitiseWidgetShowTitle('<script>')).toBe(true)
    expect(
      buildWidgetEmbedSrc({
        siteOrigin: "https://www.rageroomdirectory.co.uk",
        showTitle: false,
        activity: "axe-throwing",
        location: "birmingham",
      })
    ).toBe(
      "https://www.rageroomdirectory.co.uk/embed/rage-room-finder?title=0&activity=axe-throwing&location=birmingham"
    )
    expect(
      buildWidgetEmbedSrc({
        siteOrigin: "javascript:alert(1)",
        location: "london\"onclick=alert(1)",
      })
    ).toBe("https://www.rageroomdirectory.co.uk/embed/rage-room-finder?location=londononclickalert1")
    const html = buildWidgetEmbedHtml(
      "https://www.rageroomdirectory.co.uk/embed/rage-room-finder"
    )
    expect(html).toContain("Find a Rage Room Near You")
    expect(html).not.toContain("<a ")
    expect(html).not.toContain("follow")
    expect(WIDGET_ATTRIBUTION_REL).toBe("nofollow noopener")
  })
})
