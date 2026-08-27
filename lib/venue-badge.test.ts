import { describe, expect, it } from "vitest"
import {
  BADGE_EMBED_LINK_REL,
  buildVenueBadgeEmbedHtml,
  getVenueProfilePath,
  getVenueProfileUrl,
  isBadgeEligibleListing,
  venueBadgeLookupOptions,
} from "./venue-badge"
import type { Listing } from "@/types/listing"

function listing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "abc-123",
    name: "Boom Lab",
    description: "A verified rage room.",
    city: "London",
    region: "London",
    postcode: "E1 6AN",
    location: { lat: 51.5, lng: -0.12 },
    website: "https://example.com",
    phone: null,
    price: 35,
    activities: ["rage-room"],
    occasions: [],
    image: "/images/example.jpg",
    verified: true,
    googlePlaceId: null,
    slug: "boom-lab-london",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  }
}

describe("venue badge embed generation", () => {
  it("uses the canonical listing route rather than a placeholder", () => {
    expect(getVenueProfilePath(listing())).toBe("/listing/boom-lab-london")
    expect(getVenueProfileUrl(listing())).toBe(
      "https://www.rageroomdirectory.co.uk/listing/boom-lab-london"
    )
    expect(getVenueProfilePath(listing({ slug: null }))).toBe("/listing/abc-123")
  })

  it("builds escaped embed HTML that links to the canonical profile", () => {
    const html = buildVenueBadgeEmbedHtml({
      listing: listing({ name: `Rage & "Smash"` }),
      variant: "compact",
      siteOrigin: "https://www.rageroomdirectory.co.uk",
    })

    expect(html).toContain('href="https://www.rageroomdirectory.co.uk/listing/boom-lab-london"')
    expect(html).toContain('src="https://www.rageroomdirectory.co.uk/badges/listed-on-rageroom-compact.svg"')
    expect(html).toContain(`rel="${BADGE_EMBED_LINK_REL}"`)
    expect(html).toContain('rel="nofollow noopener"')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('alt="Listed on RageRoom Directory"')
    expect(html).not.toContain("/listing/example")
    expect(html).not.toContain("<script")
    expect(html).not.toMatch(/rel="noopener"/)
  })

  it("never lets a listing slug or origin become an arbitrary URL", () => {
    const html = buildVenueBadgeEmbedHtml({
      listing: listing({ slug: "https://evil.example/steal" }),
      siteOrigin: "javascript:alert(1)",
    })

    expect(html).toContain('href="https://www.rageroomdirectory.co.uk/listing/https://evil.example/steal"')
    expect(html).toContain('src="https://www.rageroomdirectory.co.uk/badges/listed-on-rageroom-standard.svg"')
    expect(html).not.toContain("javascript:")
    expect(html).not.toContain('href="https://evil.example')
  })

  it("escapes names and URLs so markup cannot break out of the snippet", () => {
    const html = buildVenueBadgeEmbedHtml({
      listing: listing({
        slug: `boom"onclick=alert(1)`,
        name: `<img src=x onerror=alert(1)>`,
      }),
      siteOrigin: "https://www.rageroomdirectory.co.uk",
    })

    expect(html).toContain("boom&quot;onclick=alert(1)")
    expect(html).not.toContain(`boom"onclick`)
    expect(html).not.toContain("<img src=x")
  })

  it("only offers the badge for verified listings with a profile identifier", () => {
    expect(isBadgeEligibleListing(listing())).toBe(true)
    expect(isBadgeEligibleListing(listing({ verified: false }))).toBe(false)
    expect(
      venueBadgeLookupOptions([
        listing(),
        listing({ id: "2", slug: "hidden", name: "Hidden", verified: false }),
      ]).map((option) => option.value)
    ).toEqual(["boom-lab-london"])
  })
})
