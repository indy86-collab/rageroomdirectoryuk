import { getListingCompleteness } from "@/lib/listing-quality"
import { buildInsightsStats, type InsightsStats } from "@/lib/insights-stats"
import type { Listing } from "@/types/listing"

export interface ReportRow {
  label: string
  count: number
}

export interface RageRoomReportData {
  verifiedListings: number
  citiesCovered: number
  averageStartingPrice: number | null
  minimumStartingPrice: number | null
  maximumStartingPrice: number | null
  lastUpdated: string
  regions: ReportRow[]
  cities: ReportRow[]
  priceBands: ReportRow[]
  completenessBands: ReportRow[]
  stats: InsightsStats
}

export function buildRageRoomReportData(listings: Listing[]): RageRoomReportData {
  const stats = buildInsightsStats(listings)
  const verified = listings.filter((listing) => listing.verified)
  const perPerson = stats.pricing.byUnit.find((row) => row.unit === "per-person")
  const completenessScores = verified.map((listing) => getListingCompleteness(listing).score)

  return {
    verifiedListings: stats.verifiedListings,
    citiesCovered: stats.citiesRepresented,
    averageStartingPrice: perPerson?.average ?? null,
    minimumStartingPrice: perPerson?.minimum ?? null,
    maximumStartingPrice: perPerson?.maximum ?? null,
    lastUpdated: stats.lastUpdated,
    regions: stats.allRegions.map((row) => ({ label: row.label, count: row.count })),
    cities: stats.allCities.map((row) => ({ label: row.label, count: row.count })),
    priceBands: stats.pricing.perPersonBands,
    completenessBands: [
      { label: "80–100% complete", count: completenessScores.filter((score) => score >= 80).length },
      { label: "50–79% complete", count: completenessScores.filter((score) => score >= 50 && score < 80).length },
      { label: "Under 50% complete", count: completenessScores.filter((score) => score < 50).length },
    ],
    stats,
  }
}

function csvCell(value: string | number) {
  const string = String(value)
  return /[",\n]/.test(string) ? `"${string.replace(/"/g, '""')}"` : string
}

export function buildAggregateReportCsv(data: RageRoomReportData) {
  const { stats } = data
  const perPerson = stats.pricing.byUnit.find((row) => row.unit === "per-person")
  const perRoom = stats.pricing.byUnit.find((row) => row.unit === "per-room")
  const perGroup = stats.pricing.byUnit.find((row) => row.unit === "per-group")

  const rows: Array<[string, string, string | number]> = [
    ["summary", "verified_listings", stats.verifiedListings],
    ["summary", "rage_room_listings", stats.rageRooms],
    ["summary", "axe_throwing_listings", stats.axeThrowing],
    ["summary", "paint_splatter_listings", stats.paintSplatter],
    ["summary", "car_smash_listings", stats.carSmash],
    ["summary", "mobile_rage_room_listings", stats.mobileRageRooms],
    ["summary", "fixed_location_venues", stats.fixedLocationVenues],
    ["summary", "mobile_service_venues", stats.mobileServiceVenues],
    ["summary", "multi_activity_venues", stats.multiActivityVenues],
    ["summary", "fixed_location_cities", stats.citiesRepresented],
    ["summary", "fixed_location_regions", stats.regionsRepresented],
    ["summary", "birthday_suitable_listings", stats.birthdayVenues],
    ["summary", "corporate_suitable_listings", stats.corporateVenues],
    ["summary", "stag_suitable_listings", stats.stagVenues],
    ["summary", "hen_suitable_listings", stats.henVenues],
    ["summary", "usable_published_prices", stats.pricing.usable],
    ["summary", "unavailable_prices", stats.pricing.unavailable],
    ["summary", "per_person_price_count", perPerson?.count ?? 0],
    ["summary", "per_person_minimum_gbp", perPerson?.minimum ?? ""],
    ["summary", "per_person_maximum_gbp", perPerson?.maximum ?? ""],
    ["summary", "per_person_average_gbp", perPerson?.average ?? ""],
    ["summary", "per_room_price_count", perRoom?.count ?? 0],
    ["summary", "per_room_minimum_gbp", perRoom?.minimum ?? ""],
    ["summary", "per_room_maximum_gbp", perRoom?.maximum ?? ""],
    ["summary", "per_room_average_gbp", perRoom?.average ?? ""],
    ["summary", "per_group_price_count", perGroup?.count ?? 0],
    ["summary", "dataset_last_verified", stats.lastUpdated],
    ...stats.allRegions.map((row): [string, string, number] => ["region", row.label, row.count]),
    ...stats.allCities.map((row): [string, string, number] => ["city", row.label, row.count]),
    ...stats.pricing.perPersonBands.map((row): [string, string, number] => [
      "per_person_price_band",
      row.label,
      row.count,
    ]),
    ...stats.activities.map((row): [string, string, number] => ["activity", row.label, row.count]),
    ...stats.occasions.map((row): [string, string, number] => ["occasion", row.label, row.count]),
    ...data.completenessBands.map((row): [string, string, number] => [
      "listing_completeness",
      row.label,
      row.count,
    ]),
  ]

  return ["category,metric,value", ...rows.map((row) => row.map(csvCell).join(","))].join("\n") + "\n"
}
