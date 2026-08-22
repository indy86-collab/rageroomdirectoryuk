"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>
  }
}

/**
 * Mid-article AdSense unit for long ranking pages.
 *
 * Auto ads already load in `app/layout.tsx`. This unit adds a single
 * in-article placement. Set NEXT_PUBLIC_ADSENSE_INARTICLE_SLOT to the
 * in-article unit ID from AdSense; without it the unit still renders as
 * a fluid in-article slot on the same publisher client.
 */
export default function InArticleAd() {
  const pushed = useRef(false)
  const client =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-9868896840591922"
  const slot = process.env.NEXT_PUBLIC_ADSENSE_INARTICLE_SLOT

  useEffect(() => {
    if (pushed.current) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
      pushed.current = true
    } catch {
      // AdSense may reject a second push during React Strict Mode remount.
    }
  }, [])

  return (
    <aside className="my-8 min-h-[120px] overflow-hidden text-center" aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={client}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        {...(slot ? { "data-ad-slot": slot } : {})}
      />
    </aside>
  )
}
