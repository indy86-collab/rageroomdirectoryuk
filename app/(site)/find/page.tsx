import { Metadata } from "next"
import DigitalGuidesChooser from "@/components/DigitalGuidesChooser"
import ListingsGrid from "@/components/ListingsGrid"
import NearbyActivitiesAffiliate from "@/components/NearbyActivitiesAffiliate"
import TripOptionCard from "@/components/TripOptionCard"
import TripResultsClient from "@/components/TripResultsClient"
import { getAllListingsForAdmin } from "@/lib/listings"
import {
  buildTripLocationIndex,
  tripGuideIntent,
  tripPlannerGroup,
  tripQueryFromSearchParams,
} from "@/lib/trip-query"
import {
  geocodeUkPostcode,
  rankTripListings,
  resolveNamedOrigin,
} from "@/lib/trip-search"

export const dynamic = "force-dynamic"

interface FindPageProps {
  searchParams: {
    query?: string
    city?: string
    people?: string
    budget?: string
    occasion?: string
    when?: string
    activity?: string
  }
}

export async function generateMetadata({ searchParams }: FindPageProps): Promise<Metadata> {
  const query = searchParams.query?.trim()
  return {
    title: query ? "Session options" : "Plan a rage room session",
    description:
      "Describe the plan — town, group size, budget and occasion — and we’ll rank nearby UK rage rooms.",
    alternates: { canonical: "/find" },
    robots: { index: false, follow: true },
  }
}

export default async function FindPage({ searchParams }: FindPageProps) {
  const listings = await getAllListingsForAdmin()
  const locations = buildTripLocationIndex(listings)
  const query = tripQueryFromSearchParams(searchParams, { locations })
  const hasQuery = Boolean(searchParams.query?.trim())

  let origin: { lat: number; lng: number } | null = null
  let originError: string | null = null

  if (query.location?.kind === "postcode") {
    const geocoded = await geocodeUkPostcode(query.location.name)
    origin = geocoded ? { lat: geocoded.lat, lng: geocoded.lng } : null
    if (!origin) originError = "We could not place that postcode. Try a town name instead."
  } else if (query.location) {
    origin = resolveNamedOrigin(query.location, listings)
    if (!origin) originError = "We do not have map coordinates for that place yet."
  }

  const ranked =
    origin != null
      ? rankTripListings(listings, origin, query)
      : { options: [], more: [] }

  const resultCount = ranked.options.length + ranked.more.length
  const cityName =
    query.location?.kind === "postcode" ? ranked.options[0]?.listing.city : query.location?.name
  const showAffiliate = Boolean(cityName)
  const dateNote = query.date
    ? `Planning for ${query.date.label}. We cannot see live venue calendars, so check availability before you travel.`
    : null

  return (
    <div className="py-6 sm:py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="font-display text-4xl uppercase tracking-tight text-white sm:text-5xl">
          {hasQuery ? "Your session options" : "Plan a session"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
          Ranked from verified directory data — distance, group fit, birthday suitability and published
          per-person prices. City or postcode search is unchanged in the header.
        </p>

        <div className="mt-6">
          <TripResultsClient query={query} resultCount={resultCount} />
        </div>

        {dateNote ? <p className="mt-4 text-sm text-zinc-400">{dateNote}</p> : null}

        {!hasQuery ? (
          <p className="mt-8 text-zinc-400">
            Try the Birmingham birthday example, or describe your own plan above.
          </p>
        ) : null}

        {hasQuery && !query.location ? (
          <p className="mt-8 rounded-lg border border-zinc-800 bg-[#181818] p-4 text-zinc-300">
            Add a UK town or postcode so we can rank nearby rooms.
          </p>
        ) : null}

        {originError ? (
          <p className="mt-8 rounded-lg border border-zinc-800 bg-[#181818] p-4 text-zinc-300">
            {originError}
          </p>
        ) : null}

        {ranked.options.length > 0 ? (
          <section aria-label="Recommended options" className="mt-8">
            <div className="grid gap-4 lg:grid-cols-3">
              {ranked.options.map((option) => (
                <TripOptionCard
                  key={option.listing.id}
                  option={option}
                  requestedActivities={query.activities}
                />
              ))}
            </div>
          </section>
        ) : null}

        {hasQuery && query.location && origin && resultCount === 0 ? (
          <p className="mt-8 rounded-lg border border-zinc-800 bg-[#181818] p-4 text-zinc-300">
            No verified venues matched that plan yet. Try a wider budget, a smaller group, or another
            nearby town.
          </p>
        ) : null}

        {ranked.options.length > 0 ? (
          <div className="my-10">
            <DigitalGuidesChooser highlight={tripGuideIntent(query)} />
          </div>
        ) : null}

        {showAffiliate && cityName ? (
          <div className="mb-10">
            <NearbyActivitiesAffiliate
              city={cityName}
              placement="find"
              occasionSlug={query.occasions[0]}
              initialGroup={tripPlannerGroup(query)}
            />
          </div>
        ) : null}

        {ranked.more.length > 0 ? (
          <section aria-label="More matches" className="mt-4">
            <h2 className="mb-4 text-xl font-bold text-white">More matches</h2>
            <ListingsGrid
              listings={ranked.more.map((row) => row.listing)}
              discoveryContext={{
                surface: "directory",
                pageType: "find_results",
                discoveryLocation: cityName,
              }}
            />
          </section>
        ) : null}
      </div>
    </div>
  )
}
