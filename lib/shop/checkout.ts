import "server-only"
import type Stripe from "stripe"
import { parseShopOrder, SHIPPING_PER_ITEM } from "./catalog"

export function shopCheckoutMode(): "preview" | "test" | "live" {
  const key = process.env.STRIPE_SECRET_KEY || ""
  if (key.startsWith("sk_test_")) return "test"
  if (key.startsWith("sk_live_")) return "live"
  return "preview"
}

export function shopSessionOptions(order: ReturnType<typeof parseShopOrder>, origin: string): Stripe.Checkout.SessionCreateParams {
  const { product, variant, quantity } = order
  const metadata = { orderType: "physical", productId: product.id, productName: product.name, variant, quantity: String(quantity), unitAmount: String(product.price), shippingAmount: String(SHIPPING_PER_ITEM * quantity), catalogueVersion: "smash-v3-prices-2026-09-18", fulfilmentStatus: "awaiting_fulfilment" }
  return {
    mode: "payment",
    locale: "en-GB",
    adaptive_pricing: { enabled: false },
    payment_method_types: ["card"],
    billing_address_collection: "required",
    shipping_address_collection: { allowed_countries: ["GB"] },
    line_items: [{ price_data: { currency: "gbp", unit_amount: product.price, product_data: { name: `${product.name} — ${product.kind}`, description: variant } }, quantity }],
    shipping_options: [{ shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: SHIPPING_PER_ITEM * quantity, currency: "gbp" }, display_name: "UK made-to-order delivery (7–12 working days estimated)" } }],
    metadata, payment_intent_data: { metadata, description: `Shop: ${product.name} / ${variant} × ${quantity}` },
    success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop?cancelled=1#${product.id}`,
    custom_text: { submit: { message: "Physical merchandise. UK delivery estimated at 7–12 working days from payment. Items may arrive separately. Order help: ukrageroom@gmail.com." } },
  }
}
