import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Breadcrumbs from "@/components/Breadcrumbs"
import InsightsMethodology from "@/components/InsightsMethodology"
import {
  InsightCitationBlock,
  InsightQuestion,
  InsightsBarList,
  InsightsCountTable,
  InsightsStatCard,
} from "@/components/InsightsVisuals"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOgImageUrl,
} from "@/lib/seo-schema"
import {
  INSIGHT_PAGE_SLUGS,
  buildInsightsStats,
  formatInsightCitationMonth,
  formatInsightDate,
  insightArticleDates,
  isInsightPagePublished,
  type InsightPageSlug,
} from "@/lib/insights-stats"
import {
  INSIGHT_PAGE_META,
  INSIGHTS_PUBLISHED,
  REPORT_PATH,
  insightPageIntro,
} from "@/lib/insights-pages"
import { insightAnswers } from "@/lib/insights-copy"
import { absoluteUrl } from "@/lib/site-url"

export const revalidate = 3600

interface InsightPageProps {
  params: { slug: string }
}

async function loadStats() {
  const { getAllListingsForAdmin } = await import("@/lib/listings")
  return buildInsightsStats(await getAllListingsForAdmin())
}

export async function generateStaticParams() {
  const stats = await loadStats()
  return INSIGHT_PAGE_SLUGS.filter((slug) => isInsightPagePublished(slug, stats)).map(
    (slug) => ({ slug })
  )
}

export async function generateMetadata({ params }: InsightPageProps): Promise<Metadata> {
  const stats = await loadStats()
  if (!isInsightPagePublished(params.slug, stats)) {
    return { title: "Insights not available" }
  }
  const meta = INSIGHT_PAGE_META[params.slug]
  const path = `/insights/${params.slug}`
  const ogImage = buildOgImageUrl({
    title: meta.heading,
    subtitle: "RageRoom Directory insights",
    badge: "Insights",
  })
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      url: path,
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
  }
}

