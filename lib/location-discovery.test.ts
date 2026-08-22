import { describe, expect, it } from "vitest"
import listingsData from "@/data/listings.json"
import sitemap from "@/app/sitemap"
import {
  generateMetadata as generateActivityLocationMetadata,
  generateStaticParams as generateActivityLocationParams,
} from "@/app/(site)/activities/[slug]/[location]/page"
import {
  generateMetadata as generateOccasionLocationMetadata,
  generateStaticParams as generateOccasionLocationParams,
} from "@/app/(site)/occasions/[slug]/[location]/page"
import {
  getDiscoveryBreadcrumbs,
  getEligibleLocationDiscoveryPages,
  getLocationDiscoveryDescription,
  getLocationDiscoveryPageData,
  isDiscoveryLandingPageEligible,
} from "@/lib/location-discovery"
import type { Listing } from "@/types/listing"

const listings = listingsData as Listing[]

describe("location discovery qualification", () => {
  it("creates only the inventory-backed pages that now qualify", () => {
    expect(getEligibleLocationDiscoveryPages(listings).map((page) => page.href)).toEqual([
      "/activities/paint-splatter/london",
      "/activities/rage-rooms/birmingham",
      "/activities/rage-rooms/london",
      "/occasions/birthdays/birmingham",
      "/occasions/birthdays/edinburgh",
      "/occasions/birthdays/london",
      "/occasions/corporate-team-building/edinburgh",
      "/occasions/corporate-team-building/london",
      "/occasions/hen-parties/birmingham",
      "/occasions/hen-parties/edinburgh",
      "/occasions/hen-parties/london",
      "/occasions/kids-families/london",
      "/occasions/stag-parties/birmingham",
      "/occasions/stag-parties/edinburgh",
      "/occasions/stag-parties/london",
    ])
  })

  it("qualifies the new London paint-splatter landing from verified inventory", () => {
    const page = getLocationDiscoveryPageData({
      type: "activity",
      categorySlug: "paint-splatter",
      locationSlug: "london",
      listings,
    })
    expect(page?.qualification).toBe("strong")
    expect(page?.listings.map((listing) => listing.name).sort()).toEqual([
      "Boom Lab London",
      "Kedi Studio",
      "Rage Cage UK",
      "The Splatter Room Studio",
    ])
  })

  it("resolves a qualifying activity and exact-city inventory", () => {
    const page = getLocationDiscoveryPageData({
      type: "activity",
      categorySlug: "rage-rooms",
      locationSlug: "birmingham",
      listings,
    })
    expect(page?.qualification).toBe("strong")
    expect(page?.listings).toHaveLength(3)
    expect(new Set(page?.listings.map((listing) => listing.city))).toEqual(
      new Set(["Birmingham"])
    )
  })

  it("resolves the now-strong Birmingham birthday page", () => {
    const page = getLocationDiscoveryPageData({
      type: "occasion",
      categorySlug: "birthdays",
      locationSlug: "birmingham",
      listings,
    })
    expect(page?.qualification).toBe("strong")
    expect(page?.listings.map((listing) => listing.name).sort()).toEqual([
      "All The Rage",
      "Rage Room Birmingham",
      "Splash House Birmingham",
    ])
  })

  it("rejects below-threshold and invalid combinations", () => {
    expect(
      getLocationDiscoveryPageData({
        type: "activity",
        categorySlug: "axe-throwing",
        locationSlug: "birmingham",
        listings,
      })
    ).toBeNull()
    expect(
      getLocationDiscoveryPageData({
        type: "activity",
        categorySlug: "not-an-activity",
        locationSlug: "birmingham",
        listings,
      })
    ).toBeNull()
    expect(
      getLocationDiscoveryPageData({
        type: "occasion",
        categorySlug: "not-an-occasion",
        locationSlug: "birmingham",
        listings,
      })
    ).toBeNull()
    expect(
      getLocationDiscoveryPageData({
        type: "activity",
        categorySlug: "rage-rooms",
        locationSlug: "not-a-location",
        listings,
      })
    ).toBeNull()
  })

  it("uses the explicit London city-or-region rule without distance matching", () => {
    const page = getLocationDiscoveryPageData({
      type: "activity",
      categorySlug: "rage-rooms",
      locationSlug: "london",
      listings,
    })
    expect(page?.listings).toHaveLength(3)
    expect(page?.listings.map((listing) => listing.city).sort()).toEqual([
      "Croydon",
      "London",
      "Romford",
    ])
    expect(page?.listings.every((listing) => listing.city === "London" || listing.region === "London")).toBe(true)
  })

  it("removes a route as soon as its inventory falls below its approved threshold", () => {
    const reduced = listings.filter(
      (listing) =>
        listing.name !== "Rage Room Birmingham" &&
        listing.name !== "Go Rage - Birmingham Rage Room"
    )
    expect(
      getLocationDiscoveryPageData({
        type: "activity",
        categorySlug: "rage-rooms",
        locationSlug: "birmingham",
        listings: reduced,
      })
    ).toBeNull()
  })

  it("does not make arbitrary two-venue combinations eligible", () => {
    expect(
      isDiscoveryLandingPageEligible({
        type: "activity",
        categorySlug: "rage-rooms",
        locationSlug: "leicester",
        matchingVenueCount: 2,
      })
    ).toBe(false)
  })
})

