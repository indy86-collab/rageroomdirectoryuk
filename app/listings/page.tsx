import { Metadata } from "next"
import ListingsGrid from "@/components/ListingsGrid"
import UGCButtons from "@/components/UGCButtons"

export const metadata: Metadata = {
  title: "All Rage Rooms",
  description: "Browse all rage rooms and smash rooms across the UK. Compare venues, prices, packages, opening hours and reviews to find the perfect rage room experience.",
}

// Mark this route as dynamic to prevent build-time data collection
export const dynamic = 'force-dynamic'

export default async function AllListingsPage() {
  // Lazy load to prevent build-time initialization
  const { searchListings } = await import("@/lib/listings")
  // Get all listings by searching with no query
  const listings = await searchListings(undefined)

  // ItemList Schema for listings page
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "All Rage Rooms in the UK",
    description: "Complete directory of rage rooms and smash rooms across the UK",
    numberOfItems: listings.length,
    itemListElement: listings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: listing.name,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"}/listing/${listing.slug || listing.id}`,
      },
    })),
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
          All Rage Rooms
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8">
          Browse our complete directory of rage rooms and smash rooms across the UK. Compare venues, read reviews, and find your perfect rage room experience.
        </p>
        
        <div className="mb-6">
          <p className="text-sm text-zinc-400">
            {listings.length} {listings.length === 1 ? "rage room" : "rage rooms"} found
          </p>
        </div>

        <section aria-label="All rage rooms in the UK">
          <ListingsGrid listings={listings} />
        </section>
        
        {/* UGC Section */}
        <div className="mt-12">
          <UGCButtons />
        </div>
      </div>
    </div>
  )
}

