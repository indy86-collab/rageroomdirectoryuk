"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import type { Listing } from "@/types/listing"
import ListingsGrid from "./ListingsGrid"
import ListingFilters from "./ListingFilters"
import VenueCompareTable from "./VenueCompareTable"
import {
  getDirectorySourcePath,
  trackDirectoryEvent,
} from "@/lib/analytics"
import type { ListingDiscoveryContext } from "./ListingCard"

interface ListingsPageClientProps {
  initialListings: Listing[]
  discoveryContext?: ListingDiscoveryContext
  showActivities?: boolean
  showOccasions?: boolean
  resultsLabel?: string
}

export default function ListingsPageClient({
  initialListings,
  discoveryContext = { surface: "directory", pageType: "search_results" },
  showActivities = true,
  showOccasions = true,
  resultsLabel = "venues",
}: ListingsPageClientProps) {
  const [filteredListings, setFilteredListings] = useState<Listing[]>(initialListings)
  const [compareListings, setCompareListings] = useState<Listing[]>([])
  const comparisonWasOpen = useRef(false)

  useEffect(() => {
    const isOpen = compareListings.length >= 2
    if (isOpen && !comparisonWasOpen.current) {
      trackDirectoryEvent("compare_open", {
        venueCount: compareListings.length,
        sourcePageType: discoveryContext.pageType,
        sourcePath: getDirectorySourcePath(),
      })
    }
    comparisonWasOpen.current = isOpen
  }, [compareListings.length, discoveryContext.pageType])

  const toggleCompare = (listing: Listing) => {
    if (compareListings.some((item) => item.id === listing.id)) {
      trackDirectoryEvent("compare_remove", {
        venueSlug: listing.slug || listing.id,
        sourcePageType: discoveryContext.pageType,
        sourcePath: getDirectorySourcePath(),
      })
      setCompareListings((current) => current.filter((item) => item.id !== listing.id))
      return
    }
    if (compareListings.length >= 3) return
    trackDirectoryEvent("compare_add", {
      venueSlug: listing.slug || listing.id,
      sourcePageType: discoveryContext.pageType,
      sourcePath: getDirectorySourcePath(),
    })
    setCompareListings((current) => [...current, listing])
  }

  const clearComparison = () => {
    for (const listing of compareListings) {
      trackDirectoryEvent("compare_remove", {
        venueSlug: listing.slug || listing.id,
        sourcePageType: discoveryContext.pageType,
        sourcePath: getDirectorySourcePath(),
      })
    }
    setCompareListings([])
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
                onClick={clearComparison}
                className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
              >
                Clear comparison ({compareListings.length}/3)
              </button>
            )}
          </div>
          <VenueCompareTable listings={compareListings} />
          <section aria-label="Filtered venues">
            <ListingsGrid
              listings={filteredListings}
              compareIds={new Set(compareListings.map((listing) => listing.id))}
              onCompareToggle={toggleCompare}
              discoveryContext={discoveryContext}
              comparisonActive={compareListings.length >= 2}
              emptyState={
                <div className="rounded-lg border border-zinc-800 bg-[#181818] p-6 text-center sm:p-8">
                  <h3 className="text-xl font-bold text-white">No verified match for these filters</h3>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
                    We don&apos;t currently have a verified venue matching every selected filter. Clear or widen the filters, or explore the full directory.
                  </p>
                  <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link href="/listings" className="inline-flex min-h-11 items-center justify-center rounded-md bg-rage-500 px-4 py-2 text-sm font-bold text-white hover:bg-rage-600">
                      Browse all venues
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
