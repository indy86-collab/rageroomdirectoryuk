"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { trackRageReset } from "@/lib/rage-reset/analytics"

export default function RageResetHomeFeature() {
  return (
    <section
      aria-labelledby="rage-reset-home-heading"
      className="w-full border-y border-rage-500/25 bg-gradient-to-b from-[#1a1008] to-[#0a0a0a]"
    >
      <div className="w-full px-3 py-8 sm:px-5 sm:py-10 lg:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-3 h-1 w-16 rounded-full bg-rage-500" aria-hidden />
            <h2
              id="rage-reset-home-heading"
              className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl"
            >
              Rage Reset is live
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              A free three-minute mobile game where you smash cartoon objects, control your
              strikes and complete a final reset challenge.
            </p>
            <Link
              href="/rage-reset?src=homepage&utm_source=homepage&utm_medium=organic&utm_campaign=rage_reset_pvr"
              onClick={() =>
                trackRageReset("rage_reset_discovery_clicked", {
                  surface: "homepage",
                  cta_destination: "rage_reset",
                })
              }
              className="btn-rage mt-5 inline-flex min-h-[48px] items-center gap-2 px-6 text-sm uppercase tracking-wider"
            >
              Play free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-xs text-zinc-500">
              For entertainment only. Not therapy or medical treatment.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-teal-500/25 bg-[#0B1220] shadow-[0_0_40px_rgba(249,115,22,0.12)] ring-1 ring-orange-500/10">
            <Image
              src="/rage-reset/art/office/background/office-meltdown-hero.jpg"
              alt="Office Meltdown — stylised office room with The Unbreakable Printer ready to smash"
              width={1280}
              height={853}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 512px"
              priority={false}
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/35 via-transparent to-teal-500/5"
              aria-hidden
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-teal-500/30 bg-[rgba(11,18,32,0.85)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-400 backdrop-blur-sm">
              Office Meltdown
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
