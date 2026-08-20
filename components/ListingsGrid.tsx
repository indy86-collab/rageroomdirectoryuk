import type { Listing } from "@/types/listing"
import ListingCard from "./ListingCard"
import type { ListingDiscoveryContext } from "./ListingCard"

interface ListingsGridProps {
  listings: Listing[]
  compareIds?: Set<string>
  onCompareToggle?: (listing: Listing) => void
  discoveryContext?: ListingDiscoveryContext
  comparisonActive?: boolean
  emptyState?: React.ReactNode
}

export default function ListingsGrid({ listings, compareIds, onCompareToggle, discoveryContext, comparisonActive, emptyState }: ListingsGridProps) {
  if (listings.length === 0) {
    if (emptyState) return <>{emptyState}</>
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">
          No rage rooms found for your search.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          compareSelected={compareIds?.has(listing.id)}
          compareDisabled={Boolean(compareIds && compareIds.size >= 3)}
          comparisonActive={comparisonActive}
          onCompareToggle={onCompareToggle}
          discoveryContext={discoveryContext}
        />
      ))}
    </div>
  )
}
