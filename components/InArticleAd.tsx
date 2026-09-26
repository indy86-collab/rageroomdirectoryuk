"use client"

import Script from "next/script"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import {
  ADSENSE_CLIENT,
  ADSENSE_INARTICLE_SLOT,
  ADSENSE_SCRIPT_SRC,
  isFillableManualAdSlot,
  shouldMountManualAd,
} from "@/lib/adsense"

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>
  }
}

/**
 * Single mid-article AdSense unit for long editorial pages.
 *
 * The script and the unit mount together, and only on a live eligible URL
 * with a valid slot. A missing slot no longer loads adsbygoogle.js by itself,
 * which would otherwise be enough for account-side Auto ads to start.
 */
export default function InArticleAd() {
  const pathname = usePathname()
  const [allowed, setAllowed] = useState(false)
  useEffect(() => {
    setAllowed(
      shouldMountManualAd({
        hostname: window.location.hostname,
        environment: process.env.NODE_ENV,
        pathname: pathname || "",
        slot: ADSENSE_INARTICLE_SLOT,
      })
    )
  }, [pathname])
  const insRef = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (!allowed) return
    const el = insRef.current
    if (!el || pushed.current) return
    if (!isFillableManualAdSlot(el, document)) return

    const fill = () => {
      if (pushed.current) return
      if (!isFillableManualAdSlot(el, document)) return
      if (el.getAttribute("data-adsbygoogle-status")) {
        pushed.current = true
        return
      }
      try {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
        pushed.current = true
      } catch {
        // AdSense rejects a second push during React Strict Mode remount.
      }
    }

    if (!("IntersectionObserver" in window)) {
      fill()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          fill()
          observer.disconnect()
        }
      },
      { rootMargin: "240px 0px", threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [allowed])

  if (!allowed) return null

  return (
    <aside
      className="my-10 border-y border-zinc-800/80 bg-transparent py-6"
      aria-label="Advertisement"
    >
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
        Advertisement
      </p>
      <Script
        id="adsense-manual"
        async
        src={ADSENSE_SCRIPT_SRC}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-slot={ADSENSE_INARTICLE_SLOT}
      />
    </aside>
  )
}
