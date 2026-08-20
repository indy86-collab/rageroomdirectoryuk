"use client"

import { useState } from "react"
import Link from "next/link"
import type { Listing, ListingActivity } from "@/types/listing"
import ListingsGrid from "./ListingsGrid"
import ListingFilters from "./ListingFilters"
import VenueCompareTable from "./VenueCompareTable"
import { trackCompareSelected } from "@/lib/analytics"

interface ListingsPageClientProps {
  initialListings: Listing[]
  discoveryContext?: {
    surface: "activity" | "occasion" | "directory"
    slug?: string
    activity?: ListingActivity
  }
  showActivities?: boolean
  showOccasions?: boolean
  resultsLabel?: string
}

export default function ListingsPageClient({
  initialListings,
  discoveryContext = { surface: "directory" },
  showActivities = true,
  showOccasions = true,
  resultsLabel = "venues",
}: ListingsPageClientProps) {
  const [filteredListings, setFilteredListings] = useState<Listing[]>(initialListings)
  const [compareListings, setCompareListings] = useState<Listing[]>([])

  const toggleCompare = (listing: Listing) => {
    setCompareListings((current) => {
      if (current.some((item) => item.id === listing.id)) {
        const next = current.filter((item) => item.id !== listing.id)
        trackCompareSelected({
          surface: discoveryContext.surface,
          sourceSlug: discoveryContext.slug,
          listingSlug: listing.slug || listing.id,
          selected: false,
          compareCount: next.length,
        })
        return next
      }
      if (current.length >= 3) return current
      const next = [...current, listing]
      trackCompareSelected({
        surface: discoveryContext.surface,
        sourceSlug: discoveryContext.slug,
        listingSlug: listing.slug || listing.id,
        selected: true,
        compareCount: next.length,
      })
      return next
    })
  }

  return (
    <>
      <div id="venues" className="scroll-mt-24 grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ListingFilters
            listings={initialListings}
            onFiltered={setFilteredListings}
            showActivities={showActivities}
            showOccasions={showOccasions}
            discoveryContext={discoveryContext}
          />
        </div>
        <div className="lg:col-span-3">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-400">
              {filteredListings.length} {filteredListings.length === 1 ? "venue" : resultsLabel} found
            </p>
            {compareListings.length > 0 && (
              <button
                type="button"
                onClick={() => setCompareListings([])}
                className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
              >
                Clear comparison ({compareListings.length}/3)
              </button>
            )}
          </div>
          <VenueCompareTable listings={compareListings} />
          <section aria-label="Filtered rage rooms">
            <ListingsGrid
              listings={filteredListings}
              compareIds={new Set(compareListings.map((listing) => listing.id))}
              onCompareToggle={toggleCompare}
              discoveryContext={discoveryContext}
              emptyState={
                <div className="rounded-lg border border-zinc-800 bg-[#181818] p-6 text-center sm:p-8">
                  <h3 className="text-xl font-bold text-white">No verified match for these filters</h3>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
                    We don&apos;t currently have a verified venue matching every selected filter. Clear or widen the location filters, or explore the full rage-room directory.
                  </p>
                  <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link href="/listings" className="inline-flex min-h-11 items-center justify-center rounded-md bg-rage-500 px-4 py-2 text-sm font-bold text-white hover:bg-rage-600">
                      Find nearby rage rooms
                    </Link>
                    <Link href="/activities" className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-200 hover:border-zinc-500">
                      Explore related activities
                    </Link>
                  </div>
                </div>
              }
            />
          </section>
        </div>
      </div>
    </>
  )
}

