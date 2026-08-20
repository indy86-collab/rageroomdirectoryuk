"use client"

import { useEffect } from "react"
import { Analytics } from "@vercel/analytics/next"
import { ANALYTICS_READY_EVENT } from "@/lib/consent"

type ConsentControlledProvidersProps = {
  gaMeasurementId: string
  cloudflareToken: string
}

export default function ConsentControlledProviders({
  gaMeasurementId,
  cloudflareToken,
}: ConsentControlledProvidersProps) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    if (!window.gtag) {
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args)
      }
    }

    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    })
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    })
    window.gtag("js", new Date())
    window.gtag("config", gaMeasurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    })

    if (!document.querySelector('script[data-consent-provider="ga4"]')) {
      const gaScript = document.createElement("script")
      gaScript.async = true
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
        gaMeasurementId
      )}`
      gaScript.dataset.consentProvider = "ga4"
      document.head.appendChild(gaScript)
    }

    if (
      cloudflareToken &&
      !document.querySelector('script[data-consent-provider="cloudflare"]')
    ) {
      const cloudflareScript = document.createElement("script")
      cloudflareScript.defer = true
      cloudflareScript.src =
        "https://static.cloudflareinsights.com/beacon.min.js"
      cloudflareScript.dataset.cfBeacon = JSON.stringify({ token: cloudflareToken })
      cloudflareScript.dataset.consentProvider = "cloudflare"
      document.head.appendChild(cloudflareScript)
    }

    if (process.env.NODE_ENV !== "production") {
      console.info("[privacy] Optional analytics providers enabled")
    }
    window.dispatchEvent(new Event(ANALYTICS_READY_EVENT))
  }, [cloudflareToken, gaMeasurementId])

  return <Analytics />
}
