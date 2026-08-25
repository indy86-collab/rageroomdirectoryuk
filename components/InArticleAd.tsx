"use client"

import Script from "next/script"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import {
  ADSENSE_CLIENT,
  ADSENSE_INARTICLE_SLOT,
  isAdEligiblePath,
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
 * checkout and game pages never request ads. Overlay/vignette Auto ads are
 * disabled in the tag; turn Auto ads off in AdSense as well so Google does
 * not inject extra units around this one.
 */
export default function InArticleAd() {
  const pathname = usePathname()
  const insRef = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (pathname && !isAdEligiblePath(pathname)) return
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
  }, [pathname])

  if (pathname && !isAdEligiblePath(pathname)) return null

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
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        data-overlays="{overlay:false}"
        data-vignette="{vignette:false}"
      />
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        {...(ADSENSE_INARTICLE_SLOT
          ? { "data-ad-slot": ADSENSE_INARTICLE_SLOT }
          : {})}
      />
    </aside>
  )
}
