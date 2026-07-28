import CheckoutCancelRecovery from "@/components/CheckoutCancelRecovery"
import { logCheckoutLifecycle } from "@/lib/checkout-logging"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"

export const dynamic = "force-dynamic"

type CheckoutCancelPageProps = {
  searchParams: {
    product_id?: string
    client_reference_id?: string
  }
}

export default function CheckoutCancelPage({
  searchParams,
}: CheckoutCancelPageProps) {
  const product = searchParams.product_id
    ? getDigitalProduct(searchParams.product_id)
    : null

  logCheckoutLifecycle("checkout_cancel_return", {
    sessionId: null,
    eventId: null,
    productId: product?.id ?? searchParams.product_id ?? null,
    productSlug: product?.slug ?? null,
    amountTotal: product?.unitAmount ?? null,
    currency: product?.currency ?? null,
    paymentStatus: "cancel_return",
    created: null,
    expiresAt: null,
    clientReferenceId: searchParams.client_reference_id ?? null,
  })

  if (!product) {
    return (
      <div className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-lg border border-zinc-800 bg-[#181818] p-6 text-center sm:p-8">
          <h1 className="text-2xl font-bold text-white">
            Checkout wasn’t completed
          </h1>
          <p className="mt-3 text-zinc-300">
            Return to the downloads page to pick a planner, toolkit or voucher pack.
          </p>
          <a
            href="/digital-downloads"
            className="btn-rage mt-6 inline-flex min-h-[44px] items-center justify-center"
          >
            Browse digital guides
          </a>
        </div>
      </div>
    )
  }

  return (
    <CheckoutCancelRecovery
      productId={product.id}
      productName={product.name}
      productSlug={product.slug}
      priceLabel={product.priceLabel}
      analyticsProduct={getDigitalProductAnalytics(product)}
    />
  )
}
