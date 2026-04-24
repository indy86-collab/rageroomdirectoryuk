"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

/**
 * Tiny client-side search form for the 404 page. Submitting routes to
 * `/search?query=...` which is where our real search logic lives.
 */
export default function NotFoundSearch() {
  const router = useRouter()
  const [q, setQ] = useState("")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const query = q.trim()
    router.push(query ? `/search?query=${encodeURIComponent(query)}` : "/search")
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row gap-2 items-stretch"
      role="search"
    >
      <label htmlFor="nf-search" className="sr-only">
        Search rage rooms
      </label>
      <input
        id="nf-search"
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="e.g. London, SW1, Smash Factory"
        className="flex-1 bg-dark-900/80 border border-zinc-700 rounded-md px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 text-sm sm:text-base"
      />
      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-md transition-colors"
      >
        Search
      </button>
    </form>
  )
}
