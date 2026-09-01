"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { trackAuthorityEvent } from "@/lib/analytics"
import {
  buildFindHref,
  summariseTripQuery,
  type TripQuery,
} from "@/lib/trip-query"
import TripFinderPanel from "./TripFinderPanel"

type TripResultsClientProps = {
  query: TripQuery
  resultCount: number
}

export default function TripResultsClient({ query, resultCount }: TripResultsClientProps) {
  const router = useRouter()
  const chips = summariseTripQuery(query)

  useEffect(() => {
    trackAuthorityEvent("trip_search", {
      locationKind: query.location?.kind ?? "none",
      resultCount,
    })
  }, [query.location?.kind, resultCount])

  function applyPeople(value: string) {
    router.push(
      buildFindHref(query.raw, {
        city: query.location?.slug,
        people: value || undefined,
        budget: query.budgetPerPerson?.toString(),
        occasion: query.occasions[0],
        when: query.date?.iso,
      })
    )
  }

  function applyBudget(value: string) {
    router.push(
      buildFindHref(query.raw, {
        city: query.location?.slug,
        people: query.groupSize?.toString(),
        budget: value || undefined,
        occasion: query.occasions[0],
        when: query.date?.iso,
      })
    )
  }

  return (
    <div className="space-y-6">
      <TripFinderPanel initialQuery={query.raw} compact />

      {chips.length > 0 ? (
        <p className="flex flex-wrap gap-2" aria-label="Parsed plan">
          {chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200"
            >
              {chip}
            </span>
          ))}
        </p>
      ) : null}

      {query.raw ? (
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
        <label className="block text-sm font-semibold text-zinc-300">
          Group size
          <input
            type="number"
            min={1}
            max={40}
            defaultValue={query.groupSize ?? ""}
            onBlur={(event) => {
              if (event.target.value !== String(query.groupSize ?? "")) {
                applyPeople(event.target.value)
              }
            }}
            className="mt-1 min-h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-white"
          />
        </label>
        <label className="block text-sm font-semibold text-zinc-300">
          Max £ per person
          <input
            type="number"
            min={1}
            max={500}
            defaultValue={query.budgetPerPerson ?? ""}
            onBlur={(event) => {
              if (event.target.value !== String(query.budgetPerPerson ?? "")) {
                applyBudget(event.target.value)
              }
            }}
            className="mt-1 min-h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-white"
          />
        </label>
      </form>
      ) : null}
    </div>
  )
}
