import { NextResponse } from "next/server"
import {
  checkoutSessionLogFields,
  logCheckoutLifecycle,
} from "@/lib/checkout-logging"
import { getStripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/site-url"
import { parseShopOrder } from "@/lib/shop/catalog"
import { shopCheckoutMode, shopSessionOptions } from "@/lib/shop/checkout"
export const runtime = "nodejs"
export async function POST(request: Request) {
  if (shopCheckoutMode() === "preview") {
    return NextResponse.json({ error: "Checkout is unavailable because Stripe is not configured." }, { status: 503 })
  }
  let order
  try { order = parseShopOrder(await request.json()) }
  catch { return NextResponse.json({ error: "Choose a valid product, variant and quantity (1–10)." }, { status: 400 }) }
  try {
    const origin = shopCheckoutMode() === "test" ? new URL(request.url).origin : new URL(absoluteUrl()).origin
    const session = await getStripe().checkout.sessions.create(shopSessionOptions(order, origin), { idempotencyKey: `shop-${order.requestId}` })
    logCheckoutLifecycle("checkout_session_created", checkoutSessionLogFields(session))
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Shop checkout error", error)
    return NextResponse.json({ error: "Checkout could not start. Please try again." }, { status: 502 })
  }
}
