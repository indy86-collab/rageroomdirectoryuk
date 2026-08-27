"use client"

import VenueBadgeEmbedTool from "@/components/VenueBadgeEmbedTool"
import { getSiteUrl } from "@/lib/site-url"

export default function FeaturedVenueBadge({
  venueSlug,
  venueName,
}: {
  venueSlug: string
  venueName: string
}) {
  return (
    <details className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
      <summary className="cursor-pointer font-semibold text-white">
        Promote your RageRoom listing
      </summary>
      <p className="mt-3 text-sm text-zinc-400">
        Display a free “Listed on RageRoom Directory” badge on your website. It is
        optional, does not affect rankings, and is not an award or recommendation.
      </p>
      <div className="mt-4">
        <VenueBadgeEmbedTool
          options={[{ value: venueSlug, label: venueName, name: venueName }]}
          initialSlug={venueSlug}
          siteOrigin={getSiteUrl()}
        />
      </div>
    </details>
  )
}
