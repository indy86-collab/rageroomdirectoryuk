"use client"

import { useMemo, useState } from "react"
import {
  buildWidgetEmbedHtml,
  buildWidgetEmbedSrc,
  sanitiseWidgetActivity,
} from "@/lib/widget-search"
import { trackAuthorityEvent } from "@/lib/analytics"
import { getSiteUrl } from "@/lib/site-url"

export default function WidgetEmbedBuilder({
  cities,
  siteOrigin = getSiteUrl(),
}: {
  cities: Array<{ name: string; slug: string }>
  siteOrigin?: string
}) {
  const [showTitle, setShowTitle] = useState(true)
  const [location, setLocation] = useState("")
  const [copied, setCopied] = useState(false)

  const src = useMemo(
    () =>
      buildWidgetEmbedSrc({
        siteOrigin,
        showTitle,
        activity: sanitiseWidgetActivity("rage-room"),
        location,
      }),
    [siteOrigin, showTitle, location]
  )
  const html = buildWidgetEmbedHtml(src)
  const customisation = !showTitle || location ? "custom" : "default"

  async function copy() {
    try {
      await navigator.clipboard.writeText(html)
      setCopied(true)
      trackAuthorityEvent("widget_embed_code_copied", { customisation })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-4">
        <label className="inline-flex min-h-11 items-center gap-2 text-sm text-zinc-200">
          <input
            type="checkbox"
            checked={showTitle}
            onChange={(event) => setShowTitle(event.target.checked)}
            className="h-4 w-4 accent-orange-500"
          />
          Show title
        </label>
        <label className="text-sm font-semibold text-white">
          Optional city preset
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="mt-2 block min-h-11 min-w-48 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-white"
          >
            <option value="">None</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <iframe
        src={src}
        title="Rage room finder preview"
        className="h-[540px] w-full max-w-[420px] rounded-xl border border-zinc-800"
      />

      <div>
        <label htmlFor="widget-embed" className="text-sm font-semibold text-white">
          Embed code
        </label>
        <textarea
          id="widget-embed"
          readOnly
          value={html}
          rows={5}
          className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300"
        />
      </div>
      <button
        type="button"
        onClick={copy}
        className="btn-rage inline-flex min-h-11 items-center px-4 text-sm uppercase tracking-wider"
      >
        {copied ? "Copied" : "Copy embed code"}
      </button>
    </div>
  )
}
