"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Download, Flame, ShieldCheck } from "lucide-react"
import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import {
  type AnalyticsProduct,
  trackCheckoutCancelView,
} from "@/lib/analytics"
import {
  DIGITAL_SALE,
  digitalSaleEndLabel,
  isDigitalSaleActive,
} from "@/lib/digital-promo"

type CheckoutCancelRecoveryProps = {
  productId: string
  productName: string
  productSlug: string
  priceLabel: string
  compareAtLabel?: string
  analyticsProduct: AnalyticsProduct
}

export default function CheckoutCancelRecovery({
  productId,
  productName,
  productSlug,
  priceLabel,
  compareAtLabel,
  analyticsProduct,
}: CheckoutCancelRecoveryProps) {
  const [email, setEmail] = useState("")
  const saleOn = isDigitalSaleActive()

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
          wasn’t completed. This is a planning/template download only — not a venue
          booking. Finish payment to get instant access.
        </p>

        {saleOn && (
          <div className="mt-5 inline-flex items-start gap-2 rounded-md border border-rage-500/40 bg-rage-500/10 px-4 py-3 text-left text-sm text-zinc-200">
            <Flame className="mt-0.5 h-4 w-4 flex-shrink-0 text-rage-500" />
            <p>
              <span className="font-bold text-white">{DIGITAL_SALE.shortHeadline}</span>
              {" — "}
              {compareAtLabel ? (
                <>
                  now <span className="font-semibold text-white">{priceLabel}</span>{" "}
                  <span className="text-zinc-400 line-through">{compareAtLabel}</span>
                </>
              ) : (
                <>sale price already at checkout</>
              )}
              . Ends {digitalSaleEndLabel()}. No code needed.
            </p>
          </div>
        )}

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
            Not a venue booking
          </span>
        </div>

        <label className="mx-auto mt-8 block max-w-md text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Email for checkout (optional)
          </span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-md border border-zinc-700 bg-[#151515] px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-rage-500 focus:outline-none"
          />
        </label>

        <div className="mt-5 flex justify-center">
          <DigitalCheckoutButton
            productId={productId}
            analyticsProduct={analyticsProduct}
            resumeFromCancel
            customerEmail={email}
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
