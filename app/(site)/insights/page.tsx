import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import InsightsMethodology from "@/components/InsightsMethodology"
import {
  InsightCitationBlock,
  InsightsBarList,
  InsightsStatCard,
} from "@/components/InsightsVisuals"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOgImageUrl,
} from "@/lib/seo-schema"
import {
  buildInsightsStats,
  formatInsightCitationMonth,
  formatInsightDate,
  getPublishedInsightPages,
  insightArticleDates,
} from "@/lib/insights-stats"
import { INSIGHT_HUB_META, INSIGHT_PAGE_META, INSIGHTS_PUBLISHED } from "@/lib/insights-pages"
import { absoluteUrl } from "@/lib/site-url"

const PATH = "/insights"
const OG_IMAGE = buildOgImageUrl({
  title: INSIGHT_HUB_META.title,
  subtitle: "Verified directory dataset",
  badge: "Insights",
})

export const metadata: Metadata = {
  title: INSIGHT_HUB_META.title,
  description: INSIGHT_HUB_META.description,
  alternates: { canonical: PATH },
  openGraph: {
    title: INSIGHT_HUB_META.title,
    description: INSIGHT_HUB_META.description,
    type: "article",
    url: PATH,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: INSIGHT_HUB_META.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: INSIGHT_HUB_META.title,
    description: INSIGHT_HUB_META.description,
    images: [OG_IMAGE],
  },
}

export const revalidate = 3600

