"use client"

import { useEffect } from "react"
import { type AnalyticsProduct, trackPurchase } from "@/lib/analytics"

type PurchaseTrackerProps = {
  sessionId: string
  product: AnalyticsProduct
}

export default function PurchaseTracker({
  sessionId,
  product,
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
    window.localStorage.setItem(storageKey, "true")
  }, [product, sessionId])

  return null
}
