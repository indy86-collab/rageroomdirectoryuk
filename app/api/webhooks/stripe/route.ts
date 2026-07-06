import { NextResponse } from "next/server"
import Stripe from "stripe"
import {
  checkoutSessionLogFields,
  logCheckoutLifecycle,
  type CheckoutLifecycleEvent,
} from "@/lib/checkout-logging"
import { getStripe } from "@/lib/stripe"

export const runtime = "nodejs"

const checkoutSessionEvents: Partial<Record<string, CheckoutLifecycleEvent>> = {
  "checkout.session.completed": "checkout_session_completed",
  "checkout.session.expired": "checkout_session_expired",
  "checkout.session.async_payment_failed":
    "checkout_session_async_payment_failed",
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
  }

  return NextResponse.json({ received: true })
}
