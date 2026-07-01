import Link from "next/link"
import { ArrowRight, ClipboardCheck } from "lucide-react"

export default function DigitalDownloadCTA() {
  return (
    <aside className="rounded-lg border border-rage-500/30 bg-[#181818] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
            <ClipboardCheck className="h-5 w-5 text-rage-500" />
          </div>
          <div>
            <h2 className="text-base font-bold uppercase tracking-wide text-white">
              Booking for a group?
            </h2>
            <p className="mt-1 text-sm text-zinc-300">
              Get the 15-page Rage Room Party Planner Pack before you choose a venue.
            </p>
          </div>
        </div>
        <Link
          href="/digital-downloads/rage-room-party-planner-pack"
          className="btn-rage inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap text-sm uppercase tracking-wider"
        >
          Get the planner — £7
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  )
}
