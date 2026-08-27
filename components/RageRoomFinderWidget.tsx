"use client"

import { useCallback, useEffect, useState } from "react"
import {
  searchWidgetLocations,
  WIDGET_ATTRIBUTION_REL,
  type WidgetLocationIndex,
  type WidgetLocationMatch,
} from "@/lib/widget-search"
import { trackAuthorityEvent } from "@/lib/analytics"
import { getSiteUrl } from "@/lib/site-url"

type NearbyResult = {
  slug: string
  name: string
  city: string
  distanceMiles: number
}

type FinderProps = {
  index: WidgetLocationIndex
  initialQuery?: string
  showTitle?: boolean
  source?: "embed" | "preview"
  siteOrigin?: string
}

export default function RageRoomFinderWidget({
  index,
  initialQuery = "",
  showTitle = true,
  source = "embed",
  siteOrigin = getSiteUrl(),
}: FinderProps) {
  const [query, setQuery] = useState(initialQuery)
  const [error, setError] = useState("")
  const [cityMatches, setCityMatches] = useState<WidgetLocationMatch[]>([])
  const [nearby, setNearby] = useState<NearbyResult[]>([])
  const [status, setStatus] = useState<"idle" | "searching">("idle")

  const runSearch = useCallback(
    async (raw = query) => {
      const outcome = searchWidgetLocations(raw, index)
      setError("")
      setCityMatches([])
      setNearby([])

      if (outcome.status === "empty" || outcome.status === "invalid" || outcome.status === "none") {
        setError(outcome.message)
        trackAuthorityEvent("widget_search", {
          queryKind: outcome.queryKind,
          resultCount: 0,
        })
        return
      }

      if (outcome.status === "matches") {
        setCityMatches(outcome.matches)
        trackAuthorityEvent("widget_search", {
          queryKind: outcome.queryKind,
          resultCount: outcome.matches.length,
        })
        return
      }

      setStatus("searching")
      try {
        const response = await fetch(
          `/api/nearby?postcode=${encodeURIComponent(outcome.postcode)}`,
          { cache: "no-store" }
        )
        const payload = (await response.json()) as {
          error?: string
          results?: NearbyResult[]
        }
        if (!response.ok) {
          setError(payload.error || "We could not find venues for that postcode.")
          trackAuthorityEvent("widget_search", {
            queryKind: "postcode",
            resultCount: 0,
          })
          return
        }
        const results = payload.results ?? []
        setNearby(results)
        if (results.length === 0) {
          setError("No verified venues were found near that postcode yet.")
        }
        trackAuthorityEvent("widget_search", {
          queryKind: "postcode",
          resultCount: results.length,
        })
      } catch {
        setError("Postcode search is temporarily unavailable. Try a town or city name instead.")
        trackAuthorityEvent("widget_search", {
          queryKind: "postcode",
          resultCount: 0,
        })
      } finally {
        setStatus("idle")
      }
    },
    [index, query]
  )

  useEffect(() => {
    trackAuthorityEvent("widget_loaded", { source })
  }, [source])

  useEffect(() => {
    if (initialQuery.trim()) {
      void runSearch(initialQuery)
    }
    // Optional location preset should search once after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function resultHref(path: string) {
    return `${siteOrigin}${path}`
  }

  return (
    <div className="flex h-full min-h-[520px] flex-col bg-dark-900 p-4 text-white">
      {showTitle && (
        <h1 className="text-xl font-bold tracking-tight">Find a Rage Room Near You</h1>
      )}
      <p className={`${showTitle ? "mt-2" : ""} text-sm text-zinc-400`}>
        Search verified UK venues by postcode or town.
      </p>

      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault()
          void runSearch()
        }}
      >
        <label htmlFor="widget-location" className="block text-sm font-semibold">
          Postcode or town / city
        </label>
        <input
          id="widget-location"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="postal-code"
          enterKeyHint="search"
          placeholder="e.g. Birmingham or SW1A 1AA"
          className="block w-full min-h-11 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-base text-white placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "searching"}
          className="btn-rage inline-flex min-h-11 w-full items-center justify-center text-sm uppercase tracking-wider disabled:opacity-60"
        >
          {status === "searching" ? "Searching…" : "Find venues"}
        </button>
      </form>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto" aria-live="polite">
        {error && <p className="text-sm text-zinc-300">{error}</p>}

        {cityMatches.length > 0 && (
          <ul className="space-y-2">
            {cityMatches.map((match) => (
              <li key={`${match.type}-${match.slug}`}>
                <a
                  href={resultHref(match.href)}
                  target="_blank"
                  rel="noopener"
                  onClick={() =>
                    trackAuthorityEvent("widget_result_click", {
                      resultType: match.type,
                    })
                  }
                  className="flex min-h-11 items-center justify-between rounded-md border border-zinc-800 bg-[#181818] px-3 py-2 text-sm hover:border-orange-500"
                >
                  <span className="font-semibold">{match.name}</span>
                  <span className="text-zinc-400">
                    {match.venueCount} {match.venueCount === 1 ? "venue" : "venues"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}

        {nearby.length > 0 && (
          <ul className="space-y-2">
            {nearby.map((venue) => (
              <li key={venue.slug}>
                <a
                  href={resultHref(`/listing/${venue.slug}`)}
                  target="_blank"
                  rel="noopener"
                  onClick={() =>
                    trackAuthorityEvent("widget_result_click", { resultType: "venue" })
                  }
                  className="block rounded-md border border-zinc-800 bg-[#181818] px-3 py-2 text-sm hover:border-orange-500"
                >
                  <span className="font-semibold">{venue.name}</span>
                  <span className="mt-1 block text-zinc-400">
                    {venue.city}
                    {Number.isFinite(venue.distanceMiles)
                      ? ` · ${venue.distanceMiles.toFixed(1)} miles`
                      : ""}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-zinc-500">
        Powered by{" "}
        <a
          href={siteOrigin}
          target="_blank"
          rel={WIDGET_ATTRIBUTION_REL}
          className="font-semibold text-orange-500 hover:text-orange-400"
        >
          RageRoom Directory
        </a>
      </p>
    </div>
  )
}