export default async function InsightsPage() {
  const { getAllListingsForAdmin } = await import("@/lib/listings")
  const stats = buildInsightsStats(await getAllListingsForAdmin())
  const dateLabel = formatInsightDate(stats.lastUpdated)
  const citationAsOf = formatInsightCitationMonth(stats.lastUpdated)
  const citationSource = absoluteUrl(PATH)
  const publishedPages = getPublishedInsightPages(stats)
  const rageRoomCitation = stats.citations.find((item) => item.id === "rage-rooms")
  const verifiedCitation = stats.citations.find((item) => item.id === "verified-total")
  const articleDates = insightArticleDates(INSIGHTS_PUBLISHED, stats.lastUpdated)

  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: INSIGHT_HUB_META.title,
    description: INSIGHT_HUB_META.description,
    datePublished: articleDates.datePublished,
    dateModified: articleDates.dateModified,
    keywords: [
      "UK rage room statistics",
      "rage room insights",
      "smash room venues UK",
      "rage room prices UK",
    ],
  })
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "UK Rage Room Statistics", url: PATH },
  ])

  return (
    <div className="py-6 sm:py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {[articleSchema, breadcrumbSchema].map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "UK Rage Room Statistics" },
          ]}
        />

        <article>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            Insights 2026
          </p>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            {INSIGHT_HUB_META.title}
          </h1>
          <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
            A citation-ready snapshot of the UK smash-room market, calculated only from
            RageRoom Directory&apos;s verified venue dataset. These figures are not
            estimates, surveys or invented averages.
          </p>
          <p className="mb-8 mt-3 text-sm text-zinc-500">Last updated: {dateLabel}</p>

          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InsightsStatCard
              label="Verified venues"
              value={String(stats.verifiedListings)}
              href="/listings"
              statement={verifiedCitation?.statement}
              asOf={citationAsOf}
              sourceUrl={citationSource}
            />
            <InsightsStatCard
              label="Rage rooms"
              value={String(stats.rageRooms)}
              href="/activities/rage-rooms"
              statement={rageRoomCitation?.statement}
              asOf={citationAsOf}
              sourceUrl={citationSource}
            />
            <InsightsStatCard
              label="Cities"
              value={String(stats.citiesRepresented)}
              href={publishedPages.includes("rage-rooms-by-city") ? "/insights/rage-rooms-by-city" : "/uk-map"}
            />
            <InsightsStatCard
              label="Regions"
              value={String(stats.regionsRepresented)}
              href={publishedPages.includes("rage-rooms-by-region") ? "/insights/rage-rooms-by-region" : undefined}
            />
          </div>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-bold text-white">Key statistics</h2>
            <p className="text-sm text-zinc-400">
              Copy a concise statement for journalists and bloggers. Each one already
              includes RageRoom Directory as the source.
            </p>
            {stats.citations.slice(0, 6).map((citation) => (
              <InsightCitationBlock
                key={citation.id}
                statement={citation.statement}
                href={citation.href}
                asOf={citationAsOf}
                sourceUrl={citationSource}
              />
            ))}
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Activities</h2>
            <p className="mb-5 text-sm text-zinc-400">
              Category totals can exceed unique venue totals because venues may offer
              more than one activity.
            </p>
            <InsightsBarList rows={stats.activities} />
            {publishedPages.includes("rage-room-activities") && (
              <p className="mt-4 text-sm">
                <Link
                  href="/insights/rage-room-activities"
                  className="font-semibold text-orange-500 hover:text-orange-400"
                >
                  Compare activities in more detail →
                </Link>
              </p>
            )}
          </section>

          <section className="mb-10 grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-white">Top cities</h2>
              <InsightsBarList rows={stats.topCities} />
              {publishedPages.includes("rage-rooms-by-city") && (
                <p className="mt-4 text-sm">
                  <Link
                    href="/insights/rage-rooms-by-city"
                    className="font-semibold text-orange-500 hover:text-orange-400"
                  >
                    See all cities →
                  </Link>
                </p>
              )}
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-bold text-white">Top regions</h2>
              <InsightsBarList rows={stats.topRegions} />
              {publishedPages.includes("rage-rooms-by-region") && (
                <p className="mt-4 text-sm">
                  <Link
                    href="/insights/rage-rooms-by-region"
                    className="font-semibold text-orange-500 hover:text-orange-400"
                  >
                    See all regions →
                  </Link>
                </p>
              )}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Occasions</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.birthdayVenues > 0 && (
                <InsightsStatCard
                  label="Birthday-friendly"
                  value={String(stats.birthdayVenues)}
                  href="/occasions/birthdays"
                />
              )}
              {stats.corporateVenues > 0 && (
                <InsightsStatCard
                  label="Corporate / team-building"
                  value={String(stats.corporateVenues)}
                  href="/occasions/corporate-team-building"
                />
              )}
              {stats.stagOrHenVenues > 0 && (
                <InsightsStatCard
                  label="Stag or hen groups"
                  value={String(stats.stagOrHenVenues)}
                  href="/occasions/stag-parties"
                />
              )}
            </div>
          </section>

          {stats.pricing.unavailablePercent != null && (
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-bold text-white">Pricing availability</h2>
              <p className="mb-5 text-sm text-zinc-400">
                {stats.pricing.usable} verified venues have a published amount and a
                known price unit. {stats.pricing.unavailable} do not, so they are
                omitted from price ranges rather than counted as £0.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InsightsStatCard
                  label="Pricing unavailable"
                  value={`${stats.pricing.unavailablePercent}%`}
                />
                {stats.pricing.byUnit.map((unit) => (
                  <InsightsStatCard
                    key={unit.unit}
                    label={unit.label}
                    value={String(unit.count)}
                    href={
                      publishedPages.includes("rage-room-prices")
                        ? "/insights/rage-room-prices"
                        : "/rage-room-prices-uk"
                    }
                  />
                ))}
              </div>
              {publishedPages.includes("rage-room-prices") && (
                <p className="mt-4 text-sm">
                  <Link
                    href="/insights/rage-room-prices"
                    className="font-semibold text-orange-500 hover:text-orange-400"
                  >
                    Read the pricing breakdown →
                  </Link>
                </p>
              )}
            </section>
          )}

          <InsightsMethodology stats={stats} />

          {publishedPages.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-bold text-white">More insights</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {publishedPages.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/insights/${slug}`}
                      className="flex min-h-11 items-center justify-between rounded-md border border-zinc-800 bg-[#181818] px-4 py-3 text-sm font-semibold text-white hover:border-orange-500"
                    >
                      {INSIGHT_PAGE_META[slug].heading}
                      <span aria-hidden="true" className="text-orange-500">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-6 text-sm text-zinc-300">
            Looking for the downloadable research extract? See the{" "}
            <Link href="/uk-rage-room-report-2026" className="font-semibold text-orange-500">
              UK Rage Room Report 2026
            </Link>{" "}
            or compare live prices on the{" "}
            <Link href="/rage-room-prices-uk" className="font-semibold text-orange-500">
              UK prices hub
            </Link>
            .
          </div>
          <p className="mt-4 text-xs text-zinc-600">Source URL: {absoluteUrl(PATH)}</p>
        </article>
      </div>
    </div>
  )
}
