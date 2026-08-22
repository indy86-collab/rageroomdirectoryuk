import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowDown, ArrowRight, CalendarCheck, Shirt, Users } from "lucide-react"
import Breadcrumbs from "@/components/Breadcrumbs"
import InArticleAd from "@/components/InArticleAd"
import PaintHubExtras from "@/components/PaintHubExtras"
import TrackedDiscoveryLink from "@/components/TrackedDiscoveryLink"
import ListingsPageClient from "@/components/ListingsPageClient"
import {
  ACTIVITY_DEFINITIONS,
  MIN_ACTIVITY_PAGE_LISTINGS,
  getActivityDefinition,
  getActivityCombinationHref,
  getListingHref,
  pluraliseVenue,
} from "@/lib/discovery"
import { getAllListingsForAdmin, getListingsByActivity } from "@/lib/listings"
import { getEligibleLocationDiscoveryPages } from "@/lib/location-discovery"
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/seo-schema"

interface ActivityPageProps {
  params: { slug: string }
  searchParams?: Record<string, string | string[] | undefined>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const results = await Promise.all(
    ACTIVITY_DEFINITIONS.map(async (activity) => ({
      slug: activity.slug,
      count: (await getListingsByActivity(activity.value)).length,
    }))
  )
  return results
    .filter((activity) => activity.count >= MIN_ACTIVITY_PAGE_LISTINGS)
    .map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params, searchParams = {} }: ActivityPageProps): Promise<Metadata> {
  const activity = getActivityDefinition(params.slug)
  if (!activity) return { title: "Activity Not Found" }
  const listings = await getListingsByActivity(activity.value)
  if (listings.length < MIN_ACTIVITY_PAGE_LISTINGS) return { title: "Activity Not Found" }

  const titles: Partial<Record<typeof activity.value, string>> = {
    "rage-room": "Rage Rooms Near You | UK Venue Directory",
    "axe-throwing": "Axe Throwing Near You | UK Venue Directory",
    "paint-splatter": "Paint Splatter Rooms UK | Find Nearby Venues",
    "car-smash": "Car Smash Experiences UK | Verified Venues",
    "mobile-rage-room": "Mobile Rage Room Hire UK | Verified Operators",
    "escape-room": "Selected Escape Rooms | UK Venues",
    vr: "Selected VR Venues Across the UK",
    "airsoft-target": "Selected Airsoft & Target Activities | UK Venues",
  }
  return {
    title: titles[activity.value] ?? `${activity.label} | Verified UK Venues`,
    description: activity.value === "rage-room"
      ? `Explore ${pluraliseVenue(listings.length)} in our verified UK rage-room directory. Compare locations, published prices, ages and booking options.`
      : activity.value === "paint-splatter"
        ? `Explore ${pluraliseVenue(listings.length)} offering verified UK splatter rooms, paint throwing, action painting and neon paint experiences. Compare locations, prices, ages and booking options.`
        : `Explore ${pluraliseVenue(listings.length)} offering verified ${activity.label.toLowerCase()} experiences across the UK, including standalone and multi-activity venues. Compare locations, published prices, ages and booking options.`,
    alternates: { canonical: `/activities/${activity.slug}` },
    ...(Object.keys(searchParams).length > 0
      ? { robots: { index: false, follow: true } }
      : {}),
  }
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const activity = getActivityDefinition(params.slug)
  if (!activity) notFound()
  const listings = await getListingsByActivity(activity.value)
  if (listings.length < MIN_ACTIVITY_PAGE_LISTINGS) notFound()
  const allListings = await getAllListingsForAdmin()
  const locationPages = getEligibleLocationDiscoveryPages(allListings, "activity").filter(
    (page) => page.category.slug === activity.slug
  )
  const combinations = ACTIVITY_DEFINITIONS
    .filter((related) =>
      related.value !== activity.value &&
      !(activity.value === "paint-splatter" && related.value === "rage-room")
    )
    .map((related) => ({
      ...related,
      count: listings.filter((listing) => listing.activities.includes(related.value)).length,
      directoryCount: allListings.filter((listing) => listing.activities.includes(related.value)).length,
    }))
    .filter((related) => related.count > 0)
    .sort((a, b) => b.count - a.count)
  const smashAndPaintListings = activity.value === "paint-splatter"
    ? listings.filter((listing) => listing.activities.includes("rage-room"))
    : []
  const relatedLandingPages = ACTIVITY_DEFINITIONS
    .filter((related) => related.value !== activity.value)
    .map((related) => ({
      ...related,
      count: allListings.filter((listing) => listing.activities.includes(related.value)).length,
    }))
    .filter((related) => related.count >= MIN_ACTIVITY_PAGE_LISTINGS)
    .sort((a, b) => b.count - a.count)

  const url = `/activities/${activity.slug}`
  const schemas = [
    buildBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Activities", url: "/activities" },
      { name: activity.label, url },
    ]),
    buildItemListSchema({
      name: `${activity.label} across the UK`,
      description: activity.description,
      url,
      listings,
      limit: listings.length,
    }),
  ]

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {schemas.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Activities", href: "/activities" },
            { label: activity.label },
          ]}
        />
        <div className="mb-8 max-w-4xl">
          <div className="text-4xl" aria-hidden="true">{activity.emoji}</div>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-wide text-white sm:text-5xl">
            {activity.heroTitle}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-300">{activity.description}</p>
          {activity.value === "paint-splatter" && (
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Comparing smash vs paint? Read the{" "}
              <Link href="/guides/rage-room-vs-paint-splatter" className="text-orange-500 underline hover:text-orange-400">
                rage room vs paint splatter guide
              </Link>
              {locationPages.some((page) => page.location.slug === "london") ? (
                <>
                  {" "}
                  or jump to{" "}
                  <Link href="/activities/paint-splatter/london" className="text-orange-500 underline hover:text-orange-400">
                    paint rooms in London
                  </Link>
                  .
                </>
              ) : (
                "."
              )}
            </p>
          )}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#venues" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-rage-500 px-5 py-3 text-sm font-bold text-white hover:bg-rage-600">
              Explore {pluraliseVenue(listings.length)} <ArrowDown className="h-4 w-4" />
            </a>
            <p className="text-sm font-semibold text-rage-400">
              Verified inventory, automatically updated
            </p>
          </div>
        </div>

        {(activity.value === "paint-splatter" || activity.value === "rage-room") && (
          <InArticleAd />
        )}

        <ListingsPageClient
          initialListings={listings}
          discoveryContext={{
            surface: "activity",
            pageType: "activity",
            slug: activity.slug,
            activity: activity.value,
          }}
          showActivities
          showOccasions
          resultsLabel="verified venues"
        />

        {smashAndPaintListings.length > 0 && (
          <section className="mt-10 rounded-lg border border-rage-500/30 bg-rage-500/10 p-5 sm:p-6" aria-labelledby="smash-and-paint-heading">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rage-400">Strict activity match</p>
            <h2 id="smash-and-paint-heading" className="mt-2 text-2xl font-bold text-white">Want to smash and paint?</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-300">
              These {pluraliseVenue(smashAndPaintListings.length)} have both a verified rage room and a verified paint or splatter experience at the same venue or through the same mobile operator.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {smashAndPaintListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={getListingHref(listing)}
                  className="rounded-md border border-zinc-700/80 bg-dark-900/70 px-4 py-3 text-sm font-semibold text-zinc-200 hover:border-rage-500/60 hover:text-rage-300"
                >
                  {listing.name}
                  <span className="mt-1 block text-xs font-normal text-zinc-500">
                    {listing.locationType === "mobile-service" ? "UK-wide mobile service" : listing.city}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href={getActivityCombinationHref(activity.slug, "rage-room")}
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-rage-500 px-4 py-2 text-sm font-bold text-white hover:bg-rage-600"
            >
              Apply the Rage Room + Paint filter ({smashAndPaintListings.length})
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
        )}

        {activity.value === "paint-splatter" && (
          <PaintHubExtras listings={listings} locationPages={locationPages} />
        )}

        {locationPages.length > 0 && (
          <nav className="mt-10 rounded-lg border border-zinc-800 bg-[#181818] p-5 sm:p-6" aria-label={`Inventory-backed city pages for ${activity.shortLabel}`}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rage-500">Inventory-backed locations</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Explore {activity.shortLabel} by location</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">Only locations with enough verified venues for useful comparison are linked here.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {locationPages.map((page) => (
                <TrackedDiscoveryLink
                  key={page.href}
                  eventName="location_discovery_click"
                  sourcePageType="activity"
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

        {combinations.length > 0 && (
          <section className="mt-10 rounded-lg border border-zinc-800 bg-[#181818] p-5 sm:p-6" aria-labelledby="activity-combinations-heading">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rage-500">Do more in one trip</p>
            <h2 id="activity-combinations-heading" className="mt-2 text-2xl font-bold text-white">Verified activity combinations</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
              These links apply a temporary filter to this page. They are discovery states, not separate indexable landing pages.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {combinations.map((related) => (
                <Link
                  key={related.value}
                  href={getActivityCombinationHref(activity.slug, related.value)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-700 bg-dark-900 px-4 py-2 text-sm font-bold text-zinc-200 hover:border-rage-500/60 hover:text-rage-300"
                >
                  <span aria-hidden="true">{activity.emoji} + {related.emoji}</span>
                  {activity.shortLabel} + {related.shortLabel}
                  <span className="text-zinc-500">({related.count})</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10" aria-labelledby="activity-guide-heading">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-rage-500">Before you book</p>
          <h2 id="activity-guide-heading" className="mt-2 text-2xl font-bold text-white sm:text-3xl">What to know about {activity.shortLabel}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["What it involves", activity.editorial.whatItIs, CalendarCheck],
              ["Typical format", activity.editorial.sessionFormat, ArrowRight],
              ["Who it may suit", activity.editorial.whoItSuits, Users],
              ["Age considerations", activity.editorial.age, Users],
              ["What to wear", activity.editorial.whatToWear, Shirt],
              ["Booking advice", activity.editorial.booking, CalendarCheck],
            ].map(([heading, copy, Icon]) => (
              <article key={heading as string} className="rounded-lg border border-zinc-800 bg-[#181818] p-5">
                <Icon className="h-5 w-5 text-rage-500" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-bold text-white">{heading as string}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{copy as string}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-rage-500/25 bg-rage-500/10 p-5">
            <h3 className="font-bold text-white">
              {activity.value === "rage-room" ? "Related activity pairings" : "How it can pair with rage rooms"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{activity.editorial.pairing}</p>
            {(activity.value === "paint-splatter" || activity.value === "rage-room") && (
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                Full comparison:{" "}
                <Link href="/guides/rage-room-vs-paint-splatter" className="text-orange-500 underline hover:text-orange-400">
                  rage room vs paint splatter
                </Link>
                .
              </p>
            )}
          </div>
        </section>

        {relatedLandingPages.length > 0 && (
          <nav className="mt-10 border-t border-zinc-800 pt-6" aria-label="Related activities">
            <h2 className="text-lg font-bold text-white">Explore related activities</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {relatedLandingPages.map((related) => (
                <TrackedDiscoveryLink
                  key={related.value}
                  eventName="activity_discovery_click"
                  sourcePageType="activity"
                  destinationIdentifier={related.slug}
                  destinationPath={`/activities/${related.slug}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-rage-500/50 hover:text-rage-300"
                >
                  <span aria-hidden="true">{related.emoji}</span>{related.label} ({related.count})
                </TrackedDiscoveryLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </div>
  )
}
