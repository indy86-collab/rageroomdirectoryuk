"use client"

import { useEffect } from "react"
import {
  type AnalyticsProduct,
  trackCorporateBookingSystemPurchaseSuccess,
  trackCorporateBuilderPurchaseSuccess,
  trackPurchase,
} from "@/lib/analytics"
import {
  ANALYTICS_READY_EVENT,
  CONSENT_CHANGE_EVENT,
  isAnalyticsConsentGranted,
} from "@/lib/consent"

type PurchaseTrackerProps = {
  sessionId: string
  product: AnalyticsProduct
  /** Fires corporate_builder_purchase_success when set. */
  trackCorporateBuilderSuccess?: boolean
  /** Fires corporate_booking_system_purchase_success when set. */
  trackCorporateBookingSystemSuccess?: boolean
}

export default function PurchaseTracker({
  sessionId,
  product,
  trackCorporateBuilderSuccess = false,
  trackCorporateBookingSystemSuccess = false,
}: PurchaseTrackerProps) {
  useEffect(() => {
    const storageKey = `purchase_tracked_${sessionId}`
    function attemptTracking() {
      if (!isAnalyticsConsentGranted()) return

      let alreadyTracked = false
      try {
        alreadyTracked = Boolean(window.localStorage.getItem(storageKey))
      } catch {
        // Analytics deduplication storage is best-effort.
      }

      if (alreadyTracked) return

      const sent = trackPurchase({
        transaction_id: sessionId,
        product,
      })
      if (!sent) return

      if (trackCorporateBuilderSuccess) {
        trackCorporateBuilderPurchaseSuccess()
      }
      if (trackCorporateBookingSystemSuccess) {
        trackCorporateBookingSystemPurchaseSuccess()
      }
      try {
        window.localStorage.setItem(storageKey, "true")
      } catch {
        // The event was sent; storage remains best-effort.
      }
    }

    attemptTracking()
    window.addEventListener(CONSENT_CHANGE_EVENT, attemptTracking)
    window.addEventListener(ANALYTICS_READY_EVENT, attemptTracking)
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, attemptTracking)
      window.removeEventListener(ANALYTICS_READY_EVENT, attemptTracking)
    }
  }, [
    product,
    sessionId,
    trackCorporateBookingSystemSuccess,
    trackCorporateBuilderSuccess,
  ])

  return null
}
