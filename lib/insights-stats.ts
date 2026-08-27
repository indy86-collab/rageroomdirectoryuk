import {
  ACTIVITY_DEFINITIONS,
  MIN_ACTIVITY_PAGE_LISTINGS,
  MIN_OCCASION_PAGE_LISTINGS,
  OCCASION_DEFINITIONS,
  getActivityCombinationHref,
  matchesOccasionDefinition,
  pluraliseVenue,
} from "@/lib/discovery"
import { cityToSlug, regionToSlug } from "@/lib/location"
import { PRIORITY_SEO_CITIES } from "@/lib/priority-seo-cities"
import {
  LISTING_PRICE_UNITS,
  type Listing,
  type ListingActivity,
  type ListingPriceUnit,
} from "@/types/listing"

export const MIN_PRICE_SAMPLE_FOR_RANGE = 5
export const MIN_CITIES_FOR_INSIGHT_PAGE = 5
export const MIN_REGIONS_FOR_INSIGHT_PAGE = 3
export const MIN_ACTIVITY_TYPES_FOR_INSIGHT_PAGE = 2

export const INSIGHT_HUB_PATH = "/insights"
export const REPORT_PATH = "/uk-rage-room-report-2026"
export const REPORT_CSV_PATH = "/uk-rage-room-report-2026/data.csv"
export const REPORT_PUBLISHED = "2026-07-14"
export const INSIGHT_PAGE_SLUGS = [
  "rage-room-prices",
  "rage-rooms-by-city",
  "rage-rooms-by-region",
  "rage-room-activities",
] as const

export type InsightPageSlug = (typeof INSIGHT_PAGE_SLUGS)[number]

export interface InsightCountRow {
  key: string
  label: string
  count: number
  href: string | null
}

export interface InsightPriceUnitStats {
  unit: ListingPriceUnit
  label: string
  count: number
  minimum: number | null
  maximum: number | null
  average: number | null
}

export interface InsightCitation {
  id: string
  statement: string
  href?: string
}

export interface InsightCoverageGap {
  key: string
  label: string
  href: string
}

export interface InsightPriceBand {
  label: string
  count: number
}

export interface InsightsStats {
  analysedListings: number
  verifiedListings: number
  lastUpdated: string
  rageRooms: number
  axeThrowing: number
  paintSplatter: number
  carSmash: number
  mobileRageRooms: number
  fixedLocationVenues: number
  mobileServiceVenues: number
  multiActivityVenues: number
  citiesRepresented: number
  regionsRepresented: number
  topCities: InsightCountRow[]
  allCities: InsightCountRow[]
  topRegions: InsightCountRow[]
  allRegions: InsightCountRow[]
  activities: InsightCountRow[]
  activityCombinations: InsightCountRow[]
  occasions: InsightCountRow[]
  birthdayVenues: number
  corporateVenues: number
  stagVenues: number
  henVenues: number
  stagOrHenVenues: number
  birthdayPercent: number | null
  corporatePercent: number | null
  stagPercent: number | null
  henPercent: number | null
  coverageGaps: InsightCoverageGap[]
  pricing: {
    usable: number
    unavailable: number
    unavailablePercent: number | null
    byUnit: InsightPriceUnitStats[]
    perPersonBands: InsightPriceBand[]
  }
  citations: InsightCitation[]
}

const PRICE_UNIT_LABELS: Record<ListingPriceUnit, string> = {
  "per-person": "per person",
  "per-room": "per room",
  "per-group": "per group",
}

const INSIGHT_ACTIVITY_ORDER: ListingActivity[] = [
  "rage-room",
  "axe-throwing",
  "paint-splatter",
  "car-smash",
  "mobile-rage-room",
  "escape-room",
  "archery",
  "vr",
  "airsoft-target",
]

function isVerified(listing: Listing) {
  return listing.verified === true
}

function isFixedVenue(listing: Listing) {
  return listing.locationType !== "mobile-service"
}

