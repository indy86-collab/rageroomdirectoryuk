"use client"

import { useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import {
  type AnalyticsProduct,
  trackBeginCheckout,
  trackCheckoutResumeClick,
} from "@/lib/analytics"
import { readDigitalCheckoutEmail } from "@/lib/digital-checkout-email"

type DigitalCheckoutButtonProps = {
  productId: string
  analyticsProduct: AnalyticsProduct
  children: React.ReactNode
  className?: string
  /** When true, fires checkout_resume_click instead of begin_checkout. */
  resumeFromCancel?: boolean
  /** Prefill Stripe Checkout email when known (cancel resume / lead magnet). */
  customerEmail?: string
  /** Hide the non-booking disclaimer (rare; default shows it). */
  hideDisclaimer?: boolean
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
  hideDisclaimer = false,
}: DigitalCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    setIsLoading(true)
    setError(null)

    try {
      if (resumeFromCancel) {
        trackCheckoutResumeClick(analyticsProduct)
      } else {
        trackBeginCheckout(analyticsProduct)
      }

      const trimmedEmail =
        customerEmail?.trim() || readDigitalCheckoutEmail() || ""
      const response = await fetch("/api/checkout/digital-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          ...(trimmedEmail && isValidEmail(trimmedEmail)
            ? { customerEmail: trimmedEmail }
            : {}),
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
          Planning/template download only — does not include a venue booking.
        </p>
      )}
      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  )
}
