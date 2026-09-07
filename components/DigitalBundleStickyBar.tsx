"use client"

import { useEffect, useState } from "react"
import { Gift, X } from "lucide-react"
import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"
import { EDITORIAL_PRODUCT_PROMOS_ENABLED } from "@/lib/monetization"

const DISMISSED_KEY = "rage-room-bundle-bar-dismissed"

/** Mobile-only checkout prompt shown after a reader has engaged with a guide. */
export default function DigitalBundleStickyBar() {
  const [visible, setVisible] = useState(false)
  const bundle = getDigitalProduct("party-gift-bundle")

  useEffect(() => {
    if (!EDITORIAL_PRODUCT_PROMOS_ENABLED) return
    if (window.sessionStorage.getItem(DISMISSED_KEY) === "1") return

    const updateVisibility = () => {
      const threshold = Math.min(
        900,
        Math.max(480, document.documentElement.scrollHeight * 0.2)
      )
      setVisible(window.scrollY >= threshold)
    }

    updateVisibility()
    window.addEventListener("scroll", updateVisibility, { passive: true })
    return () => window.removeEventListener("scroll", updateVisibility)
  }, [])

  if (!EDITORIAL_PRODUCT_PROMOS_ENABLED || !bundle || !visible) return null

  const analyticsProduct = getDigitalProductAnalytics(bundle)

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rage-500/40 bg-dark-900/95 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_30px_rgba(0,0,0,0.45)] backdrop-blur md:hidden"
      aria-label="Party planner and gift voucher bundle"
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-rage-500/15">
          <Gift className="h-5 w-5 text-rage-400" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">Plan it + gift it</p>
          <p className="truncate text-xs text-zinc-400">PDF planner and voucher templates</p>
        </div>
        <DigitalCheckoutButton
          productId={bundle.id}
          analyticsProduct={analyticsProduct}
          hideDisclaimer
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-md bg-rage-500 px-3 text-xs font-bold uppercase tracking-wide text-white hover:bg-rage-600 disabled:opacity-70"
        >
          Buy {bundle.priceLabel}
        </DigitalCheckoutButton>
        <button
          type="button"
          aria-label="Dismiss bundle offer"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
          onClick={() => {
            window.sessionStorage.setItem(DISMISSED_KEY, "1")
            setVisible(false)
          }}
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </aside>
  )
}
