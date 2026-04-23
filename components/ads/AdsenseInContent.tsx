"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

const AD_CLIENT = "ca-pub-9868896840591922"
const AD_SLOT = "2022027286"

/**
 * Single responsive in-content unit. Client-only: adsbygoogle must run after mount.
 * Global loader lives in root layout (next/script); this file only renders the ins + push.
 */
export default function AdsenseInContent() {
  const insRef = useRef<HTMLModElement>(null)
  const pushedRef = useRef(false)

  useEffect(() => {
    console.log('AdsenseInContent mounted')
    if (typeof window === "undefined" || pushedRef.current || !insRef.current) return
    pushedRef.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // Duplicate fill or race (e.g. React Strict Mode remount); safe to ignore.
    }
  }, [])

  return (
    <div className="my-8 w-full flex justify-center">
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
