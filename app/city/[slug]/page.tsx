import { Metadata } from "next"
import { slugToCity, cityToSlug } from "@/lib/location"
import ListingsGrid from "@/components/ListingsGrid"
import Breadcrumbs from "@/components/Breadcrumbs"
import FAQ from "@/components/FAQ"
import { getCityFAQs } from "@/lib/faqs"
import UGCButtons from "@/components/UGCButtons"
import Link from "next/link"

interface CityPageProps {
  params: { slug: string }
}

// Disable static generation - we'll use dynamic rendering instead
// export async function generateStaticParams() {
//   const { getDistinctCities } = await import("@/lib/listings")
//   const { cityToSlug } = await import("@/lib/location")
//   
//   const cities = await getDistinctCities()
//   
//   return cities.map((city) => ({
//     slug: cityToSlug(city),
//   }))
// }

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const cityName = slugToCity(params.slug)
  // Lazy load to prevent build-time initialization
  const { getListingsByCity } = await import("@/lib/listings")
  const listings = await getListingsByCity(cityName)
  
  return {
    title: `Rage Rooms in ${cityName}`,
    description: `Browse rage rooms and smash rooms in ${cityName}, view prices, packages, opening hours and reviews. Find the best rage room experience near you.`,
    openGraph: {
      title: `Rage Rooms in ${cityName} | RageRoom Directory`,
      description: `Browse rage rooms and smash rooms in ${cityName}, view prices, packages, opening hours and reviews.`,
      type: "website",
    },
  }
}

// Mark this route as dynamic to prevent build-time data collection
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default async function CityPage({ params }: CityPageProps) {
  const cityName = slugToCity(params.slug)
  // Lazy load to prevent build-time initialization
  const { getListingsByCity } = await import("@/lib/listings")
  const listings = await getListingsByCity(cityName)

  // ItemList Schema for city page
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Rage Rooms in ${cityName}`,
    description: `List of rage rooms and smash rooms in ${cityName}`,
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

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
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
        <div className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <p>
            {cityName} offers a growing number of rage room and smash room experiences for stress relief, team building, and fun activities. These controlled environments provide a safe space to release tension by breaking items like glass bottles, ceramics, and electronics using provided tools and protective gear.
          </p>
          <p>
            Whether you're looking for a unique date night, corporate event, or simply need to let off steam, browse our directory of rage rooms in {cityName} to <Link href="/rage-room-prices-uk" className="text-orange-500 hover:text-orange-600 underline">compare prices and packages</Link>, and book your session. Popular with young adults, corporate groups, and anyone seeking an alternative stress-relief activity, rage rooms in {cityName} typically offer 30-minute sessions starting from around £25-30 per person.
          </p>
          <p>
            Each venue provides comprehensive safety equipment including coveralls, helmets, and safety glasses, along with a variety of smashing tools and breakable items. Most rage rooms in {cityName} require advance booking, especially for weekends and group sessions. <Link href="/listings" className="text-orange-500 hover:text-orange-600 underline">Browse all rage rooms</Link> across the UK or explore <Link href={`/city/${cityToSlug(cityName)}`} className="text-orange-500 hover:text-orange-600 underline">rage rooms in {cityName}</Link> specifically.
          </p>
        </div>
        
        {listings.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-sm text-zinc-400">
                {listings.length} {listings.length === 1 ? "rage room" : "rage rooms"} found in {cityName}
              </p>
            </div>
            <section aria-label={`Rage rooms in ${cityName}`}>
              <ListingsGrid listings={listings} />
            </section>
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

        {/* FAQ Section */}
        <FAQ items={cityFAQs} title={`Frequently Asked Questions About Rage Rooms in ${cityName}`} />

        {/* UGC Section */}
        <div className="mt-12">
          <UGCButtons />
        </div>
      </div>
    </div>
  )
}


