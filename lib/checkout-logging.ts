import "server-only"
import Stripe from "stripe"
import { getDigitalProduct } from "@/lib/digital-products"

export type CheckoutLifecycleEvent =
  | "checkout_session_created"
  | "checkout_session_completed"
  | "checkout_session_expired"
  | "checkout_session_async_payment_failed"
  | "checkout_cancel_return"

type CheckoutLogFields = {
  sessionId?: string | null
  eventId?: string | null
  productId?: string | null
  productSlug?: string | null
  amountTotal?: number | null
  currency?: string | null
  paymentStatus?: string | null
  created?: number | null
  expiresAt?: number | null
  clientReferenceId?: string | null
}

function cleanLogFields(fields: CheckoutLogFields) {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined)
  )
}

export function logCheckoutLifecycle(
  eventName: CheckoutLifecycleEvent,
  fields: CheckoutLogFields
) {
  const payload = {
    event: eventName,
    ...cleanLogFields(fields),
  }

  if (
    eventName === "checkout_session_expired" ||
    eventName === "checkout_session_async_payment_failed" ||
    eventName === "checkout_cancel_return"
  ) {
    console.warn(payload)
    return
  }

  console.info(payload)
}

export function checkoutSessionLogFields(
  session: Stripe.Checkout.Session,
  eventId?: string
): CheckoutLogFields {
  const productId = session.metadata?.productId ?? null
  const product = productId ? getDigitalProduct(productId) : null

  return {
    sessionId: session.id,
    eventId,
    productId,
    productSlug: product?.slug ?? session.metadata?.productSlug ?? null,
    amountTotal: session.amount_total,
    currency: session.currency,
    paymentStatus: session.payment_status,
    created: session.created,
    expiresAt: session.expires_at,
    clientReferenceId:
      session.client_reference_id ?? session.metadata?.clientReferenceId ?? null,
  }
}
