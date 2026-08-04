"use client"

import { useState } from "react"

export default function FeaturedVenueBadge({
  listingUrl,
  venueName,
}: {
  listingUrl: string
  venueName: string
}) {
  const [copied, setCopied] = useState(false)
  const snippet = `<a href="${listingUrl}" aria-label="View ${venueName} on RageRoom Directory"><img src="https://www.rageroomdirectory.co.uk/featured-venue-badge.svg" alt="Featured on RageRoom Directory" width="220" height="64"></a>`

  async function copy() {
    await navigator.clipboard.writeText(snippet)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <details className="mb-6 rounded-lg border border-zinc-800 bg-[#181818] p-4 sm:mb-8 sm:p-6">
      <summary className="cursor-pointer font-semibold text-white">
        Optional badge for this verified venue
      </summary>
      <div className="mt-4 space-y-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/featured-venue-badge.svg" alt="Featured on RageRoom Directory" width="220" height="64" />
        <p className="text-sm text-zinc-400">
          Venue owners may display this badge and link to this canonical listing. It is optional, does not affect rankings, and is not required to remain listed.
        </p>
        <code className="block overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-zinc-300">{snippet}</code>
        <button type="button" onClick={copy} className="rounded-md border border-zinc-700 px-3 py-2 text-sm font-semibold text-white hover:border-orange-500">
          {copied ? "Copied" : "Copy badge HTML"}
        </button>
      </div>
    </details>
  )
}
