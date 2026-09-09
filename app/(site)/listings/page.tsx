import { orderDiscoveryListings } from "@/lib/discovery-order"
import HomeSearchBox from "@/components/HomeSearchBox"
import { Metadata } from "next"
import ListingsPageClient from "@/components/ListingsPageClient"
import UGCButtons from "@/components/UGCButtons"
import Link from "next/link"
import { listingUrl } from "@/lib/site-url"

export function generateMetadata({
  searchParams = {},
}: {
  searchParams?: Record<string, string | string[] | undefined>
}): Metadata {
  return {
    title: "UK Rage Rooms & Destructive Experiences — Complete Directory",
    description: "Browse verified UK rage rooms and closely related destructive experiences. Compare activities, cities, published prices and booking options.",
    alternates: { canonical: "/listings" },
    ...(Object.keys(searchParams).length > 0
      ? { robots: { index: false, follow: true } }
      : {}),
  }
}

export const revalidate = 3600

export default async function AllListingsPage() {
  const { searchListings, getDistinctCities, getDistinctRegions, getListingsByRegion } =
    await import("@/lib/listings")
  const { cityToSlug, regionToSlug } = await import("@/lib/location")
  const listings = await searchListings(undefined)
  const cities = await getDistinctCities()
  const regions = await getDistinctRegions()
  const regionCounts = await Promise.all(
    regions.map(async (region) => ({
      region,
      count: (await getListingsByRegion(region)).length,
    }))
  )
  const topRegions = regionCounts
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "UK Rage Rooms & Destructive Experiences",
    description: "Complete verified directory of rage rooms and closely related destructive experiences across the UK",
    numberOfItems: listings.length,
    itemListElement: listings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": listing.locationType === "mobile-service" ? "Organization" : "LocalBusiness",
        name: listing.name,
        url: listingUrl(listing.slug || listing.id),
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
          UK Rage Rooms & Destructive Experiences
        </h1>

        <p className="mb-6 max-w-2xl text-zinc-300">Find your next day out. Compare rage rooms and related activities by location, price and who’s coming.</p>
        <div className="mb-8"><HomeSearchBox /></div>
        <ListingsPageClient initialListings={orderDiscoveryListings(listings)} />
        <details className="mt-10 rounded-xl border border-zinc-800 p-5">
          <summary className="cursor-pointer font-semibold text-zinc-200">Browse all cities and regions</summary>
          <div className="mt-5">
        {/* Browse by city */}
        {cities.length > 1 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-3">Browse by City</h2>
            <div className="flex flex-wrap gap-2">
              {cities.sort().map(city => (
                <Link
                  key={city}
                  href={`/city/${cityToSlug(city)}`}
                  className="inline-flex min-h-11 items-center px-3 py-2 bg-[#181818] border border-zinc-700 rounded-full text-sm text-zinc-300 hover:text-orange-500 hover:border-orange-500/50 transition-colors"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        )}

        {topRegions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-3">Browse by Region</h2>
            <div className="flex flex-wrap gap-2">
              {topRegions.map(({ region, count }) => (
                <Link
                  key={region}
                  href={`/region/${regionToSlug(region)}`}
                  className="inline-flex min-h-11 items-center px-3 py-2 bg-[#181818] border border-zinc-700 rounded-full text-sm text-zinc-300 hover:text-orange-500 hover:border-orange-500/50 transition-colors"
                >
                  {region} ({count})
                </Link>
              ))}
            </div>
          </div>
        )}

          </div>
        </details>

        {/* Useful guides */}
        <div className="mt-10 bg-[#181818] rounded-lg border border-zinc-800 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-white mb-3">New to Rage Rooms?</h2>
          <p className="text-zinc-300 mb-4 text-sm">
            If you're considering booking your first session, these guides cover everything you need to know — from what to wear, to how much it costs, to what actually happens inside a rage room.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/guides/what-happens-in-a-rage-room"
              className="text-sm text-orange-500 hover:text-orange-600 underline"
            >
              What Happens in a Rage Room
            </Link>
            <span className="text-zinc-600">|</span>
            <Link
              href="/guides/how-much-do-rage-rooms-cost-uk"
              className="text-sm text-orange-500 hover:text-orange-600 underline"
            >
              UK Pricing Guide
            </Link>
            <span className="text-zinc-600">|</span>
            <Link
              href="/guides/are-rage-rooms-safe-uk"
              className="text-sm text-orange-500 hover:text-orange-600 underline"
            >
              Safety Guide
            </Link>
            <span className="text-zinc-600">|</span>
            <Link
              href="/guides/best-rage-rooms-for-couples"
              className="text-sm text-orange-500 hover:text-orange-600 underline"
            >
              Couples Guide
            </Link>
            <span className="text-zinc-600">|</span>
            <Link
              href="/guides/best-rage-rooms-for-team-building"
              className="text-sm text-orange-500 hover:text-orange-600 underline"
            >
              Team Building Guide
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <UGCButtons />
        </div>
      </div>
    </div>
  )
}
