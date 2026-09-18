import "server-only"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe"

export function validPaidShopSession(session: Stripe.Checkout.Session) {
  const m = session.metadata
  if (m?.orderType !== "physical" || session.payment_status !== "paid" || session.currency !== "gbp") return false
  const unit = Number(m.unitAmount), quantity = Number(m.quantity), shipping = Number(m.shippingAmount)
  return Number.isInteger(unit) && unit > 0 && Number.isInteger(quantity) && quantity > 0 && quantity <= 10 &&
    Number.isInteger(shipping) && shipping >= 0 && session.amount_subtotal === unit * quantity &&
    session.amount_total === unit * quantity + shipping && Boolean(session.collected_information?.shipping_details?.address?.country === "GB")
}
export async function recordPhysicalOrder(session: Stripe.Checkout.Session) {
  if (!validPaidShopSession(session)) throw new Error("Physical order payment or shipping validation failed")
  const stripe = getStripe()
  // PaymentIntent metadata is the manual fulfilment record in Stripe Dashboard.
  // Never regress an order an operator has already submitted or dispatched.
  const id = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id
  if (!id) throw new Error("Missing physical payment record")
  await stripe.paymentIntents.update(id, { metadata: { paymentVerified: "true", checkoutSession: session.id } }, { idempotencyKey: `shop-paid-${session.id}` })
}
