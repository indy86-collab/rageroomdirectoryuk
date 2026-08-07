/**
 * Limited-time digital guide sale (list prices already include the 20% cut).
 * Stripe Prices use the reduced unit amounts — no coupon stacking needed.
 */
export const DIGITAL_SALE = {
  active: true,
  percentOff: 20,
  /** Inclusive UK end — after this, hide sale chrome (prices stay until changed). */
  endsAtIso: "2026-08-31T23:59:59+01:00",
  eyebrow: "Limited-time demand drop",
  headline: "Prices reduced 20% while demand is high",
  shortHeadline: "20% off — limited time",
  copy:
    "We've temporarily cut every digital guide by 20% so more planners can grab packs while interest is peaking. This isn't a voucher code — the lower price is already applied at checkout. Offer ends 31 August, then prices return to normal.",
  checkoutNote:
    "Limited-time 20% demand drop already applied — not a venue booking.",
  badge: "20% off",
} as const

export function isDigitalSaleActive(now = new Date()) {
  if (!DIGITAL_SALE.active) return false
  return now.getTime() <= new Date(DIGITAL_SALE.endsAtIso).getTime()
}

export function digitalSaleEndLabel() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(new Date(DIGITAL_SALE.endsAtIso))
}
