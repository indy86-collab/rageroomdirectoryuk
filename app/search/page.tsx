import { Metadata } from "next"
import ListingsGrid from "@/components/ListingsGrid"
import HomeSearchBox from "@/components/HomeSearchBox"

interface SearchPageProps {
  searchParams: { query?: string }
}

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = searchParams.query

  return {
    title: query ? `Search: ${query}` : "Search Rage Rooms",
    description: query
      ? `Search results for "${query}" - Find rage rooms and smash rooms matching your search.`
      : "Search for rage rooms and smash rooms across the UK. Find venues by city, postcode, or name.",
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.query
  // Lazy load to prevent build-time initialization
  const { searchListings } = await import("@/lib/listings")
  const listings = await searchListings(query)

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
          {query ? `Search results for "${query}"` : "Search Rage Rooms"}
        </h1>

        {!query && (
          <p className="text-base sm:text-lg text-zinc-300 mb-6">
            Search our UK directory by venue name, city, or postcode to find rage rooms near you.
            You can also browse the full directory from our{" "}
            <a href="/listings" className="text-orange-500 hover:text-orange-600 underline">all listings</a>{" "}
            page or explore by{" "}
            <a href="/near-me" className="text-orange-500 hover:text-orange-600 underline">location</a>.
          </p>
        )}

        {query && (
          <p className="text-sm text-zinc-400 mb-4">
            {listings.length} {listings.length === 1 ? "result" : "results"} found for &ldquo;{query}&rdquo;
          </p>
        )}

        <div className="mb-8">
          <HomeSearchBox />
        </div>

        <section aria-label={query ? `Search results for ${query}` : "All rage rooms"}>
          <ListingsGrid listings={listings} />
        </section>
      </div>
    </div>
  )
}
