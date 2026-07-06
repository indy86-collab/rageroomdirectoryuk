import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import {
  checkoutSessionLogFields,
  logCheckoutLifecycle,
} from "@/lib/checkout-logging"
import { getDigitalProduct } from "@/lib/digital-products"
import { absoluteUrl } from "@/lib/site-url"
import { getStripe } from "@/lib/stripe"
import { getOrCreateStripePriceForProduct } from "@/lib/stripe-products"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { productId?: string }
    const product = body.productId ? getDigitalProduct(body.productId) : null

    if (!product) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 })
    }

    const stripe = getStripe()
    const priceId = await getOrCreateStripePriceForProduct(product.id)
    const clientReferenceId = randomUUID()
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: clientReferenceId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${absoluteUrl("/order/success")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${absoluteUrl("/checkout/cancel")}?product_id=${encodeURIComponent(product.id)}&client_reference_id=${encodeURIComponent(clientReferenceId)}`,
      metadata: {
        clientReferenceId,
        productId: product.id,
        productSlug: product.slug,
      },
    })

    logCheckoutLifecycle(
      "checkout_session_created",
      checkoutSessionLogFields(session)
    )

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Digital checkout error", error)
    return NextResponse.json(
      { error: "Unable to start checkout" },
      { status: 500 }
    )
  }
}
