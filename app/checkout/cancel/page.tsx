import { redirect } from "next/navigation"
import { logCheckoutLifecycle } from "@/lib/checkout-logging"
import { getDigitalProduct } from "@/lib/digital-products"

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

  redirect(product ? `/digital-downloads/${product.slug}` : "/digital-downloads")
}
