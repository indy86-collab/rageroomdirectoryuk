import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { trackGenerateLead, trackPurchase } from "./analytics"

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
})
