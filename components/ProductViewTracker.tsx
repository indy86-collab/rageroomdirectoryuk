"use client"

import { useEffect, useRef } from "react"
import { type AnalyticsProduct, trackViewItem } from "@/lib/analytics"

type ProductViewTrackerProps = {
  product: AnalyticsProduct
}

export default function ProductViewTracker({
  product,
}: ProductViewTrackerProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) {
      return
    }

    hasTracked.current = true
    trackViewItem(product)
  }, [product])

  return null
}
