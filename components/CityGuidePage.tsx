import Link from "next/link"
import FAQ from "@/components/FAQ"
import GuideMeta from "@/components/GuideMeta"
import Breadcrumbs from "@/components/Breadcrumbs"
import AdsenseInContent from "@/components/ads/AdsenseInContent"
import { getCityFAQs } from "@/lib/faqs"
import { getGuideCityContent } from "@/lib/guide-city-content"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildItemListSchema,
} from "@/lib/seo-schema"

interface CityGuidePageProps {
  /** Proper-cased city name e.g. "London", "Birmingham". */
  city: string
  /** Root-relative guide URL e.g. "/guides/best-rage-rooms-london". */
  path: string
  /** ISO date the guide was first published. */
  published?: string
  /** Human-readable last-updated date shown on the page. */
  updated?: string
}

/**
 * Shared renderer for `/guides/best-rage-rooms-<city>` pages.
 *
 * Centralising this keeps Article/ItemList/BreadcrumbList schema, TL;DR
 * takeaways, internal linking and layout consistent across all city guides.
 * Each route still owns its own `metadata` / canonical for per-URL SEO.
 */
export default async function CityGuidePage({
  city,
  path,
  published = "2025-01-01",
  updated = "April 2026",
}: CityGuidePageProps) {
  const { getListingsByCity } = await import("@/lib/listings")
  const listings = await getListingsByCity(city)
  const content = getGuideCityContent(city)
  const faqs = getCityFAQs(city)

  const priced = listings.filter((l) => l.price != null) as Array<
    typeof listings[number] & { price: number }
  >
  const minPrice = priced.length ? Math.min(...priced.map((l) => l.price)) : null
  const maxPrice = priced.length ? Math.max(...priced.map((l) => l.price)) : null

  const articleSchema = buildArticleSchema({
    url: path,
    headline: `Best Rage Rooms in ${city} (2026)`,
    description: `Editorial guide to the top rage rooms and smash rooms in ${city}, with prices, tips and venue comparisons.`,
    datePublished: published,
    keywords: [
      `rage rooms ${city}`,
      `smash rooms ${city}`,
      `${city} rage room prices`,
      "best rage rooms UK",
    ],
  })

  const itemListSchema = buildItemListSchema({
    name: `Best Rage Rooms in ${city}`,
    description: `Ranked list of the top rage rooms in ${city}.`,
    url: path,
    listings: listings.slice(0, 10),
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: `Best Rage Rooms in ${city}`, url: path },
  ])

  const citySlug = city.toLowerCase()

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: `Best Rage Rooms in ${city}` },
          ]}
        />

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Best Rage Rooms in {city}
          </h1>

          <GuideMeta
            updated={updated}
            readingTimeMinutes={6}
            keyTakeaways={[
              listings.length > 0
                ? `RageRoom Directory tracks ${listings.length} verified rage room venue${listings.length === 1 ? "" : "s"} in ${city}.`
                : `We're monitoring new rage room openings across ${city}.`,
              minPrice && maxPrice
                ? `${city} sessions typically start from £${minPrice.toFixed(0)}–£${maxPrice.toFixed(0)} per person.`
                : `Expect £25–£65 per person for a standard ${city} rage room session.`,
              `All reputable ${city} venues include safety PPE (coveralls, helmet with visor, gloves) in the booking fee.`,
              `Solo, couple, and group (3–8 people) packages are widely available; corporate team-building packages are offered by most larger venues.`,
            ]}
          />

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
                Top Rage Rooms in {city}
              </h2>
              <div className="space-y-6 mb-10">
                {listings.slice(0, 5).map((listing, index) => (
                  <div
                    key={listing.id}
                    className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-5 sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                        {index + 1}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                          <Link
                            href={`/listing/${listing.slug || listing.id}`}
                            className="hover:text-orange-500 transition-colors"
                          >
                            {listing.name}
                          </Link>
                        </h3>
                        <p className="text-zinc-400 mb-3 text-sm">
                          {listing.city}
                          {listing.postcode && `, ${listing.postcode}`}
                        </p>
                        {listing.description && (
                          <p className="text-zinc-300 mb-3 text-sm">
                            {listing.description.substring(0, 200)}
                            {listing.description.length > 200 ? "..." : ""}
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
              <p className="text-xl text-white mb-4">
                No rage rooms listed in {city} yet.
              </p>
              <Link
                href="/listings"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors mt-2"
              >
                Browse All Rage Rooms
              </Link>
            </div>
          )}

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              What to Look For
            </h2>
            <p className="text-zinc-300">{content?.whatToLookFor}</p>
          </div>

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Local Tip</h2>
            <p className="text-zinc-300">{content?.localTip}</p>
          </div>

          <FAQ
            items={faqs}
            title={`Frequently Asked Questions About Rage Rooms in ${city}`}
          />

          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6 mb-8 mt-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Related Reading
            </h2>
            <ul className="space-y-2 text-zinc-300">
              <li>
                <Link
                  href="/guides/how-much-do-rage-rooms-cost-uk"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  How much do rage rooms cost in the UK?
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/are-rage-rooms-safe-uk"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Are rage rooms safe? (UK safety guide)
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/what-happens-in-a-rage-room"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  What happens in a rage room? Step-by-step guide
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/best-rage-rooms-for-couples"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Best rage rooms for couples and date nights
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/best-rage-rooms-for-team-building"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Best rage rooms for corporate team building
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-10 text-center">
            <Link
              href={`/city/${citySlug}`}
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              View All {city} Rage Rooms
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
