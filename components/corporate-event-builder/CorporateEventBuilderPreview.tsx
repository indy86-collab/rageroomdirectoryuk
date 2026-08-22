"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Check, ClipboardList, Mail, PoundSterling, MapPin } from "lucide-react"
import { trackCorporateEventBuilderView } from "@/lib/analytics"

const previews = [
  {
    icon: PoundSterling,
    title: "Budget",
    sample: "Total £900 · Rage room £630 · Food £180 · Travel £45 · Contingency £45 · £50/person",
  },
  {
    icon: MapPin,
    title: "Venue comparison",
    sample: "Shortlist 2–4 directory venues · starting price · approx × group · notes · Check with venue where unknown",
  },
  {
    icon: Mail,
    title: "Approval proposal",
    sample: "Team Event Proposal with purpose, schedule, cost summary and approval request — ready to copy",
  },
  {
    icon: ClipboardList,
    title: "Invite + checklist",
    sample: "Email / Slack invite · run sheet · RSVP tracker · final reminder · feedback survey",
  },
]

export default function CorporateEventBuilderPreview() {
  useEffect(() => {
    trackCorporateEventBuilderView("product_page")
  }, [])

  return (
    <div className="rounded-lg border border-zinc-800 bg-[#181818] p-5 sm:p-6">
      <p className="text-sm font-bold uppercase tracking-widest text-rage-500">
        Product preview
      </p>
      <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
        This is what you build — try the real tool
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
        Plan your team event for free. Examples below are illustrative; the
        builder uses your real details. Pay only if you want a clean PDF of the
        finished plan.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {previews.map((preview) => {
          const Icon = preview.icon
          return (
            <article
              key={preview.title}
              className="rounded-md border border-zinc-800 bg-[#141414] p-4"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-rage-500" />
                <h3 className="text-sm font-bold text-white">{preview.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {preview.sample}
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                <Check className="h-3.5 w-3.5 text-rage-500" />
                Included in the free builder
              </p>
            </article>
          )
        })}
      </div>
      <Link
        href="/corporate-event-builder"
        className="mt-5 inline-flex min-h-[44px] items-center text-sm font-semibold text-rage-500 hover:text-rage-400"
      >
        Open the Event Builder
      </Link>
    </div>
  )
}
