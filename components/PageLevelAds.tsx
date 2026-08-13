"use client"

import { useEffect, useRef } from "react"

const ADSENSE_CLIENT = "ca-pub-9868896840591922"

/**
 * Enables AdSense Auto / page-level ads on high-traffic directory pages.
 * Display units still need approval in the AdSense account for this publisher.
 */
export default function PageLevelAds() {
  const enabled = useRef(false)

  useEffect(() => {
    if (enabled.current) return
    enabled.current = true
    try {
      const w = window as typeof window & { adsbygoogle?: unknown[] }
      w.adsbygoogle = w.adsbygoogle || []
      w.adsbygoogle.push({
        google_ad_client: ADSENSE_CLIENT,
        enable_page_level_ads: true,
      })
    } catch {
      // Ad blockers or missing AdSense script — ignore.
    }
  }, [])

  return null
}
