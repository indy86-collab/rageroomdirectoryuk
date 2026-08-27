import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowDown, Banknote, CalendarCheck, Layers3, Users } from "lucide-react"
import Breadcrumbs from "@/components/Breadcrumbs"
import TrackedDiscoveryLink from "@/components/TrackedDiscoveryLink"
import ListingsPageClient from "@/components/ListingsPageClient"
import {
  MIN_OCCASION_PAGE_LISTINGS,
  OCCASION_DEFINITIONS,
  formatPriceAmount,
  getCharacterisedPriceRange,
  getOccasionDefinition,
  pluraliseVenue,
} from "@/lib/discovery"
import { getAllListingsForAdmin, getListingsByOccasions } from "@/lib/listings"
import { getEligibleLocationDiscoveryPages } from "@/lib/location-discovery"
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/seo-schema"
import DirectoryInsightCallout from "@/components/DirectoryInsightCallout"
import { getOccasionDirectoryInsight } from "@/lib/directory-insights"
import { buildInsightsStats } from "@/lib/insights-stats"

interface OccasionPageProps {
  params: { slug: string }
  searchParams?: Record<string, string | string[] | undefined>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const results = await Promise.all(
    OCCASION_DEFINITIONS.map(async (occasion) => ({
      slug: occasion.slug,
      count: (await getListingsByOccasions(occasion.values)).length,
    }))
  )
  return results
    .filter((occasion) => occasion.count >= MIN_OCCASION_PAGE_LISTINGS)
    .map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params, searchParams = {} }: OccasionPageProps): Promise<Metadata> {
  const occasion = getOccasionDefinition(params.slug)
  if (!occasion) return { title: "Occasion Not Found" }
  const listings = await getListingsByOccasions(occasion.values)
  if (listings.length < MIN_OCCASION_PAGE_LISTINGS) return { title: "Occasion Not Found" }
  return {
    title: `${occasion.heroTitle} | UK Venues`,
    description: `Compare ${pluraliseVenue(listings.length)} with verified suitability for ${occasion.shortLabel.toLowerCase()}. Check rage-room prices, ages, group sizes and booking options.`,
    alternates: { canonical: `/occasions/${occasion.slug}` },
    ...(Object.keys(searchParams).length > 0
      ? { robots: { index: false, follow: true } }
      : {}),
  }
}

export default async function OccasionPage({ params }: OccasionPageProps) {
  const occasion = getOccasionDefinition(params.slug)
  if (!occasion) notFound()
  const listings = await getListingsByOccasions(occasion.values)
  if (listings.length < MIN_OCCASION_PAGE_LISTINGS) notFound()
  const allListings = await getAllListingsForAdmin()
  const insightCallout = getOccasionDirectoryInsight(buildInsightsStats(allListings), occasion.slug)
  const locationPages = getEligibleLocationDiscoveryPages(allListings, "occasion").filter(
    (page) => page.category.slug === occasion.slug
  )
  const priceRange = getCharacterisedPriceRange(listings)
  const url = `/occasions/${occasion.slug}`
  const schemas = [
    buildBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Occasions", url: "/occasions" },
      { name: occasion.label, url },
    ]),
    buildItemListSchema({
      name: occasion.label,
      description: occasion.description,
      url,
      listings,
      limit: listings.length,
    }),
  ]

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Occasions", href: "/occasions" }, { label: occasion.label }]} />
        <div className="mb-8 max-w-4xl">
          <div className="text-4xl" aria-hidden="true">{occasion.emoji}</div>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-wide text-white sm:text-5xl">{occasion.heroTitle}</h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-300">{occasion.description}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#venues" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-rage-500 px-5 py-3 text-sm font-bold text-white hover:bg-rage-600">
              Compare {pluraliseVenue(listings.length)} <ArrowDown className="h-4 w-4" />
            </a>
            <p className="text-sm font-semibold text-rage-400">Only evidence-backed occasion matches</p>
          </div>
        </div>

        {insightCallout && <DirectoryInsightCallout {...insightCallout} />}

        <ListingsPageClient
          initialListings={listings}
          discoveryContext={{
            surface: "occasion",
            pageType: "occasion",
            slug: occasion.slug,
            occasion: occasion.slug,
          }}
          showActivities
          showOccasions={false}
          resultsLabel="suitable venues"
        />

        {locationPages.length > 0 && (
          <nav className="mt-10 rounded-lg border border-zinc-800 bg-[#181818] p-5 sm:p-6" aria-label={`Inventory-backed city pages for ${occasion.shortLabel}`}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rage-500">Inventory-backed locations</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Plan {occasion.shortLabel.toLowerCase()} by location</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">These locations have enough evidence-backed choice to support a dedicated comparison page.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {locationPages.map((page) => (
                <TrackedDiscoveryLink
                  key={page.href}
                  eventName="location_discovery_click"
                  sourcePageType="occasion"
                  destinationIdentifier={page.location.slug}
                  destinationPath={page.href}
                  className="inline-flex min-h-11 items-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-200 hover:border-rage-500/50 hover:text-rage-300"
                >
                  {page.location.name} ({page.listings.length})
                </TrackedDiscoveryLink>
              ))}
            </div>
          </nav>
        )}

        <section className="mt-10" aria-labelledby="occasion-planning-heading">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-rage-500">Choose and book with confidence</p>
          <h2 id="occasion-planning-heading" className="mt-2 text-2xl font-bold text-white sm:text-3xl">What to consider for {occasion.shortLabel.toLowerCase()}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { heading: "Booking questions", copy: occasion.planning.booking, Icon: CalendarCheck },
              { heading: "Group size", copy: occasion.planning.groupSize, Icon: Users },
              { heading: "Age considerations", copy: occasion.planning.age, Icon: Users },
              { heading: "Pricing", copy: occasion.planning.pricing, Icon: Banknote },
              { heading: "Activities available", copy: occasion.planning.activities, Icon: Layers3 },
            ].map(({ heading, copy, Icon }) => (
              <article key={heading} className="rounded-lg border border-zinc-800 bg-[#181818] p-5">
                <Icon className="h-5 w-5 text-rage-500" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-bold text-white">{heading}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{copy}</p>
              </article>
            ))}
            <article className="rounded-lg border border-rage-500/25 bg-rage-500/10 p-5">
              <Banknote className="h-5 w-5 text-rage-400" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-bold text-white">Current characterised pricing</h3>
              {priceRange ? (
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  Across {priceRange.count} {priceRange.count === 1 ? "listing" : "listings"} with a characterised per-person rage-room price, published starting prices range from {formatPriceAmount(priceRange.minimum)} to {formatPriceAmount(priceRange.maximum)} per person. Other cards preserve per-room, per-group or unknown pricing as published.
                </p>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">No matching listing currently has a characterised per-person starting price. Use each venue&apos;s booking link to confirm the current group total.</p>
              )}
            </article>
          </div>
        </section>

        <nav className="mt-10 border-t border-zinc-800 pt-6" aria-label="Related occasion planning">
          <h2 className="text-lg font-bold text-white">Continue planning</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/activities" className="inline-flex min-h-11 items-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-rage-500/50 hover:text-rage-300">Explore activity combinations</Link>
            <Link href="/guides/what-to-wear-to-a-rage-room" className="inline-flex min-h-11 items-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-rage-500/50 hover:text-rage-300">What to wear</Link>
            <Link href="/guides/are-rage-rooms-safe-uk" className="inline-flex min-h-11 items-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-rage-500/50 hover:text-rage-300">Safety guide</Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
