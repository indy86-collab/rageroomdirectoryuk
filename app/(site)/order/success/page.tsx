import Link from "next/link"
import { CheckCircle, TriangleAlert } from "lucide-react"
import PurchaseTracker from "@/components/PurchaseTracker"
import TrackedDownloadLink from "@/components/TrackedDownloadLink"
import { CORPORATE_BOOKING_SYSTEM_PRODUCT_ID } from "@/lib/corporate-booking-system/types"
import { createDownloadToken } from "@/lib/download-token"
import {
  type DigitalProduct,
  getDigitalProduct,
  getDigitalProductAnalytics,
  getFulfilmentProducts,
  productHasFulfilment,
} from "@/lib/digital-products"
import { getStripe } from "@/lib/stripe"

export const dynamic = "force-dynamic"

type OrderSuccessPageProps = {
  searchParams: { session_id?: string }
}

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const sessionId = searchParams.session_id
  let purchasedProduct: DigitalProduct | null = null
  let fulfilmentProducts: DigitalProduct[] = []
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
        purchasedProduct = product
        fulfilmentProducts = getFulfilmentProducts(product)
      }
    } catch (error) {
      console.error("Order success fulfilment error", error)
      errorMessage = "We could not confirm this order."
    }
  } else {
    errorMessage = "Missing checkout session."
  }

  if (!purchasedProduct || !productHasFulfilment(purchasedProduct)) {
    return (
      <div className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-lg border border-zinc-800 bg-[#181818] p-6 text-center sm:p-8">
          <TriangleAlert className="mx-auto h-10 w-10 text-rage-500" />
          <h1 className="mt-4 text-2xl font-bold text-white">
            {errorMessage}
          </h1>
          <p className="mt-3 text-zinc-300">
            If you have just paid, wait a moment and refresh this page. Check your
            email for a download link, or return to the downloads page and try again.
          </p>
          <Link
            href="/digital-downloads"
            className="btn-rage mt-6 inline-flex min-h-[44px] items-center justify-center"
          >
            Back to downloads
          </Link>
        </div>
      </div>
    )
  }

  const isGiftVoucher =
    purchasedProduct.id === "rage-room-gift-voucher-template-pack"
  const isBundle = purchasedProduct.id === "party-gift-bundle"
  const isCorporateBuilder =
    purchasedProduct.id === "corporate-team-building-toolkit"
  const isBookingSystem =
    purchasedProduct.id === CORPORATE_BOOKING_SYSTEM_PRODUCT_ID
  const productHref = `/digital-downloads/${purchasedProduct.slug}`
  const analyticsProduct = getDigitalProductAnalytics(purchasedProduct)
  const builderHref = `/corporate-event-builder?session_id=${encodeURIComponent(sessionId!)}`
  const bookingSystemHref = `/venue-owner/corporate-booking-system?session_id=${encodeURIComponent(sessionId!)}`
  const headline = isBookingSystem
    ? "Your Corporate Booking System is ready."
    : isCorporateBuilder
      ? "Your Corporate Event Builder is ready."
      : `Your ${purchasedProduct.name} is ready.`

  return (
    <div className="px-4 py-16 sm:px-6">
      <PurchaseTracker
        sessionId={sessionId!}
        product={analyticsProduct}
        trackCorporateBuilderSuccess={isCorporateBuilder}
        trackCorporateBookingSystemSuccess={isBookingSystem}
      />
      <div className="mx-auto max-w-2xl rounded-lg border border-rage-500/30 bg-[#181818] p-6 text-center sm:p-8">
        <CheckCircle className="mx-auto h-12 w-12 text-rage-500" />
        <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          {headline}
        </h1>
        {isBookingSystem ? (
          <p className="mt-3 text-zinc-300">
            Open your venue workspace to set up packages, create quotes and
            manage corporate leads. We’ve also emailed your access link.
          </p>
        ) : isCorporateBuilder ? (
          <p className="mt-3 text-zinc-300">
            Open the interactive Event Builder to enter your team details, build
            the budget, shortlist venues and generate approval and invite
            messages. We’ve also emailed access links to the address you used at
            checkout.
          </p>
        ) : (
          <p className="mt-3 text-zinc-300">
            Your download link{fulfilmentProducts.length > 1 ? "s expire" : " expires"}{" "}
            in 72 hours. We’ve also emailed the link to the address you used at
            checkout. Save a copy after downloading.
          </p>
        )}
        <div className="mt-6 space-y-3">
          {isBookingSystem && (
            <Link
              href={bookingSystemHref}
              className="btn-rage inline-flex min-h-[48px] w-full items-center justify-center"
            >
              Open Corporate Booking System
            </Link>
          )}
          {isCorporateBuilder && (
            <Link
              href={builderHref}
              className="btn-rage inline-flex min-h-[48px] w-full items-center justify-center"
            >
              Open Event Builder
            </Link>
          )}
          {fulfilmentProducts.map((fileProduct) => {
            const token = createDownloadToken({
              sessionId: sessionId!,
              productId: fileProduct.id,
            })
            const downloadLabel = isCorporateBuilder
              ? "Download legacy toolkit PDF (optional)"
              : fileProduct.contentType === "application/zip"
                ? `Download ${fileProduct.shortName || fileProduct.name} (ZIP)`
                : `Download ${fileProduct.shortName || fileProduct.name} (PDF)`

            return (
              <TrackedDownloadLink
                key={fileProduct.id}
                href={`/download/${token}`}
                label={downloadLabel}
                fileName={fileProduct.downloadFilename || "download"}
                product={getDigitalProductAnalytics(fileProduct)}
              />
            )
          })}
        </div>
        <div className="mt-5">
          <Link href={productHref} className="text-sm font-semibold text-rage-500 hover:text-rage-400">
            Back to product page
          </Link>
        </div>
      </div>

      {(purchasedProduct.id === "rage-room-party-planner" || isBundle) && (
        <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-zinc-800 bg-[#181818] p-5">
          <h2 className="text-lg font-bold text-white">Planning this for work?</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Use the Corporate Rage Room Event Builder to build budget, compare
            venues, prepare approval and generate team invitations.
          </p>
          <Link
            href="/digital-downloads/corporate-rage-room-team-building-toolkit"
            className="mt-4 inline-flex text-sm font-semibold text-rage-500 hover:text-rage-400"
          >
            View Corporate Event Builder
          </Link>
        </div>
      )}

      {purchasedProduct.id === "rage-room-first-visit-prep" && (
        <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-zinc-800 bg-[#181818] p-5">
          <h2 className="text-lg font-bold text-white">Organising a group night too?</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Use the Rage Room Party Planner Pack for budgets, RSVPs, invites and the full
            night-out plan.
          </p>
          <Link
            href="/digital-downloads/rage-room-party-planner-pack"
            className="mt-4 inline-flex text-sm font-semibold text-rage-500 hover:text-rage-400"
          >
            View party planner pack
          </Link>
        </div>
      )}

      {isGiftVoucher && (
        <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-zinc-800 bg-[#181818] p-5">
          <h2 className="text-lg font-bold text-white">Planning the actual event too?</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Use the Rage Room Party Planner Pack to compare venues, track budget,
            send invites and plan the full night — or grab the bundle and save £3.
          </p>
          <Link
            href="/digital-downloads/party-planner-gift-voucher-bundle"
            className="mt-4 inline-flex text-sm font-semibold text-rage-500 hover:text-rage-400"
          >
            View party + gift bundle
          </Link>
        </div>
      )}
    </div>
  )
}
