import { Metadata } from "next"
import Link from "next/link"
import FAQ from "@/components/FAQ"
import { getCityFAQs } from "@/lib/faqs"
import { getGuideCityContent } from "@/lib/guide-city-content"
import Breadcrumbs from "@/components/Breadcrumbs"
import AdsenseInContent from "@/components/ads/AdsenseInContent"

export const metadata: Metadata = {
  title: "Best Rage Rooms in Sheffield | Top Venues Ranked (2025)",
  description: "Discover the best rage rooms in Sheffield. Our guide covers top venues in South Yorkshire, what to look for, pricing, and local tips for booking your destruction therapy session.",
  alternates: { canonical: "/guides/best-rage-rooms-sheffield" },
  openGraph: {
    title: "Best Rage Rooms in Sheffield | Top Venues Ranked",
    description: "Find the best rage rooms and smash rooms in Sheffield. Compare venues, prices, and book your stress-relief session.",
    type: "article",
  },
}

export const revalidate = 86400

export default async function BestRageRoomsSheffieldPage() {
  const { getListingsByCity } = await import("@/lib/listings")
  const listings = await getListingsByCity("Sheffield")
  const content = getGuideCityContent("Sheffield")
  const faqs = getCityFAQs("Sheffield")

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Rage Rooms in Sheffield",
    description: "Guide to the best rage rooms and smash rooms in Sheffield.",
    author: { "@type": "Organization", name: "RageRoom Directory" },
    datePublished: "2025-01-01",
    dateModified: "2025-12-01",
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: "Best Rage Rooms in Sheffield" },
          ]}
        />

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Best Rage Rooms in Sheffield
          </h1>

          <div className="text-base sm:text-lg text-zinc-300 mb-8 space-y-4">
            <p>{content?.intro}</p>
          </div>

          <AdsenseInContent />

          <div className="text-base sm:text-lg text-zinc-300 mb-8 space-y-4">
            <p>{content?.sceneDescription}</p>
          </div>

          {listings.length > 0 ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Top Rage Rooms in Sheffield
              </h2>
              <div className="space-y-6 mb-10">
                {listings.slice(0, 5).map((listing, index) => (
                  <div key={listing.id} className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                        {index + 1}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                          <Link href={`/listing/${listing.slug || listing.id}`} className="hover:text-orange-500 transition-colors">
                            {listing.name}
                          </Link>
                        </h3>
                        <p className="text-zinc-400 mb-3 text-sm">
                          {listing.city}{listing.postcode && `, ${listing.postcode}`}
                        </p>
                        {listing.description && (
                          <p className="text-zinc-300 mb-3 text-sm">
                            {listing.description.substring(0, 200)}{listing.description.length > 200 ? "..." : ""}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3">
                          {listing.price && (
                            <span className="text-orange-500 font-semibold text-sm">
                              From £{listing.price.toFixed(0)} per person
                            </span>
                          )}
                          <Link
                            href={`/listing/${listing.slug || listing.id}`}
                            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-1.5 rounded-md transition-colors text-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-[#181818] rounded-lg border border-zinc-800 p-8 text-center mb-8">
              <p className="text-xl text-white mb-4">No rage rooms listed in Sheffield yet.</p>
              <Link href="/listings" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors mt-2">
                Browse All Rage Rooms
              </Link>
            </div>
          )}

          {/* Unique editorial sections */}
          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">What to Look For</h2>
            <p className="text-zinc-300">{content?.whatToLookFor}</p>
          </div>

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Local Tip</h2>
            <p className="text-zinc-300">{content?.localTip}</p>
          </div>

          <FAQ items={faqs} title="Frequently Asked Questions About Rage Rooms in Sheffield" />

          <div className="mt-10 text-center">
            <Link href="/city/sheffield" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors">
              View All Sheffield Rage Rooms
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
