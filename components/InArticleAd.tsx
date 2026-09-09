"use client"

import Script from "next/script"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import {
  ADSENSE_CLIENT,
  ADSENSE_INARTICLE_SLOT,
  isAdEligiblePath,
  isLiveAdsenseHost,
  isValidAdsenseAdSlot,
} from "@/lib/adsense"

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>
  }
}

/**
 * Single mid-article AdSense unit for long editorial pages.
 *
 * The AdSense script is loaded only when this unit mounts, so directory,
 * checkout and game pages do not mount this loader. Account-side Auto ads
 * exclusions are still needed when navigating after the script has loaded. If no valid manual unit ID is
 * configured, only the base script loads (which can still serve account-side
 * Auto ads) and no incomplete manual ad request is sent.
 */
export default function InArticleAd() {
  const pathname = usePathname()
  const [liveHost, setLiveHost] = useState(false)
  useEffect(() => {
    setLiveHost(isLiveAdsenseHost(window.location.hostname, process.env.NODE_ENV))
  }, [])
  const insRef = useRef<HTMLModElement>(null)
  const pushed = useRef(false)
  const hasManualSlot = isValidAdsenseAdSlot(ADSENSE_INARTICLE_SLOT)

  useEffect(() => {
    if (!liveHost || !pathname || !isAdEligiblePath(pathname)) return
    if (!hasManualSlot) return
    const el = insRef.current
    if (!el || pushed.current) return

    const fill = () => {
      if (pushed.current) return
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
  }, [hasManualSlot, pathname, liveHost])

  if (!liveHost || !pathname || !isAdEligiblePath(pathname)) return null

  const loader = (
    <Script
      id="adsense-manual"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )

  if (!hasManualSlot) return loader

  return (
    <aside
      className="my-10 border-y border-zinc-800/80 bg-transparent py-6"
      aria-label="Advertisement"
    >
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
        Advertisement
      </p>
      {loader}
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
