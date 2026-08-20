import { describe, expect, it } from "vitest"
import listingsData from "@/data/listings.json"
import type { Listing } from "@/types/listing"
import {
  ACTIVITY_DEFINITIONS,
  MIN_ACTIVITY_PAGE_LISTINGS,
  MIN_OCCASION_PAGE_LISTINGS,
  OCCASION_DEFINITIONS,
  formatListingPrice,
  getActivityCombinationHref,
  getListingHref,
  getListingPrimaryAction,
  matchesOccasionDefinition,
} from "@/lib/discovery"
import sitemap from "@/app/sitemap"
import {
  generateMetadata as generateActivityMetadata,
  generateStaticParams as generateActivityParams,
} from "@/app/(site)/activities/[slug]/page"
import {
  generateMetadata as generateOccasionMetadata,
  generateStaticParams as generateOccasionParams,
} from "@/app/(site)/occasions/[slug]/page"
import { generateMetadata as generateListingsMetadata } from "@/app/(site)/listings/page"

const listings = listingsData as Listing[]

describe("discovery inventory", () => {
  it("exposes only activity pages with sufficient verified inventory", async () => {
    const params = new Set((await generateActivityParams()).map(({ slug }) => slug))

    for (const activity of ACTIVITY_DEFINITIONS) {
      const count = listings.filter((listing) => listing.activities.includes(activity.value)).length
      expect(params.has(activity.slug)).toBe(count >= MIN_ACTIVITY_PAGE_LISTINGS)
    }

    expect(params.has("axe-throwing")).toBe(true)
    expect(params.has("car-smash")).toBe(true)
    expect(params.has("archery")).toBe(true)
    expect(params.has("mobile-rage-rooms")).toBe(true)
  })

  it("keeps occasion pages tied to evidence-backed inventory", async () => {
    const params = new Set((await generateOccasionParams()).map(({ slug }) => slug))

    for (const occasion of OCCASION_DEFINITIONS) {
      const count = listings.filter((listing) => matchesOccasionDefinition(listing, occasion)).length
      expect(params.has(occasion.slug)).toBe(count >= MIN_OCCASION_PAGE_LISTINGS)
    }
  })

  it("builds non-indexable activity combination states without new landing routes", () => {
    expect(getActivityCombinationHref("rage-rooms", "axe-throwing")).toBe(
      "/activities/rage-rooms?activities=axe-throwing#venues"
    )
    const matches = listings.filter((listing) =>
      ["rage-room", "axe-throwing"].every((activity) => listing.activities.includes(activity as never))
    )
    expect(matches.length).toBe(14)

    expect(listings.filter((listing) => listing.activities.includes("axe-throwing"))).toHaveLength(29)
  })

  it("exposes the expanded paint inventory and its strict smash-and-paint subset", () => {
    const paint = listings.filter((listing) => listing.activities.includes("paint-splatter"))
    const rageAndPaint = paint.filter((listing) => listing.activities.includes("rage-room"))

    expect(paint).toHaveLength(34)
    expect(rageAndPaint).toHaveLength(12)
    expect(getActivityCombinationHref("paint-splatter", "rage-room")).toBe(
      "/activities/paint-splatter?activities=rage-room#venues"
    )
  })
})

describe("discovery indexability", () => {
  it("canonicals filtered activity and occasion states to their parent and marks them noindex", async () => {
    const activity = await generateActivityMetadata({
      params: { slug: "axe-throwing" },
      searchParams: { city: "Derby", activities: "airsoft-target" },
    })
    const occasion = await generateOccasionMetadata({
      params: { slug: "birthdays" },
      searchParams: { city: "Bedford" },
    })

    expect(activity.alternates).toEqual({ canonical: "/activities/axe-throwing" })
    expect(activity.robots).toEqual({ index: false, follow: true })
    expect(occasion.alternates).toEqual({ canonical: "/occasions/birthdays" })
    expect(occasion.robots).toEqual({ index: false, follow: true })
  })

  it("marks filtered directory URLs noindex while keeping the directory canonical", () => {
    const metadata = generateListingsMetadata({ searchParams: { activities: "axe-throwing" } })
    expect(metadata.alternates).toEqual({ canonical: "/listings" })
    expect(metadata.robots).toEqual({ index: false, follow: true })
  })

  it("keeps sparse activity pages out of the sitemap", async () => {
    const urls = new Set((await sitemap()).map((entry) => entry.url))
    expect(urls.has("https://www.rageroomdirectory.co.uk/activities/axe-throwing")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/activities/car-smash")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/activities/mobile-rage-rooms")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/activities/paint-splatter")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/listing/splatter-art-studio-glasgow")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/listing/just-axing-swansea")).toBe(true)
  })
})

describe("venue discovery actions", () => {
  const base = listings[0]

  it("uses a verified booking URL as the primary action and falls back to details", () => {
    expect(getListingPrimaryAction({ ...base, bookingUrl: "https://example.com/book" })).toEqual({
      kind: "booking",
      href: "https://example.com/book",
      label: "Check availability",
    })
    expect(getListingPrimaryAction({ ...base, slug: "venue", bookingUrl: null })).toEqual({
      kind: "details",
      href: "/listing/venue",
      label: "View venue",
    })
  })

  it("keeps internal venue links stable and unknown prices explicit", () => {
    expect(getListingHref({ id: "id-only", slug: null })).toBe("/listing/id-only")
    expect(formatListingPrice({ price: null, priceUnit: null })).toBeNull()
  })
})
