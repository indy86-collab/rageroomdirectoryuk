import { Metadata } from "next"
import Link from "next/link"
import ListingsPageClient from "@/components/ListingsPageClient"
import HomeSearchBox from "@/components/HomeSearchBox"
import { orderDiscoveryListings } from "@/lib/discovery-order"

interface SearchPageProps { searchParams: { query?: string } }
export const dynamic = "force-dynamic"
export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  return { title: searchParams.query ? `Search: ${searchParams.query}` : "Search Rage Rooms", description: "Find UK rage rooms by town, postcode or venue name. Compare prices and booking options.", alternates: { canonical: "/search" }, robots: { index: false, follow: true } }
}
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.query?.trim() || ""
  const { searchListings } = await import("@/lib/listings")
  const listings = orderDiscoveryListings(await searchListings(query), query)
  return <div className="site-container py-8 sm:py-10">
    <h1 className="mb-3 break-words text-3xl font-bold sm:text-4xl">{query ? `Search results for "${query}"` : "Find your rage room"}</h1>
    <p className="mb-5 max-w-2xl text-zinc-300">Compare rage rooms first, then explore related activities. Narrow your choices by price, age and group size.</p>
    <div className="mb-8"><HomeSearchBox key={query} initialQuery={query} /></div>
    <section aria-label={query ? `Search results for ${query}` : "All rage rooms"}>
      <ListingsPageClient key={query} initialListings={listings} />
    </section>
    <p className="mt-8 text-sm text-zinc-400">Looking a little further afield? <Link href="/near-me" className="text-rage-300 underline">Find venues near a postcode</Link>.</p>
  </div>
}
