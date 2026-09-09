import { afterEach, describe, expect, it, vi } from "vitest"
import { FIRST_VISIT_CHECKLIST_PRODUCT_ID } from "@/lib/digital-products"

vi.mock("server-only", () => ({}))

describe("stripe price helper", () => {
  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it("creates a Stripe price for the £1 first-timer checklist", async () => {
    vi.doMock("@/lib/stripe", () => ({
      getStripe: () => {
        return {
          prices: { list: vi.fn().mockResolvedValue({ data: [{ id: "price_first_visit", product: "prod_first_visit" }] }) },
          products: { retrieve: vi.fn().mockResolvedValue({ id: "prod_first_visit", name: "Rage Room First Visit Prep Pack" }), update: vi.fn() },
        }
      },
    }))

    const { getOrCreateStripePriceForProduct } = await import(
      "@/lib/stripe-products"
    )

    await expect(getOrCreateStripePriceForProduct(FIRST_VISIT_CHECKLIST_PRODUCT_ID)).resolves.toBe("price_first_visit")
  })
})

describe("checkout first-visit product", () => {
  it("keeps the checklist as a paid product", async () => {
    const { getDigitalProduct, isFreeDigitalProduct } = await import(
      "@/lib/digital-products"
    )
    const product = getDigitalProduct(FIRST_VISIT_CHECKLIST_PRODUCT_ID)
    expect(isFreeDigitalProduct(product)).toBe(false)
  })
})
