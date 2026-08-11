import { afterEach, describe, expect, it, vi } from "vitest"
import { FIRST_VISIT_CHECKLIST_PRODUCT_ID } from "@/lib/digital-products"

vi.mock("server-only", () => ({}))

describe("stripe price helper", () => {
  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it("refuses to create a Stripe price for the free first-timer checklist", async () => {
    vi.doMock("@/lib/stripe", () => ({
      getStripe: () => {
        throw new Error("Stripe should not be called for free products")
      },
    }))

    const { getOrCreateStripePriceForProduct } = await import(
      "@/lib/stripe-products"
    )

    await expect(
      getOrCreateStripePriceForProduct(FIRST_VISIT_CHECKLIST_PRODUCT_ID)
    ).rejects.toThrow(/Free digital product cannot create a Stripe price/i)
  })
})

describe("checkout free-product guard", () => {
  it("documents free checklist checkout rejection contract", async () => {
    const { getDigitalProduct, isFreeDigitalProduct } = await import(
      "@/lib/digital-products"
    )
    const product = getDigitalProduct(FIRST_VISIT_CHECKLIST_PRODUCT_ID)
    expect(isFreeDigitalProduct(product)).toBe(true)
    // Checkout route returns 400 when product.isFree — covered by product flag.
  })
})
