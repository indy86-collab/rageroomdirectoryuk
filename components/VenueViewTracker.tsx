"use client"

import { useEffect, useRef } from "react"
import {
  getSafeDirectoryReferrerPath,
  trackDirectoryEvent,
} from "@/lib/analytics"

export default function VenueViewTracker({
  venueSlug,
  venueCity,
}: {
  venueSlug: string
  venueCity: string
}) {
  const trackedVenue = useRef<string | null>(null)

  useEffect(() => {
    if (trackedVenue.current === venueSlug) return
    trackedVenue.current = venueSlug
    trackDirectoryEvent("venue_view", {
      venueSlug,
      venueCity,
      sourcePath: getSafeDirectoryReferrerPath(),
    })
  }, [venueCity, venueSlug])

  return null
}
