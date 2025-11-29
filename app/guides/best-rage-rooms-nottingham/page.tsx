import { Metadata } from "next"
import Link from "next/link"
import FAQ from "@/components/FAQ"
import { getCityFAQs } from "@/lib/faqs"
import { cityToSlug } from "@/lib/location"

export const metadata: Metadata = {
  title: "Best Rage Rooms in Nottingham | Top 5 Ranked 2025",
  description: "Discover the best rage rooms in Nottingham. Our comprehensive guide ranks the top 5 smash rooms, compares prices, packages, and helps you find the perfect stress-relief experience in the East Midlands.",
  openGraph: {
    title: "Best Rage Rooms in Nottingham | Top 5 Ranked 2025",
    description: "Find the best rage rooms and smash rooms in Nottingham. Compare venues, prices, and book your stress-relief session.",
    type: "article",
  },
}

export const dynamic = 'force-dynamic'

export default async function BestRageRoomsNottinghamPage() {
  const { getListingsByCity } = await import("@/lib/listings")
  const listings = await getListingsByCity("Nottingham")

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Rage Rooms in Nottingham | Top 5 Ranked 2025",
    description: "Comprehensive guide to the best rage rooms and smash rooms in Nottingham.",
    author: {
      "@type": "Organization",
      name: "RageRoom Directory",
    },
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  }

  const nottinghamFAQs = getCityFAQs("Nottingham")

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
            <li className="text-white">Best Rage Rooms in Nottingham</li>
          </ol>
        </nav>

        <article>
          <h1 className="text-4xl font-bold mb-4 text-white">
            Best Rage Rooms in Nottingham: Top 5 Ranked (2025)
          </h1>

          <p className="text-lg text-zinc-300 mb-6">
            Nottingham offers excellent rage room experiences in the East Midlands. Our comprehensive guide ranks the top 5 rage rooms in Nottingham based on customer reviews, value for money, safety standards, and overall experience quality.
          </p>

          {listings.length > 0 ? (
            <>
              <h2 className="text-3xl font-bold text-white mb-6">
                Top 5 Rage Rooms in Nottingham
              </h2>
              <div className="space-y-8 mb-12">
                {listings.slice(0, 5).map((listing, index) => (
                  <div key={listing.id} className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6">
                    <div className="flex items-start gap-4">
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
            </>
          ) : (
            <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-8 text-center mb-8">
              <p className="text-xl text-white mb-4">
                More rage rooms coming to Nottingham soon!
              </p>
              <Link
                href="/listings"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors mt-4"
              >
                Browse All Rage Rooms
              </Link>
            </div>
          )}

          <FAQ items={nottinghamFAQs} title="Frequently Asked Questions About Rage Rooms in Nottingham" />

          <div className="mt-12 text-center">
            <Link
              href={`/city/${cityToSlug("Nottingham")}`}
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              View All Nottingham Rage Rooms
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}

