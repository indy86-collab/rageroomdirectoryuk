import type { DigitalProduct } from "@/lib/digital-products"

/** Stripe product names shown on the hosted Checkout line item. */
export function stripeCheckoutDisplayName(product: DigitalProduct) {
  if (product.bundleProductIds?.length) {
    return `${product.name} (instant downloads — not a venue booking)`
  }
  if (product.isInteractive) {
    return `${product.name} (instant access — not a venue booking)`
  }
  if (product.contentType === "application/zip") {
    return `${product.name} (ZIP templates — not a venue booking)`
  }
  return `${product.name} (PDF download — not a venue booking)`
}

/**
 * Cheap PDFs should not show Klarna / Amazon Pay / Revolut.
 * Those methods make a £4–£15 download look like a bigger booking.
 */
export function digitalCheckoutPaymentMethodTypes(product: DigitalProduct) {
  if (product.unitAmount < 5000) {
    return ["card", "link"] as const
  }
  return null
}

export function digitalCheckoutSessionOptions(product: DigitalProduct) {
  const paymentMethodTypes = digitalCheckoutPaymentMethodTypes(product)

  return {
    mode: "payment" as const,
    billing_address_collection: "auto" as const,
    phone_number_collection: { enabled: false },
    // Sale is already in the Stripe Price. A "Add promotion code" field
    // makes people hunt for a code they were told they don't need, then leave.
    locale: "en-GB" as const,
    submit_type: "pay" as const,
    adaptive_pricing: { enabled: false as const },
    ...(paymentMethodTypes
      ? { payment_method_types: [...paymentMethodTypes] }
      : {}),
    custom_text: {
      submit: {
        message: product.checkoutBlurb,
      },
    },
  }
}