function hasUsablePrice(listing: Listing): listing is Listing & {
  price: number
  priceUnit: ListingPriceUnit
} {
  return (
    typeof listing.price === "number" &&
    Number.isFinite(listing.price) &&
    listing.price >= 0 &&
    listing.priceUnit != null &&
    (LISTING_PRICE_UNITS as readonly string[]).includes(listing.priceUnit)
  )
}

function countByLabel(
  listings: Listing[],
  value: (listing: Listing) => string | null
) {
  const counts = new Map<string, number>()
  for (const listing of listings) {
    const label = value(listing)?.trim()
    if (!label) continue
    counts.set(label, (counts.get(label) || 0) + 1)
  }
  return Array.from(counts, ([label, count]) => ({ label, count })).sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label)
  )
}

function summarisePrices(values: number[]) {
  if (values.length === 0) {
    return { minimum: null, maximum: null, average: null }
  }
  if (values.length < MIN_PRICE_SAMPLE_FOR_RANGE) {
    return { minimum: null, maximum: null, average: null }
  }
  const sum = values.reduce((total, price) => total + price, 0)
  return {
    minimum: Math.min(...values),
    maximum: Math.max(...values),
    average: Math.round(sum / values.length),
  }
}

function activityHref(activity: ListingActivity, count: number) {
  const definition = ACTIVITY_DEFINITIONS.find((item) => item.value === activity)
  if (!definition || count < MIN_ACTIVITY_PAGE_LISTINGS) return null
  return `/activities/${definition.slug}`
}

function occasionHref(slug: string, count: number) {
  if (count < MIN_OCCASION_PAGE_LISTINGS) return null
  return `/occasions/${slug}`
}

export function formatInsightDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatInsightCitationMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  })
}

export function citationClipboardText(
  statement: string,
  options?: { asOf?: string; sourceUrl?: string }
) {
  let text = `${statement} — Source: RageRoom Directory`
  if (options?.asOf) text += `, ${options.asOf}`
  if (options?.sourceUrl) text += `. ${options.sourceUrl}`
  return text
}

export function insightArticleDates(pagePublished: string, datasetUpdatedIso: string) {
  const datasetDay = datasetUpdatedIso.slice(0, 10)
  return {
    datePublished: pagePublished,
    dateModified: datasetDay > pagePublished ? datasetDay : pagePublished,
  }
}

export function percentOf(part: number, whole: number) {
  if (whole <= 0) return null
  return Math.round((part / whole) * 100)
}

export function flagshipReportCitation(datasetUpdatedIso: string, canonicalUrl: string) {
  return `RageRoom Directory, UK Rage Room Report 2026, updated ${formatInsightCitationMonth(datasetUpdatedIso)}. ${canonicalUrl}`
}

function perPersonPriceBands(prices: number[]): InsightPriceBand[] {
  return [
    { label: "Under £25", count: prices.filter((price) => price < 25).length },
    { label: "£25–£39", count: prices.filter((price) => price >= 25 && price < 40).length },
    { label: "£40–£59", count: prices.filter((price) => price >= 40 && price < 60).length },
    { label: "£60+", count: prices.filter((price) => price >= 60).length },
  ]
}

