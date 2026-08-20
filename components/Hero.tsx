"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, Shield, Star, Users, MapPin } from "lucide-react"
import type { Listing } from "@/types/listing"
import FeaturedRooms from "./FeaturedRooms"

interface HeroProps {
  featuredListings?: Listing[]
}

export default function Hero({ featuredListings = [] }: HeroProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/search?query=${encodeURIComponent(q)}` : "/search")
  }

  const sidebarListings = featuredListings.slice(0, 4)

  return (
    <section className="relative w-full pt-4 sm:pt-6 pb-8 sm:pb-12">
      <div className="w-full px-3 sm:px-5 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-4 lg:gap-5">
          {/* Hero card: real rage-room photograph with dark overlay for copy legibility. */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 min-h-[300px] sm:min-h-[440px] lg:min-h-[520px] flex">
            <Image
              src="/images/hero/rage.jpg"
              alt="Person in safety gear smashing items inside a UK rage room"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-cover object-center"
            />
            {/* Left-to-right dark gradient so the headline + search stay readable over the photo. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/75 sm:bg-gradient-to-r sm:from-black/85 sm:via-black/55 sm:to-black/10"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
            />

            <div className="relative w-full flex flex-col justify-end sm:justify-center p-4 sm:p-10 lg:p-14">
              <h1 className="font-display text-[2.35rem] leading-[0.95] text-white uppercase tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                Find Rage Rooms{" "}
                <span className="text-rage-500">Across the UK.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm font-medium text-zinc-300 sm:mt-4 sm:text-lg lg:text-xl">
                Compare verified smash rooms, prices and booking links — then release your rage.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 max-w-xl sm:mt-8">
                <div className="flex flex-col overflow-hidden rounded-md border border-zinc-800 bg-dark-900/80 sm:flex-row sm:items-stretch">
                  <div className="relative min-w-0 flex-1">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <label htmlFor="hero-search" className="sr-only">
                      Enter city or postcode
                    </label>
                    <input
                      id="hero-search"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="City or postcode"
                      autoComplete="off"
                      enterKeyHint="search"
                      className="min-h-12 w-full bg-transparent py-3 pl-9 pr-3 text-base text-white placeholder:text-zinc-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="min-h-12 bg-rage-500 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-rage-600"
                  >
                    Find Rage Rooms
                  </button>
                </div>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400 sm:mt-6 sm:gap-x-5 sm:text-sm">
                <Link
                  href="/near-me"
                  className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-rage-400 transition-colors hover:text-rage-300"
                >
                  <MapPin className="w-4 h-4" />
                  Rage room near me — open map
                </Link>
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-rage-500" />
                  Verified Venues
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-rage-500" />
                  Top-rated UK smash rooms
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-rage-500" />
                  Groups & date nights welcome
                </span>
              </div>
            </div>
          </div>

          <aside className="card-base p-4 flex flex-col">
            <h2 className="section-title mb-3">Featured &amp; Verified Rage Rooms</h2>
            {sidebarListings.length > 0 ? (
              <FeaturedRooms listings={sidebarListings} variant="compact" />
            ) : (
              <p className="text-zinc-400 text-sm py-6 text-center">
                Featured venues are on their way.
              </p>
            )}

            <div className="mt-4 border-t border-zinc-800 pt-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-rage-500">
                Why Choose RRD?
              </h3>
              <ul className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs text-zinc-300">
                <li className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-rage-500 flex-shrink-0" />
                  Verified Reviews
                </li>
                <li className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-rage-500 flex-shrink-0" />
                  Lowest Prices
                </li>
                <li className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-rage-500 flex-shrink-0" />
                  Largest Network
                </li>
                <li className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rage-500 flex-shrink-0" />
                  Local Guides
                </li>
              </ul>
              <Link
                href="/listings"
                className="inline-flex items-center gap-1 text-xs font-semibold text-rage-500 hover:text-rage-400 transition-colors"
              >
                Browse all venues
                <Search className="w-3 h-3" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
