"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, Zap } from "lucide-react"

export default function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`)
    } else {
      router.push("/search")
    }
  }

  return (
    <section className="relative w-full py-12 sm:py-20 overflow-hidden">
      {/* Background effects removed for performance */}
      
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Impact badge - Simplified */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800 border border-rage-600 rounded-full">
            <Zap className="w-4 h-4 text-rage-500" fill="currentColor" />
            <span className="text-sm font-semibold text-rage-400">UK's Leading Rage Room Directory</span>
          </div>
          
          {/* Main headline with gradient */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold uppercase leading-tight">
            <span className="block text-gradient text-glow">
              UNLEASH.
            </span>
            <span className="block text-white text-impact">
              DE-STRESS.
            </span>
            <span className="block text-gradient text-glow">
              DESTROY.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto font-medium">
            Discover the best <span className="text-rage-400 font-semibold">rage rooms</span> and <span className="text-rage-400 font-semibold">smash experiences</span> across the UK.
          </p>

          {/* Search bar - Simplified for performance */}
          <form onSubmit={handleSubmit} className="mt-8 sm:mt-10">
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 p-2 bg-dark-800 border border-zinc-800 rounded-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter city or postcode..."
                    className="w-full pl-12 pr-4 py-4 bg-dark-700 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-rage-500 focus:border-transparent transition-colors duration-150 text-base font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-rage uppercase font-bold text-base tracking-wide whitespace-nowrap px-8 py-4 rounded-xl sm:rounded-xl"
                >
                  Find Your Rage
                </button>
              </div>
            </div>
          </form>

          {/* Quick stats - Removed animations for performance */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-rage-500 rounded-full"></div>
              <span className="text-zinc-400">
                <span className="text-white font-bold">30+</span> Locations
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-rage-500 rounded-full"></div>
              <span className="text-zinc-400">
                <span className="text-white font-bold">1000+</span> Sessions Booked
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-rage-500 rounded-full"></div>
              <span className="text-zinc-400">
                <span className="text-white font-bold">100%</span> Stress Free
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

