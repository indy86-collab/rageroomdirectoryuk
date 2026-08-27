import { ACTIVITY_DEFINITIONS, pluraliseVenue } from "@/lib/discovery"
import type { InsightsStats } from "@/lib/insights-stats"
import type { ListingActivity } from "@/types/listing"

export interface DirectoryInsightCalloutData {
  statement: string
  href: string
  linkLabel: string
}

export function getCityDirectoryInsight(
  stats: InsightsStats,
  citySlug: string,
  cityName: string
): DirectoryInsightCalloutData {
  const row = stats.allCities.find((item) => item.key === citySlug)
  if (row) {
    return {
      statement: `RageRoom Directory currently records ${row.count} fixed-location ${row.count === 1 ? "venue" : "venues"} with ${cityName} as their city. This page can also include nearby or canonical region matches, so the live list may differ from that city-field count.`,
      href: "/insights/rage-rooms-by-city",
      linkLabel: `See how ${cityName} compares with other UK cities`,
    }
  }

  return {
    statement: `RageRoom Directory currently has no verified fixed-location listing recorded for ${cityName} as a city. Nearby options below, if shown, come from travelling-distance matches rather than an in-city record.`,
    href: "/insights/rage-rooms-by-city",
    linkLabel: "See coverage across UK cities in the dataset",
  }
}

export function getRegionDirectoryInsight(
  stats: InsightsStats,
  regionSlug: string,
  regionName: string
): DirectoryInsightCalloutData | null {
  const row = stats.allRegions.find((item) => item.key === regionSlug)
  if (!row) return null

  return {
    statement: `RageRoom Directory currently records ${row.count} fixed-location ${row.count === 1 ? "venue" : "venues"} with ${regionName} as their region.`,
    href: "/insights/rage-rooms-by-region",
    linkLabel: `See how ${regionName} compares with other UK regions`,
  }
}

export function getActivityDirectoryInsight(
  stats: InsightsStats,
  activity: ListingActivity
): DirectoryInsightCalloutData | null {
  const row = stats.activities.find((item) => item.key === activity)
  const definition = ACTIVITY_DEFINITIONS.find((item) => item.value === activity)
  if (!row || !definition) return null

  const researchActivities = new Set([
    "rage-room",
    "axe-throwing",
    "paint-splatter",
    "car-smash",
    "mobile-rage-room",
  ])
  if (!researchActivities.has(activity)) return null

  return {
    statement: `${pluraliseVenue(row.count)} in our verified directory dataset currently offer ${definition.shortLabel.toLowerCase()}.`,
    href: "/insights/rage-room-activities",
    linkLabel: "See how this activity appears across the dataset",
  }
}

export function getOccasionDirectoryInsight(
  stats: InsightsStats,
  slug: string
): DirectoryInsightCalloutData | null {
  const row = stats.occasions.find((item) => item.key === slug)
  if (!row) return null

  return {
    statement: `${pluraliseVenue(row.count)} in our verified dataset advertise suitability for ${row.label.toLowerCase()}.`,
    href: "/uk-rage-room-report-2026",
    linkLabel: "Read the UK Rage Room Report 2026",
  }
}