export default async function InsightDetailPage({ params }: InsightPageProps) {
  const stats = await loadStats()
  if (!isInsightPagePublished(params.slug, stats)) notFound()

  const slug = params.slug as InsightPageSlug
  const meta = INSIGHT_PAGE_META[slug]
  const path = `/insights/${slug}`
  const dateLabel = formatInsightDate(stats.lastUpdated)
  const citationAsOf = formatInsightCitationMonth(stats.lastUpdated)
  const citationSource = absoluteUrl(path)
  const answers = insightAnswers(stats)
  const articleDates = insightArticleDates(INSIGHTS_PUBLISHED, stats.lastUpdated)

  const articleSchema = buildArticleSchema({
    url: path,
    headline: meta.title,
    description: meta.description,
    datePublished: articleDates.datePublished,
    dateModified: articleDates.dateModified,
  })
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "UK Rage Room Statistics", url: "/insights" },
    { name: meta.heading, url: path },
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
            { label: "UK Rage Room Statistics", href: "/insights" },
            { label: meta.heading },
          ]}
        />

        <article>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">{meta.heading}</h1>
          <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
            {insightPageIntro(slug, stats)}
          </p>
          <p className="mb-8 mt-3 text-sm text-zinc-500">Last updated: {dateLabel}</p>

          {slug === "rage-room-prices" && (
            <>
              <InsightQuestion question="How much does a rage room cost in the UK?">
                <p>{answers.howMuch}</p>
              </InsightQuestion>
              <InsightQuestion question="How many venues publish prices?">
                <p>{answers.publishedPrices}</p>
              </InsightQuestion>
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InsightsStatCard
                  label="Usable published prices"
                  value={String(stats.pricing.usable)}
                />
                <InsightsStatCard
                  label="Pricing unavailable"
                  value={
                    stats.pricing.unavailablePercent != null
                      ? `${stats.pricing.unavailablePercent}%`
                      : String(stats.pricing.unavailable)
                  }
                />
              </div>
              {stats.citations
                .filter((item) => item.id === "pricing-availability" || item.id === "per-person-prices")
                .map((citation) => (
                  <div key={citation.id} className="mb-4">
                    <InsightCitationBlock
                      statement={citation.statement}
                      asOf={citationAsOf}
                      sourceUrl={citationSource}
                    />
                  </div>
                ))}
              <div className="mb-10 mt-8 grid gap-4 sm:grid-cols-3">
                {stats.pricing.byUnit.map((unit) => (
                  <div key={unit.unit} className="rounded-lg border border-zinc-800 bg-[#181818] p-4">
                    <p className="text-xs uppercase tracking-wider text-zinc-400">{unit.label}</p>
                    <p className="mt-2 text-2xl font-black text-white">{unit.count}</p>
                    {unit.average != null && unit.minimum != null && unit.maximum != null ? (
                      <p className="mt-2 text-sm text-zinc-400">
                        £{unit.minimum}–£{unit.maximum}, average £{unit.average}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-zinc-500">
                        Not enough comparable {unit.label} prices to publish a range.
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <p className="mb-10 text-sm text-zinc-400">
                This page is dataset research. Compare current venue-level starting prices on the{" "}
                <Link href="/rage-room-prices-uk" className="font-semibold text-orange-500">
                  UK prices hub
                </Link>
                , which is the consumer booking comparison.
              </p>
            </>
          )}

          {slug === "rage-rooms-by-city" && (
            <>
              <InsightQuestion question="Which city has the most listed venues in the dataset?">
                <p>{answers.topCity}</p>
              </InsightQuestion>
              {stats.citations
                .filter((item) => item.id === "cities")
                .map((citation) => (
                  <div key={citation.id} className="mb-8">
                    <InsightCitationBlock
                      statement={citation.statement}
                      asOf={citationAsOf}
                      sourceUrl={citationSource}
                    />
                  </div>
                ))}
              <InsightsBarList rows={stats.topCities} />
              <div className="mt-8">
                <h2 className="mb-4 text-2xl font-bold text-white">All cities in the dataset</h2>
                <InsightsCountTable
                  caption="Verified fixed-location listings by recorded city"
                  labelHeading="City"
                  rows={stats.allCities.map((row) => ({
                    label: row.label,
                    count: row.count,
                    href: row.href,
                  }))}
                />
              </div>
            </>
          )}

          {slug === "rage-rooms-by-region" && (
            <>
              {stats.citations
                .filter((item) => item.id === "regions")
                .map((citation) => (
                  <div key={citation.id} className="mb-8">
                    <InsightCitationBlock
                      statement={citation.statement}
                      asOf={citationAsOf}
                      sourceUrl={citationSource}
                    />
                  </div>
                ))}
              <InsightsBarList rows={stats.topRegions} />
              <div className="mt-8">
                <h2 className="mb-4 text-2xl font-bold text-white">All regions in the dataset</h2>
                <InsightsCountTable
                  caption="Verified fixed-location listings by recorded region"
                  labelHeading="Region"
                  rows={stats.allRegions.map((row) => ({
                    label: row.label,
                    count: row.count,
                    href: row.href,
                  }))}
                />
              </div>
            </>
          )}

          {slug === "rage-room-activities" && (
            <>
              <InsightQuestion question="How many rage rooms offer axe throwing?">
                <p>{answers.axeThrowing}</p>
              </InsightQuestion>
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.activities.map((activity) => (
                  <InsightsStatCard
                    key={activity.key}
                    label={activity.label}
                    value={String(activity.count)}
                    href={activity.href}
                  />
                ))}
              </div>
              {stats.activityCombinations.length > 0 && (
                <section className="mb-10">
                  <h2 className="mb-4 text-2xl font-bold text-white">Common combinations</h2>
                  <p className="mb-5 text-sm text-zinc-400">
                    These pairs appear at two or more verified venues. Totals can overlap.
                  </p>
                  <InsightsBarList rows={stats.activityCombinations} />
                </section>
              )}
            </>
          )}

          <div className="mt-10">
            <InsightsMethodology stats={stats} />
          </div>
          <p className="text-sm text-zinc-400">
            For the annual publication, citation format and aggregate dataset, see the{" "}
            <Link href={REPORT_PATH} className="font-semibold text-orange-500">
              UK Rage Room Report 2026
            </Link>
            .
          </p>
        </article>
      </div>
    </div>
  )
}
