import { pluraliseVenue } from "@/lib/discovery"
import {
  flagshipReportCitation,
  formatInsightCitationMonth,
  percentOf,
  type InsightsStats,
} from "@/lib/insights-stats"

export function buildExecutiveFindings(stats: InsightsStats): string[] {
  const findings: string[] = [
    `RageRoom Directory currently tracks ${stats.verifiedListings} verified listings across ${stats.citiesRepresented} fixed-location cities.`,
    `${stats.rageRooms} of those listings offer rage-room experiences. Activity categories overlap, so a venue can appear in more than one activity total.`,
  ]

  const perPerson = stats.pricing.byUnit.find((row) => row.unit === "per-person")
  if (
    perPerson &&
    perPerson.minimum != null &&
    perPerson.maximum != null &&
    perPerson.average != null
  ) {
    findings.push(
      `Of listings with usable published pricing, per-person sessions range from £${perPerson.minimum} to £${perPerson.maximum}, with an average of £${perPerson.average} (n=${perPerson.count}).`
    )
  }

  if (stats.birthdayPercent != null) {
    findings.push(
      `${stats.birthdayPercent}% of verified listings advertise birthday suitability (${stats.birthdayVenues} of ${stats.verifiedListings}).`
    )
  }

  const topCity = stats.topCities[0]
  if (topCity) {
    findings.push(
      `${topCity.label} currently has the most fixed-location venues by recorded city field (${topCity.count}).`
    )
  }

  if (stats.pricing.unavailablePercent != null) {
    findings.push(
      `Published, comparable starting prices are currently unavailable for ${stats.pricing.unavailablePercent}% of verified listings (${stats.pricing.unavailable} of ${stats.verifiedListings}). Unknown prices are not treated as zero.`
    )
  }

  if (stats.axeThrowing > 0) {
    findings.push(
      `${pluraliseVenue(stats.axeThrowing)} currently offer axe throwing, including venues that also run a rage room.`
    )
  }

  findings.push(
    `${stats.fixedLocationVenues} listings are recorded as fixed venues and ${stats.mobileServiceVenues} as mobile operators. ${stats.mobileRageRooms} listings offer a mobile rage-room experience, which can include fixed venues that also travel.`
  )

  return findings.slice(0, 8)
}

export function insightAnswers(stats: InsightsStats) {
  const perPerson = stats.pricing.byUnit.find((row) => row.unit === "per-person")
  const topCity = stats.topCities[0]
  const rageAndAxe = stats.activityCombinations.find((row) => row.key === "rage-room+axe-throwing")

  return {
    howManyRageRooms: `RageRoom Directory currently tracks ${stats.rageRooms} verified listings offering rage-room experiences within a dataset of ${stats.verifiedListings} UK activity venues.`,
    howManyListings: `RageRoom Directory currently tracks ${stats.verifiedListings} verified listings. ${stats.fixedLocationVenues} are recorded as fixed venues and ${stats.mobileServiceVenues} as mobile operators.`,
    howMuch:
      perPerson && perPerson.minimum != null && perPerson.maximum != null && perPerson.average != null
        ? `Among ${perPerson.count} listings in our dataset with a published per-person starting price, figures currently range from £${perPerson.minimum} to £${perPerson.maximum}, with an average of £${perPerson.average}. Per-room and per-group prices are counted separately and are not averaged together.`
        : `RageRoom Directory does not currently have enough comparable per-person prices to publish a representative UK range. Unknown prices are not treated as zero.`,
    topCity: topCity
      ? `${topCity.label} currently has the most fixed-location venues by recorded city field in the dataset (${topCity.count}). Directory city pages can show a different total because they may include nearby or canonical region matches.`
      : `RageRoom Directory does not currently have enough fixed-location city data to name a leading city.`,
    axeThrowing: `${pluraliseVenue(stats.axeThrowing)} in the RageRoom Directory dataset currently offer axe throwing.${rageAndAxe ? ` ${rageAndAxe.count} of those listings combine axe throwing with a rage room.` : ""}`,
    birthdays:
      stats.birthdayPercent != null
        ? `${stats.birthdayVenues} verified venues (${stats.birthdayPercent}%) in our dataset advertise birthday suitability. This is a listing claim, not a guarantee that every package is a birthday event.`
        : `RageRoom Directory does not currently have enough occasion data to describe birthday suitability.`,
    corporate:
      stats.corporatePercent != null
        ? `${stats.corporateVenues} verified venues (${stats.corporatePercent}%) in our dataset are listed as suitable for corporate or team-building groups.`
        : `RageRoom Directory does not currently have enough occasion data to describe corporate suitability.`,
    publishedPrices: `${stats.pricing.usable} of ${stats.verifiedListings} verified listings currently have a usable published price and known unit. ${stats.pricing.unavailable} do not, so they are omitted from ranges rather than counted as £0.`,
    asOf: formatInsightCitationMonth(stats.lastUpdated),
    citation: (url: string) => flagshipReportCitation(stats.lastUpdated, url),
    occasionShare: (count: number) => percentOf(count, stats.verifiedListings),
  }
}
