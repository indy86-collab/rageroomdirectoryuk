import { getListingCompleteness } from "@/lib/listing-quality"
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
}

function countBy(listings: Listing[], value: (listing: Listing) => string) {
  const counts = new Map<string, number>()
  for (const listing of listings) {
    const label = value(listing).trim() || "Unspecified"
    counts.set(label, (counts.get(label) || 0) + 1)
  }
  return Array.from(counts, ([label, count]) => ({ label, count })).sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label)
  )
}

export function buildRageRoomReportData(listings: Listing[]): RageRoomReportData {
  const verified = listings.filter((listing) => listing.verified)
  const prices = verified
    .map((listing) => listing.price)
    .filter((price): price is number => typeof price === "number")
  const latestTimestamp = Math.max(
    0,
    ...verified.map((listing) =>
      new Date(listing.lastVerified || listing.createdAt).getTime()
    )
  )
  const priceBandCounts = [
    { label: "Under £25", count: prices.filter((price) => price < 25).length },
    { label: "£25–£39", count: prices.filter((price) => price >= 25 && price < 40).length },
    { label: "£40–£59", count: prices.filter((price) => price >= 40 && price < 60).length },
    { label: "£60+", count: prices.filter((price) => price >= 60).length },
  ]
  const completenessScores = verified.map(
    (listing) => getListingCompleteness(listing).score
  )

  return {
    verifiedListings: verified.length,
    citiesCovered: new Set(verified.map((listing) => listing.city)).size,
    averageStartingPrice: prices.length
      ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
      : null,
    minimumStartingPrice: prices.length ? Math.min(...prices) : null,
    maximumStartingPrice: prices.length ? Math.max(...prices) : null,
    lastUpdated: latestTimestamp
      ? new Date(latestTimestamp).toISOString()
      : new Date(0).toISOString(),
    regions: countBy(verified, (listing) => listing.region),
    cities: countBy(verified, (listing) => listing.city),
    priceBands: priceBandCounts,
    completenessBands: [
      { label: "80–100% complete", count: completenessScores.filter((score) => score >= 80).length },
      { label: "50–79% complete", count: completenessScores.filter((score) => score >= 50 && score < 80).length },
      { label: "Under 50% complete", count: completenessScores.filter((score) => score < 50).length },
    ],
  }
}

function csvCell(value: string | number) {
  const string = String(value)
  return /[",\n]/.test(string) ? `"${string.replace(/"/g, '""')}"` : string
}

export function buildAggregateReportCsv(data: RageRoomReportData) {
  const rows: Array<[string, string, string | number]> = [
    ["summary", "verified_listings", data.verifiedListings],
    ["summary", "cities_covered", data.citiesCovered],
    ["summary", "average_starting_price_gbp", data.averageStartingPrice ?? ""],
    ["summary", "minimum_starting_price_gbp", data.minimumStartingPrice ?? ""],
    ["summary", "maximum_starting_price_gbp", data.maximumStartingPrice ?? ""],
    ["summary", "last_updated", data.lastUpdated],
    ...data.regions.map((row): [string, string, number] => ["region", row.label, row.count]),
    ...data.cities.map((row): [string, string, number] => ["city", row.label, row.count]),
    ...data.priceBands.map((row): [string, string, number] => ["price_band", row.label, row.count]),
    ...data.completenessBands.map((row): [string, string, number] => ["listing_completeness", row.label, row.count]),
  ]
  return ["category,metric,value", ...rows.map((row) => row.map(csvCell).join(","))].join("\n") + "\n"
}
