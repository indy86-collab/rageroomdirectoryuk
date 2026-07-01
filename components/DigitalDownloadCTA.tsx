import Link from "next/link"
import { ArrowRight, ClipboardCheck } from "lucide-react"

type DigitalDownloadCTAVariant = "party" | "corporate"

type DigitalDownloadCTAProps = {
  variant?: DigitalDownloadCTAVariant
  compact?: boolean
}

const ctaCopy = {
  party: {
    eyebrow: null,
    title: "Booking for a group?",
    copy: "Get the 15-page Rage Room Party Planner Pack before you choose a venue.",
    button: "Get the planner — £7",
    href: "/digital-downloads/rage-room-party-planner-pack",
  },
  corporate: {
    eyebrow: "For work events",
    title: "Planning a corporate rage room team-building event?",
    copy: "Get the 16-page toolkit with approval email, budget worksheet, venue scorecard, safety questions, run sheet and feedback form.",
    button: "Get the corporate toolkit — £19",
    href: "/digital-downloads/corporate-rage-room-team-building-toolkit",
  },
}

export default function DigitalDownloadCTA({
  variant = "party",
  compact = false,
}: DigitalDownloadCTAProps) {
  const copy = ctaCopy[variant]

  return (
    <aside className="rounded-lg border border-rage-500/30 bg-[#181818] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
            <ClipboardCheck className="h-5 w-5 text-rage-500" />
          </div>
          <div>
            {copy.eyebrow && (
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-rage-500">
                {copy.eyebrow}
              </p>
            )}
            <h2 className="text-base font-bold uppercase tracking-wide text-white">
              {copy.title}
            </h2>
            <p className={`mt-1 text-sm text-zinc-300 ${compact ? "max-w-2xl" : ""}`}>
              {copy.copy}
            </p>
          </div>
        </div>
        <Link
          href={copy.href}
          className="btn-rage inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap text-sm uppercase tracking-wider"
        >
          {copy.button}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  )
}
