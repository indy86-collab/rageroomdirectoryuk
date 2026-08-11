"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, Trash2 } from "lucide-react"
import {
  buildVenueEnquiryQuestions,
  displayOrCheck,
  estimateVenueCost,
  formatGbp,
  toShortlistItem,
  type CorporateEvent,
  type VenueSearchResult,
} from "@/lib/corporate-event-builder"
import CopyButton from "./CopyButton"
import { fieldClass, helpClass, labelClass, sectionClass } from "./fieldStyles"

type StepVenuesProps = {
  event: CorporateEvent
  sessionId: string
  onChange: (patch: Partial<CorporateEvent>) => void
  onVenueAdded?: () => void
}

export default function StepVenues({
  event,
  sessionId,
  onChange,
  onVenueAdded,
}: StepVenuesProps) {
  const [query, setQuery] = useState(event.location)
  const [results, setResults] = useState<VenueSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function searchVenues(nextQuery: string) {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        session_id: sessionId,
        q: nextQuery.trim(),
        city: event.location.trim(),
      })
      const res = await fetch(`/api/corporate-event-builder/venues?${params}`)
      const data = (await res.json()) as {
        venues?: VenueSearchResult[]
        error?: string
      }
      if (!res.ok) {
        setError(data.error || "Venue search failed.")
        setResults([])
        return
      }
      setResults(data.venues || [])
    } catch {
      setError("Venue search failed.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (event.location.trim().length >= 2) {
      void searchVenues(event.location)
    }
    // Initial city-based search only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addVenue(venue: VenueSearchResult) {
    if (event.venueShortlist.some((v) => v.listingId === venue.id)) return
    if (event.venueShortlist.length >= 4) {
      setError("Shortlist up to 4 venues.")
      return
    }
    onChange({
      venueShortlist: [...event.venueShortlist, toShortlistItem(venue)],
    })
    onVenueAdded?.()
  }

  function removeVenue(listingId: string) {
    const venueShortlist = event.venueShortlist.filter(
      (v) => v.listingId !== listingId
    )
    onChange({
      venueShortlist,
      selectedVenueId:
        event.selectedVenueId === listingId ? null : event.selectedVenueId,
      selectedVenueName:
        event.selectedVenueId === listingId ? "" : event.selectedVenueName,
    })
  }

  function updateNotes(listingId: string, notes: string) {
    onChange({
      venueShortlist: event.venueShortlist.map((v) =>
        v.listingId === listingId ? { ...v, notes } : v
      ),
    })
  }

  function selectVenue(listingId: string) {
    const venue = event.venueShortlist.find((v) => v.listingId === listingId)
    if (!venue) return
    onChange({
      selectedVenueId: listingId,
      selectedVenueName: venue.name,
    })
  }

  const questions = buildVenueEnquiryQuestions(event).join("\n")

  return (
    <div className="space-y-4">
      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-white">Compare rage rooms</h2>
        <p className={helpClass}>
          Shortlist 2–4 venues from RageRoom Directory. Missing details show as
          “Check with venue” — we do not invent prices or amenities.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            className={fieldClass}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city or venue name"
            aria-label="Search venues"
          />
          <button
            type="button"
            onClick={() => void searchVenues(query)}
            className="btn-rage inline-flex min-h-[44px] items-center justify-center gap-2 px-4 text-sm"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-amber-400">{error}</p>}
        {loading && (
          <p className="mt-2 text-sm text-zinc-500">Searching directory…</p>
        )}
        {!loading && results.length > 0 && (
          <ul className="mt-4 divide-y divide-zinc-800 rounded-md border border-zinc-800">
            {results.map((venue) => {
              const already = event.venueShortlist.some(
                (v) => v.listingId === venue.id
              )
              return (
                <li
                  key={venue.id}
                  className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">{venue.name}</p>
                    <p className="text-xs text-zinc-500">
                      {venue.city}
                      {venue.region ? ` · ${venue.region}` : ""}
                      {" · "}
                      From{" "}
                      {venue.price != null
                        ? formatGbp(venue.price)
                        : "Check with venue"}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={already || event.venueShortlist.length >= 4}
                    onClick={() => addVenue(venue)}
                    className="inline-flex min-h-[40px] items-center justify-center gap-1 rounded-md border border-zinc-700 px-3 text-sm font-semibold text-zinc-100 disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                    {already ? "Added" : "Add"}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-white">Your shortlist</h2>
        {event.venueShortlist.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">
            No venues shortlisted yet. Search above to add 2–4 options.
          </p>
        ) : (
          <div className="mt-4 space-y-3 lg:hidden">
            {event.venueShortlist.map((venue) => {
              const approx = estimateVenueCost(venue.price, event.attendeeCount)
              return (
                <article
                  key={venue.listingId}
                  className="rounded-md border border-zinc-800 bg-[#121212] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white">{venue.name}</p>
                      <p className="text-xs text-zinc-500">
                        {venue.city} · {venue.region}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${venue.name}`}
                      onClick={() => removeVenue(venue.listingId)}
                      className="text-zinc-500 hover:text-rage-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <dl className="mt-3 space-y-1 text-sm text-zinc-300">
                    <div className="flex justify-between gap-2">
                      <dt className="text-zinc-500">Starting price</dt>
                      <dd>
                        {venue.price != null
                          ? formatGbp(venue.price)
                          : "Check with venue"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-zinc-500">Approx × attendees</dt>
                      <dd>
                        {approx != null
                          ? formatGbp(approx)
                          : "Check with venue"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-zinc-500">Group size</dt>
                      <dd>
                        {venue.groupSizeMin != null || venue.groupSizeMax != null
                          ? `${displayOrCheck(venue.groupSizeMin)}–${displayOrCheck(venue.groupSizeMax)}`
                          : "Check with venue"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-zinc-500">Corporate groups</dt>
                      <dd>
                        {venue.hasCorporateGroups
                          ? "Listed as suitable"
                          : "Check with venue"}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    <Link
                      href={venue.listingPath}
                      className="font-semibold text-rage-500 hover:text-rage-400"
                      target="_blank"
                    >
                      Directory listing
                    </Link>
                    {venue.website && (
                      <a
                        href={venue.website}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-zinc-300 hover:text-white"
                      >
                        Website
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => selectVenue(venue.listingId)}
                      className="font-semibold text-zinc-300 hover:text-white"
                    >
                      {event.selectedVenueId === venue.listingId
                        ? "Selected"
                        : "Select venue"}
                    </button>
                  </div>
                  <label className={`${labelClass} mt-3`} htmlFor={`notes-${venue.listingId}`}>
                    Notes (parking, private booking, invoice…)
                  </label>
                  <textarea
                    id={`notes-${venue.listingId}`}
                    className={`${fieldClass} min-h-[72px]`}
                    value={venue.notes}
                    onChange={(e) =>
                      updateNotes(venue.listingId, e.target.value)
                    }
                    placeholder="Parking? Private booking? Can 18 attend together? Food nearby? Corporate invoice?"
                  />
                </article>
              )
            })}
          </div>
        )}

        {event.venueShortlist.length > 0 && (
          <div className="mt-4 hidden overflow-x-auto lg:block">
            <table className="min-w-full text-left text-sm text-zinc-300">
              <thead className="text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-2 py-2">Venue</th>
                  <th className="px-2 py-2">Starting</th>
                  <th className="px-2 py-2">Approx × group</th>
                  <th className="px-2 py-2">Group size</th>
                  <th className="px-2 py-2">Corporate</th>
                  <th className="px-2 py-2">Links</th>
                  <th className="px-2 py-2">Notes</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {event.venueShortlist.map((venue) => {
                  const approx = estimateVenueCost(
                    venue.price,
                    event.attendeeCount
                  )
                  return (
                    <tr key={venue.listingId} className="border-t border-zinc-800">
                      <td className="px-2 py-3 align-top">
                        <p className="font-semibold text-white">{venue.name}</p>
                        <p className="text-xs text-zinc-500">
                          {venue.city}
                          {venue.priceNote ? ` · ${venue.priceNote}` : ""}
                        </p>
                        <button
                          type="button"
                          onClick={() => selectVenue(venue.listingId)}
                          className="mt-1 text-xs font-semibold text-rage-500"
                        >
                          {event.selectedVenueId === venue.listingId
                            ? "Selected"
                            : "Select"}
                        </button>
                      </td>
                      <td className="px-2 py-3 align-top">
                        {venue.price != null
                          ? formatGbp(venue.price)
                          : "Check with venue"}
                      </td>
                      <td className="px-2 py-3 align-top">
                        {approx != null
                          ? formatGbp(approx)
                          : "Check with venue"}
                      </td>
                      <td className="px-2 py-3 align-top">
                        {venue.groupSizeMin != null || venue.groupSizeMax != null
                          ? `${displayOrCheck(venue.groupSizeMin)}–${displayOrCheck(venue.groupSizeMax)}`
                          : "Check with venue"}
                      </td>
                      <td className="px-2 py-3 align-top">
                        {venue.hasCorporateGroups
                          ? "Listed"
                          : "Check with venue"}
                      </td>
                      <td className="px-2 py-3 align-top">
                        <div className="flex flex-col gap-1">
                          <Link
                            href={venue.listingPath}
                            className="text-rage-500 hover:text-rage-400"
                            target="_blank"
                          >
                            Listing
                          </Link>
                          {venue.website ? (
                            <a
                              href={venue.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-zinc-400 hover:text-white"
                            >
                              Website
                            </a>
                          ) : (
                            <span className="text-zinc-600">Check with venue</span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-3 align-top">
                        <textarea
                          className={`${fieldClass} min-h-[64px] min-w-[160px]`}
                          value={venue.notes}
                          onChange={(e) =>
                            updateNotes(venue.listingId, e.target.value)
                          }
                          placeholder="Parking? Private? Invoice?"
                        />
                      </td>
                      <td className="px-2 py-3 align-top">
                        <button
                          type="button"
                          aria-label={`Remove ${venue.name}`}
                          onClick={() => removeVenue(venue.listingId)}
                          className="text-zinc-500 hover:text-rage-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              Venue enquiry questions
            </h2>
            <p className={helpClass}>
              Requirements differ by venue — confirm everything before booking.
            </p>
          </div>
          <CopyButton text={questions} label="Copy questions" />
        </div>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
          {buildVenueEnquiryQuestions(event).map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}
