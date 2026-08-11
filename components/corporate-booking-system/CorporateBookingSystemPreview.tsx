"use client"

import { formatGbp } from "@/lib/corporate-booking-system"
import WorkflowStrip from "./WorkflowStrip"

/** Static UI preview for the sales page — not connected to a real workspace. */
export default function CorporateBookingSystemPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#121212] shadow-2xl shadow-black/40">
      <div className="border-b border-zinc-800 px-4 py-3 sm:px-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-rage-500">
          Corporate Booking System
        </p>
        <p className="mt-1 text-sm font-semibold text-white">
          Venue workspace preview
        </p>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <WorkflowStrip activeIndex={3} />

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["Open opportunities", "6"],
            ["Pipeline value", formatGbp(4820)],
            ["Quotes awaiting", "3"],
            ["Follow-ups due", "2"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-zinc-800 bg-[#181818] p-3"
            >
              <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                {label}
              </p>
              <p className="mt-1 text-lg font-black text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-3 lg:col-span-1">
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Package builder
            </p>
            <p className="mt-2 text-sm font-bold text-white">Corporate Plus</p>
            <p className="mt-1 text-xs text-zinc-400">
              10–20 guests · 60 mins · £50/pp · min £500
            </p>
            <p className="mt-3 text-xs text-zinc-500">
              Est. contribution {formatGbp(320)} · margin 40%
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-3 lg:col-span-1">
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Booking quote / estimate
            </p>
            <p className="mt-2 text-sm text-zinc-300">Acme Ltd · 16 guests</p>
            <p className="mt-2 text-xl font-black text-white">
              {formatGbp(860)}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Deposit {formatGbp(215)} · balance {formatGbp(645)}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-3 lg:col-span-1">
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Follow up today
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-zinc-300">
              <li>Northbridge Finance — quote sent</li>
              <li>River & Co — proposal follow-up</li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-zinc-700 bg-[#161616] p-3">
          <p className="text-xs font-semibold uppercase text-zinc-500">
            Proposal excerpt
          </p>
          <p className="mt-2 text-sm text-zinc-300">
            Proposed activity: structured team social smash session. Package
            includes PPE, exclusive area and group photo. Next step: confirm
            headcount and deposit.
          </p>
        </div>
      </div>
    </div>
  )
}
