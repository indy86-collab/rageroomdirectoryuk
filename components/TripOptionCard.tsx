import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  MapPin,
  Users,
} from "lucide-react"
import {
  formatGroupSize,
  getListingHref,
  getListingPrimaryAction,
} from "@/lib/discovery"
import {
  formatTripExperience,
  formatTripPrice,
  listingIsBirthdaySuitable,
  type RankedTripListing,
} from "@/lib/trip-search"
import TrackedBookingLink from "./TrackedBookingLink"

type TripOptionCardProps = {
  option: RankedTripListing
  requestedActivities?: RankedTripListing["listing"]["activities"]
}

export default function TripOptionCard({
  option,
  requestedActivities = [],
}: TripOptionCardProps) {
  const { listing, distanceMiles, optionLabel, fitsGroup, occasionMatch } = option
  const href = getListingHref(listing)
  const primaryAction = getListingPrimaryAction(listing)
  const listingSlug = listing.slug || listing.id
  const birthday = listingIsBirthdaySuitable(listing)
  const groupLabel = formatGroupSize(listing)
  const discoveryContext = {
    pageType: "find_results" as const,
    discoveryLocation: listing.city,
  }

  return (
    <article className="card-base card-hover relative flex h-full flex-col overflow-hidden p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-rage-400">
          Option {optionLabel}
        </p>
        {listing.verified ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-rage-400/40 bg-rage-500/15 px-2 py-1 text-[11px] font-bold text-rage-300">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Verified
          </span>
        ) : null}
      </div>

      <Link href={href} className="mt-3">
        <h3 className="text-2xl font-bold text-white transition-colors hover:text-rage-400">
          {listing.name}
        </h3>
      </Link>
      <p className="mt-1 text-sm font-medium text-zinc-400">
        {formatTripExperience(listing, requestedActivities)}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg border border-zinc-800 bg-dark-900/70 p-3">
          <dt className="text-[10px] uppercase tracking-wider text-zinc-500">From</dt>
          <dd className="mt-1 font-bold text-white">{formatTripPrice(listing)}</dd>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-dark-900/70 p-3">
          <dt className="text-[10px] uppercase tracking-wider text-zinc-500">Distance</dt>
          <dd className="mt-1 inline-flex items-center gap-1.5 font-bold text-white">
            <MapPin className="h-3.5 w-3.5 text-rage-500" aria-hidden="true" />
            {distanceMiles} {distanceMiles === 1 ? "mile" : "miles"} away
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-dark-900/70 p-3">
          <dt className="text-[10px] uppercase tracking-wider text-zinc-500">Occasion</dt>
          <dd className="mt-1 font-bold text-white">
            {birthday ? "Birthday suitable" : occasionMatch ? "Matches your plan" : "Ask the venue"}
          </dd>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-dark-900/70 p-3">
          <dt className="text-[10px] uppercase tracking-wider text-zinc-500">Group</dt>
          <dd className="mt-1 inline-flex items-center gap-1.5 font-bold text-white">
            <Users className="h-3.5 w-3.5 text-rage-500" aria-hidden="true" />
            {fitsGroup ? groupLabel ?? "Can take your group" : groupLabel ?? "Check capacity"}
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
        {primaryAction.kind === "booking" ? (
          <TrackedBookingLink
            href={primaryAction.href}
            venueSlug={listingSlug}
            venueCity={listing.city}
            context={discoveryContext}
            ctaPlacement="find_option"
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-rage-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rage-600"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Check availability
          </TrackedBookingLink>
        ) : null}
        <Link
          href={href}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-zinc-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:border-rage-500/70"
        >
          Venue details
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
