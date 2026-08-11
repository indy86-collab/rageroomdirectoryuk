"use client"

import {
  computeDashboardStats,
  followUpsDueToday,
  formatGbp,
  quotesAwaiting,
  recentlyWon,
  upcomingBookedEvents,
  type AppView,
  type VenueOwnerWorkspace,
} from "@/lib/corporate-booking-system"
import WorkflowStrip from "./WorkflowStrip"
import { btnPrimary, btnSecondary, sectionClass } from "./fieldStyles"

export default function DashboardView({
  workspace,
  onNavigate,
}: {
  workspace: VenueOwnerWorkspace
  onNavigate: (view: AppView) => void
}) {
  const stats = computeDashboardStats(workspace)
  const due = followUpsDueToday(workspace.leads)
  const awaiting = quotesAwaiting(workspace.leads)
  const upcoming = upcomingBookedEvents(workspace.leads)
  const won = recentlyWon(workspace.leads)

  const cards = [
    { label: "Open opportunities", value: String(stats.openOpportunities) },
    { label: "Pipeline value", value: formatGbp(stats.pipelineValue) },
    {
      label: "Quotes awaiting response",
      value: String(stats.quotesAwaitingResponse),
    },
    { label: "Follow-ups due", value: String(stats.followUpsDue) },
    { label: "Corporate bookings won", value: String(stats.bookingsWon) },
  ]

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-rage-500">
          {workspace.venue.businessName || "Venue workspace"}
        </p>
        <h1 className="mt-2 text-3xl font-black uppercase tracking-wide text-white sm:text-4xl">
          Corporate booking dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Built to help venues organise and improve their corporate-booking
          workflow — packages, quotes, proposals and follow-ups in one place.
        </p>
      </header>

      <WorkflowStrip />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className={sectionClass}>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-black text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={btnPrimary}
          onClick={() => onNavigate("pipeline")}
        >
          New Lead
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => onNavigate("packages")}
        >
          Build Package
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => onNavigate("quote")}
        >
          Create Quote
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => onNavigate("pipeline")}
        >
          View Pipeline
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className={sectionClass}>
          <h2 className="text-lg font-bold text-white">Follow up today</h2>
          {due.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">No follow-ups due.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {due.map((lead) => (
                <li key={lead.id}>
                  {lead.company || "Untitled"} — next action{" "}
                  {lead.nextFollowUpDate}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className={sectionClass}>
          <h2 className="text-lg font-bold text-white">
            Quotes awaiting response
          </h2>
          {awaiting.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">None right now.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {awaiting.map((lead) => (
                <li key={lead.id}>
                  {lead.company || "Untitled"} —{" "}
                  {formatGbp(lead.estimatedValue || 0)}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className={sectionClass}>
          <h2 className="text-lg font-bold text-white">
            Upcoming corporate events
          </h2>
          {upcoming.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">No upcoming booked events.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {upcoming.map((lead) => (
                <li key={lead.id}>
                  {lead.proposedDate}: {lead.company || "Untitled"} (
                  {lead.groupSize || "?"} guests)
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className={sectionClass}>
          <h2 className="text-lg font-bold text-white">Recently won</h2>
          {won.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">No bookings won yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {won.map((lead) => (
                <li key={lead.id}>
                  {lead.company || "Untitled"} —{" "}
                  {formatGbp(lead.estimatedValue || 0)}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