describe("location discovery routes and metadata", () => {
  it("generates only eligible static activity and occasion params", async () => {
    expect(await generateActivityLocationParams()).toEqual([
      { slug: "paint-splatter", location: "london" },
      { slug: "rage-rooms", location: "birmingham" },
      { slug: "rage-rooms", location: "london" },
    ])
    expect(await generateOccasionLocationParams()).toEqual([
      { slug: "birthdays", location: "birmingham" },
      { slug: "birthdays", location: "edinburgh" },
      { slug: "birthdays", location: "london" },
      { slug: "corporate-team-building", location: "edinburgh" },
      { slug: "corporate-team-building", location: "london" },
      { slug: "hen-parties", location: "birmingham" },
      { slug: "hen-parties", location: "edinburgh" },
      { slug: "hen-parties", location: "london" },
      { slug: "kids-families", location: "london" },
      { slug: "stag-parties", location: "birmingham" },
      { slug: "stag-parties", location: "edinburgh" },
      { slug: "stag-parties", location: "london" },
    ])
  })

  it("generates truthful canonical metadata with live inventory copy", async () => {
    const metadata = await generateActivityLocationMetadata({
      params: { slug: "rage-rooms", location: "birmingham" },
    })
    expect(metadata.title).toBe("Rage Rooms in Birmingham")
    expect(metadata.alternates).toEqual({
      canonical: "/activities/rage-rooms/birmingham",
    })
    expect(metadata.description).toContain("3 verified venues")

    const occasion = await generateOccasionLocationMetadata({
      params: { slug: "birthdays", location: "birmingham" },
    })
    expect(occasion.alternates).toEqual({
      canonical: "/occasions/birthdays/birmingham",
    })
    expect(occasion.description).toContain("3 verified venues")
  })

  it("generates the four-level breadcrumb trail", () => {
    const page = getLocationDiscoveryPageData({
      type: "occasion",
      categorySlug: "birthdays",
      locationSlug: "birmingham",
      listings,
    })
    expect(page && getDiscoveryBreadcrumbs(page)).toEqual([
      { label: "Home", href: "/" },
      { label: "Occasions", href: "/occasions" },
      { label: "Birthday Rage Rooms", href: "/occasions/birthdays" },
      { label: "Birmingham" },
    ])
  })

  it("handles singular and plural inventory copy without hardcoded counts", () => {
    const page = getLocationDiscoveryPageData({
      type: "activity",
      categorySlug: "rage-rooms",
      locationSlug: "birmingham",
      listings,
    })!
    expect(getLocationDiscoveryDescription(page)).toContain("3 verified venues")
    expect(
      getLocationDiscoveryDescription({ ...page, listings: page.listings.slice(0, 1) })
    ).toContain("1 verified venue in Birmingham")
  })

  it("adds exactly eligible discovery URLs to the sitemap", async () => {
    const urls = new Set((await sitemap()).map((entry) => entry.url))
    expect(urls.has("https://www.rageroomdirectory.co.uk/activities/rage-rooms/birmingham")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/activities/rage-rooms/london")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/occasions/birthdays/birmingham")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/occasions/hen-parties/london")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/occasions/stag-parties/birmingham")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/activities/paint-splatter/london")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/occasions/birthdays/edinburgh")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/occasions/kids-families/london")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/occasions/corporate-team-building/london")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/activities/axe-throwing/birmingham")).toBe(false)
    expect(urls.has("https://www.rageroomdirectory.co.uk/activities/rage-rooms/leicester")).toBe(false)
  })
})
