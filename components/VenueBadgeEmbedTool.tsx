"use client"

import { useMemo, useState } from "react"
import {
  VENUE_BADGE_ASSETS,
  VENUE_BADGE_VARIANTS,
  buildVenueBadgeEmbedHtml,
  getVenueProfileUrl,
  type VenueBadgeVariant,
} from "@/lib/venue-badge"
import { trackAuthorityEvent } from "@/lib/analytics"
import { getSiteUrl } from "@/lib/site-url"

type BadgeOption = {
  value: string
  label: string
  name: string
}

export default function VenueBadgeEmbedTool({
  options,
  initialSlug,
  siteOrigin = getSiteUrl(),
}: {
  options: BadgeOption[]
  initialSlug?: string
  siteOrigin?: string
}) {
  const defaultSlug = initialSlug && options.some((option) => option.value === initialSlug)
    ? initialSlug
    : options[0]?.value ?? ""
  const [slug, setSlug] = useState(defaultSlug)
  const [variant, setVariant] = useState<VenueBadgeVariant>("standard")
  const [copied, setCopied] = useState<"embed" | "link" | null>(null)

  const listing = useMemo(() => {
    const selected = options.find((option) => option.value === slug) ?? options[0]
    return selected
      ? { id: selected.value, slug: selected.value, name: selected.name }
      : null
  }, [options, slug])
  const asset = VENUE_BADGE_ASSETS[variant]
  const embed = useMemo(
    () =>
      listing
        ? buildVenueBadgeEmbedHtml({ listing, variant, siteOrigin })
        : "",
    [listing, variant, siteOrigin]
  )
  const profileUrl = listing ? getVenueProfileUrl(listing) : ""

  async function copy(kind: "embed" | "link") {
    const text = kind === "embed" ? embed : profileUrl
    if (!text || !listing) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      if (kind === "embed") {
        trackAuthorityEvent("badge_code_copied", {
          variant,
          venueSlug: listing.slug || listing.id,
        })
      } else {
        trackAuthorityEvent("venue_profile_link_copied", {
          venueSlug: listing.slug || listing.id,
        })
      }
      window.setTimeout(() => setCopied(null), 2000)
    } catch {
      setCopied(null)
    }
  }

  if (!listing) {
    return (
      <p className="text-sm text-zinc-400">
        No verified venues are available for a listing badge yet.
      </p>
    )
  }

  return (
    <div className="space-y-5">
      {options.length > 1 && (
        <label className="block text-sm font-semibold text-white">
          Choose your venue
          <select
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className="mt-2 block w-full min-h-11 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-white"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <fieldset>
        <legend className="text-sm font-semibold text-white">Badge size</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {VENUE_BADGE_VARIANTS.map((item) => (
            <label
              key={item}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-md border px-3 text-sm font-semibold ${
                variant === item
                  ? "border-orange-500 bg-orange-500/10 text-white"
                  : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              <input
                type="radio"
                name="badge-variant"
                value={item}
                checked={variant === item}
                onChange={() => setVariant(item)}
                className="sr-only"
              />
              {item === "compact" ? "Compact" : "Standard"}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
        <p className="mb-3 text-xs uppercase tracking-wider text-zinc-500">Preview</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
        />
      </div>

      <div>
        <label htmlFor="badge-embed" className="text-sm font-semibold text-white">
          Embed code
        </label>
        <textarea
          id="badge-embed"
          readOnly
          value={embed}
          rows={4}
          className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-300"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => copy("embed")}
          className="btn-rage inline-flex min-h-11 items-center px-4 text-sm uppercase tracking-wider"
        >
          {copied === "embed" ? "Copied" : "Copy embed code"}
        </button>
        <button
          type="button"
          onClick={() => copy("link")}
          className="inline-flex min-h-11 items-center rounded-md border border-zinc-700 px-4 text-sm font-semibold text-white hover:border-orange-500"
        >
          {copied === "link" ? "Copied" : "Copy profile link"}
        </button>
      </div>
    </div>
  )
}
