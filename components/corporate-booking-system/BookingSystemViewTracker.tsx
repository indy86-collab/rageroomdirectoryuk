"use client"

import { useEffect, useRef } from "react"
import {
  trackCorporateBookingSystemView,
  trackViewItem,
  type AnalyticsProduct,
} from "@/lib/analytics"

export default function BookingSystemViewTracker({
  product,
  source,
}: {
  product: AnalyticsProduct
  source?: string
}) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    trackViewItem(product)
    trackCorporateBookingSystemView(source)
  }, [product, source])

  return null
}
