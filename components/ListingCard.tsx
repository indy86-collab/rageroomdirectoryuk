"use client"

import Link from "next/link"
import Image from "next/image"
import type { Listing, ListingActivity } from "@/types/listing"
import { ArrowRight, CalendarCheck, Clock, MapPin, Star, Users } from "lucide-react"
import {
  ACTIVITY_DEFINITIONS,
  formatListingPrice,
  getListingHref,
  getListingPrimaryAction,
  getOccasionLabel,
} from "@/lib/discovery"
import type { DirectoryDiscoveryContext } from "@/lib/analytics"
import TrackedBookingLink from "./TrackedBookingLink"

export type ListingDiscoveryContext = DirectoryDiscoveryContext & {
  surface: "activity" | "occasion" | "directory"
  slug?: string
  activity?: ListingActivity
}

interface ListingCardProps {
  listing: Listing
  compareSelected?: boolean
  onCompareToggle?: (listing: Listing) => void
  compareDisabled?: boolean
  comparisonActive?: boolean
  discoveryContext?: ListingDiscoveryContext
}

export default function ListingCard({
  listing,
  compareSelected = false,
  onCompareToggle,
  compareDisabled = false,
  comparisonActive = false,
  discoveryContext = { surface: "directory", pageType: "search_results" },
}: ListingCardProps) {
  const href = getListingHref(listing)
  const primaryAction = getListingPrimaryAction(listing)
  const orderedActivities = discoveryContext.activity
    ? [
        discoveryContext.activity,
        ...listing.activities.filter((activity) => activity !== discoveryContext.activity),
      ]
    : listing.activities
  const activityBadges = orderedActivities
    .map((value) => ACTIVITY_DEFINITIONS.find((activity) => activity.value === value))
    .filter((activity): activity is NonNullable<typeof activity> => Boolean(activity))
    .slice(0, 3)
  const occasionBadges = listing.occasions.slice(0, 2)
  const duration = listing.sessionLengths?.length
    ? `${Math.min(...listing.sessionLengths)} min${listing.sessionLengths.length > 1 ? "+" : ""}`
    : null
  const startingPrice = formatListingPrice(listing)
  const listingSlug = listing.slug || listing.id
  const ctaPlacement =
    discoveryContext.pageType === "activity"
      ? "activity_results"
      : discoveryContext.pageType === "occasion"
        ? "occasion_results"
        : discoveryContext.pageType === "activity_location" ||
            discoveryContext.pageType === "occasion_location"
          ? "location_results"
          : "venue_card"

  return (
    <article className="card-base card-hover group relative flex h-full flex-col overflow-hidden">
      <Link href={href} className="block" aria-label={`View ${listing.name}`}>
        <div className="relative aspect-video w-full overflow-hidden">
          {listing.image ? (
            <Image
              src={listing.image}
              alt={`${listing.name} in ${listing.city}`}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-dark-800 to-dark-900">
              <span className="text-sm font-medium text-zinc-600">No image</span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 h-12 w-12 bg-rage-600 opacity-70" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }} />
          {listing.verified && (
            <div className="absolute left-3 top-3 rounded-full border border-rage-400/50 bg-rage-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
              VERIFIED
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-grow flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {activityBadges.map((activity) => (
            <span key={activity.value} className="inline-flex items-center gap-1 rounded-full border border-rage-500/30 bg-rage-500/10 px-2 py-1 text-[11px] font-bold text-rage-300">
              <span aria-hidden="true">{activity.emoji}</span> {activity.shortLabel}
            </span>
          ))}
        </div>

        <Link href={href}>
          <h2 className="mb-2 line-clamp-2 text-lg font-bold text-white transition-colors duration-150 group-hover:text-rage-400">
            {listing.name}
          </h2>
        </Link>

        <div className="mb-3 flex items-center gap-2 text-sm text-zinc-400">
          <MapPin className="h-4 w-4 shrink-0 text-rage-500" />
          <span>{listing.city}{listing.region && `, ${listing.region}`}</span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-zinc-300">
          <div className="rounded-md border border-zinc-800 bg-dark-900/60 p-2">
            <span className="block text-[10px] uppercase tracking-wider text-zinc-500">Rage-room price</span>
            <span className="font-bold text-white">{startingPrice ?? "Not provided"}</span>
          </div>
          <div className="rounded-md border border-zinc-800 bg-dark-900/60 p-2">
            <span className="block text-[10px] uppercase tracking-wider text-zinc-500">Rage-room age</span>
            <span className="font-bold text-white">{listing.ageMin != null ? `${listing.ageMin}+` : "Not provided"}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-dark-900/60 p-2">
            <Clock className="h-3.5 w-3.5 text-rage-500" />
            <span>{duration ?? "Not provided"}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-dark-900/60 p-2">
            {listing.rating != null ? <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> : <Users className="h-3.5 w-3.5 text-rage-500" />}
            <span>{listing.rating != null ? `${listing.rating.toFixed(1)} rating` : "Group options"}</span>
          </div>
        </div>

        {occasionBadges.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {occasionBadges.map((occasion) => (
              <span key={occasion} className="rounded-full bg-zinc-800 px-2 py-1 text-[11px] font-semibold text-zinc-300">
                {getOccasionLabel(occasion)}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto border-t border-zinc-800 pt-3">
          {primaryAction.kind === "booking" ? (
            <TrackedBookingLink
              href={primaryAction.href}
              venueSlug={listingSlug}
              venueCity={listing.city}
              context={discoveryContext}
              ctaPlacement={ctaPlacement}
              comparisonContext={comparisonActive ? "active" : undefined}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-rage-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rage-600"
            >
              <CalendarCheck className="h-4 w-4" />
              {primaryAction.label}
              <ArrowRight className="h-4 w-4" />
            </TrackedBookingLink>
          ) : (
            <Link href={href} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-rage-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rage-600">
              {primaryAction.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <div className="mt-2 grid grid-cols-2 gap-2">
            {listing.bookingUrl && (
              <Link
                href={href}
                className="flex min-h-10 items-center justify-center rounded-md border border-zinc-700 px-3 py-2 text-xs font-bold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                View details
              </Link>
            )}
            {onCompareToggle && (
            <button
              type="button"
              onClick={() => onCompareToggle(listing)}
              disabled={compareDisabled && !compareSelected}
              className={`min-h-10 rounded-md border px-3 py-2 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${compareSelected ? "border-rage-500 bg-rage-500/15 text-rage-300" : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"} ${listing.bookingUrl ? "" : "col-span-2"}`}
            >
              {compareSelected ? "✓ Added to comparison" : "Compare venue"}
            </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
