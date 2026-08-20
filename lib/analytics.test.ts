import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import {
  trackBookingCtaClicked,
  trackClaimListingClicked,
  trackCompareSelected,
  trackDiscoveryFilterApplied,
  trackDiscoveryPageViewed,
  trackGenerateLead,
  trackPurchase,
  trackVenueClicked,
} from "./analytics"

describe("directory monetisation analytics", () => {
  const gtag = vi.fn()

  beforeEach(() => {
    gtag.mockClear()
    vi.stubGlobal("window", { gtag })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("fires generate_lead without PII", () => {
    trackGenerateLead({
      source: "listing_hero",
      listingSlug: "edinburgh-rage-room-edinburgh",
      city: "Edinburgh",
    })
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", {
      currency: "GBP",
      value: 0,
      lead_source: "listing_hero",
      listing_slug: "edinburgh-rage-room-edinburgh",
      city: "Edinburgh",
    })
  })

  it("fires purchase with transaction value", () => {
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
      expect.objectContaining({
        transaction_id: "cs_test_123",
        value: 5.6,
        currency: "GBP",
      })
    )
  })

  it("uses stable discovery funnel events without PII", () => {
    trackDiscoveryPageViewed("activity", "axe-throwing", 14)
    trackDiscoveryFilterApplied({
      surface: "activity",
      slug: "axe-throwing",
      filterState: "city=Derby",
      resultCount: 1,
    })
    trackVenueClicked({
      surface: "activity",
      sourceSlug: "axe-throwing",
      listingSlug: "hatchet-harrys-derby",
      city: "Derby",
    })
    trackCompareSelected({
      surface: "activity",
      sourceSlug: "axe-throwing",
      listingSlug: "hatchet-harrys-derby",
      selected: true,
      compareCount: 1,
    })
    trackBookingCtaClicked({ source: "activity_card", listingSlug: "venue", city: "Derby" })
    trackClaimListingClicked("venue", "listing_owner_panel")

    expect(gtag.mock.calls.map((call) => call[1])).toEqual([
      "activity_page_viewed",
      "discovery_filter_applied",
      "discovery_venue_clicked",
      "discovery_compare_selected",
      "booking_cta_clicked",
      "claim_listing_clicked",
    ])
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("email")
  })
})
