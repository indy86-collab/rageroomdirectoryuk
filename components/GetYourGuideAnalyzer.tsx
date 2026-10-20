"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { GYG_ANALYZER_ENABLED } from "@/lib/getyourguide-catalogue"
import { GETYOURGUIDE_PARTNER_ID } from "@/lib/getyourguide"
import { THIRD_PARTY_AFFILIATE_LINKS_ENABLED } from "@/lib/monetization"
import { isAnalyticsConsentGranted } from "@/lib/consent"

export const GYG_ANALYZER_URL = "https://widget.getyourguide.com/dist/pa.umd.production.min.js"
const selector = 'script[data-consent-provider="getyourguide"]'

/** Mounted only by ConsentControlledProviders. A script tag removal cannot undo
 * third-party listeners; consent withdrawal already reloads in ConsentManager. */
export default function GetYourGuideAnalyzer() {
  const pathname = usePathname()
  useEffect(() => {
    if (!GYG_ANALYZER_ENABLED || !THIRD_PARTY_AFFILIATE_LINKS_ENABLED) return
    let timer: ReturnType<typeof setTimeout>
    const reconcile = () => {
      if (!isAnalyticsConsentGranted()) return
      const hasOffers = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[rel~="sponsored"][href]')).some(link => {
        try {
          const url = new URL(link.href)
          return url.hostname === "www.getyourguide.com" && url.searchParams.get("partner_id") === GETYOURGUIDE_PARTNER_ID
        } catch { return false }
      })
      const existing = document.querySelector(selector)
      if (!hasOffers) {
        // There is no documented Analyzer teardown. Reset its execution context
        // when leaving an eligible route, rather than merely removing the tag.
        if (existing) window.location.reload()
        return
      }
      if (existing) return
      const script = document.createElement("script")
      script.src = GYG_ANALYZER_URL
      script.async = true
      script.defer = true
      script.dataset.gygPartnerId = GETYOURGUIDE_PARTNER_ID
      script.dataset.consentProvider = "getyourguide"
      document.head.appendChild(script)
    }
    const schedule = () => { clearTimeout(timer); timer = setTimeout(reconcile, 150) }
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true })
    schedule()
    return () => { clearTimeout(timer); observer.disconnect() }
  }, [pathname])
  return null
}
