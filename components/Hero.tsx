"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

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
    <section className="w-full bg-transparent py-8 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase leading-tight px-2">
          UNLEASH. DE-STRESS. DESTROY.
        </h1>

        {/* Sub-text */}
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#b3b3b3] px-2">
          Discover the best rage rooms and smash experiences across the UK.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 px-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="City or Postcode"
              className="w-full sm:flex-1 rounded-md bg-zinc-200 text-black px-4 py-3.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-zinc-500 text-base min-h-[44px]"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3.5 sm:py-3 rounded-md flex items-center justify-center gap-2 transition-colors w-full sm:w-auto min-h-[44px] text-base"
            >
              FIND YOUR RAGE
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>
        </div>
      </div>
    </section>
  )
}

