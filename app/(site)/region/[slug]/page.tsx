import { notFound } from "next/navigation"
import { Metadata } from "next"
import { slugToRegion, cityToSlug } from "@/lib/location"
import { getRegionContent, getGenericRegionContent } from "@/lib/region-content"
import ListingsGrid from "@/components/ListingsGrid"
import Breadcrumbs from "@/components/Breadcrumbs"
import UGCButtons from "@/components/UGCButtons"
import Link from "next/link"
import { listingUrl } from "@/lib/site-url"

interface RegionPageProps {
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: RegionPageProps): Promise<Metadata> {
  const regionName = slugToRegion(params.slug)
  const { getListingsByRegion } = await import("@/lib/listings")
  const listings = await getListingsByRegion(regionName)
  const count = listings.length
  const rageRoomCount = listings.filter((listing) => listing.activities.includes("rage-room")).length
  
  return {
    title: `Rage Rooms & Destructive Experiences in ${regionName} — ${count} ${count === 1 ? "Venue" : "Venues"}`,
    description: `Browse ${count} verified ${count === 1 ? "venue" : "venues"} in ${regionName}${rageRoomCount ? `, including ${rageRoomCount} ${rageRoomCount === 1 ? "rage room" : "rage rooms"}` : ""}. Compare activities, prices and booking options.`,
    alternates: { canonical: `/region/${params.slug}` },
    openGraph: {
      title: `Rage Rooms & Destructive Experiences in ${regionName}`,
      description: `Discover ${count} verified ${count === 1 ? "venue" : "venues"} in ${regionName}. Compare activities and prices.`,
      type: "website",
    },
  }
}

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const { getDistinctRegions } = await import("@/lib/listings")
  const { regionToSlug } = await import("@/lib/location")
  const regions = await getDistinctRegions()
  return regions.map((region) => ({ slug: regionToSlug(region) }))
}

export default async function RegionPage({ params }: RegionPageProps) {
  const regionName = slugToRegion(params.slug)
  const { getListingsByRegion } = await import("@/lib/listings")
  const listings = await getListingsByRegion(regionName)

  if (listings.length === 0) {
    notFound()
  }

  const regionContent = getRegionContent(regionName) || getGenericRegionContent(regionName, listings.length)
  const hasStandaloneVenue = listings.some((listing) => !listing.activities.includes("rage-room"))
  const hasRageRoom = listings.some((listing) => listing.activities.includes("rage-room"))

  const citiesInRegion = [...new Set(listings.map(l => l.city))].sort()

  const priceRange = listings.filter(l => l.price).map(l => l.price!)
  const minPrice = priceRange.length > 0 ? Math.min(...priceRange) : null
  const maxPrice = priceRange.length > 0 ? Math.max(...priceRange) : null

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Rage Rooms & Destructive Experiences in ${regionName}`,
    description: `Verified directory of rage rooms and closely related destructive experiences in ${regionName}`,
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
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "All Venues", href: "/listings" },
            { label: regionName },
          ]}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />

        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
          Rage Rooms & Destructive Experiences in {regionName}
        </h1>

        <div className="text-base sm:text-lg text-zinc-300 mb-6 space-y-3">
          {hasStandaloneVenue ? (
            <p>Browse verified rage rooms and closely related destructive or adrenaline experiences across {regionName}. Standalone activity specialists are included only when their published offering matches a supported category.</p>
          ) : (
            <><p>{regionContent.description}</p><p>{regionContent.coverageNote}</p></>
          )}
        </div>

        {/* Stats bar */}
        <div className="bg-[#181818] rounded-lg border border-zinc-800 p-4 mb-6 flex flex-wrap gap-4 sm:gap-8">
          <div>
            <p className="text-zinc-400 text-xs uppercase tracking-wider">Venues</p>
            <p className="text-white text-xl font-bold">{listings.length}</p>
          </div>
          <div>
            <p className="text-zinc-400 text-xs uppercase tracking-wider">Cities</p>
            <p className="text-white text-xl font-bold">{citiesInRegion.length}</p>
          </div>
          {minPrice !== null && (
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-wider">From</p>
              <p className="text-orange-500 text-xl font-bold">£{minPrice.toFixed(0)}</p>
            </div>
          )}
          {maxPrice !== null && minPrice !== maxPrice && (
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-wider">Up To</p>
              <p className="text-orange-500 text-xl font-bold">£{maxPrice.toFixed(0)}</p>
            </div>
          )}
        </div>

        {/* Cities in this region */}
        {citiesInRegion.length > 1 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-3">
              Cities in {regionName} with Verified Venues
            </h2>
            <div className="flex flex-wrap gap-2">
              {citiesInRegion.map(city => (
                <Link
                  key={city}
                  href={`/city/${cityToSlug(city)}`}
                  className="px-3 py-1.5 bg-[#181818] border border-zinc-700 rounded-full text-sm text-zinc-300 hover:text-orange-500 hover:border-orange-500/50 transition-colors"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        )}

        <section aria-label={`Verified venues in ${regionName}`}>
          <ListingsGrid listings={listings} />
        </section>

        {/* Cross-links */}
        <div className="mt-8 mb-6 flex flex-wrap gap-3">
          <Link
            href="/listings"
            className="text-sm text-orange-500 hover:text-orange-600 underline"
          >
            Browse All UK Venues
          </Link>
          {hasRageRoom && (
            <>
              <span className="text-zinc-600">|</span>
              <Link
                href="/guides/how-much-do-rage-rooms-cost-uk"
                className="text-sm text-orange-500 hover:text-orange-600 underline"
              >
                Rage Room Pricing Guide
              </Link>
              <span className="text-zinc-600">|</span>
              <Link
                href="/guides/are-rage-rooms-safe-uk"
                className="text-sm text-orange-500 hover:text-orange-600 underline"
              >
                Rage Room Safety Guide
              </Link>
            </>
          )}
        </div>

        <div className="mt-8">
          <UGCButtons />
        </div>
      </div>
    </div>
  )
}
