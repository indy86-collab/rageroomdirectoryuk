"use client"

import { useEffect } from "react"
import {
  type AnalyticsProduct,
  trackCorporateBookingSystemPurchaseSuccess,
  trackCorporateBuilderPurchaseSuccess,
  trackPurchase,
} from "@/lib/analytics"

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
    let alreadyTracked = false

    try {
      alreadyTracked = Boolean(window.localStorage.getItem(storageKey))
    } catch {
      // Safari privacy settings can block storage. Tracking the confirmed
      // purchase is more important than client-side deduplication in that case.
    }

    if (alreadyTracked) {
      return
    }

    trackPurchase({
      transaction_id: sessionId,
      product,
    })
    if (trackCorporateBuilderSuccess) {
      trackCorporateBuilderPurchaseSuccess()
    }
    if (trackCorporateBookingSystemSuccess) {
      trackCorporateBookingSystemPurchaseSuccess()
    }
    try {
      window.localStorage.setItem(storageKey, "true")
    } catch {
      // The purchase event has already been queued; storage is best-effort.
    }
  }, [
    product,
    sessionId,
    trackCorporateBookingSystemSuccess,
    trackCorporateBuilderSuccess,
  ])

  return null
}
