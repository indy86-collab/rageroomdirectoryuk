"use client"

import {
  buildEventSummaryLines,
  buildEventSummaryTitle,
  type CorporateEvent,
} from "@/lib/corporate-event-builder"
import { sectionClass } from "./fieldStyles"

export default function EventSummaryCard({ event }: { event: CorporateEvent }) {
  const lines = buildEventSummaryLines(event)
  return (
    <aside className={`${sectionClass} lg:sticky lg:top-4`}>
      <p className="text-xs font-bold uppercase tracking-widest text-rage-500">
        Event summary
      </p>
      <h2 className="mt-2 text-base font-bold text-white">
        {buildEventSummaryTitle(event)}
      </h2>
      <ul className="mt-3 space-y-1.5 text-sm text-zinc-300">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {event.venueShortlist.length > 0 && (
        <div className="mt-4 border-t border-zinc-800 pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Shortlist
          </p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-300">
            {event.venueShortlist.map((v) => (
              <li key={v.listingId}>
                {v.name}
                {event.selectedVenueId === v.listingId ? " · selected" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
