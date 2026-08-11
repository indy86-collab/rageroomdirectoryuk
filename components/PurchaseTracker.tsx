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

    if (window.localStorage.getItem(storageKey)) {
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
    window.localStorage.setItem(storageKey, "true")
  }, [
    product,
    sessionId,
    trackCorporateBookingSystemSuccess,
    trackCorporateBuilderSuccess,
  ])

  return null
}
