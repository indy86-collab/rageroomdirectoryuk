"use client"

import Link from "next/link"
import { ArrowRight, ClipboardList } from "lucide-react"
import { trackFirstVisitChecklistCtaClick } from "@/lib/analytics"

type FirstVisitChecklistCTAProps = {
  className?: string
  compact?: boolean
  /** Analytics / lead source for the destination form. */
  source?: string
}

/**
 * Reusable high-intent CTA pointing at the free First Visit Prep Pack.
 */
export default function FirstVisitChecklistCTA({
  className = "",
  compact = false,
  source = "cta",
}: FirstVisitChecklistCTAProps) {
  const href = `/digital-downloads/rage-room-first-visit-prep-pack?source=${encodeURIComponent(source)}#get-checklist`

  return (
    <aside
      className={`rounded-lg border border-rage-500/30 bg-[#181818] p-4 sm:p-5 ${className}`}
      aria-label="Free first visit prep pack"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
            <ClipboardList className="h-5 w-5 text-rage-500" />
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-rage-500">
              Free prep pack
            </p>
            <h2 className="text-base font-bold uppercase tracking-wide text-white">
              First rage room?
            </h2>
            <p
              className={`mt-1 text-sm text-zinc-300 ${compact ? "max-w-2xl" : "max-w-xl"}`}
            >
              Get our free 12-page prep pack covering what happens, what to wear and what
              to check before you go.
            </p>
          </div>
        </div>
        <Link
          href={href}
          onClick={() => trackFirstVisitChecklistCtaClick(source)}
          className="btn-rage inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap px-4 text-sm uppercase tracking-wider"
        >
          Get the Free Prep Pack
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  )
}
