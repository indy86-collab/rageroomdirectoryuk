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
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 min-h-[360px] sm:min-h-[440px] lg:min-h-[520px] flex">
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
              className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
            />

            <div className="relative w-full flex flex-col justify-center p-6 sm:p-10 lg:p-14">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] text-white uppercase tracking-tight">
                Release Your <span className="text-rage-500">Rage.</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg lg:text-xl text-zinc-300 max-w-xl font-medium">
                Discover the UK&rsquo;s best smash rooms.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 max-w-xl">
                <div className="flex flex-col sm:flex-row items-stretch bg-dark-900/80 border border-zinc-800 rounded-md overflow-hidden">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <label htmlFor="hero-search" className="sr-only">
                      Enter City or Postcode
                    </label>
                    <input
                      id="hero-search"
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Enter City or Postcode (e.g. London, B1 2)"
                      className="w-full pl-9 pr-3 py-3 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none text-sm sm:text-base"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-rage-500 hover:bg-rage-600 text-white font-bold uppercase tracking-wider text-sm px-6 py-3 transition-colors whitespace-nowrap"
                  >
                    Find Rage Rooms
                  </button>
                </div>
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-zinc-400">
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
