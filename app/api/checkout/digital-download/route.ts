import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import {
  checkoutSessionLogFields,
  logCheckoutLifecycle,
} from "@/lib/checkout-logging"
import { isCorporateBookingDurableStoreReady } from "@/lib/corporate-booking-system/store"
import { CORPORATE_BOOKING_SYSTEM_PRODUCT_ID } from "@/lib/corporate-booking-system/types"
import { digitalCheckoutSessionOptions } from "@/lib/digital-checkout-session"
import { getDigitalProduct } from "@/lib/digital-products"
import { absoluteUrl } from "@/lib/site-url"
import { getStripe } from "@/lib/stripe"
import { getOrCreateStripePriceForProduct } from "@/lib/stripe-products"

export const runtime = "nodejs"

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      productId?: string
      customerEmail?: string
      returnTo?: string
    }
    const product = body.productId ? getDigitalProduct(body.productId) : null

    if (!product) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 })
    }

    if (product.isFree) {
      return NextResponse.json(
        {
          error:
            "This download is free — use the email form on the product page instead of checkout.",
        },
        { status: 400 }
      )
    }

    if (
      product.id === CORPORATE_BOOKING_SYSTEM_PRODUCT_ID &&
      !isCorporateBookingDurableStoreReady()
    ) {
      return NextResponse.json(
        {
          error:
            "The Corporate Booking System is temporarily unavailable. Venue-owner workspaces need durable storage before checkout can start.",
        },
        { status: 503 }
      )
    }

    const customerEmail =
      typeof body.customerEmail === "string" &&
      isValidEmail(body.customerEmail.trim())
        ? body.customerEmail.trim().toLowerCase()
        : undefined

    const stripe = getStripe()
    const priceId = await getOrCreateStripePriceForProduct(product.id)
    const clientReferenceId = randomUUID()
    const session = await stripe.checkout.sessions.create({
      ...digitalCheckoutSessionOptions(product),
      client_reference_id: clientReferenceId,
      line_items: [{ price: priceId, quantity: 1 }],
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      success_url:
        body.returnTo === "builder" &&
        product.id === "corporate-team-building-toolkit"
          ? `${absoluteUrl("/corporate-event-builder")}?session_id={CHECKOUT_SESSION_ID}`
          : `${absoluteUrl("/order/success")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${absoluteUrl("/checkout/cancel")}?product_id=${encodeURIComponent(product.id)}&client_reference_id=${encodeURIComponent(clientReferenceId)}`,
      metadata: {
        clientReferenceId,
        productId: product.id,
        productSlug: product.slug,
        ...(product.bundleProductIds?.length
          ? { bundleProductIds: product.bundleProductIds.join(",") }
          : {}),
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
