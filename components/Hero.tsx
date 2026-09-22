"use client"

import Image from "next/image"
import Link from "next/link"
import HomeSearchBox from "./HomeSearchBox"
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react"

export default function Hero() {
  return (
    <section className="site-container pt-5 sm:pt-8 pb-8 sm:pb-12">
      <div className="relative isolate rounded-2xl border border-zinc-800 bg-[#20201e]">
        <Image src="/images/hero/rage.jpg" alt="Person in protective gear enjoying a rage room experience" fill priority sizes="(max-width: 1280px) 100vw, 1216px" className="rounded-2xl object-cover object-[65%_center]" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-black/90 via-black/70 to-black/15" aria-hidden="true" />
        <div className="relative max-w-3xl px-5 py-10 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          <p className="eyebrow mb-4">A different kind of day out</p>
          <h1 className="font-display text-5xl leading-[1] text-white sm:text-7xl lg:text-8xl">Find a rage room<br /><span className="text-rage-400">near you.</span></h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-200 sm:text-lg">Find rage rooms across the UK. Compare the price, the experience and the journey—then book with the venue.</p>
          <div className="mt-7"><HomeSearchBox id="hero-search" label="Enter city or postcode" buttonLabel="Find Rage Rooms" /></div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/near-me" className="inline-flex min-h-11 items-center gap-2 font-semibold text-white hover:text-rage-300"><MapPin className="h-4 w-4" />Find rooms near me</Link>
            <Link href="/find" className="inline-flex min-h-11 items-center gap-2 text-zinc-200 hover:text-white">Planning for a group?<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-300">
        <p className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-rage-400" />Venue details checked against published sources</p>
        <Link href="/editorial-policy" className="inline-flex min-h-11 items-center text-rage-300 underline underline-offset-4">How we check listings</Link>
      </div>
    </section>
  )
}
