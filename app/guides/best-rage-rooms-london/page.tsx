import { Metadata } from "next"
import Link from "next/link"
import ListingCard from "@/components/ListingCard"
import FAQ from "@/components/FAQ"
import { getCityFAQs } from "@/lib/faqs"

export const metadata: Metadata = {
  title: "Best Rage Rooms in London | Top 5 Ranked 2025",
  description: "Discover the best rage rooms in London. Our comprehensive guide ranks the top 5 smash rooms, compares prices, packages, and helps you find the perfect stress-relief experience in the capital.",
  openGraph: {
    title: "Best Rage Rooms in London | Top 5 Ranked 2025",
    description: "Find the best rage rooms and smash rooms in London. Compare venues, prices, and book your stress-relief session.",
    type: "article",
  },
}

// Mark this route as dynamic to prevent build-time data collection
export const dynamic = 'force-dynamic'

export default async function BestRageRoomsLondonPage() {
  // Lazy load to prevent build-time initialization
  const { getListingsByCity } = await import("@/lib/listings")
  const listings = await getListingsByCity("London")

  // Article schema for the guide
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Rage Rooms in London | Top 5 Ranked 2025",
    description: "Comprehensive guide to the best rage rooms and smash rooms in London, including rankings, prices, and booking information.",
    author: {
      "@type": "Organization",
      name: "RageRoom Directory",
    },
    publisher: {
      "@type": "Organization",
      name: "RageRoom Directory",
    },
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"}/guides/best-rage-rooms-london`,
    },
  }

  const londonFAQs = getCityFAQs("London")

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-white">
            <li>
              <Link href="/" className="hover:text-orange-500 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/guides" className="hover:text-orange-500 transition-colors">
                Guides
              </Link>
            </li>
            <li>/</li>
            <li className="text-white">Best Rage Rooms in London</li>
          </ol>
        </nav>

        <article>
          <h1 className="text-4xl font-bold mb-4 text-white">
            Best Rage Rooms in London: Top 5 Ranked (2025)
          </h1>

          <p className="text-lg text-zinc-300 mb-6">
            London is home to some of the UK's best rage rooms and smash room experiences. Whether you're looking for stress relief, a unique date night, or a corporate team building activity, our guide ranks the top rage rooms in the capital based on customer reviews, <Link href="/rage-room-prices-uk" className="text-orange-500 hover:text-orange-600 underline">pricing</Link>, packages, and overall experience.
          </p>

          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Why Choose a Rage Room in London?
            </h2>
            <p className="text-zinc-300 mb-4">
              London's rage rooms offer world-class facilities with state-of-the-art safety equipment, diverse package options, and convenient locations across the capital. With London's fast-paced lifestyle, rage rooms provide the perfect escape for stress relief, making them increasingly popular among professionals, students, and anyone needing to let off steam.
            </p>
            <p className="text-zinc-300">
              The capital's rage rooms are known for their professional setups, comprehensive safety briefings, and variety of smashing items. Many venues offer premium packages with extended sessions, additional items, and even music systems to enhance your experience.
            </p>
          </div>

          {listings.length > 0 ? (
            <>
              <h2 className="text-3xl font-bold text-white mb-6">
                Top Rage Rooms in London
              </h2>
              <div className="space-y-8 mb-12">
                {listings.map((listing, index) => (
                  <div key={listing.id} className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold text-white mb-2">
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
                        </p>
                        {listing.description && (
                          <p className="text-zinc-300 mb-4">
                            {listing.description.substring(0, 200)}...
                          </p>
                        )}
                        {listing.price && (
                          <p className="text-orange-500 font-semibold mb-4">
                            From £{listing.price.toFixed(0)} per person
                          </p>
                        )}
                        <Link
                          href={`/listing/${listing.id}`}
                          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-md transition-colors"
                        >
                          View Details & Book
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-8 text-center mb-8">
              <p className="text-xl text-white mb-4">
                More rage rooms coming to London soon!
              </p>
              <p className="text-zinc-400 mb-6">
                We're constantly updating our directory. Check back soon or explore rage rooms in other cities.
              </p>
              <Link
                href="/listings"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors"
              >
                Browse All Rage Rooms
              </Link>
            </div>
          )}

          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              How We Rank London's Rage Rooms
            </h2>
            <p className="text-zinc-300 mb-4">
              Our rankings are based on several key factors:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 mb-4">
              <li>Customer reviews and ratings from Google and our platform</li>
              <li>Value for money (pricing vs. package inclusions)</li>
              <li>Safety standards and protective equipment quality</li>
              <li>Variety of smashing items and tools provided</li>
              <li>Location convenience and accessibility</li>
              <li>Additional features (music systems, add-ons, group packages)</li>
            </ul>
            <p className="text-zinc-300">
              We regularly update our rankings based on new reviews and venue improvements to ensure you get the most accurate information.
            </p>
          </div>

          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              What to Expect at London Rage Rooms
            </h2>
            <p className="text-zinc-300 mb-4">
              London's rage rooms typically offer 30-minute sessions with all protective gear included. Most venues provide a selection of smashing tools (hammers, bats, crowbars) and breakable items (plates, electronics, glass bottles). Premium packages often include extended time, additional items, music systems, and sometimes paint or spray paint for creative destruction.
            </p>
            <p className="text-zinc-300">
              All venues in London follow strict safety protocols, with mandatory safety briefings, professional supervision, and high-quality protective equipment. Whether you're visiting solo, as a couple, or with a group, London's rage rooms cater to all experience levels.
            </p>
          </div>

          <FAQ items={londonFAQs} title="Frequently Asked Questions About Rage Rooms in London" />

          <div className="mt-12 text-center">
            <Link
              href="/city/london"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              View All London Rage Rooms
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}


