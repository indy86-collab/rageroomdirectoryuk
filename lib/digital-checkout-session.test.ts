import { describe, expect, it } from "vitest"
import {
  digitalCheckoutPaymentMethodTypes,
  digitalCheckoutSessionOptions,
  stripeCheckoutDisplayName,
} from "@/lib/digital-checkout-session"
import { getDigitalProduct } from "@/lib/digital-products"

describe("digital checkout session options", () => {
  it("labels the party planner as a PDF download, not a booking", () => {
    const party = getDigitalProduct("rage-room-party-planner")!
    expect(stripeCheckoutDisplayName(party)).toMatch(/PDF download/i)
    expect(stripeCheckoutDisplayName(party)).toMatch(/not a venue booking/i)
  })

  it("keeps cheap downloads on card + Link only", () => {
    const party = getDigitalProduct("rage-room-party-planner")!
    const gift = getDigitalProduct("rage-room-gift-voucher-template-pack")!
    const corporate = getDigitalProduct("corporate-team-building-toolkit")!

    expect(digitalCheckoutPaymentMethodTypes(party)).toEqual(["card", "link"])
    expect(digitalCheckoutPaymentMethodTypes(gift)).toEqual(["card", "link"])
    expect(digitalCheckoutPaymentMethodTypes(corporate)).toEqual(["card", "link"])
  })

  it("leaves higher-ticket products on Stripe's default methods", () => {
    const bookingSystem = getDigitalProduct(
      "rage-room-corporate-booking-system"
    )!
    expect(digitalCheckoutPaymentMethodTypes(bookingSystem)).toBeNull()
    expect(
      "payment_method_types" in digitalCheckoutSessionOptions(bookingSystem)
    ).toBe(false)
  })

  it("does not offer a promo-code field and uses a Pay button in en-GB", () => {
    const party = getDigitalProduct("rage-room-party-planner")!
    const options = digitalCheckoutSessionOptions(party)

    expect(options).not.toHaveProperty("allow_promotion_codes")
    expect(options.submit_type).toBe("pay")
    expect(options.locale).toBe("en-GB")
    expect(options.adaptive_pricing).toEqual({ enabled: false })
    expect(options.payment_method_types).toEqual(["card", "link"])
    expect(options.custom_text.submit.message).toMatch(/not a venue booking/i)
  })
})
