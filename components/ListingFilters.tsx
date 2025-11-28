"use client"

import { useState, useEffect } from "react"
import { Listing } from "@prisma/client"

interface ListingFiltersProps {
  listings: Listing[]
  onFiltered: (filtered: Listing[]) => void
}

export default function ListingFilters({ listings, onFiltered }: ListingFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name" | "newest">("newest")

  // Calculate price range from listings
  const prices = listings
    .map((l) => l.price)
    .filter((p): p is number => p !== null && p !== undefined)
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 100

  useEffect(() => {
    let filtered = [...listings]

    // Filter by verified
    if (verifiedOnly) {
      filtered = filtered.filter((l) => l.verified)
    }

    // Filter by price range
    if (priceRange) {
      filtered = filtered.filter((l) => {
        if (!l.price) return false
        return l.price >= priceRange[0] && l.price <= priceRange[1]
      })
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (a.price || 0) - (b.price || 0)
        case "price-desc":
          return (b.price || 0) - (a.price || 0)
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

    onFiltered(filtered)
  }, [listings, priceRange, verifiedOnly, sortBy, onFiltered])

  return (
    <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Filters</h2>
      
      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Price Range: £{priceRange ? priceRange[0].toFixed(0) : minPrice.toFixed(0)} - £{priceRange ? priceRange[1].toFixed(0) : maxPrice.toFixed(0)}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange?.[0] ?? minPrice}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange?.[1] ?? maxPrice])}
              className="flex-1"
            />
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange?.[1] ?? maxPrice}
              onChange={(e) => setPriceRange([priceRange?.[0] ?? minPrice, Number(e.target.value)])}
              className="flex-1"
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-400 mt-1">
            <span>£{minPrice.toFixed(0)}</span>
            <span>£{maxPrice.toFixed(0)}</span>
          </div>
        </div>

        {/* Verified Only */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="verified-only"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="w-4 h-4 text-orange-500 bg-zinc-800 border-zinc-600 rounded focus:ring-orange-500"
          />
          <label htmlFor="verified-only" className="text-white cursor-pointer">
            Verified venues only
          </label>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {/* Reset Filters */}
        <button
          onClick={() => {
            setPriceRange(null)
            setVerifiedOnly(false)
            setSortBy("newest")
          }}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
}

