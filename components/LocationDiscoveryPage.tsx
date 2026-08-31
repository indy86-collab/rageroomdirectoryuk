import Link from "next/link"
import { ArrowDown, Banknote, CalendarCheck, Layers3, Users } from "lucide-react"
import Breadcrumbs from "@/components/Breadcrumbs"
import TrackedDiscoveryLink from "@/components/TrackedDiscoveryLink"
import ListingsPageClient from "@/components/ListingsPageClient"
import {
  ACTIVITY_DEFINITIONS,
  formatPriceAmount,
  getCharacterisedPriceRange,
  pluraliseVenue,
  type ActivityDefinition,
  type OccasionDefinition,
} from "@/lib/discovery"
import {
  getDiscoveryBreadcrumbs,
  getEligibleLocationDiscoveryPages,
  getLocationDiscoveryTitle,
  type LocationDiscoveryPageData,
} from "@/lib/location-discovery"
import type { Listing } from "@/types/listing"
import { getCityHeroImagePath } from "@/lib/city-images"
import LocationHero from "@/components/LocationHero"
import NearbyActivitiesAffiliate from "@/components/NearbyActivitiesAffiliate"
import {
  getOccasionPlannerGroup,
  shouldShowAffiliateOnActivity,
  shouldShowAffiliateOnOccasion,
} from "@/lib/getyourguide"

