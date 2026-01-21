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
    <section className="relative w-full py-16 sm:py-24 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 border border-primary-200 rounded-full">
            <Zap className="w-4 h-4 text-primary-600" fill="currentColor" />
            <span className="text-sm font-semibold text-primary-700">UK's Leading Rage Room Directory</span>
          </div>
          
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold uppercase leading-tight">
            <span className="block text-gray-900">
              Find Your Perfect
            </span>
            <span className="block text-gradient mt-2">
              Rage Room
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Discover and compare the best <span className="text-accent-600 font-semibold">rage rooms</span> and <span className="text-accent-600 font-semibold">smash experiences</span> across the UK.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 p-2 bg-white border border-gray-200 rounded-2xl shadow-soft-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter city or postcode..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-base font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-rage uppercase font-bold text-base tracking-wide whitespace-nowrap px-8 py-4 rounded-xl"
                >
                  Search Now
                </button>
              </div>
            </div>
          </form>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">
                <span className="text-gray-900 font-bold">30+</span> Locations
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <span className="text-gray-600">
                <span className="text-gray-900 font-bold">1000+</span> Sessions Booked
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
              <span className="text-gray-600">
                <span className="text-gray-900 font-bold">100%</span> Stress Free
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
