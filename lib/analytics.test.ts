import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  getDirectorySourcePath,
  getSafeDirectoryReferrerPath,
  trackAffiliateWidgetLoad,
  trackAuthorityEvent,
  trackDirectoryEvent,
  trackPurchase,
} from "./analytics"

describe("directory conversion analytics", () => {
  const gtag = vi.fn()

  beforeEach(() => {
    gtag.mockClear()
    const consent = JSON.stringify({
      version: 1,
      analytics: true,
      decidedAt: Date.now(),
    })
    vi.stubGlobal("window", {
      gtag,
      localStorage: {
        getItem: vi.fn((key: string) =>
          key === "rageroom:privacy-consent" ? consent : null
        ),
      },
      location: {
        origin: "https://rageroomdirectory.co.uk",
        pathname: "/activities/axe-throwing",
        search: "?query=arbitrary-personal-text",
      },
    })
    vi.stubGlobal("document", {
      referrer: "https://rageroomdirectory.co.uk/listings?query=private",
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("fires one primary booking conversion with sanitised attribution", () => {
    trackDirectoryEvent("booking_click", {
      venueSlug: "axed-and-enraged-london",
      venueCity: "London",
      pageType: "activity",
      sourcePath: getDirectorySourcePath(),
      ctaPlacement: "activity_results",
      activity: "axe_throwing",
    })

    expect(gtag).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledWith("event", "booking_click", {
      venueSlug: "axed-and-enraged-london",
      venueCity: "London",
      pageType: "activity",
      sourcePath: "/activities/axe-throwing",
      ctaPlacement: "activity_results",
      activity: "axe_throwing",
    })
  })

  it("keeps website, phone and claim intent distinct from booking", () => {
    const common = {
      venueSlug: "venue",
      venueCity: "Derby",
      pageType: "venue" as const,
      sourcePath: "/listing/venue",
      ctaPlacement: "venue_contact" as const,
    }
    trackDirectoryEvent("website_click", common)
    trackDirectoryEvent("phone_click", common)
    trackDirectoryEvent("claim_listing_click", {
      ...common,
      ctaPlacement: "listing_owner_panel",
    })

    expect(gtag.mock.calls.map((call) => call[1])).toEqual([
      "website_click",
      "phone_click",
      "claim_listing_click",
    ])
    expect(gtag.mock.calls.map((call) => call[1])).not.toContain("booking_click")
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("phoneNumber")
  })

  it("tracks venue views with same-origin path only", () => {
    trackDirectoryEvent("venue_view", {
      venueSlug: "venue",
      venueCity: "London",
      sourcePath: getSafeDirectoryReferrerPath(),
    })

    expect(gtag).toHaveBeenCalledWith("event", "venue_view", {
      venueSlug: "venue",
      venueCity: "London",
      sourcePath: "/listings",
    })

    vi.stubGlobal("document", { referrer: "https://search.example/?q=private" })
    expect(getSafeDirectoryReferrerPath()).toBeUndefined()
  })

  it("tracks compare add, remove and open without venue payload bloat", () => {
    trackDirectoryEvent("compare_add", {
      venueSlug: "one",
      sourcePageType: "search_results",
      sourcePath: "/listings",
    })
    trackDirectoryEvent("compare_remove", {
      venueSlug: "one",
      sourcePageType: "search_results",
      sourcePath: "/listings",
    })
    trackDirectoryEvent("compare_open", {
      venueCount: 2,
      sourcePageType: "search_results",
      sourcePath: "/listings",
    })

    expect(gtag.mock.calls.map((call) => call[1])).toEqual([
      "compare_add",
      "compare_remove",
      "compare_open",
    ])
    expect(gtag.mock.calls[2][2]).toEqual({
      venueCount: 2,
      sourcePageType: "search_results",
      sourcePath: "/listings",
    })
  })

  it("tracks deliberate filter application and clearing without coordinates", () => {
    trackDirectoryEvent("filter_apply", {
      filterType: "distance",
      filterValue: "25_miles",
      filterAction: "set",
      pageType: "search_results",
      sourcePath: "/listings",
      distanceFilterUsed: true,
    })
    trackDirectoryEvent("filter_clear", {
      pageType: "search_results",
      sourcePath: "/listings",
      filterCount: 1,
    })

    expect(gtag.mock.calls.map((call) => call[1])).toEqual([
      "filter_apply",
      "filter_clear",
    ])
    expect(JSON.stringify(gtag.mock.calls)).not.toMatch(/latitude|longitude|\"lat\"|\"lng\"/)
  })

  it("tracks each discovery transition with a normalised destination", () => {
    const common = {
      sourcePageType: "homepage" as const,
      sourcePath: "/",
    }
    trackDirectoryEvent("activity_discovery_click", {
      ...common,
      destinationIdentifier: "axe-throwing",
      destinationPath: "/activities/axe-throwing",
    })
    trackDirectoryEvent("occasion_discovery_click", {
      ...common,
      destinationIdentifier: "birthdays",
      destinationPath: "/occasions/birthdays",
    })
    trackDirectoryEvent("location_discovery_click", {
      sourcePageType: "activity",
      sourcePath: "/activities/rage-rooms",
      destinationIdentifier: "birmingham",
      destinationPath: "/activities/rage-rooms/birmingham",
    })

    expect(gtag.mock.calls.map((call) => call[1])).toEqual([
      "activity_discovery_click",
      "occasion_discovery_click",
      "location_discovery_click",
    ])
  })

  it("drops unsupported runtime properties from directory payloads", () => {
    trackDirectoryEvent("booking_click", {
      venueSlug: "venue",
      pageType: "venue",
      sourcePath: "/listing/venue?email=person@example.com",
      ctaPlacement: "venue_hero",
      latitude: 51.5072,
      email: "person@example.com",
    } as never)

    const payload = gtag.mock.calls[0][2]
    expect(payload).not.toHaveProperty("latitude")
    expect(payload).not.toHaveProperty("email")
    expect(payload.sourcePath).toBe("/listing/venue")
  })

  it("enforces the event property contract at compile time", () => {
    if (false) {
      // @ts-expect-error Exact coordinates are not supported directory properties.
      trackDirectoryEvent("venue_view", { venueSlug: "venue", venueCity: "London", latitude: 1 })
      // @ts-expect-error Website clicks require stable CTA placement attribution.
      trackDirectoryEvent("website_click", { venueSlug: "venue", pageType: "venue" })
    }
    expect(true).toBe(true)
  })

  it("retains existing ecommerce analytics", () => {
    trackPurchase({
      transaction_id: "cs_test_123",
      product: {
        item_id: "rage_party_planner_pack",
        item_name: "Rage Room Party Planner Pack",
        item_category: "Digital Product",
        price: 5.6,
        currency: "GBP",
      },
    })
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "purchase",
      expect.objectContaining({ transaction_id: "cs_test_123", value: 5.6 })
    )
  })

  it("does not send events without analytics consent", () => {
    vi.stubGlobal("window", {
      gtag,
      localStorage: { getItem: vi.fn(() => null) },
      location: { origin: "https://rageroomdirectory.co.uk", pathname: "/listings" },
    })

    trackDirectoryEvent("venue_view", {
      venueSlug: "venue",
      venueCity: "London",
    })

    expect(gtag).not.toHaveBeenCalled()
  })

  it("tracks affiliate widget load without PII", () => {
    trackAffiliateWidgetLoad({
      provider: "getyourguide",
      placement: "city",
      city: "Manchester",
      recommendationId: "city_default",
    })

    expect(gtag).toHaveBeenCalledWith("event", "affiliate_widget_load", {
      affiliate_provider: "getyourguide",
      affiliate_placement: "city",
      city: "Manchester",
      recommendation_id: "city_default",
    })
  })
})

describe("authority analytics", () => {
  const gtag = vi.fn()

  beforeEach(() => {
    gtag.mockClear()
    const consent = JSON.stringify({
      version: 1,
      analytics: true,
      decidedAt: Date.now(),
    })
    vi.stubGlobal("window", {
      gtag,
      localStorage: {
        getItem: vi.fn((key: string) =>
          key === "rageroom:privacy-consent" ? consent : null
        ),
      },
      location: {
        origin: "https://rageroomdirectory.co.uk",
        pathname: "/for-publishers",
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("tracks badge and widget events without search text or PII", () => {
    trackAuthorityEvent("badge_code_copied", {
      variant: "compact",
      venueSlug: "boom-lab-london",
    })
    trackAuthorityEvent("venue_profile_link_copied", {
      venueSlug: "boom-lab-london",
    })
    trackAuthorityEvent("widget_loaded", { source: "embed" })
    trackAuthorityEvent("widget_search", {
      queryKind: "city",
      resultCount: 2,
    })
    trackAuthorityEvent("widget_result_click", { resultType: "city" })
    trackAuthorityEvent("widget_embed_code_copied", { customisation: "default" })

    expect(gtag.mock.calls.map((call) => call[1])).toEqual([
      "badge_code_copied",
      "venue_profile_link_copied",
      "widget_loaded",
      "widget_search",
      "widget_result_click",
      "widget_embed_code_copied",
    ])
    expect(JSON.stringify(gtag.mock.calls)).not.toMatch(/SW1A|email|postcode/i)
    expect(gtag.mock.calls[3][2]).toEqual({
      queryKind: "city",
      resultCount: 2,
    })
  })
})
