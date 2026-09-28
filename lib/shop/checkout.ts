import "server-only"
import type Stripe from "stripe"
import { parseShopOrder, SHIPPING_PER_ORDER, DELIVERY_MESSAGE } from "./catalog"

export function shopCheckoutMode(): "preview" | "test" | "live" {
  const key = process.env.STRIPE_SECRET_KEY || ""
  if (key.startsWith("sk_test_")) return "test"
  if (key.startsWith("sk_live_")) return "live"
  return "preview"
}

export function shopSessionOptions(order: ReturnType<typeof parseShopOrder>, origin: string): Stripe.Checkout.SessionCreateParams {
  const { items } = order
  const metadata: Record<string, string> = { orderType: "physical", basketVersion: "1", itemCount: String(items.length), shippingAmount: String(SHIPPING_PER_ORDER), catalogueVersion: "venue-neutral-v4-2026-09-28", fulfilmentStatus: "awaiting_fulfilment" }
  items.forEach(({ product, variant, quantity }, index) => {
    metadata[`item_${index}`] = JSON.stringify({ productId: product.id, productName: product.name, variant, quantity, unitAmount: product.price, design: product.artwork })
  })
  return {
    mode: "payment",
    locale: "en-GB",
    adaptive_pricing: { enabled: false },
    payment_method_types: ["card"],
    billing_address_collection: "required",
    shipping_address_collection: { allowed_countries: ["GB"] },
    line_items: items.map(({ product, variant, quantity }) => ({ price_data: { currency: "gbp", unit_amount: product.price, product_data: { name: `${product.name} — ${product.kind}`, description: variant, metadata: { productId: product.id, variant, design: product.artwork, quantity: String(quantity) } } }, quantity })),
    shipping_options: [{ shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: SHIPPING_PER_ORDER, currency: "gbp" }, display_name: "UK delivery per order" } }],
    metadata, payment_intent_data: { metadata, description: "Shop merchandise order" },
    success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop?cancelled=1#basket`,
    custom_text: { submit: { message: `${DELIVERY_MESSAGE} Order help: ukrageroom@gmail.com.` } },
  }
}
