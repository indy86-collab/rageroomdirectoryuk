import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type Stripe from "stripe"
const mocks = vi.hoisted(() => ({ create: vi.fn(), update: vi.fn(), constructEvent: vi.fn() }))
vi.mock("@/lib/stripe", () => ({ getStripe: () => ({ checkout: { sessions: { create: mocks.create } }, paymentIntents: { update: mocks.update }, webhooks: { constructEvent: mocks.constructEvent } }) }))
vi.mock("@/lib/digital-emails", () => ({ getCheckoutSessionEmail: vi.fn(), sendAbandonedCheckoutEmail: vi.fn(), sendPurchaseDownloadEmail: vi.fn() }))
import { sendPurchaseDownloadEmail } from "@/lib/digital-emails"
import { parseShopOrder } from "./catalog"
import { shopCheckoutMode, shopSessionOptions } from "./checkout"
import { recordPhysicalOrder, validPaidShopSession } from "./fulfilment"
import { POST as checkout } from "@/app/api/checkout/shop/route"
import { POST as webhook } from "@/app/api/webhooks/stripe/route"
const body = { productId: "smash-crew", variant: "Black / M", quantity: 2, requestId: "12345678-1234-1234-1234-123456789abc" }
// Historical paid orders retain their original price snapshot after catalogue repricing.
function paidSession() { return { id: "cs_test_123", metadata: { orderType: "physical", unitAmount: "2499", quantity: "2", shippingAmount: "998" }, currency: "gbp", payment_status: "paid", amount_subtotal: 4998, amount_total: 5996, payment_intent: "pi_123", collected_information: { shipping_details: { address: { country: "GB" } } } } as unknown as Stripe.Checkout.Session }
beforeEach(() => { vi.clearAllMocks(); vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_dummy"); vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_dummy") })
afterEach(() => vi.unstubAllEnvs())
describe("shop checkout", () => {
 it("opens checkout from the Stripe key", () => { expect(shopCheckoutMode()).toBe("test"); vi.stubEnv("STRIPE_SECRET_KEY", "sk_live_dummy"); expect(shopCheckoutMode()).toBe("live"); vi.stubEnv("STRIPE_SECRET_KEY", ""); expect(shopCheckoutMode()).toBe("preview") })
 it.each([{ quantity: 0 }, { quantity: 11 }, { quantity: 1.5 }, { quantity: "2" }, { variant: "unknown" }, { productId: "missing" }, { requestId: "bad" }])("rejects invalid orders %j", change => { expect(() => parseShopOrder({ ...body, ...change })).toThrow() })
 it("uses catalogue prices and UK-only shipping despite client amounts", () => { const options = shopSessionOptions(parseShopOrder({ ...body, price: 1, shipping: 0 }), "http://localhost:3107"); expect(options.line_items?.[0].price_data?.unit_amount).toBe(1999); expect(options.shipping_options?.[0].shipping_rate_data?.fixed_amount?.amount).toBe(998); expect(options.shipping_address_collection?.allowed_countries).toEqual(["GB"]); expect(options.payment_intent_data?.metadata?.orderType).toBe("physical"); expect(options.locale).toBe("en-GB"); expect(options.adaptive_pricing).toEqual({ enabled: false }) })
 it("blocks checkout when Stripe is not configured", async () => { vi.stubEnv("STRIPE_SECRET_KEY", ""); const res = await checkout(new Request("http://localhost/api/checkout/shop", { method: "POST", body: JSON.stringify(body) })); expect(res.status).toBe(503); expect(mocks.create).not.toHaveBeenCalled() })
 it("creates an idempotent hosted session", async () => { mocks.create.mockResolvedValue({ url: "https://checkout.stripe.com/test" }); const res = await checkout(new Request("http://localhost/api/checkout/shop", { method: "POST", body: JSON.stringify(body) })); expect(res.status).toBe(200); expect(mocks.create.mock.calls[0][1]).toEqual({ idempotencyKey: `shop-${body.requestId}` }) })
})
describe("physical order recording", () => {
 it("rejects unpaid or mismatched amounts and non-UK addresses", () => { const s = paidSession(); expect(validPaidShopSession(s)).toBe(true); expect(validPaidShopSession({ ...s, payment_status: "unpaid" })).toBe(false); expect(validPaidShopSession({ ...s, amount_total: 1 })).toBe(false); expect(validPaidShopSession({ ...s, collected_information: null })).toBe(false) })
 it("records retry-safe verification without overwriting manual fulfilment status", async () => { await recordPhysicalOrder(paidSession()); await recordPhysicalOrder(paidSession()); expect(mocks.update).toHaveBeenCalledTimes(2); expect(mocks.update).toHaveBeenLastCalledWith("pi_123", { metadata: { paymentVerified: "true", checkoutSession: "cs_test_123" } }, { idempotencyKey: "shop-paid-cs_test_123" }) })
 it("does not send digital email for physical orders", async () => { mocks.constructEvent.mockReturnValue({ type: "checkout.session.completed", data: { object: paidSession() } }); const res = await webhook(new Request("http://localhost/api/webhooks/stripe", { method: "POST", headers: { "stripe-signature": "test" }, body: "{}" })); expect(res.status).toBe(200); expect(mocks.update).toHaveBeenCalled(); expect(sendPurchaseDownloadEmail).not.toHaveBeenCalled() })
 it("returns retryable failure when recording fails", async () => { mocks.update.mockRejectedValueOnce(new Error("temporary")); mocks.constructEvent.mockReturnValue({ type: "checkout.session.completed", data: { object: paidSession() } }); expect((await webhook(new Request("http://localhost/api/webhooks/stripe", { method: "POST", headers: { "stripe-signature": "test" }, body: "{}" }))).status).toBe(500) })
 it("rejects a missing webhook signature", async () => { expect((await webhook(new Request("http://localhost/api/webhooks/stripe", { method: "POST", body: "{}" }))).status).toBe(400); expect(mocks.update).not.toHaveBeenCalled() })
})
