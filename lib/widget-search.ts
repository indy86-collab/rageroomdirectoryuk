import { escapeHtml } from "@/lib/html-escape"
import { cityToSlug, regionToSlug } from "@/lib/location"
import { resolvePublicAssetOrigin } from "@/lib/site-url"
import { isCompleteUkPostcode, normaliseUkPostcode } from "@/lib/uk-postcode"
import type { Listing, ListingActivity } from "@/types/listing"

export const WIDGET_ATTRIBUTION_REL = "nofollow noopener"

export type WidgetQueryKind = "postcode" | "city" | "invalid"

export type WidgetLocationMatch = {
  type: "city" | "region"
  name: string
  slug: string
  href: string
  venueCount: number
}

export type WidgetSearchOutcome =
  | { status: "empty"; queryKind: "invalid"; message: string }
  | { status: "invalid"; queryKind: "invalid"; message: string }
  | { status: "postcode"; queryKind: "postcode"; postcode: string }
  | {
      status: "matches"
      queryKind: "city"
      matches: WidgetLocationMatch[]
    }
  | { status: "none"; queryKind: "city"; message: string }

export type WidgetLocationIndex = {
  cities: WidgetLocationMatch[]
  regions: WidgetLocationMatch[]
}

const ALLOWED_WIDGET_ACTIVITIES: ListingActivity[] = [
  "rage-room",
  "axe-throwing",
  "paint-splatter",
  "car-smash",
  "mobile-rage-room",
]

export function sanitiseWidgetActivity(value: string | null | undefined): ListingActivity {
  if (value && ALLOWED_WIDGET_ACTIVITIES.includes(value as ListingActivity)) {
    return value as ListingActivity
  }
  return "rage-room"
}

export function sanitiseWidgetLocationSlug(value: string | null | undefined) {
  if (!value) return ""
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 80)
}

export function sanitiseWidgetShowTitle(value: string | null | undefined) {
  return value !== "0"
}

export function buildWidgetLocationIndex(
  listings: Listing[],
  activity: ListingActivity = "rage-room"
): WidgetLocationIndex {
  const verified = listings.filter(
    (listing) =>
      listing.verified &&
      listing.locationType !== "mobile-service" &&
      listing.activities.includes(activity)
  )

  const cities = new Map<string, WidgetLocationMatch>()
  const regions = new Map<string, WidgetLocationMatch>()

  for (const listing of verified) {
    const cityName = listing.city.trim()
    if (cityName) {
      const slug = cityToSlug(cityName)
      const existing = cities.get(slug)
      if (existing) existing.venueCount += 1
      else {
        cities.set(slug, {
          type: "city",
          name: cityName,
          slug,
          href: `/city/${slug}`,
          venueCount: 1,
        })
      }
    }

    const regionName = listing.region.trim()
    if (regionName) {
      const slug = regionToSlug(regionName)
      const existing = regions.get(slug)
      if (existing) existing.venueCount += 1
      else {
        regions.set(slug, {
          type: "region",
          name: regionName,
          slug,
          href: `/region/${slug}`,
          venueCount: 1,
        })
      }
    }
  }

  const sortMatches = (left: WidgetLocationMatch, right: WidgetLocationMatch) =>
    right.venueCount - left.venueCount || left.name.localeCompare(right.name)

  return {
    cities: Array.from(cities.values()).sort(sortMatches),
    regions: Array.from(regions.values()).sort(sortMatches),
  }
}

function scoreMatch(query: string, name: string, slug: string) {
  const normalisedName = name.toLowerCase()
  const normalisedSlug = slug.toLowerCase()
  if (normalisedName === query || normalisedSlug === query) return 3
  if (normalisedName.startsWith(query) || normalisedSlug.startsWith(query)) return 2
  if (normalisedName.includes(query) || normalisedSlug.includes(query)) return 1
  return 0
}

export function searchWidgetLocations(
  rawQuery: string,
  index: WidgetLocationIndex
): WidgetSearchOutcome {
  const query = rawQuery.trim()
  if (!query) {
    return {
      status: "empty",
      queryKind: "invalid",
      message: "Enter a UK postcode or a town or city name.",
    }
  }

  if (isCompleteUkPostcode(query)) {
    return {
      status: "postcode",
      queryKind: "postcode",
      postcode: normaliseUkPostcode(query),
    }
  }

  if (query.length < 2) {
    return {
      status: "invalid",
      queryKind: "invalid",
      message: "Enter a complete UK postcode or at least two letters of a town or city.",
    }
  }

  const needle = query.toLowerCase().replace(/\s+/g, " ")
  const scored = [...index.cities, ...index.regions]
    .map((match) => ({ match, score: scoreMatch(needle, match.name, match.slug) }))
    .filter((row) => row.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.match.venueCount - a.match.venueCount ||
        a.match.name.localeCompare(b.match.name)
    )
    .slice(0, 8)
    .map((row) => row.match)

  if (scored.length === 0) {
    return {
      status: "none",
      queryKind: "city",
      message:
        "We could not match that location. Try a UK town or city from the directory, or a complete postcode such as SW1A 1AA.",
    }
  }

  return { status: "matches", queryKind: "city", matches: scored }
}

export function buildWidgetEmbedSrc({
  siteOrigin,
  showTitle = true,
  activity = "rage-room",
  location = "",
}: {
  siteOrigin: string
  showTitle?: boolean
  activity?: string
  location?: string
}) {
  const params = new URLSearchParams()
  const safeActivity = sanitiseWidgetActivity(activity)
  const safeLocation = sanitiseWidgetLocationSlug(location)
  if (!showTitle) params.set("title", "0")
  if (safeActivity !== "rage-room") params.set("activity", safeActivity)
  if (safeLocation) params.set("location", safeLocation)
  const query = params.toString()
  const origin = resolvePublicAssetOrigin(siteOrigin)
  return query
    ? `${origin}/embed/rage-room-finder?${query}`
    : `${origin}/embed/rage-room-finder`
}

export function buildWidgetEmbedHtml(src: string) {
  return `<iframe src="${escapeHtml(src)}" title="Find a Rage Room Near You" loading="lazy" referrerpolicy="no-referrer-when-downgrade" style="width:100%;max-width:420px;height:540px;border:0;border-radius:12px;overflow:hidden;"></iframe>`
}
