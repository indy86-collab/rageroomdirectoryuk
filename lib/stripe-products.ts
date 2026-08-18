import "server-only"
import { stripeCheckoutDisplayName } from "@/lib/digital-checkout-session"
import { getDigitalProduct } from "@/lib/digital-products"
import { getStripe } from "@/lib/stripe"

export async function getOrCreateStripePriceForProduct(productId: string) {
  const product = getDigitalProduct(productId)

  if (!product) {
    throw new Error(`Unknown digital product: ${productId}`)
  }

  if (product.isFree) {
    throw new Error(`Free digital product cannot create a Stripe price: ${productId}`)
  }

  const stripe = getStripe()
  const existingPrices = await stripe.prices.list({
    lookup_keys: [product.stripeLookupKey],
    active: true,
    limit: 1,
  })

  const displayName = stripeCheckoutDisplayName(product)

  if (existingPrices.data[0]) {
    const stripeProductId =
      typeof existingPrices.data[0].product === "string"
        ? existingPrices.data[0].product
        : existingPrices.data[0].product.id
    const stripeProduct = await stripe.products.retrieve(stripeProductId)
    if (stripeProduct.name !== displayName) {
      await stripe.products.update(stripeProductId, {
        name: displayName,
        description: product.checkoutBlurb,
      })
    }
    return existingPrices.data[0].id
  }

  // The stable lookup_key is the idempotency anchor for product sales.
  // Repeated checkouts find this active Price instead of creating duplicates.
  const price = await stripe.prices.create({
    currency: product.currency,
    unit_amount: product.unitAmount,
    lookup_key: product.stripeLookupKey,
    metadata: {
      productId: product.id,
      digitalProduct: "true",
      ...(product.bundleProductIds?.length
        ? { bundleProductIds: product.bundleProductIds.join(",") }
        : {}),
    },
    product_data: {
      name: displayName,
      metadata: {
        productId: product.id,
        digitalProduct: "true",
      },
    },
  })

  return price.id
}
