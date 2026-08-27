import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import CopyStatisticButton from "@/components/CopyStatisticButton"
import InsightsMethodology from "@/components/InsightsMethodology"
import {
  InsightQuestion,
  InsightsBarList,
  InsightsCountTable,
  InsightsStatCard,
} from "@/components/InsightsVisuals"
import TrackedInsightLink from "@/components/TrackedInsightLink"
import TrackedReportDatasetLink from "@/components/TrackedReportDatasetLink"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOgImageUrl,
} from "@/lib/seo-schema"
import { buildExecutiveFindings, insightAnswers } from "@/lib/insights-copy"
import {
  REPORT_CSV_PATH,
  REPORT_META,
  REPORT_PATH,
  REPORT_PUBLISHED,
} from "@/lib/insights-pages"
import {
  flagshipReportCitation,
  formatInsightDate,
  formatInsightCitationMonth,
  insightArticleDates,
} from "@/lib/insights-stats"
import { buildRageRoomReportData } from "@/lib/report-data"
import { absoluteUrl } from "@/lib/site-url"

const OG_IMAGE = buildOgImageUrl({
  title: REPORT_META.heading,
  subtitle: "Prices, locations and activities from the verified dataset",
  badge: "Report",
})

export const metadata: Metadata = {
  title: REPORT_META.title,
  description: REPORT_META.description,
  alternates: { canonical: REPORT_PATH },
  openGraph: {
    title: REPORT_META.title,
    description: REPORT_META.description,
    type: "article",
    url: REPORT_PATH,
    images: [
      { url: OG_IMAGE, width: 1200, height: 630, alt: REPORT_META.heading },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: REPORT_META.title,
    description: REPORT_META.description,
    images: [OG_IMAGE],
  },
}

export const revalidate = 3600

export default async function UkRageRoomReport2026Page() {
  const { getAllListingsForAdmin } = await import("@/lib/listings")
  const listings = await getAllListingsForAdmin()
  const report = buildRageRoomReportData(listings)
  const stats = report.stats
  const answers = insightAnswers(stats)
  const findings = buildExecutiveFindings(stats)
  const dateLabel = formatInsightDate(stats.lastUpdated)
  const citationAsOf = formatInsightCitationMonth(stats.lastUpdated)
  const canonicalUrl = absoluteUrl(REPORT_PATH)
  const citationText = flagshipReportCitation(stats.lastUpdated, canonicalUrl)
  const articleDates = insightArticleDates(REPORT_PUBLISHED, stats.lastUpdated)
  const publishedLabel = formatInsightDate(`${REPORT_PUBLISHED}T00:00:00.000Z`)
  const perPerson = stats.pricing.byUnit.find((row) => row.unit === "per-person")
  const perRoom = stats.pricing.byUnit.find((row) => row.unit === "per-room")
  const perGroup = stats.pricing.byUnit.find((row) => row.unit === "per-group")
  const topCity = stats.topCities[0]
  const topRegion = stats.topRegions[0]
  const rageAndAxe = stats.activityCombinations.find((row) => row.key === "rage-room+axe-throwing")
  const rageAndPaint = stats.activityCombinations.find((row) => row.key === "rage-room+paint-splatter")

  const articleSchema = buildArticleSchema({
    url: REPORT_PATH,
    headline: REPORT_META.heading,
    description: REPORT_META.description,
    datePublished: articleDates.datePublished,
    dateModified: articleDates.dateModified,
    image: OG_IMAGE,
    keywords: [
      "UK rage room report 2026",
      "UK rage room statistics",
      "rage room prices UK",
      "smash room venues UK",
    ],
  })
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "UK Rage Room Statistics", url: "/insights" },
    { name: REPORT_META.heading, url: REPORT_PATH },
  ])
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${canonicalUrl}#dataset`,
    name: "UK Rage Room Report 2026 aggregate dataset",
    description:
      "Aggregate counts from the verified RageRoom Directory dataset: listing totals, activity mix, fixed-location city and region coverage, occasion suitability and published prices by unit. The download does not include venue contact details or private submission fields.",
    url: canonicalUrl,
    dateModified: stats.lastUpdated,
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "RageRoom Directory",
      url: absoluteUrl("/"),
    },
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: "RageRoom Directory Insights",
      url: absoluteUrl("/insights"),
    },
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: absoluteUrl(REPORT_CSV_PATH),
    },
    variableMeasured: [
      "Verified listing count",
      "Rage-room listings",
      "Activity mix",
      "Fixed-location cities",
      "Fixed-location regions",
      "Published prices by unit",
      "Occasion suitability",
    ],
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {[articleSchema, breadcrumbSchema, datasetSchema].map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "UK Rage Room Statistics", href: "/insights" },
            { label: REPORT_META.heading },
          ]}
        />

        <article>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            Annual data report
          </p>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            {REPORT_META.heading}
          </h1>
          <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
            A data publication from RageRoom Directory describing the UK rage-room
            and adjacent activity market represented in our verified directory.
            These figures describe listings we currently track. They are not a
            complete national census of every venue that may operate in the UK.
          </p>
          <p className="mb-8 mt-3 text-sm text-zinc-500">
            First published {publishedLabel}. Dataset last verified {dateLabel}.
            Page updated {formatInsightDate(`${articleDates.dateModified}T00:00:00.000Z`)}.
          </p>

          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InsightsStatCard label="Verified listings" value={String(stats.verifiedListings)} href="/listings" />
            <InsightsStatCard
              label="Rage rooms"
              value={String(stats.rageRooms)}
              href="/activities/rage-rooms"
            />
            <InsightsStatCard
              label="Fixed-location cities"
              value={String(stats.citiesRepresented)}
              href="/insights/rage-rooms-by-city"
            />
            <InsightsStatCard
              label="Usable published prices"
              value={String(stats.pricing.usable)}
              href="/insights/rage-room-prices"
            />
          </div>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Executive summary</h2>
            <ol className="list-decimal space-y-3 pl-5 text-zinc-300">
              {findings.map((finding) => (
                <li key={finding}>{finding}</li>
              ))}
            </ol>
          </section>

          <InsightQuestion question="How many rage rooms does RageRoom Directory track?">
            <p>{answers.howManyRageRooms}</p>
          </InsightQuestion>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">
              How many rage rooms are tracked in the UK?
            </h2>
            <p className="mb-5 text-zinc-300">
              {answers.howManyListings} Listings can offer more than one activity,
              so rage-room, axe-throwing and paint totals are not mutually exclusive.
            </p>
            <InsightsCountTable
              caption="Verified listing counts by type"
              labelHeading="Measure"
              rows={[
                { label: "Verified listings", count: stats.verifiedListings, href: "/listings" },
                { label: "Rage-room experiences", count: stats.rageRooms, href: "/activities/rage-rooms" },
                { label: "Fixed-location venues", count: stats.fixedLocationVenues },
                { label: "Mobile-service operators", count: stats.mobileServiceVenues },
                { label: "Mobile rage-room offerings", count: stats.mobileRageRooms, href: "/activities/mobile-rage-rooms" },
                { label: "Listings with two or more activities", count: stats.multiActivityVenues },
              ]}
            />
            <p className="mt-4 text-sm text-zinc-400">
              A mobile rage-room offering is an activity label. It can appear at a
              travelling operator or at a fixed venue that also takes the experience
              on the road, so it is not the same as the mobile-operator count.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Rage rooms by city</h2>
            <p className="mb-5 text-zinc-300">
              {answers.topCity} The table below uses fixed-location venues only.
              {" "}
              <Link href="/insights/rage-rooms-by-city" className="font-semibold text-orange-500 hover:text-orange-400">
                See the full city comparison
              </Link>
              .
            </p>
            <div className="mb-6">
              <InsightsBarList rows={stats.topCities} />
            </div>
            <InsightsCountTable
              caption="Top UK cities by recorded city field for fixed-location venues"
              labelHeading="City"
              rows={stats.topCities.map((row) => ({
                label: row.label,
                count: row.count,
                href: row.href,
              }))}
            />
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Rage rooms by region</h2>
            <p className="mb-5 text-zinc-300">
              {topRegion
                ? `${topRegion.label} currently has the most fixed-location venues by recorded region field (${topRegion.count}).`
                : "Region totals use each venue's recorded region field."}{" "}
              <Link href="/insights/rage-rooms-by-region" className="font-semibold text-orange-500 hover:text-orange-400">
                See the full region comparison
              </Link>
              .
            </p>
            <div className="mb-6">
              <InsightsBarList rows={stats.topRegions} />
            </div>
            <InsightsCountTable
              caption="Top UK regions by recorded region field for fixed-location venues"
              labelHeading="Region"
              rows={stats.topRegions.map((row) => ({
                label: row.label,
                count: row.count,
                href: row.href,
              }))}
            />
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Rage room prices</h2>
            <InsightQuestion question="How much does a rage room cost in the UK?" headingLevel="h3">
              <p>{answers.howMuch}</p>
            </InsightQuestion>
            <p className="mb-5 text-zinc-300">
              {answers.publishedPrices}{" "}
              <Link href="/insights/rage-room-prices" className="font-semibold text-orange-500 hover:text-orange-400">
                Read the pricing research
              </Link>
              . For a venue-by-venue booking comparison, use the{" "}
              <TrackedInsightLink href="/rage-room-prices-uk" className="font-semibold text-orange-500 hover:text-orange-400">
                UK prices hub
              </TrackedInsightLink>
              .
            </p>
            <InsightsCountTable
              caption="Published prices by unit in the verified dataset"
              labelHeading="Price unit"
              rows={[
                {
                  label: "Per person",
                  count: perPerson?.count ?? 0,
                  extra:
                    perPerson?.average != null && perPerson.minimum != null && perPerson.maximum != null
                      ? `£${perPerson.minimum}–£${perPerson.maximum}, average £${perPerson.average}`
                      : "Not enough comparable prices for a range",
                },
                {
                  label: "Per room",
                  count: perRoom?.count ?? 0,
                  extra:
                    perRoom?.average != null && perRoom.minimum != null && perRoom.maximum != null
                      ? `£${perRoom.minimum}–£${perRoom.maximum}, average £${perRoom.average}`
                      : "Not enough comparable prices for a range",
                },
                {
                  label: "Per group",
                  count: perGroup?.count ?? 0,
                  extra: "Count only; sample below the range threshold",
                },
                {
                  label: "Pricing unavailable",
                  count: stats.pricing.unavailable,
                  extra:
                    stats.pricing.unavailablePercent != null
                      ? `${stats.pricing.unavailablePercent}% of verified listings`
                      : undefined,
                },
              ]}
            />
            {perPerson && perPerson.count >= 5 && (
              <div className="mt-6">
                <h3 className="mb-3 text-lg font-bold text-white">Per-person starting-price bands</h3>
                <p className="mb-4 text-sm text-zinc-400">
                  These bands use published per-person starting prices only. They do not include per-room or per-group rates.
                </p>
                <InsightsCountTable
                  caption="Per-person starting-price bands"
                  labelHeading="Band"
                  rows={stats.pricing.perPersonBands.map((row) => ({
                    label: row.label,
                    count: row.count,
                  }))}
                />
              </div>
            )}
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Activities</h2>
            <InsightQuestion question="How many rage rooms offer axe throwing?" headingLevel="h3">
              <p>{answers.axeThrowing}</p>
            </InsightQuestion>
            <p className="mb-5 text-zinc-300">
              Category totals can exceed unique venue totals because venues may offer more than one activity.{" "}
              <Link href="/insights/rage-room-activities" className="font-semibold text-orange-500 hover:text-orange-400">
                See the activity mix in more detail
              </Link>
              .
            </p>
            <div className="mb-6">
              <InsightsBarList rows={stats.activities} />
            </div>
            <InsightsCountTable
              caption="Verified listings by activity"
              labelHeading="Activity"
              rows={stats.activities.map((row) => ({
                label: row.label,
                count: row.count,
                href: row.href,
              }))}
            />
            {stats.activityCombinations.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 text-lg font-bold text-white">Common combinations</h3>
                <p className="mb-4 text-sm text-zinc-400">
                  Pairs shown here appear at two or more verified listings.
                  {rageAndAxe ? ` Rage room + axe throwing appears at ${rageAndAxe.count} listings.` : ""}
                  {rageAndPaint ? ` Rage room + paint or splatter appears at ${rageAndPaint.count} listings.` : ""}
                </p>
                <InsightsCountTable
                  caption="Activity combinations with at least two verified listings"
                  labelHeading="Combination"
                  rows={stats.activityCombinations.slice(0, 8).map((row) => ({
                    label: row.label,
                    count: row.count,
                    href: row.href,
                  }))}
                />
              </div>
            )}
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Occasions and group use</h2>
            <InsightQuestion question="Are rage rooms suitable for birthdays?" headingLevel="h3">
              <p>{answers.birthdays}</p>
            </InsightQuestion>
            <InsightQuestion question="Are rage rooms used for corporate team building?" headingLevel="h3">
              <p>{answers.corporate}</p>
            </InsightQuestion>
            <p className="mb-5 text-zinc-300">
              Occasion labels are included only when the listing has evidence-backed occasion data. A missing label does not prove that a venue refuses that group.
            </p>
            <div className="mb-6">
              <InsightsBarList rows={stats.occasions} />
            </div>
            <InsightsCountTable
              caption="Occasion suitability in the verified dataset"
              labelHeading="Occasion"
              extraHeading="Share of verified listings"
              rows={stats.occasions.map((row) => ({
                label: row.label,
                count: row.count,
                href: row.href,
                extra:
                  answers.occasionShare(row.count) != null
                    ? `${answers.occasionShare(row.count)}%`
                    : undefined,
              }))}
            />
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Geographic coverage</h2>
            <p className="mb-5 text-zinc-300">
              RageRoom Directory currently records verified fixed-location listings in {stats.citiesRepresented} cities and {stats.regionsRepresented} regions. That is coverage in our dataset, not a statement that no other UK venues exist.
            </p>
            {stats.coverageGaps.length > 0 && (
              <>
                <p className="mb-4 text-zinc-300">
                  Among larger UK cities we watch closely, RageRoom Directory currently has no verified fixed-location listing recorded for:
                </p>
                <ul className="mb-4 flex flex-wrap gap-2">
                  {stats.coverageGaps.map((city) => (
                    <li key={city.key}>
                      <TrackedInsightLink
                        href={city.href}
                        className="inline-flex rounded-full border border-zinc-700 bg-[#151515] px-3 py-1.5 text-sm font-semibold text-zinc-200 hover:border-orange-500"
                      >
                        {city.label}
                      </TrackedInsightLink>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-zinc-400">
                  Those city pages may still show nearby options. Absence from this dataset is not proof that no rage room operates there.
                </p>
              </>
            )}
          </section>

          <InsightsMethodology stats={stats} />

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Download the data</h2>
            <p className="mb-5 text-zinc-300">
              The underlying dataset for this report is an aggregate CSV. It contains counts, not venue contact details, booking URLs, emails or other private fields. Check venue-level facts on the live listing before publication.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { href: `${REPORT_PATH}/charts/regions.svg`, label: "Regional coverage chart" },
                { href: `${REPORT_PATH}/charts/prices.svg`, label: "Per-person starting-price chart" },
              ].map((chart) => (
                <a key={chart.href} href={chart.href} className="overflow-hidden rounded-lg border border-zinc-800 bg-[#181818] hover:border-orange-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={chart.href} alt={chart.label} className="h-auto w-full" loading="lazy" />
                  <span className="block px-4 py-3 text-sm font-semibold text-orange-500">
                    Open {chart.label.toLowerCase()} →
                  </span>
                </a>
              ))}
            </div>
            <TrackedReportDatasetLink
              href={REPORT_CSV_PATH}
              className="mt-4 inline-flex rounded-md bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Download the aggregate CSV
            </TrackedReportDatasetLink>
          </section>

          <section className="mb-10 rounded-lg border border-zinc-800 bg-[#181818] p-6">
            <h2 className="mb-3 text-2xl font-bold text-white">Cite this report</h2>
            <p className="text-zinc-300">Suggested citation:</p>
            <blockquote className="mt-3 text-sm leading-relaxed text-zinc-200 sm:text-base">
              {citationText}
            </blockquote>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <CopyStatisticButton
                text={citationText}
                label="Copy citation"
                eventName="report_citation_copied"
              />
              <span className="text-xs text-zinc-500">Plain text</span>
            </div>
            <p className="mt-4 text-sm text-zinc-400">
              Publisher: RageRoom Directory. Canonical URL: {canonicalUrl}. Dataset last verified {citationAsOf}.
            </p>
          </section>

          <section className="mb-10 rounded-lg border border-orange-500/30 bg-orange-500/10 p-6">
            <h2 className="mb-3 text-2xl font-bold text-white">Press and research enquiries</h2>
            <p className="text-zinc-300">
              Journalists, tourism teams, student publications and industry researchers may cite these figures with a link to this report. For methodology questions or corrections, email{" "}
              <a href="mailto:ukrageroom@gmail.com?subject=UK%20Rage%20Room%20Report%202026" className="font-semibold text-orange-500 underline">
                ukrageroom@gmail.com
              </a>
              .
            </p>
          </section>

          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-6 text-sm text-zinc-300">
            {topCity ? (
              <p>
                Looking for venues rather than statistics? Start with{" "}
                <TrackedInsightLink href={topCity.href ?? "/listings"} className="font-semibold text-orange-500">
                  {topCity.label}
                </TrackedInsightLink>
                , the{" "}
                <TrackedInsightLink href="/activities/rage-rooms" className="font-semibold text-orange-500">
                  rage-room directory
                </TrackedInsightLink>
                , or the{" "}
                <Link href="/insights" className="font-semibold text-orange-500">
                  Insights research hub
                </Link>
                .
              </p>
            ) : (
              <p>
                Explore the{" "}
                <Link href="/insights" className="font-semibold text-orange-500">
                  Insights research hub
                </Link>{" "}
                or the{" "}
                <TrackedInsightLink href="/listings" className="font-semibold text-orange-500">
                  full listings
                </TrackedInsightLink>
                .
              </p>
            )}
            <p className="mt-3 text-xs text-zinc-600">Source URL: {canonicalUrl}</p>
          </div>
        </article>
      </div>
    </div>
  )
}
