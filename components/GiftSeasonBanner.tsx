"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Gift } from "lucide-react"
import { getGiftSeason, type GiftSeason } from "@/lib/gift-season"
import { trackEvent } from "@/lib/analytics"

/** Client-evaluated so statically built pages still follow the calendar. */
export default function GiftSeasonBanner({ placement, className = "" }: { placement: string; className?: string }) {
  const [season, setSeason] = useState<GiftSeason | null>(null)
  useEffect(() => setSeason(getGiftSeason()), [])
  if (!season) return null
  return (
    <aside aria-label="Seasonal gift ideas" className={`rounded-lg border border-orange-500/40 bg-orange-500/10 p-4 sm:p-5 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Gift className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" aria-hidden="true" />
          <div>
            <p className="font-bold text-white">{season.headline}</p>
            <p className="mt-1 text-sm text-zinc-300">{season.copy}</p>
          </div>
        </div>
        <Link
          href="/rage-room-gift-ideas-uk"
          onClick={() => trackEvent("gift_season_banner_click", { placement, season: season.id })}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-rage-500 px-4 text-sm font-bold text-white hover:bg-rage-600"
        >
          See gift ideas
        </Link>
      </div>
    </aside>
  )
}
