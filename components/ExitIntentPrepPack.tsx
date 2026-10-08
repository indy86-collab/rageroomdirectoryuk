"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import LeadMagnetForm from "@/components/LeadMagnetForm"
import { readConsentPreferences } from "@/lib/consent"
import { readDigitalCheckoutEmail } from "@/lib/digital-checkout-email"
import { trackEvent } from "@/lib/analytics"
import {
  EXIT_INTENT_MIN_DWELL_MS,
  EXIT_INTENT_MOBILE_SCROLL_DEPTH,
  EXIT_INTENT_STORAGE_KEY,
  isExitIntentPath,
  parseLastShown,
  shouldShowExitIntent,
} from "@/lib/exit-intent"

function readLastShown(): number | null {
  try {
    return parseLastShown(window.localStorage.getItem(EXIT_INTENT_STORAGE_KEY))
  } catch {
    return null
  }
}

/** One-off free prep pack offer on editorial pages, at most once per 14 days. */
export default function ExitIntentPrepPack() {
  const pathname = usePathname() || ""
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isExitIntentPath(pathname)) return
    const start = Date.now()
    let fired = false

    const trigger = (reason: "exit" | "scroll") => {
      if (fired || Date.now() - start < EXIT_INTENT_MIN_DWELL_MS) return
      const eligible = shouldShowExitIntent({
        pathname,
        lastShownAt: readLastShown(),
        now: Date.now(),
        hasConsentDecision: readConsentPreferences() !== null,
        alreadySubscribed: Boolean(readDigitalCheckoutEmail()),
      })
      if (!eligible) return
      fired = true
      try {
        window.localStorage.setItem(EXIT_INTENT_STORAGE_KEY, String(Date.now()))
      } catch {
        // Private mode: still show once for this page view.
      }
      setOpen(true)
      trackEvent("exit_intent_view", { placement: "guide_exit_intent", trigger: reason })
    }

    const coarse = window.matchMedia?.("(pointer: coarse)").matches
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) trigger("exit")
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max > 0 && window.scrollY / max >= EXIT_INTENT_MOBILE_SCROLL_DEPTH) trigger("scroll")
    }
    if (coarse) window.addEventListener("scroll", onScroll, { passive: true })
    else document.addEventListener("mouseout", onMouseOut)
    return () => {
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("mouseout", onMouseOut)
    }
  }, [pathname])

  useEffect(() => {
    if (!open) return
    dialogRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 sm:items-center" onClick={() => setOpen(false)}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-zinc-700 bg-[#181818] p-6 shadow-2xl focus:outline-none"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-md text-zinc-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-400">Free download</p>
        <h2 id="exit-intent-title" className="mt-2 pr-10 text-2xl font-bold text-white">Before you go: the first-visit prep pack</h2>
        <p className="mt-2 text-sm text-zinc-300">What to wear, what to ask when booking and what to expect on the day. Free PDF.</p>
        <div className="mt-4">
          <LeadMagnetForm source="exit_intent" compact showInlinePreviewOnSuccess={false} idPrefix="exit-intent" />
        </div>
      </div>
    </div>
  )
}
