import Link from "next/link"
import FAQ from "@/components/FAQ"
import GuideMeta from "@/components/GuideMeta"
import Breadcrumbs from "@/components/Breadcrumbs"
import InArticleAd from "@/components/InArticleAd"
import { getCityFAQs } from "@/lib/faqs"
import { getGuideCityContent } from "@/lib/guide-city-content"
import { getCityHeroImagePath } from "@/lib/city-images"
import LocationHero from "@/components/LocationHero"
import { cityToSlug } from "@/lib/location"
import { formatListingPrice } from "@/lib/discovery"
import type { Listing } from "@/types/listing"
import type { ListingWithDistance } from "@/lib/listings"
import {
  buildArticleSchema,
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
  /** ISO date of the last substantive content review. */
  modified?: string
}

function ListingCard({
  listing,
  index,
  distanceMiles,
}: {
  listing: Listing
  index: number
  distanceMiles?: number
}) {
  return (
    <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-5 sm:p-6">
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
            {distanceMiles != null && (
              <span className="text-zinc-500"> · {distanceMiles} miles away</span>
            )}
          </p>
          {listing.description && (
            <p className="text-zinc-300 mb-3 text-sm">
              {listing.description.substring(0, 200)}
              {listing.description.length > 200 ? "..." : ""}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {formatListingPrice(listing) && (
              <span className="text-orange-500 font-semibold text-sm">
                {formatListingPrice(listing)}
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
  )
}

/**
 * Shared renderer for `/guides/best-rage-rooms-<city>` pages.
 */
export default async function CityGuidePage({
  city,
  path,
  published = "2025-01-01",
  updated = "4 August 2026",
  modified = "2026-08-04",
}: CityGuidePageProps) {
  const { getListingsNearCity } = await import("@/lib/listings")
  const { inCity, nearby, allForSchema } = await getListingsNearCity(city)
  const content = getGuideCityContent(city)
  const faqs = getCityFAQs(city)

  const allListings = allForSchema
  const priced = allListings.filter((l) => l.price != null && l.priceUnit === "per-person") as Array<
    (typeof allListings)[number] & { price: number }
  >
  const minPrice = priced.length ? Math.min(...priced.map((l) => l.price)) : null
  const maxPrice = priced.length ? Math.max(...priced.map((l) => l.price)) : null

  const hasNearbyOnly = inCity.length === 0 && nearby.length > 0
  const totalCount = allListings.length
  const comparisonListings: Array<Listing & { distanceMiles?: number }> = [
    ...inCity,
    ...nearby,
  ].slice(0, 10)

  const articleSchema = buildArticleSchema({
    url: path,
    headline: `Best Rage Rooms in ${city} (2026)`,
    description: `Editorial guide to the top rage rooms and smash rooms in ${city}, with prices, tips and venue comparisons.`,
    datePublished: published,
    dateModified: modified,
    keywords: [
      `rage rooms ${city}`,
      `smash rooms ${city}`,
      `${city} rage room prices`,
      "best rage rooms UK",
    ],
  })

  const itemListSchema = buildItemListSchema({
    name: `Best Rage Rooms in ${city}`,
    description: `Ranked list of rage rooms in and near ${city}.`,
    url: path,
    listings: allListings.slice(0, 10),
  })

  const citySlug = cityToSlug(city)
  const cityHeroImage = getCityHeroImagePath(city)

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
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: `Best Rage Rooms in ${city}` },
          ]}
        />

        {cityHeroImage && <LocationHero city={city} image={cityHeroImage} />}

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
            Best Rage Rooms in {city}
          </h1>
          {hasNearbyOnly && (
            <p className="text-lg text-zinc-400 mb-4">
              Including nearby venues within travelling distance of {city}
            </p>
          )}

          <GuideMeta
            updated={updated}
            readingTimeMinutes={6}
            keyTakeaways={[
              inCity.length > 0
                ? `RageRoom Directory tracks ${inCity.length} verified rage room venue${inCity.length === 1 ? "" : "s"} in ${city}.`
                : nearby.length > 0
                  ? `No dedicated rage room in central ${city} yet — ${nearby.length} nearby venue${nearby.length === 1 ? "" : "s"} within travelling distance.`
                  : `We're monitoring new rage room openings across ${city}.`,
              nearby.length > 0 && inCity.length > 0
                ? `${nearby.length} additional venue${nearby.length === 1 ? "" : "s"} within 40 miles of ${city}.`
                : null,
              minPrice && maxPrice
                ? `Published per-person starting prices near ${city} range from £${minPrice.toFixed(0)}–£${maxPrice.toFixed(0)} in our current data.`
                : `No comparable per-person price range is currently published in our ${city} data.`,
              `Check each venue's current PPE, package, age and group rules before booking.`,
            ].filter((t): t is string => t != null)}
          />

          <div className="text-base sm:text-lg text-zinc-300 mb-8 space-y-4">
            <p>{content?.intro}</p>
          </div>


          <div className="text-base sm:text-lg text-zinc-300 mb-8 space-y-4">
            <p>{content?.sceneDescription}</p>
          </div>

          {comparisonListings.length > 0 && (
            <section className="mb-10" aria-labelledby={`${citySlug}-comparison`}>
              <h2
                id={`${citySlug}-comparison`}
                className="text-2xl sm:text-3xl font-bold text-white mb-3"
              >
                Compare Rage Rooms in and Near {city}
              </h2>
              <p className="text-zinc-400 mb-5">
                Compare the latest directory price, location and minimum-age data before
                opening a venue page for package details and booking links.
              </p>
              <div className="overflow-x-auto overscroll-x-contain rounded-lg border border-zinc-800">
                <p className="px-4 pt-3 text-xs text-zinc-500 lg:hidden">Swipe sideways to compare venues.</p>
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-zinc-900 text-zinc-300">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Venue</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Area</th>
                      <th scope="col" className="px-4 py-3 font-semibold">From</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Minimum age</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 bg-[#181818]">
                    {comparisonListings.map((listing) => (
                      <tr key={listing.id}>
                        <th scope="row" className="px-4 py-3 font-semibold text-white">
                          {listing.name}
                        </th>
                        <td className="px-4 py-3 text-zinc-300">
                          {listing.city}
                          {listing.distanceMiles != null
                            ? ` · ${listing.distanceMiles.toFixed(0)} miles from ${city}`
                            : ""}
                        </td>
                        <td className="px-4 py-3 text-zinc-300">
                          {formatListingPrice(listing, { includeFrom: false }) ?? "Not provided"}
                        </td>
                        <td className="px-4 py-3 text-zinc-300">
                          {listing.ageMin != null ? `${listing.ageMin}+` : "Check venue"}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/listing/${listing.slug || listing.id}`}
                            className="font-semibold text-orange-500 hover:text-orange-400 underline underline-offset-2"
                          >
                            View venue
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                Prices and age rules can change. Confirm the final package and eligibility
                with the venue before travelling.
              </p>
            </section>
          )}

          <InArticleAd />

          {inCity.length > 0 && (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Rage Rooms in {city}
              </h2>
              <div className="space-y-6 mb-10">
                {inCity.slice(0, 5).map((listing, index) => (
                  <ListingCard key={listing.id} listing={listing} index={index} />
                ))}
              </div>
            </>
          )}

          {nearby.length > 0 && (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                {inCity.length > 0
                  ? `Rage Rooms Near ${city}`
                  : `Nearest Rage Rooms to ${city}`}
              </h2>
              <div className="space-y-6 mb-10">
                {(nearby as ListingWithDistance[]).slice(0, 5).map((listing, index) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    index={inCity.length > 0 ? inCity.length + index : index}
                    distanceMiles={listing.distanceMiles}
                  />
                ))}
              </div>
            </>
          )}

          {totalCount === 0 && (
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
                  href="/guides/cheapest-rage-rooms-uk"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Cheapest rage rooms in the UK
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/rage-room-age-limits-uk"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  UK rage room age limits by venue
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
              <li>
                <Link
                  href="/guides/rage-room-vs-paint-splatter"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Rage room vs paint splatter
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
