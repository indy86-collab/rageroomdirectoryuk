import { Metadata } from "next"
import Link from "next/link"
import { cityToSlug } from "@/lib/location"
import Breadcrumbs from "@/components/Breadcrumbs"
import FAQ from "@/components/FAQ"
import { getCityFAQs } from "@/lib/faqs"
import ListingCard from "@/components/ListingCard"
import NearMeMap from "@/components/NearMeMap"

export const metadata: Metadata = {
  title: "Rage Room London | Best Smash Rooms in the Capital 2025",
  description: "Discover the best rage rooms in London. Compare top 5 smash rooms, prices, packages, and locations. Book your stress-relief session in London today.",
  openGraph: {
    title: "Rage Room London | Best Smash Rooms in the Capital",
    description: "Find and compare the best rage rooms in London. Top venues, prices, and booking information.",
    type: "website",
  },
}

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export default async function RageRoomLondonPage() {
  // Lazy load to prevent build-time initialization
  const { getListingsByCity } = await import("@/lib/listings")
  const listings = await getListingsByCity("London")

  // Get top 5 listings (or all if less than 5)
  const topListings = listings.slice(0, 5)

  // LocalBusiness schema for London page
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Rage Rooms in London",
    address: {
      "@type": "PostalAddress",
      addressLocality: "London",
      addressCountry: "GB",
    },
    description: "Best rage rooms and smash rooms in London",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"}/rage-room-london`,
  }

  const londonFAQs = getCityFAQs("London")

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "London", href: "/city/london" },
            { label: "Rage Room London" },
          ]}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />

        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
          Rage Room London: Best Smash Rooms in the Capital
        </h1>

        <div className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <p>
            London is home to some of the UK's premier rage room and smash room experiences. Whether you're looking for stress relief after a long week, a unique date night activity, or a corporate team building event, London's rage rooms offer world-class facilities with state-of-the-art safety equipment and diverse package options.
          </p>
          <p>
            Our comprehensive guide ranks the top rage rooms in London based on customer reviews, pricing, safety standards, and overall experience. Each venue provides comprehensive safety equipment including coveralls, helmets, and safety glasses, along with a variety of smashing tools and breakable items.
          </p>
          <p>
            Most rage rooms in London offer 30-minute sessions starting from around £25-30 per person, with premium packages including extended time and additional items available for £40-50. <Link href="/rage-room-prices-uk" className="text-orange-500 hover:text-orange-600 underline">Compare detailed pricing across the UK</Link> to find the best value. All venues require advance booking, especially for weekends and group sessions.
          </p>
        </div>

        {/* Top 5 Rage Rooms Section */}
        {topListings.length > 0 && (
          <section aria-labelledby="top-5-heading" className="mb-12">
            <h2 id="top-5-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Top 5 Rage Rooms in London
            </h2>
            <div className="space-y-6 mb-8">
              {topListings.map((listing, index) => (
                <div
                  key={listing.id}
                  className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        <Link
                          href={`/listing/${listing.slug || listing.id}`}
                          className="hover:text-orange-500 transition-colors"
                        >
                          {listing.name}
                        </Link>
                      </h3>
                      <p className="text-zinc-400 mb-3">
                        {listing.city}
                        {listing.postcode && `, ${listing.postcode}`}
                        {listing.region && `, ${listing.region}`}
                      </p>
                      {listing.description && (
                        <p className="text-zinc-300 mb-4">
                          {listing.description.length > 200
                            ? `${listing.description.substring(0, 200)}...`
                            : listing.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        {listing.price && (
                          <span className="text-orange-500 font-semibold text-lg">
                            From £{listing.price.toFixed(0)} per person
                          </span>
                        )}
                        {listing.website && (
                          <a
                            href={listing.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            Visit Website →
                          </a>
                        )}
                      </div>
                      <Link
                        href={`/listing/${listing.slug || listing.id}`}
                        className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-md transition-colors"
                      >
                        View Details & Book
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Comparison Table */}
        {topListings.length > 0 && (
          <section aria-labelledby="comparison-heading" className="mb-12">
            <h2 id="comparison-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Compare London Rage Rooms
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-[#181818] border border-zinc-800 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[#1a1a1a] border-b border-zinc-800">
                    <th className="text-left p-4 text-white font-semibold">Venue</th>
                    <th className="text-left p-4 text-white font-semibold">Location</th>
                    <th className="text-left p-4 text-white font-semibold">Price (from)</th>
                    <th className="text-left p-4 text-white font-semibold">Verified</th>
                    <th className="text-left p-4 text-white font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {topListings.map((listing) => (
                    <tr
                      key={listing.id}
                      className="border-b border-zinc-800 hover:bg-[#1a1a1a] transition-colors"
                    >
                      <td className="p-4">
                        <Link
                          href={`/listing/${listing.slug || listing.id}`}
                          className="text-white hover:text-orange-500 font-medium transition-colors"
                        >
                          {listing.name}
                        </Link>
                      </td>
                      <td className="p-4 text-zinc-300 text-sm">
                        {listing.city}
                        {listing.postcode && `, ${listing.postcode}`}
                      </td>
                      <td className="p-4 text-orange-500 font-semibold">
                        {listing.price ? `£${listing.price.toFixed(0)}` : "Contact"}
                      </td>
                      <td className="p-4">
                        {listing.verified ? (
                          <span className="text-green-400 text-sm">✓ Verified</span>
                        ) : (
                          <span className="text-zinc-500 text-sm">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/listing/${listing.slug || listing.id}`}
                          className="text-orange-500 hover:text-orange-400 text-sm font-medium"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Pricing Section */}
        <section aria-labelledby="pricing-heading" className="mb-12">
          <h2 id="pricing-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Rage Room Pricing in London
          </h2>
          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-zinc-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Standard Session</h3>
                <p className="text-2xl font-bold text-orange-500 mb-2">£25-30</p>
                <p className="text-sm text-zinc-400">
                  30-minute session with basic package including protective gear and standard items
                </p>
              </div>
              <div className="border border-zinc-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Premium Package</h3>
                <p className="text-2xl font-bold text-orange-500 mb-2">£40-50</p>
                <p className="text-sm text-zinc-400">
                  Extended 45-60 minute session with additional items and premium tools
                </p>
              </div>
              <div className="border border-zinc-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Group Booking</h3>
                <p className="text-2xl font-bold text-orange-500 mb-2">Discounts</p>
                <p className="text-sm text-zinc-400">
                  Special rates for corporate events, parties, and large groups (4+ people)
                </p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm mt-6">
              * Prices may vary by venue. Always check with the specific rage room for current rates and package inclusions.
            </p>
          </div>
        </section>

        {/* Map Section */}
        {listings.length > 0 && (
          <section aria-labelledby="map-heading" className="mb-12">
            <h2 id="map-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Map of London Rage Rooms
            </h2>
            <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4">
              <NearMeMap listings={listings} />
            </div>
          </section>
        )}

        {/* All London Listings */}
        {listings.length > 5 && (
          <section aria-labelledby="all-listings-heading" className="mb-12">
            <h2 id="all-listings-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
              All Rage Rooms in London
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.slice(5).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* Internal Links Section */}
        <section aria-labelledby="related-heading" className="mb-12">
          <h2 id="related-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Explore More
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/city/london"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">All London Rage Rooms</h3>
              <p className="text-zinc-400">
                Browse the complete directory of rage rooms in London
              </p>
            </Link>
            <Link
              href="/guides/best-rage-rooms-london"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Best Rage Rooms Guide</h3>
              <p className="text-zinc-400">
                Read our comprehensive guide to the best rage rooms in London
              </p>
            </Link>
            <Link
              href="/near-me"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Rage Room Near Me</h3>
              <p className="text-zinc-400">
                Find rage rooms near your location across the UK
              </p>
            </Link>
            <Link
              href="/listings"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">All UK Rage Rooms</h3>
              <p className="text-zinc-400">
                Browse our complete directory of rage rooms across the UK
              </p>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ items={londonFAQs} title="Frequently Asked Questions About Rage Rooms in London" />

        {/* Call to Action */}
        <div className="mt-12 text-center bg-[#181818] rounded-lg border border-zinc-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Book Your Rage Room Session in London?
          </h2>
          <p className="text-zinc-300 mb-6">
            Browse our top-rated venues, compare prices, and book your stress-relief session today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/city/london"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              View All London Venues
            </Link>
            <Link
              href="/list-your-rage-room"
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-zinc-700 font-semibold px-8 py-3 rounded-md transition-colors"
            >
              List Your Rage Room
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

