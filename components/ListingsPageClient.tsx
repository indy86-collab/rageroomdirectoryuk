"use client"

import { useState } from "react"
import { Listing } from "@prisma/client"
import ListingsGrid from "./ListingsGrid"
import ListingFilters from "./ListingFilters"

interface ListingsPageClientProps {
  initialListings: Listing[]
}

export default function ListingsPageClient({ initialListings }: ListingsPageClientProps) {
  const [filteredListings, setFilteredListings] = useState<Listing[]>(initialListings)

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <ListingFilters listings={initialListings} onFiltered={setFilteredListings} />
        </div>
        <div className="lg:col-span-3">
          <div className="mb-6">
            <p className="text-sm text-zinc-400">
              {filteredListings.length} {filteredListings.length === 1 ? "rage room" : "rage rooms"} found
            </p>
          </div>
          <section aria-label="Filtered rage rooms">
            <ListingsGrid listings={filteredListings} />
          </section>
        </div>
      </div>
    </>
  )
}


