import { Listing } from "@prisma/client"
import ListingCard from "./ListingCard"

interface ListingsGridProps {
  listings: Listing[]
}

export default function ListingsGrid({ listings }: ListingsGridProps) {
  if (listings.length === 0) {
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
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}




