import { describe, expect, it } from "vitest"
import {
  FIRST_VISIT_CHECKLIST_PRODUCT_ID,
  acceptedPurchaseAmounts,
  getDigitalProduct,
  getDigitalProductAnalytics,
  isFreeDigitalProduct,
  sessionAmountMatchesProduct,
} from "@/lib/digital-products"

describe("first-timer checklist lead magnet", () => {
  it("marks the first visit product as free without zeroing historical unitAmount", () => {
    const product = getDigitalProduct(FIRST_VISIT_CHECKLIST_PRODUCT_ID)
    expect(product).toBeTruthy()
    expect(product?.isFree).toBe(true)
    expect(product?.priceLabel).toBe("FREE")
    expect(product?.unitAmount).toBe(400)
    expect(product?.name).toMatch(/First-Timer Checklist/i)
    expect(isFreeDigitalProduct(product)).toBe(true)
  })

  it("reports zero analytics price for the free checklist", () => {
    const product = getDigitalProduct(FIRST_VISIT_CHECKLIST_PRODUCT_ID)!
    const analytics = getDigitalProductAnalytics(product)
    expect(analytics.price).toBe(0)
    expect(analytics.item_id).toBe("rage_first_visit_prep_pack")
  })

  it("keeps paid products non-free with unchanged prices", () => {
    const party = getDigitalProduct("rage-room-party-planner")!
    const corporate = getDigitalProduct("corporate-team-building-toolkit")!
    const bookingSystem = getDigitalProduct(
      "rage-room-corporate-booking-system"
    )!
    const gift = getDigitalProduct("rage-room-gift-voucher-template-pack")!
    const bundle = getDigitalProduct("party-gift-bundle")!

    for (const product of [party, corporate, bookingSystem, gift, bundle]) {
      expect(product.isFree).toBeFalsy()
      expect(product.unitAmount).toBeGreaterThan(0)
      expect(product.priceLabel).not.toBe("FREE")
    }

    expect(party.unitAmount).toBe(560)
    expect(corporate.unitAmount).toBe(1520)
    expect(corporate.name).toMatch(/Event Builder/i)
    expect(bookingSystem.unitAmount).toBe(7900)
    expect(bookingSystem.priceLabel).toBe("£79")
    expect(bookingSystem.isInteractive).toBe(true)
    expect(bookingSystem.filePath).toBeFalsy()
    expect(gift.unitAmount).toBe(400)
    expect(bundle.unitAmount).toBe(720)
  })

  it("accepts current and legacy compare-at amounts for Event Builder entitlement", () => {
    const corporate = getDigitalProduct("corporate-team-building-toolkit")!
    expect(acceptedPurchaseAmounts(corporate)).toEqual(
      expect.arrayContaining([1520, 1900])
    )
    expect(sessionAmountMatchesProduct(corporate, 1520, "gbp")).toBe(true)
    expect(sessionAmountMatchesProduct(corporate, 1900, "gbp")).toBe(true)
    expect(sessionAmountMatchesProduct(corporate, 7900, "gbp")).toBe(false)
    expect(sessionAmountMatchesProduct(corporate, 1520, "usd")).toBe(false)
  })

  it("keeps booking system entitlement pinned to £79 GBP", () => {
    const bookingSystem = getDigitalProduct(
      "rage-room-corporate-booking-system"
    )!
    expect(sessionAmountMatchesProduct(bookingSystem, 7900, "gbp")).toBe(true)
    expect(sessionAmountMatchesProduct(bookingSystem, 1520, "gbp")).toBe(false)
    expect(bookingSystem.stripeLookupKey).toBe(
      "rage_room_corporate_booking_system_gbp_7900"
    )
  })
})
