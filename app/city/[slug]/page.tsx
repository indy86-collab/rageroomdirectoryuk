import { Metadata } from "next"
import { slugToCity, cityToSlug } from "@/lib/location"
import { getCityContent, getGenericCityContent } from "@/lib/city-content"
import ListingsGrid from "@/components/ListingsGrid"
import Breadcrumbs from "@/components/Breadcrumbs"
import FAQ from "@/components/FAQ"
import { getCityFAQs } from "@/lib/faqs"
import UGCButtons from "@/components/UGCButtons"
import AdsenseInContent from "@/components/ads/AdsenseInContent"
import Link from "next/link"

interface CityPageProps {
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const cityName = slugToCity(params.slug)
  const { getListingsByCity } = await import("@/lib/listings")
  const listings = await getListingsByCity(cityName)
  const count = listings.length
  
  return {
    title: `Rage Rooms in ${cityName} — ${count} ${count === 1 ? "Venue" : "Venues"} Listed`,
    description: `Find rage rooms in ${cityName}. Compare ${count} ${count === 1 ? "venue" : "venues"}, view starting prices, read reviews, and book a destruction therapy session near you.`,
    alternates: { canonical: `/city/${cityToSlug(cityName)}` },
    openGraph: {
      title: `Rage Rooms in ${cityName} | RageRoom Directory`,
      description: `Browse ${count} rage ${count === 1 ? "room" : "rooms"} in ${cityName}. Compare venues, prices, and reviews.`,
      type: "website",
    },
  }
}

export const revalidate = 3600
export const dynamicParams = true

export default async function CityPage({ params }: CityPageProps) {
  const cityName = slugToCity(params.slug)
  const { getListingsByCity } = await import("@/lib/listings")
  const listings = await getListingsByCity(cityName)

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Rage Rooms in ${cityName}`,
    description: `Directory of rage rooms and smash rooms in ${cityName}`,
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

  const cityFAQs = getCityFAQs(cityName)
  const cityContent = getCityContent(cityName) || getGenericCityContent(cityName, listings.length)

  const priceRange = listings.filter(l => l.price).map(l => l.price!)
  const minPrice = priceRange.length > 0 ? Math.min(...priceRange) : null
  const maxPrice = priceRange.length > 0 ? Math.max(...priceRange) : null

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "All Rage Rooms", href: "/listings" },
            { label: cityName },
          ]}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />

        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
          Rage Rooms in {cityName}
        </h1>

        {/* Unique city-specific intro; ad after first paragraph only. */}
        <div className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <p>{cityContent.intro}</p>
          <AdsenseInContent />
          <p>{cityContent.localContext}</p>
        </div>

        {/* Quick stats bar */}
        {listings.length > 0 && (
          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-4 mb-6 flex flex-wrap gap-4 sm:gap-8">
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-wider">Venues Listed</p>
              <p className="text-white text-xl font-bold">{listings.length}</p>
            </div>
            {minPrice !== null && (
              <div>
                <p className="text-zinc-400 text-xs uppercase tracking-wider">Starting From</p>
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
        )}
        
        {listings.length > 0 ? (
          <>
            <section aria-label={`Rage rooms in ${cityName}`}>
              <ListingsGrid listings={listings} />
            </section>
            
            {/* Travel tip */}
            <div className="mt-8 mb-6">
              <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-white mb-2">Getting There</h2>
                <p className="text-base text-zinc-300">
                  {cityContent.travelTip}
                </p>
              </div>
            </div>

            {/* Cross-links */}
            <div className="mt-4 mb-6 flex flex-wrap gap-3">
              <Link
                href="/listings"
                className="text-sm text-orange-500 hover:text-orange-600 underline"
              >
                Browse All UK Rage Rooms
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
                href="/guides/what-happens-in-a-rage-room"
                className="text-sm text-orange-500 hover:text-orange-600 underline"
              >
                First Time Guide
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-8 text-center">
            <p className="text-xl text-white mb-4">
              No rage rooms found in {cityName} yet
            </p>
            <p className="text-zinc-400 mb-6">
              We're always adding new rage rooms to our directory. Check back soon, or explore rage rooms in other cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors text-center"
              >
                Browse All Rage Rooms
              </Link>
              <Link
                href="/list-your-rage-room"
                className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-zinc-700 font-semibold px-6 py-3 rounded-md transition-colors text-center"
              >
                List Your Rage Room
              </Link>
            </div>
          </div>
        )}

        <FAQ items={cityFAQs} title={`Frequently Asked Questions About Rage Rooms in ${cityName}`} />

        <div className="mt-12">
          <UGCButtons />
        </div>
      </div>
    </div>
  )
}
