"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import {
  type AnalyticsProduct,
  trackBeginCheckout,
  trackCheckoutResumeClick,
  trackCorporateBookingSystemCheckoutClick,
  trackCorporateBuilderCheckoutClick,
} from "@/lib/analytics"
import { CORPORATE_BOOKING_SYSTEM_PRODUCT_ID } from "@/lib/corporate-booking-system/types"
import { CORPORATE_EVENT_BUILDER_PRODUCT_ID } from "@/lib/corporate-event-builder/types"
import {
  readDigitalCheckoutEmail,
  storeDigitalCheckoutEmail,
} from "@/lib/digital-checkout-email"

type DigitalCheckoutButtonProps = {
  productId: string
  analyticsProduct: AnalyticsProduct
  children: React.ReactNode
  className?: string
  /** When true, fires checkout_resume_click instead of begin_checkout. */
  resumeFromCancel?: boolean
  /** Prefill Stripe Checkout email when known (cancel resume / lead magnet). */
  customerEmail?: string
  /** Show an optional email field so Stripe is shorter and abandoned emails can send. */
  collectEmail?: boolean
  /** Hide the non-booking disclaimer (rare; default shows it). */
  hideDisclaimer?: boolean
  /** Override analytics source (e.g. builder_plan). */
  checkoutSource?: string
  /** After payment, return to the Event Builder instead of /order/success. */
  returnTo?: "builder"
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function DigitalCheckoutButton({
  productId,
  analyticsProduct,
  children,
  className,
  resumeFromCancel = false,
  customerEmail,
  collectEmail = false,
  hideDisclaimer = false,
  checkoutSource,
  returnTo,
}: DigitalCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState(customerEmail ?? "")

  useEffect(() => {
    if (!collectEmail) return
    if (customerEmail?.trim()) {
      setEmail(customerEmail)
      return
    }
    const stored = readDigitalCheckoutEmail()
    if (stored) setEmail(stored)
  }, [collectEmail, customerEmail])

  async function handleCheckout() {
    setIsLoading(true)
    setError(null)

    try {
      if (resumeFromCancel) {
        trackCheckoutResumeClick(analyticsProduct)
      } else {
        trackBeginCheckout(analyticsProduct)
      }
      if (productId === CORPORATE_EVENT_BUILDER_PRODUCT_ID) {
        trackCorporateBuilderCheckoutClick(
          checkoutSource ??
            (resumeFromCancel ? "checkout_cancel" : "product_page")
        )
      }
      if (productId === CORPORATE_BOOKING_SYSTEM_PRODUCT_ID) {
        trackCorporateBookingSystemCheckoutClick(
          resumeFromCancel ? "checkout_cancel" : "product_page"
        )
      }

      const trimmedEmail =
        email.trim() || customerEmail?.trim() || readDigitalCheckoutEmail() || ""
      if (trimmedEmail && isValidEmail(trimmedEmail)) {
        storeDigitalCheckoutEmail(trimmedEmail)
      }
      const response = await fetch("/api/checkout/digital-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          ...(trimmedEmail && isValidEmail(trimmedEmail)
            ? { customerEmail: trimmedEmail }
            : {}),
          ...(returnTo === "builder" ? { returnTo: "builder" } : {}),
        }),
      })
      const data = (await response.json()) as { url?: string; error?: string }

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout")
      }

      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {collectEmail && (
        <label className="block max-w-md text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Email for your download
          </span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              const next = event.target.value
              setEmail(next)
              if (isValidEmail(next.trim())) {
                storeDigitalCheckoutEmail(next)
              }
            }}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-md border border-zinc-700 bg-[#151515] px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-rage-500 focus:outline-none"
          />
          <span className="mt-1.5 block text-xs leading-relaxed text-zinc-500">
            Optional — skips typing it on Stripe, and lets us email the file if you close the tab.
          </span>
        </label>
      )}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className={
          className ??
          "btn-rage inline-flex min-h-[48px] items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-70"
        }
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
        {children}
      </button>
      {!hideDisclaimer && (
        <p className="text-xs leading-relaxed text-zinc-400">
          {productId === CORPORATE_BOOKING_SYSTEM_PRODUCT_ID
            ? "Next: Stripe checkout. Venue-owner workspace after payment — not a consumer planner or a booking."
            : productId === CORPORATE_EVENT_BUILDER_PRODUCT_ID
              ? "Next: Stripe checkout for your event plan PDF and toolkit. The builder itself is free — not a venue booking."
              : "Next: Stripe checkout to pay for this download. Instant file — not a venue booking."}
        </p>
      )}
      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  )
}