export default function LocationDiscoveryPage({
  page,
  allListings,
}: {
  page: LocationDiscoveryPageData
  allListings: Listing[]
}) {
  const title = getLocationDiscoveryTitle(page)
  const breadcrumbs = getDiscoveryBreadcrumbs(page)
  const priceRange = getCharacterisedPriceRange(page.listings)
  const activityCounts = ACTIVITY_DEFINITIONS.map((activity) => ({
    ...activity,
    count: page.listings.filter((listing) =>
      listing.activities.includes(activity.value)
    ).length,
  }))
    .filter((activity) => activity.count > 0)
    .sort((a, b) => b.count - a.count)
  const relatedPages = getEligibleLocationDiscoveryPages(allListings).filter(
    (related) =>
      related.href !== page.href &&
      (related.location.slug === page.location.slug ||
        (related.type === page.type && related.category.slug === page.category.slug))
  )

  const activity =
    page.type === "activity" ? (page.category as ActivityDefinition) : null
  const occasion =
    page.type === "occasion" ? (page.category as OccasionDefinition) : null
  const cityHeroImage = getCityHeroImagePath(page.location.name)

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumbs items={breadcrumbs} />
        {cityHeroImage && <LocationHero city={page.location.name} image={cityHeroImage} />}

        <header className="mb-8 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-rage-500">
            Verified {page.location.name} inventory
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-wide text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-300">
            {page.type === "activity"
              ? activity?.value === "rage-room"
                ? `Explore ${pluraliseVenue(page.listings.length)} whose structured location places them in ${page.location.name}. Compare rage-room prices, age guidance, other activities and booking options.`
                : activity?.value === "paint-splatter"
                  ? `Explore ${pluraliseVenue(page.listings.length)} offering verified paint and splatter rooms in ${page.location.name}. Compare published prices, ages and smash-and-paint combos.`
                : `Explore ${pluraliseVenue(page.listings.length)} offering verified ${activity?.shortLabel.toLowerCase()} experiences in ${page.location.name}.`
              : `Explore ${pluraliseVenue(page.listings.length)} with evidence-backed suitability for ${occasion?.shortLabel.toLowerCase()} in ${page.location.name}.`}
          </p>
          {activity?.value === "paint-splatter" && (
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Not sure smash or paint? See the{" "}
              <Link href="/guides/rage-room-vs-paint-splatter" className="text-orange-500 underline hover:text-orange-400">
                rage room vs paint splatter guide
              </Link>
              .
            </p>
          )}
          {page.location.matchMode === "city-or-region" && (
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              London uses the directory&apos;s explicit city-area rule: a venue must have London as its structured city or region. Nearby venues are not included by distance.
            </p>
          )}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#venues"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-rage-500 px-5 py-3 text-sm font-bold text-white hover:bg-rage-600"
            >
              Compare {pluraliseVenue(page.listings.length)}
              <ArrowDown className="h-4 w-4" />
            </a>
            <Link
              href={`/city/${page.location.slug}`}
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-zinc-700 px-5 py-3 text-sm font-bold text-zinc-200 hover:border-rage-500/50 hover:text-rage-300"
            >
              Explore all {page.location.name} venue discovery
            </Link>
          </div>
        </header>

        <ListingsPageClient
          initialListings={page.listings}
          discoveryContext={{
            surface: page.type,
            pageType: page.type === "activity" ? "activity_location" : "occasion_location",
            slug: `${page.category.slug}:${page.location.slug}`,
            discoveryLocation: page.location.slug,
            ...(occasion ? { occasion: occasion.slug } : {}),
            ...(activity ? { activity: activity.value } : {}),
          }}
          showActivities
          showOccasions={page.type === "activity"}
          resultsLabel={page.type === "activity" ? "verified venues" : "suitable venues"}
        />

        {page.type === "occasion" &&
          occasion &&
          shouldShowAffiliateOnOccasion(occasion.slug) && (
            <div className="mt-8">
              <NearbyActivitiesAffiliate
                city={page.location.name}
                placement="occasion"
                occasionSlug={occasion.slug}
                initialGroup={getOccasionPlannerGroup(occasion.slug) ?? undefined}
              />
            </div>
          )}

        {page.type === "activity" &&
          activity &&
          shouldShowAffiliateOnActivity(activity.slug) && (
            <div className="mt-8">
              <NearbyActivitiesAffiliate
                city={page.location.name}
                placement="activity"
              />
            </div>
          )}

        <section className="mt-10 grid gap-4 lg:grid-cols-3" aria-labelledby="location-booking-heading">
          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-5">
            <CalendarCheck className="h-5 w-5 text-rage-500" aria-hidden="true" />
            <h2 id="location-booking-heading" className="mt-3 text-lg font-bold text-white">
              What to expect
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {activity?.editorial.sessionFormat ?? occasion?.planning.booking}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-5">
            <Users className="h-5 w-5 text-rage-500" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-bold text-white">Group suitability</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {activity?.editorial.whoItSuits ?? occasion?.planning.groupSize}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-5">
            <Banknote className="h-5 w-5 text-rage-500" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-bold text-white">Published pricing</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {priceRange
                ? `${priceRange.count} ${priceRange.count === 1 ? "listing has" : "listings have"} a characterised per-person starting price, ranging from ${formatPriceAmount(priceRange.minimum)} to ${formatPriceAmount(priceRange.maximum)}. Card prices retain the venue's published unit.`
                : "No matching listing currently has a characterised per-person starting price. Check each venue for its current group or room total."}
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-rage-500/25 bg-rage-500/10 p-5" aria-labelledby="other-activities-heading">
          <Layers3 className="h-5 w-5 text-rage-400" aria-hidden="true" />
          <h2 id="other-activities-heading" className="mt-3 text-xl font-bold text-white">
            Other activities at these venues
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {activityCounts.map((item) => (
              <TrackedDiscoveryLink
                key={item.value}
                eventName="activity_discovery_click"
                sourcePageType={page.type === "activity" ? "activity_location" : "occasion_location"}
                destinationIdentifier={item.slug}
                destinationPath={`/activities/${item.slug}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-rage-500/30 bg-dark-900/70 px-3 py-2 text-sm font-bold text-rage-200 hover:border-rage-400"
              >
                <span aria-hidden="true">{item.emoji}</span>
                {item.shortLabel} ({item.count})
              </TrackedDiscoveryLink>
            ))}
          </div>
        </section>

        <nav className="mt-10 border-t border-zinc-800 pt-6" aria-label="Related discovery">
          <h2 className="text-lg font-bold text-white">Related discovery</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href={`/${page.type === "activity" ? "activities" : "occasions"}/${page.category.slug}`}
              className="inline-flex min-h-11 items-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-rage-500/50 hover:text-rage-300"
            >
              All UK {page.category.shortLabel}
            </Link>
            {activity?.value === "paint-splatter" && (
              <Link
                href="/guides/rage-room-vs-paint-splatter"
                className="inline-flex min-h-11 items-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-rage-500/50 hover:text-rage-300"
              >
                Rage room vs paint
              </Link>
            )}
            <Link
              href={`/city/${page.location.slug}`}
              className="inline-flex min-h-11 items-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-rage-500/50 hover:text-rage-300"
            >
              Venues in {page.location.name}
            </Link>
            {relatedPages.slice(0, 4).map((related) => (
              <TrackedDiscoveryLink
                key={related.href}
                eventName="location_discovery_click"
                sourcePageType={page.type === "activity" ? "activity_location" : "occasion_location"}
                destinationIdentifier={related.location.slug}
                destinationPath={related.href}
                className="inline-flex min-h-11 items-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-rage-500/50 hover:text-rage-300"
              >
                {related.category.shortLabel} in {related.location.name} ({related.listings.length})
              </TrackedDiscoveryLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
