"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import {
  EXAMPLE_TRIP_CHIPS,
  EXAMPLE_TRIP_QUERY,
  buildFindHref,
} from "@/lib/trip-query"

type TripFinderPanelProps = {
  initialQuery?: string
  compact?: boolean
}

export default function TripFinderPanel({
  initialQuery = "",
  compact = false,
}: TripFinderPanelProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)

  function submit(nextQuery = query) {
    const trimmed = nextQuery.trim()
    router.push(buildFindHref(trimmed))
  }

  return (
    <section
      aria-labelledby="trip-finder-heading"
      className={compact ? "w-full" : "w-full pt-2 sm:pt-4 pb-8 sm:pb-12"}
    >
      <div className={compact ? "" : "w-full px-3 sm:px-5 lg:px-6"}>
        <div className={`relative overflow-hidden rounded-2xl border border-rage-500/35 bg-gradient-to-br from-[#2a1208] via-[#14110f] to-[#0b0a16] shadow-[0_0_80px_-24px_rgba(249,115,22,0.55)] ${compact ? "p-4 sm:p-5" : "p-5 sm:p-8 lg:p-10"}`}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-rage-500/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-10 h-40 w-40 rounded-full bg-orange-700/20 blur-3xl"
          />

          <p className="relative inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-rage-400">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Plan a session
          </p>
          {compact ? (
            <h2 id="trip-finder-heading" className="relative mt-2 text-xl font-bold text-white sm:text-2xl">
              Change the plan
            </h2>
          ) : (
            <>
              <h2
                id="trip-finder-heading"
                className="relative mt-3 max-w-3xl font-display text-3xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Describe the plan.{" "}
                <span className="text-rage-500">We’ll pick the rooms.</span>
              </h2>
              <p className="relative mt-3 max-w-2xl text-sm text-zinc-300 sm:mt-4 sm:text-base">
                Town, group size, budget, birthday or hen do — type it like you’d text a friend.
                We’ll rank nearby options with price, distance and whether they fit.
              </p>
            </>
          )}

          <form
            className="relative mt-6 space-y-3"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <label htmlFor="trip-finder-query" className="sr-only">
              Describe the rage room session you want
            </label>
            <textarea
              id="trip-finder-query"
              name="query"
              rows={compact ? 3 : 4}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={EXAMPLE_TRIP_QUERY}
              className="min-h-[6.5rem] w-full resize-y rounded-xl border border-zinc-700 bg-black/45 px-4 py-3 text-base text-white placeholder:text-zinc-500 focus:border-rage-500 focus:outline-none focus:ring-2 focus:ring-rage-500/40"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-rage-500 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-rage-600"
              >
                Find options
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="text-xs text-zinc-500 sm:text-right">
                City or postcode search is still in the hero and header.
              </p>
            </div>
          </form>

          <div className="relative mt-5 flex flex-wrap gap-2">
            {EXAMPLE_TRIP_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setQuery(chip.query)
                  submit(chip.query)
                }}
                className="min-h-11 rounded-full border border-zinc-700 bg-black/30 px-3.5 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:border-rage-500/70 hover:text-white"
              >
                Try: {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
