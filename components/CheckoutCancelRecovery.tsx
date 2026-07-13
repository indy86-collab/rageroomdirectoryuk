"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Download, ShieldCheck } from "lucide-react"
import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import {
  type AnalyticsProduct,
  trackCheckoutCancelView,
} from "@/lib/analytics"

type CheckoutCancelRecoveryProps = {
  productId: string
  productName: string
  productSlug: string
  priceLabel: string
  analyticsProduct: AnalyticsProduct
}

export default function CheckoutCancelRecovery({
  productId,
  productName,
  productSlug,
  priceLabel,
  analyticsProduct,
}: CheckoutCancelRecoveryProps) {
  useEffect(() => {
    trackCheckoutCancelView(analyticsProduct)
    // Fire once per cancelled product view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyticsProduct.item_id])

  return (
    <div className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-lg border border-rage-500/30 bg-[#181818] p-6 text-center sm:p-8">
        <h1 className="text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
          Your download isn’t unlocked yet
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-300">
          Checkout for <span className="font-semibold text-white">{productName}</span>{" "}
          wasn’t completed. Finish payment to get instant access.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-zinc-300">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-[#151515] px-3 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-rage-500" />
            Stripe checkout
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-[#151515] px-3 py-1.5">
            <Download className="h-3.5 w-3.5 text-rage-500" />
            Instant download
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-[#151515] px-3 py-1.5">
            No venue booking required
          </span>
        </div>

        <div className="mt-8 flex justify-center">
          <DigitalCheckoutButton
            productId={productId}
            analyticsProduct={analyticsProduct}
            resumeFromCancel
          >
            Complete purchase — {priceLabel}
          </DigitalCheckoutButton>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 text-sm sm:flex-row sm:justify-center">
          <Link
            href={`/digital-downloads/${productSlug}#whats-included`}
            className="font-semibold text-rage-500 hover:text-rage-400"
          >
            View what’s included
          </Link>
          <span className="hidden text-zinc-600 sm:inline">·</span>
          <Link
            href="/contact"
            className="font-semibold text-zinc-300 hover:text-white"
          >
            Questions? Contact us
          </Link>
        </div>
      </div>
    </div>
  )
}
