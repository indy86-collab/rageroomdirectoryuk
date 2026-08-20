"use client"

import { useEffect } from "react"
import { trackDiscoveryPageViewed } from "@/lib/analytics"

export default function DiscoveryPageViewTracker({
  surface,
  slug,
  inventoryCount,
}: {
  surface: "activity" | "occasion"
  slug: string
  inventoryCount: number
}) {
  useEffect(() => {
    trackDiscoveryPageViewed(surface, slug, inventoryCount)
  }, [inventoryCount, slug, surface])

  return null
}
