import "server-only"
import { getDigitalProduct } from "@/lib/digital-products"
import { getStripe } from "@/lib/stripe"

export async function getOrCreateStripePriceForProduct(productId: string) {
  const product = getDigitalProduct(productId)

  if (!product) {
    throw new Error(`Unknown digital product: ${productId}`)
  }

  const stripe = getStripe()
  const existingPrices = await stripe.prices.list({
    lookup_keys: [product.stripeLookupKey],
    active: true,
    limit: 1,
  })

  if (existingPrices.data[0]) {
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
    },
    product_data: {
      name: product.name,
      metadata: {
        productId: product.id,
        digitalProduct: "true",
      },
    },
  })

  return price.id
}
