import type { Listing, ListingActivity } from "@/types/listing"
import ListingCard from "./ListingCard"

interface ListingsGridProps {
  listings: Listing[]
  compareIds?: Set<string>
  onCompareToggle?: (listing: Listing) => void
  discoveryContext?: {
    surface: "activity" | "occasion" | "directory"
    slug?: string
    activity?: ListingActivity
  }
  emptyState?: React.ReactNode
}

export default function ListingsGrid({ listings, compareIds, onCompareToggle, discoveryContext, emptyState }: ListingsGridProps) {
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
          onCompareToggle={onCompareToggle}
          discoveryContext={discoveryContext}
        />
      ))}
    </div>
  )
}


