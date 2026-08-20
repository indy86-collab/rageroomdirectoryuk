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

  const priceRange = listings.filter(l => l.price).map(l => l.price!)
  const minPrice = priceRange.length > 0 ? Math.min(...priceRange) : null
  const maxPrice = priceRange.length > 0 ? Math.max(...priceRange) : null
  const avgPrice = priceRange.length > 0 ? priceRange.reduce((a, b) => a + b, 0) / priceRange.length : null

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

        <div className="text-base sm:text-lg text-zinc-300 mb-6 space-y-3">
          <p>
            This is the complete RageRoom Directory: rage rooms remain at its core, alongside
            verified axe throwing, paint splatter, car smash and mobile smash experiences that fit
            the same high-energy proposition. Each activity shown on a listing is evidence-backed.
          </p>
          <p>
            We manually verify listings and update them regularly. If you spot anything out of
            date or know of a venue we've missed, you can let us know using the links at the
            bottom of this page.
          </p>
        </div>

        {/* Stats overview */}
        <div className="bg-[#181818] rounded-lg border border-zinc-800 p-4 mb-6 flex flex-wrap gap-4 sm:gap-8">
          <div>
            <p className="text-zinc-400 text-xs uppercase tracking-wider">Total Venues</p>
            <p className="text-white text-xl font-bold">{listings.length}</p>
          </div>
          <div>
            <p className="text-zinc-400 text-xs uppercase tracking-wider">Cities Covered</p>
            <p className="text-white text-xl font-bold">{cities.length}</p>
          </div>
          {minPrice !== null && (
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-wider">Cheapest From</p>
              <p className="text-orange-500 text-xl font-bold">£{minPrice.toFixed(0)}</p>
            </div>
          )}
          {avgPrice !== null && (
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-wider">Average Price</p>
              <p className="text-orange-500 text-xl font-bold">£{Math.round(avgPrice)}</p>
            </div>
          )}
        </div>

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

        <ListingsPageClient initialListings={listings} />

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
