import { describe, expect, it } from "vitest"
import { buildImageSitemapXml } from "@/lib/image-sitemap"
import {
  buildListingMediaSchema,
  getListingCompleteness,
} from "@/lib/listing-quality"
import { isIndexableLocationPage } from "@/lib/location-indexing"
import { findNearestListings } from "@/lib/nearby-search"
import { buildAggregateReportCsv, buildRageRoomReportData } from "@/lib/report-data"
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
    image: "/images/example.jpg",
    verified: true,
    googlePlaceId: null,
    slug: "example-rage-room",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  }
}

describe("listing enrichment SEO", () => {
  it("counts only genuinely present completeness fields", () => {
    const result = getListingCompleteness(
      listing({
        bookingUrl: "https://example.com/book",
        lastVerified: "2026-08-01",
        sourceUrl: "https://example.com/prices",
      })
    )
    expect(result.complete).toEqual(
      expect.arrayContaining(["bookingUrl", "lastVerified", "sourceUrl"])
    )
    expect(result.missing).toContain("authorisedMedia")
  })

  it("emits ImageObject and VideoObject only for authorised media", () => {
    const schemas = buildListingMediaSchema(
      listing({
        media: [
          { type: "image", url: "/images/authorised.jpg", alt: "Smash room interior", authorised: true, credit: "Venue" },
          { type: "image", url: "/images/unapproved.jpg", alt: "Unapproved", authorised: false },
          { type: "video", url: "https://example.com/tour.mp4", alt: "Venue tour", authorised: true },
        ],
      }),
      "https://www.rageroomdirectory.co.uk/listing/example-rage-room"
    )
    expect(schemas.map((schema) => schema["@type"])).toEqual([
      "ImageObject",
      "VideoObject",
    ])
    expect(JSON.stringify(schemas)).not.toContain("unapproved.jpg")
  })

  it("puts authorised venue images and first-party covers in the image sitemap", () => {
    const xml = buildImageSitemapXml([
      listing({
        media: [
          {
            type: "image",
            url: "/images/authorised.jpg",
            alt: "Venue interior",
            caption: "Inside the venue",
            authorised: true,
          },
        ],
      }),
      listing({
        id: "2",
        slug: "no-permission",
        image: "https://storage.googleapis.com/example/private-cover.jpg",
        media: [{ type: "image", url: "/images/private.jpg", alt: "Private", authorised: false }],
      }),
      listing({
        id: "3",
        slug: "first-party-cover",
        image: "/images/venue-cover.jpg",
        media: [],
      }),
    ])
    expect(xml).toContain("authorised.jpg")
    expect(xml).toContain("venue-cover.jpg")
    expect(xml).not.toContain("private.jpg")
    expect(xml).not.toContain("private-cover.jpg")
    expect(xml).not.toContain("image:caption")
  })
})

describe("nearby and index-quality rules", () => {
  it("returns verified venues sorted by distance", () => {
    const results = findNearestListings(
      [
        listing({ id: "far", slug: "far", location: { lat: 52, lng: -0.12 } }),
        listing({ id: "near", slug: "near", location: { lat: 51.51, lng: -0.12 } }),
        listing({ id: "hidden", slug: "hidden", verified: false, location: { lat: 51.5, lng: -0.12 } }),
      ],
      { lat: 51.5, lng: -0.12 }
    )
    expect(results.map((result) => result.id)).toEqual(["near", "far"])
  })

  it("indexes in-city inventory and curated nearby pages, but not generic nearby-only pages", () => {
    expect(isIndexableLocationPage({ city: "Bath", inCity: [listing()], nearby: [] })).toBe(true)
    expect(isIndexableLocationPage({ city: "Oxford", inCity: [], nearby: [listing()] })).toBe(true)
    expect(isIndexableLocationPage({ city: "Uncurated Town", inCity: [], nearby: [listing()] })).toBe(false)
  })
})

describe("report data", () => {
  it("builds aggregate statistics and a private-data-free CSV", () => {
    const report = buildRageRoomReportData([
      listing({ id: "1", city: "London", price: 30, lastVerified: "2026-08-01" }),
      listing({ id: "2", city: "Leeds", region: "Yorkshire", price: 50, lastVerified: "2026-08-02" }),
    ])
    expect(report.averageStartingPrice).toBe(40)
    expect(report.citiesCovered).toBe(2)
    const csv = buildAggregateReportCsv(report)
    expect(csv).toContain("average_starting_price_gbp,40")
    expect(csv).not.toContain("example.com")
  })
})
