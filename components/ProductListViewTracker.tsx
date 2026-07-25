"use client"

import { useEffect, useRef } from "react"
import { type AnalyticsProduct, trackViewItemList } from "@/lib/analytics"

type ProductListViewTrackerProps = {
  products: AnalyticsProduct[]
  listName?: string
}

export default function ProductListViewTracker({
  products,
  listName = "Digital Products",
}: ProductListViewTrackerProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current || products.length === 0) {
      return
    }

    hasTracked.current = true
    trackViewItemList(products, listName)
  }, [products, listName])

  return null
}
