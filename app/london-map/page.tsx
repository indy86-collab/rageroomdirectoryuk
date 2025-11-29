import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import NearMeMap from "@/components/NearMeMap"

export const metadata: Metadata = {
  title: "Rage Room London Map | Find All London Rage Rooms on Map",
  description: "Interactive map showing all rage rooms in London. Find locations, compare venues, and discover the best smash rooms in the capital.",
  openGraph: {
    title: "Rage Room London Map | Find All London Rage Rooms",
    description: "Interactive map of all rage rooms and smash rooms in London. Find venues near you.",
    type: "website",
  },
}

export const dynamic = 'force-dynamic'

export default async function LondonMapPage() {
  // Lazy load to prevent build-time initialization
  const { getListingsByCity } = await import("@/lib/listings")
  const listings = await getListingsByCity("London")

  // WebPage Schema
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Rage Room London Map",
    description: "Interactive map showing all rage rooms in London",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"}/london-map`,
  }

  // ItemList Schema for London venues
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Rage Rooms in London",
    description: "List of all rage rooms in London shown on map",
    numberOfItems: listings.length,
    itemListElement: listings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: listing.name,
        address: {
          "@type": "PostalAddress",
          addressLocality: listing.city,
          postalCode: listing.postcode,
          addressRegion: listing.region,
        },
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"}/listing/${listing.slug || listing.id}`,
        ...(listing.price && { priceRange: `£${listing.price.toFixed(0)}` }),
      },
    })),
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "London", href: "/city/london" },
            { label: "London Map" },
          ]}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />

        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
          Rage Room London Map
        </h1>

        <div className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <p>
            Find all rage rooms in London on our interactive map. Explore venues across the capital, compare locations, and discover the best smash rooms near you. Click on any venue to view details, prices, and book your session.
          </p>
          <p>
            London offers some of the UK's best rage room experiences, from central London locations to venues in outer boroughs. Use the map below to find venues by location, or browse our complete list of London rage rooms.
          </p>
        </div>

        {/* Interactive Map */}
        <section aria-labelledby="map-heading" className="mb-12">
          <h2 id="map-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Interactive Map of London Rage Rooms
          </h2>
          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4">
            <NearMeMap listings={listings} />
          </div>
        </section>

        {/* List of Venues */}
        {listings.length > 0 && (
          <section aria-labelledby="venues-heading" className="mb-12">
            <h2 id="venues-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
              All Rage Rooms in London
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => {
                const location = listing.location as { lat: number; lng: number } | null
                return (
                  <Link
                    key={listing.id}
                    href={`/listing/${listing.slug || listing.id}`}
                    className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{listing.name}</h3>
                    <p className="text-zinc-400 mb-2">
                      {listing.city}
                      {listing.postcode && `, ${listing.postcode}`}
                      {listing.region && `, ${listing.region}`}
                    </p>
                    {listing.description && (
                      <p className="text-zinc-300 text-sm mb-3 line-clamp-2">
                        {listing.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {listing.price && (
                        <span className="text-orange-500 font-semibold">
                          From £{listing.price.toFixed(0)}
                        </span>
                      )}
                      {location && (
                        <span className="text-zinc-500 text-sm">View on map →</span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Related Links */}
        <section aria-labelledby="related-heading" className="mb-12">
          <h2 id="related-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Explore More
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/rage-room-london"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Rage Room London Guide</h3>
              <p className="text-zinc-400">Complete guide to the best rage rooms in London with rankings and comparisons</p>
            </Link>
            <Link
              href="/city/london"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">All London Rage Rooms</h3>
              <p className="text-zinc-400">Browse the complete directory of rage rooms in London</p>
            </Link>
            <Link
              href="/guides/best-rage-rooms-london"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Best Rage Rooms in London</h3>
              <p className="text-zinc-400">Read our comprehensive guide ranking the top rage rooms in London</p>
            </Link>
            <Link
              href="/rage-room-prices-uk"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Rage Room Prices UK</h3>
              <p className="text-zinc-400">Compare prices across the UK including London venues</p>
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-[#181818] rounded-lg border border-zinc-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Book Your London Rage Room Session?
          </h2>
          <p className="text-zinc-300 mb-6">
            Browse our directory, compare venues, and book your stress-relief session in London today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/city/london"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              View All London Venues
            </Link>
            <Link
              href="/rage-room-london"
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-zinc-700 font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Read London Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

