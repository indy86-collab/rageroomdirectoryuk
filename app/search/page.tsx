import { Metadata } from "next"
import { searchListings } from "@/lib/listings"
import ListingsGrid from "@/components/ListingsGrid"
import HomeSearchBox from "@/components/HomeSearchBox"

interface SearchPageProps {
  searchParams: { query?: string }
}

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
  const listings = await searchListings(query)

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6 text-white">
          {query ? `Search results for "${query}"` : "Browse rage rooms"}
        </h1>

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
