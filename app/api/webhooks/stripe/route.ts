import { NextResponse } from "next/server"
import Stripe from "stripe"
import {
  checkoutSessionLogFields,
  logCheckoutLifecycle,
  type CheckoutLifecycleEvent,
} from "@/lib/checkout-logging"
import {
  getCheckoutSessionEmail,
  sendAbandonedCheckoutEmail,
  sendPurchaseDownloadEmail,
} from "@/lib/digital-emails"
import {
  getDigitalProduct,
  sessionAmountMatchesProduct,
} from "@/lib/digital-products"
import { getStripe } from "@/lib/stripe"

export const runtime = "nodejs"

const checkoutSessionEvents: Partial<Record<string, CheckoutLifecycleEvent>> = {
  "checkout.session.completed": "checkout_session_completed",
  "checkout.session.expired": "checkout_session_expired",
  "checkout.session.async_payment_failed":
    "checkout_session_async_payment_failed",
}

async function handlePaidSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    return
  }

  const productId = session.metadata?.productId
  const product = productId ? getDigitalProduct(productId) : null
  const email = getCheckoutSessionEmail(session)

  if (
    !product ||
    !sessionAmountMatchesProduct(
      product,
      session.amount_subtotal,
      session.currency
    )
  ) {
    console.warn("Paid session product mismatch — skipping email", {
      sessionId: session.id,
      productId,
    })
    return
  }

  if (!email) {
    console.warn("Paid session missing customer email", session.id)
    return
  }

  const result = await sendPurchaseDownloadEmail({
    sessionId: session.id,
    purchasedProduct: product,
    toEmail: email,
  })

  console.info("Purchase download email", {
    sessionId: session.id,
    productId: product.id,
    ...result,
  })
}

async function handleExpiredSession(session: Stripe.Checkout.Session) {
  const productId = session.metadata?.productId
  const product = productId ? getDigitalProduct(productId) : null
  const email = getCheckoutSessionEmail(session)

  if (!product || !email || product.isFree) {
    return
  }

  const result = await sendAbandonedCheckoutEmail({
    purchasedProduct: product,
    toEmail: email,
  })

  console.info("Abandoned checkout email", {
    sessionId: session.id,
    productId: product.id,
    ...result,
  })
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured")
    return NextResponse.json(
      { error: "Stripe webhook secret is not configured" },
      { status: 500 }
    )
  }

  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    console.warn("Stripe webhook missing signature")
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    const rawBody = await request.text()
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    )
  } catch (error) {
    console.warn(
      "Stripe webhook signature verification failed",
      error instanceof Error ? error.message : "Unknown verification error"
    )
    return NextResponse.json(
      { error: "Invalid Stripe signature" },
      { status: 400 }
    )
  }

  const lifecycleEvent = checkoutSessionEvents[event.type]

  if (lifecycleEvent) {
    const session = event.data.object as Stripe.Checkout.Session
    logCheckoutLifecycle(
      lifecycleEvent,
      checkoutSessionLogFields(session, event.id)
    )

    try {
      if (event.type === "checkout.session.completed") {
        await handlePaidSession(session)
      }
      if (event.type === "checkout.session.expired") {
        await handleExpiredSession(session)
      }
    } catch (error) {
      console.error("Stripe webhook side-effect error", error)
    }
  }

  return NextResponse.json({ received: true })
}
