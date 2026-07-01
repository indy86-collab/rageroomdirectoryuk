import Link from "next/link"
import { CheckCircle, Download, TriangleAlert } from "lucide-react"
import { createDownloadToken } from "@/lib/download-token"
import { getDigitalProduct } from "@/lib/digital-products"
import { getStripe } from "@/lib/stripe"

export const dynamic = "force-dynamic"

type OrderSuccessPageProps = {
  searchParams: { session_id?: string }
}

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const sessionId = searchParams.session_id
  let downloadToken: string | null = null
  let errorMessage = "Payment has not been confirmed yet."

  if (sessionId) {
    try {
      const stripe = getStripe()
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      const productId = session.metadata?.productId
      const product = productId ? getDigitalProduct(productId) : null

      if (
        product &&
        session.payment_status === "paid" &&
        session.amount_total === product.unitAmount &&
        session.currency === product.currency
      ) {
        downloadToken = createDownloadToken({
          sessionId: session.id,
          productId: product.id,
        })
      }
    } catch (error) {
      console.error("Order success fulfilment error", error)
      errorMessage = "We could not confirm this order."
    }
  } else {
    errorMessage = "Missing checkout session."
  }

  if (!downloadToken) {
    return (
      <div className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-lg border border-zinc-800 bg-[#181818] p-6 text-center sm:p-8">
          <TriangleAlert className="mx-auto h-10 w-10 text-rage-500" />
          <h1 className="mt-4 text-2xl font-bold text-white">
            {errorMessage}
          </h1>
          <p className="mt-3 text-zinc-300">
            If you have just paid, wait a moment and refresh this page. Otherwise,
            return to the planner pack and try again.
          </p>
          <Link
            href="/digital-downloads/rage-room-party-planner-pack"
            className="btn-rage mt-6 inline-flex min-h-[44px] items-center justify-center"
          >
            Back to planner pack
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-lg border border-rage-500/30 bg-[#181818] p-6 text-center sm:p-8">
        <CheckCircle className="mx-auto h-12 w-12 text-rage-500" />
        <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          Your Rage Room Party Planner Pack is ready.
        </h1>
        <p className="mt-3 text-zinc-300">
          Your download link expires in 72 hours.
        </p>
        <Link
          href={`/download/${downloadToken}`}
          className="btn-rage mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 text-sm uppercase tracking-wider"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Link>
      </div>
    </div>
  )
}
