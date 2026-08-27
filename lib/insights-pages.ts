import type { InsightPageSlug, InsightsStats } from "@/lib/insights-stats"

export const INSIGHTS_PUBLISHED = "2026-08-27"
export const REPORT_PUBLISHED = "2026-07-14"
export const REPORT_PATH = "/uk-rage-room-report-2026"
export const REPORT_CSV_PATH = "/uk-rage-room-report-2026/data.csv"

export const INSIGHT_HUB_META = {
  title: "UK Rage Room Statistics & Insights 2026",
  description:
    "Research hub for verified UK rage room statistics from the RageRoom Directory dataset: venue counts, activities, cities, regions and pricing availability. For the annual publication, see the UK Rage Room Report 2026.",
}

export const REPORT_META = {
  title: "UK Rage Room Report 2026: Prices, Locations & Activities",
  description:
    "RageRoom Directory's 2026 data report on verified UK listings: how many venues are tracked, where they are concentrated, published prices, activity mix and dataset limitations.",
  heading: "UK Rage Room Report 2026",
}

export const INSIGHT_PAGE_META: Record<
  InsightPageSlug,
  { title: string; description: string; heading: string }
> = {
  "rage-room-prices": {
    title: "UK Rage Room Price Statistics",
    description:
      "Aggregate per-person, per-room and per-group price ranges from verified RageRoom Directory listings. Dataset research, not a venue-by-venue booking comparison.",
    heading: "UK Rage Room Price Statistics",
  },
  "rage-rooms-by-city": {
    title: "How Many Rage Rooms Are There in Each UK City?",
    description:
      "Comparative counts of verified fixed-location listings by recorded city in the RageRoom Directory dataset. Use city directory pages to find and compare venues.",
    heading: "UK Rage Room Statistics by City",
  },
  "rage-rooms-by-region": {
    title: "UK Rage Room Coverage by Region",
    description:
      "Aggregate regional comparison of verified fixed-location listings in the RageRoom Directory dataset. Regional directory pages remain the place to browse venues.",
    heading: "UK Rage Room Statistics by Region",
  },
  "rage-room-activities": {
    title: "UK Rage Room Activity Statistics",
    description:
      "How many verified UK listings offer rage rooms, axe throwing, paint splatter, car smash and mobile experiences, including overlapping activities.",
    heading: "UK Rage Room Activity Statistics",
  },
}

export function insightPageIntro(slug: InsightPageSlug, stats: InsightsStats) {
  switch (slug) {
    case "rage-room-prices":
      return `These figures summarise published prices in the verified RageRoom Directory dataset. Per-person, per-room and per-group rates are counted separately because they are not equivalent. Unknown prices are not treated as zero. For a venue-by-venue booking comparison, use the live prices hub. Last updated ${stats.lastUpdated.slice(0, 10)}.`
    case "rage-rooms-by-city":
      return `This is a comparative dataset view by recorded city, not a venue finder. Rankings use the venue's recorded city field and fixed-location venues only. Directory location pages may include nearby or canonical region matches and can therefore show a different total. Mobile operators are excluded from city totals. Last updated ${stats.lastUpdated.slice(0, 10)}.`
    case "rage-rooms-by-region":
      return `This page compares regional coverage in the dataset. Totals use each venue's recorded region field and exclude mobile operators. Blank region values are omitted rather than counted as zero, so city and region totals are not interchangeable. Last updated ${stats.lastUpdated.slice(0, 10)}.`
    case "rage-room-activities":
      return `This page analyses activity mix and overlap in the dataset; activity directory pages remain the place to browse venues. Venues can offer more than one activity, so category totals can exceed the number of unique venues. Figures below are calculated from ${stats.verifiedListings} verified listings.`
  }
}
