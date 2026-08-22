"use client"

import { useEffect, useRef } from "react"
import { Sparkles } from "lucide-react"
import {
  GETYOURGUIDE_PARTNER_ID,
  ensureGetYourGuideWidgetScript,
  getGetYourGuideWidgetDataset,
  isGetYourGuideWidgetScriptPresent,
} from "@/lib/getyourguide"

type GygWidgetApi = {
  Widget?: (element: HTMLElement, options: Record<string, string>) => void
}

type GetYourGuideWidgetProps = {
  query: string
  campaign: string
  city: string
  loaded: boolean
  onRequestLoad: () => void
}

export default function GetYourGuideWidget({
  query,
  campaign,
  city,
  loaded,
  onRequestLoad,
}: GetYourGuideWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loaded) return

    const alreadyPresent = isGetYourGuideWidgetScriptPresent()
    let cancelled = false

    ensureGetYourGuideWidgetScript()
      .then(() => {
        if (cancelled) return
        const element = containerRef.current
        if (!element || !alreadyPresent) return

        const Widget = (window as Window & { GYG?: GygWidgetApi }).GYG?.Widget
        Widget?.(element, {
          partnerId: GETYOURGUIDE_PARTNER_ID,
          localeCode: "en-GB",
          numberOfItems: "3",
          q: query,
          cmp: campaign,
        })
      })
      .catch(() => {
        // The placeholder already disclosed the third-party request.
        // A failed load must not throw into the directory page.
      })

    return () => {
      cancelled = true
    }
  }, [loaded, query, campaign])

  if (!loaded) {
    return (
      <button
        type="button"
        onClick={onRequestLoad}
        aria-label={`Show nearby GetYourGuide activities in ${city}`}
        className="flex min-h-[220px] w-full flex-col items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-black/25 px-4 py-8 text-zinc-300 transition-colors hover:border-orange-500/60 hover:bg-orange-500/5 hover:text-white"
      >
        <Sparkles className="h-8 w-8 text-orange-500" aria-hidden="true" />
        <span className="text-sm font-semibold">Show nearby activities</span>
        <span className="max-w-sm text-center text-xs leading-5 text-zinc-400">
          This contacts GetYourGuide, which may receive device and request
          information. Tours show photos, prices and ratings.
        </span>
      </button>
    )
  }

  const dataset = getGetYourGuideWidgetDataset(query, campaign)

  return (
    <div className="min-h-[220px] overflow-hidden rounded-lg bg-black/20">
      <div ref={containerRef} {...dataset} />
    </div>
  )
}