export function buildInsightsStats(listings: Listing[]): InsightsStats {
  const analysedListings = listings.length
  const verified = listings.filter(isVerified)
  const fixedVerified = verified.filter(isFixedVenue)
  const mobileServiceVenues = verified.filter(
    (listing) => listing.locationType === "mobile-service"
  ).length
  const multiActivityVenues = verified.filter(
    (listing) => new Set(listing.activities).size >= 2
  ).length

  const latestTimestamp = Math.max(
    0,
    ...verified.map((listing) =>
      new Date(listing.lastVerified || listing.createdAt).getTime()
    )
  )

  const rageRooms = verified.filter((listing) =>
    listing.activities.includes("rage-room")
  ).length
  const axeThrowing = verified.filter((listing) =>
    listing.activities.includes("axe-throwing")
  ).length
  const paintSplatter = verified.filter((listing) =>
    listing.activities.includes("paint-splatter")
  ).length
  const carSmash = verified.filter((listing) =>
    listing.activities.includes("car-smash")
  ).length
  const mobileRageRooms = verified.filter((listing) =>
    listing.activities.includes("mobile-rage-room")
  ).length

  const cityRows = countByLabel(fixedVerified, (listing) => listing.city).map(
    (row) => ({
      key: cityToSlug(row.label),
      label: row.label,
      count: row.count,
      href: `/city/${cityToSlug(row.label)}`,
    })
  )
  const regionRows = countByLabel(fixedVerified, (listing) => listing.region).map(
    (row) => ({
      key: regionToSlug(row.label),
      label: row.label,
      count: row.count,
      href: `/region/${regionToSlug(row.label)}`,
    })
  )

  const activities: InsightCountRow[] = []
  for (const activity of INSIGHT_ACTIVITY_ORDER) {
    const definition = ACTIVITY_DEFINITIONS.find((item) => item.value === activity)
    const count = verified.filter((listing) =>
      listing.activities.includes(activity)
    ).length
    if (!definition || count === 0) continue
    activities.push({
      key: activity,
      label: definition.shortLabel,
      count,
      href: activityHref(activity, count),
    })
  }

  const combinationCounts = new Map<string, InsightCountRow>()
  for (const listing of verified) {
    const unique = Array.from(new Set(listing.activities)).sort(
      (a, b) => INSIGHT_ACTIVITY_ORDER.indexOf(a) - INSIGHT_ACTIVITY_ORDER.indexOf(b)
    )
    if (unique.length < 2) continue
    for (let i = 0; i < unique.length; i += 1) {
      for (let j = i + 1; j < unique.length; j += 1) {
        const left = ACTIVITY_DEFINITIONS.find((item) => item.value === unique[i])
        const right = ACTIVITY_DEFINITIONS.find((item) => item.value === unique[j])
        if (!left || !right) continue
        const key = `${left.value}+${right.value}`
        const existing = combinationCounts.get(key)
        if (existing) {
          existing.count += 1
          continue
        }
        combinationCounts.set(key, {
          key,
          label: `${left.shortLabel} + ${right.shortLabel}`,
          count: 1,
          href: getActivityCombinationHref(left.slug, right.value),
        })
      }
    }
  }
  const activityCombinations = Array.from(combinationCounts.values())
    .filter((row) => row.count >= 2)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  const birthdayDefinition = OCCASION_DEFINITIONS.find((item) => item.slug === "birthdays")
  const corporateDefinition = OCCASION_DEFINITIONS.find(
    (item) => item.slug === "corporate-team-building"
  )
  const stagDefinition = OCCASION_DEFINITIONS.find((item) => item.slug === "stag-parties")
  const henDefinition = OCCASION_DEFINITIONS.find((item) => item.slug === "hen-parties")

  const birthdayVenues = birthdayDefinition
    ? verified.filter((listing) => matchesOccasionDefinition(listing, birthdayDefinition)).length
    : 0
  const corporateVenues = corporateDefinition
    ? verified.filter((listing) => matchesOccasionDefinition(listing, corporateDefinition)).length
    : 0
  const stagVenues = stagDefinition
    ? verified.filter((listing) => matchesOccasionDefinition(listing, stagDefinition)).length
    : 0
  const henVenues = henDefinition
    ? verified.filter((listing) => matchesOccasionDefinition(listing, henDefinition)).length
    : 0
  const stagOrHenVenues = verified.filter((listing) =>
    listing.occasions.includes("stag-parties") || listing.occasions.includes("hen-parties")
  ).length

  const occasions: InsightCountRow[] = [
    {
      key: "birthdays",
      label: "Birthdays",
      count: birthdayVenues,
      href: occasionHref("birthdays", birthdayVenues),
    },
    {
      key: "corporate-team-building",
      label: "Corporate / team-building",
      count: corporateVenues,
      href: occasionHref("corporate-team-building", corporateVenues),
    },
    {
      key: "stag-parties",
      label: "Stag parties",
      count: stagVenues,
      href: occasionHref("stag-parties", stagVenues),
    },
    {
      key: "hen-parties",
      label: "Hen parties",
      count: henVenues,
      href: occasionHref("hen-parties", henVenues),
    },
  ].filter((row) => row.count > 0)

  const usablePriced = verified.filter(hasUsablePrice)
  const unavailable = verified.length - usablePriced.length
  const byUnit: InsightPriceUnitStats[] = LISTING_PRICE_UNITS.map((unit) => {
    const prices = usablePriced
      .filter((listing) => listing.priceUnit === unit)
      .map((listing) => listing.price)
    return {
      unit,
      label: PRICE_UNIT_LABELS[unit],
      count: prices.length,
      ...summarisePrices(prices),
    }
  }).filter((row) => row.count > 0)

  const perPersonPrices = usablePriced
    .filter((listing) => listing.priceUnit === "per-person")
    .map((listing) => listing.price)
  const cityKeys = new Set(cityRows.map((row) => row.key))
  const coverageGaps: InsightCoverageGap[] = PRIORITY_SEO_CITIES.filter(
    (city) => !cityKeys.has(cityToSlug(city))
  ).map((city) => ({
    key: cityToSlug(city),
    label: city,
    href: `/city/${cityToSlug(city)}`,
  }))

  const lastUpdated = latestTimestamp
    ? new Date(latestTimestamp).toISOString()
    : new Date(0).toISOString()

  const citations: InsightCitation[] = [
    {
      id: "verified-total",
      statement: `RageRoom Directory tracks ${pluraliseVenue(verified.length)} in its verified UK directory dataset.`,
    },
    {
      id: "rage-rooms",
      statement: `RageRoom Directory tracks ${pluraliseVenue(rageRooms)} offering rage-room experiences across its verified UK directory dataset.`,
      href: activityHref("rage-room", rageRooms) ?? undefined,
    },
    {
      id: "cities",
      statement: `Verified fixed-location RageRoom Directory listings currently cover ${cityRows.length} ${cityRows.length === 1 ? "city" : "cities"} by recorded city field.`,
    },
    {
      id: "regions",
      statement: `Verified fixed-location RageRoom Directory listings currently cover ${regionRows.length} ${regionRows.length === 1 ? "region" : "regions"} by recorded region field.`,
    },
  ]

  if (axeThrowing > 0) {
    citations.push({
      id: "axe-throwing",
      statement: `${pluraliseVenue(axeThrowing)} in the RageRoom Directory dataset currently offer axe throwing.`,
      href: activityHref("axe-throwing", axeThrowing) ?? undefined,
    })
  }
  if (paintSplatter > 0) {
    citations.push({
      id: "paint-splatter",
      statement: `${pluraliseVenue(paintSplatter)} in the RageRoom Directory dataset currently offer paint or splatter experiences.`,
      href: activityHref("paint-splatter", paintSplatter) ?? undefined,
    })
  }
  if (carSmash > 0) {
    citations.push({
      id: "car-smash",
      statement: `${pluraliseVenue(carSmash)} in the RageRoom Directory dataset currently offer car-smash sessions.`,
      href: activityHref("car-smash", carSmash) ?? undefined,
    })
  }
  if (mobileRageRooms > 0) {
    citations.push({
      id: "mobile-rage-rooms",
      statement: `${pluraliseVenue(mobileRageRooms)} in the RageRoom Directory dataset currently offer mobile rage-room experiences.`,
      href: activityHref("mobile-rage-room", mobileRageRooms) ?? undefined,
    })
  }
  if (birthdayVenues > 0) {
    citations.push({
      id: "birthdays",
      statement: `${pluraliseVenue(birthdayVenues)} in the RageRoom Directory dataset are listed as suitable for birthdays.`,
      href: occasionHref("birthdays", birthdayVenues) ?? undefined,
    })
  }
  if (corporateVenues > 0) {
    citations.push({
      id: "corporate",
      statement: `${pluraliseVenue(corporateVenues)} in the RageRoom Directory dataset are listed as suitable for corporate or team-building groups.`,
      href: occasionHref("corporate-team-building", corporateVenues) ?? undefined,
    })
  }
  if (stagVenues > 0) {
    citations.push({
      id: "stag",
      statement: `${pluraliseVenue(stagVenues)} in the RageRoom Directory dataset are listed as suitable for stag groups.`,
      href: occasionHref("stag-parties", stagVenues) ?? undefined,
    })
  }
  if (henVenues > 0) {
    citations.push({
      id: "hen",
      statement: `${pluraliseVenue(henVenues)} in the RageRoom Directory dataset are listed as suitable for hen groups.`,
      href: occasionHref("hen-parties", henVenues) ?? undefined,
    })
  }
  if (verified.length > 0) {
    citations.push({
      id: "pricing-availability",
      statement: `Published, comparable starting prices are currently unavailable for ${unavailable} of ${verified.length} verified venues (${Math.round((unavailable / verified.length) * 100)}%). Unknown prices are not treated as zero.`,
    })
  }

  const perPerson = byUnit.find((row) => row.unit === "per-person")
  if (
    perPerson &&
    perPerson.minimum != null &&
    perPerson.maximum != null &&
    perPerson.average != null
  ) {
    citations.push({
      id: "per-person-prices",
      statement: `Among ${perPerson.count} verified venues with a published per-person starting price, figures currently range from £${perPerson.minimum} to £${perPerson.maximum}, with an average of £${perPerson.average}. Per-room and per-group prices are counted separately and are not averaged together.`,
      href: "/insights/rage-room-prices",
    })
  }

  return {
    analysedListings,
    verifiedListings: verified.length,
    lastUpdated,
    rageRooms,
    axeThrowing,
    paintSplatter,
    carSmash,
    mobileRageRooms,
    fixedLocationVenues: fixedVerified.length,
    mobileServiceVenues,
    multiActivityVenues,
    citiesRepresented: cityRows.length,
    regionsRepresented: regionRows.length,
    topCities: cityRows.slice(0, 10),
    allCities: cityRows,
    topRegions: regionRows.slice(0, 10),
    allRegions: regionRows,
    activities,
    activityCombinations,
    occasions,
    birthdayVenues,
    corporateVenues,
    stagVenues,
    henVenues,
    stagOrHenVenues,
    birthdayPercent: percentOf(birthdayVenues, verified.length),
    corporatePercent: percentOf(corporateVenues, verified.length),
    stagPercent: percentOf(stagVenues, verified.length),
    henPercent: percentOf(henVenues, verified.length),
    coverageGaps,
    pricing: {
      usable: usablePriced.length,
      unavailable,
      unavailablePercent:
        verified.length > 0
          ? Math.round((unavailable / verified.length) * 100)
          : null,
      byUnit,
      perPersonBands: perPersonPriceBands(perPersonPrices),
    },
    citations,
  }
}

export function getPublishedInsightPages(stats: InsightsStats): InsightPageSlug[] {
  const pages: InsightPageSlug[] = []
  if (stats.pricing.usable >= MIN_PRICE_SAMPLE_FOR_RANGE) {
    pages.push("rage-room-prices")
  }
  if (stats.citiesRepresented >= MIN_CITIES_FOR_INSIGHT_PAGE) {
    pages.push("rage-rooms-by-city")
  }
  if (stats.regionsRepresented >= MIN_REGIONS_FOR_INSIGHT_PAGE) {
    pages.push("rage-rooms-by-region")
  }
  const comparableActivities = stats.activities.filter((row) => row.count >= 2)
  if (comparableActivities.length >= MIN_ACTIVITY_TYPES_FOR_INSIGHT_PAGE) {
    pages.push("rage-room-activities")
  }
  return pages
}

export function isInsightPagePublished(slug: string, stats: InsightsStats): slug is InsightPageSlug {
  return getPublishedInsightPages(stats).includes(slug as InsightPageSlug)
}
