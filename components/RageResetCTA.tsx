"use client"

import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { trackRageReset } from "@/lib/rage-reset/analytics"

type Surface = "guide" | "listing" | "homepage" | "nav" | "other"

export default function RageResetCTA({
  surface = "guide",
  compact = false,
  variant = "default",
}: {
  surface?: Surface
  compact?: boolean
  variant?: "default" | "secondary"
}) {
  const href = `/rage-reset?src=${surface}&utm_source=${surface}&utm_medium=organic&utm_campaign=rage_reset_pvr`
  const onClick = () => {
    trackRageReset("rage_reset_discovery_clicked", {
      surface,
      cta_destination: "rage_reset",
    })
  }

  if (variant === "secondary") {
    return (
      <aside className="rounded-lg border border-zinc-700/80 bg-[#141414] p-3 sm:p-4">
        <p className="text-sm text-zinc-300">
          Not ready to book? Try a three-minute{" "}
          <Link
            href={href}
            onClick={onClick}
            className="font-semibold text-rage-400 underline-offset-2 hover:underline"
          >
            Rage Reset
          </Link>
          .
        </p>
      </aside>
    )
  }

  return (
    <aside className="rounded-lg border border-rage-500/30 bg-[#181818] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
            <Zap className="h-5 w-5 text-rage-500" />
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-rage-500">
              Free game
            </p>
            <h2 className="text-base font-bold uppercase tracking-wide text-white">
              Need a quick reset?
            </h2>
            <p className={`mt-1 text-sm text-zinc-300 ${compact ? "max-w-2xl" : ""}`}>
              Smash virtual objects, slow things down and complete a three-minute Rage Reset.
              Entertainment only — not therapy.
            </p>
          </div>
        </div>
        <Link
          href={href}
          onClick={onClick}
          className="btn-rage inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap text-sm uppercase tracking-wider"
        >
          Play Rage Reset
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  )
}
