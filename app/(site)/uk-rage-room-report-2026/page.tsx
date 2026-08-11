import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import { cityToSlug } from "@/lib/location"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOgImageUrl,
} from "@/lib/seo-schema"
import { buildRageRoomReportData } from "@/lib/report-data"
import { absoluteUrl } from "@/lib/site-url"

const PATH = "/uk-rage-room-report-2026"
const OG_IMAGE = buildOgImageUrl({
  title: "UK Rage Room Report 2026",
  subtitle: "Venue counts, prices & regional trends",
  badge: "Research",
})

export const metadata: Metadata = {
  title: "UK Rage Room Report 2026 | Venues, Prices & Regional Trends",
  description:
    "Original research from RageRoom Directory: verified UK venue counts, starting-price distribution, regional coverage, inventory gaps and downloadable aggregate data.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "UK Rage Room Report 2026",
    description:
      "Venue counts, starting prices and regional trends from the UK's independent rage room directory.",
    type: "article",
    images: [
      { url: OG_IMAGE, width: 1200, height: 630, alt: "UK Rage Room Report 2026" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Rage Room Report 2026",
    description: "Verified venue counts, prices and regional trends.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 3600

export default async function UkRageRoomReport2026Page() {
  const { getAllListingsForAdmin } = await import("@/lib/listings")
  const report = buildRageRoomReportData(await getAllListingsForAdmin())
  const coveredCities = new Set(report.cities.map((row) => row.label))
  const priorityGaps = [
    "Manchester",
    "Leeds",
    "Glasgow",
    "Bristol",
    "Sheffield",
    "Nottingham",
  ].filter((city) => !coveredCities.has(city))
  const dateLabel = new Date(report.lastUpdated).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: "UK Rage Room Report 2026",
    description:
      "Original research on UK rage room venue counts, starting prices and regional coverage.",
    datePublished: "2026-07-14",
    dateModified: report.lastUpdated.slice(0, 10),
    keywords: [
      "UK rage room statistics",
      "rage room prices UK 2026",
      "smash room venues UK",
      "rage room industry report",
    ],
  })
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "UK Rage Room Report 2026", url: PATH },
  ])
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "UK Rage Room Report 2026 aggregate dataset",
    description:
      "Aggregate counts, starting-price bands, city coverage and listing completeness for verified UK rage rooms.",
    url: absoluteUrl(PATH),
    dateModified: report.lastUpdated,
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "RageRoom Directory",
      url: absoluteUrl("/"),
    },
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: absoluteUrl(`${PATH}/data.csv`),
    },
    variableMeasured: [
      "Verified venue count",
      "Starting prices",
      "Region",
      "City",
      "Listing completeness",
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
            { label: "UK Rage Room Report 2026" },
          ]}
        />

        <article>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            UK Rage Room Report 2026
          </h1>
          <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
            An original snapshot of the UK smash-room market based on verified
            RageRoom Directory listings: venue counts, starting-price bands,
            regional coverage and the places where inventory remains thin.
          </p>
          <p className="mb-8 mt-3 text-sm text-zinc-500">Last updated {dateLabel}.</p>

          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Verified venues", value: String(report.verifiedListings) },
              {
                label: "Avg starting price",
                value:
                  report.averageStartingPrice != null
                    ? `£${report.averageStartingPrice}`
                    : "—",
              },
              {
                label: "Price range",
                value:
                  report.minimumStartingPrice != null &&
                  report.maximumStartingPrice != null
                    ? `£${report.minimumStartingPrice}–£${report.maximumStartingPrice}`
                    : "—",
              },
              { label: "Cities covered", value: String(report.citiesCovered) },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-zinc-800 bg-[#181818] p-4">
                <p className="text-xs uppercase tracking-wider text-zinc-400">{stat.label}</p>
                <p className="mt-2 text-2xl font-black text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Venues by region</h2>
            <p className="mb-4 text-sm text-zinc-400">
              Region names come from venue and editorial data and may not match formal statistical regions.
            </p>
            <div className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full min-w-[360px] text-left text-sm">
                <thead className="bg-[#151515] text-zinc-400">
                  <tr><th className="px-4 py-3">Region</th><th className="px-4 py-3">Venues</th></tr>
                </thead>
                <tbody>
                  {report.regions.slice(0, 10).map(({ label, count }) => (
                    <tr key={label} className="border-t border-zinc-800">
                      <td className="px-4 py-3 text-zinc-200">{label}</td>
                      <td className="px-4 py-3 font-semibold text-white">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Cities with the most listings</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {report.cities.slice(0, 12).map(({ label, count }) => (
                <li key={label}>
                  <Link
                    href={`/city/${cityToSlug(label)}`}
                    className="flex items-center justify-between rounded-md border border-zinc-800 bg-[#181818] px-4 py-3 text-sm hover:border-orange-500"
                  >
                    <span className="font-semibold text-white">{label}</span>
                    <span className="text-zinc-400">{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Starting-price distribution</h2>
            <p className="mb-5 text-zinc-300">
              These bands use each venue&apos;s lowest recorded per-person price. They do not compare session length, group minimums or the number of breakables included.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {report.priceBands.map((band) => (
                <div key={band.label} className="rounded-lg border border-zinc-800 bg-[#181818] p-4">
                  <p className="text-sm text-zinc-400">{band.label}</p>
                  <p className="mt-1 text-2xl font-black text-white">{band.count}</p>
                </div>
              ))}
            </div>
          </section>

          {priorityGaps.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-bold text-white">Priority inventory gaps</h2>
              <p className="mb-4 text-zinc-300">
                These high-demand cities currently have no dedicated in-city listing. Their city pages show clearly labelled nearby options while we seek operators to verify.
              </p>
              <ul className="flex flex-wrap gap-2">
                {priorityGaps.map((city) => (
                  <li key={city}>
                    <Link href={`/city/${cityToSlug(city)}`} className="inline-flex rounded-full border border-zinc-700 bg-[#151515] px-3 py-1.5 text-sm font-semibold text-zinc-200 hover:border-orange-500">
                      {city}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Download and reuse the research</h2>
            <p className="mb-5 text-zinc-300">
              The aggregate dataset and charts may be cited with a visible link to this report. Check venue-level facts directly before publication.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { href: `${PATH}/charts/regions.svg`, label: "Regional coverage chart" },
                { href: `${PATH}/charts/prices.svg`, label: "Starting-price chart" },
              ].map((chart) => (
                <a key={chart.href} href={chart.href} className="overflow-hidden rounded-lg border border-zinc-800 bg-[#181818] hover:border-orange-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={chart.href} alt={chart.label} className="h-auto w-full" loading="lazy" />
                  <span className="block px-4 py-3 text-sm font-semibold text-orange-500">
                    Open or download {chart.label.toLowerCase()} →
                  </span>
                </a>
              ))}
            </div>
            <a href={`${PATH}/data.csv`} className="mt-4 inline-flex rounded-md bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600">
              Download aggregate CSV
            </a>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Methodology</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-300">
              <li>The dataset includes {report.verifiedListings} verified listings published in RageRoom Directory at the last rebuild.</li>
              <li>Prices are typical starting rates recorded from venue pages or editorial research; packages and extras vary.</li>
              <li>Completeness measures the presence of booking, age, package, source, verification and authorised-media fields, not venue quality.</li>
              <li>The aggregate CSV excludes private submission data and contact identities.</li>
            </ul>
          </section>

          <section className="mb-10 rounded-lg border border-orange-500/30 bg-orange-500/10 p-6">
            <h2 className="mb-3 text-2xl font-bold text-white">Press and research enquiries</h2>
            <p className="text-zinc-300">
              Journalists, tourism teams, student publications and industry researchers may cite these figures with attribution and a link to this report. For regional extracts, methodology questions or corrections, email{" "}
              <a href="mailto:ukrageroom@gmail.com?subject=UK%20Rage%20Room%20Report%202026" className="font-semibold text-orange-500 underline">ukrageroom@gmail.com</a>.
            </p>
            <p className="mt-3 text-sm text-zinc-400">
              Suggested attribution: “UK Rage Room Report 2026, RageRoom Directory”.
            </p>
          </section>

          <section className="mb-10 rounded-lg border border-zinc-800 bg-[#181818] p-6">
            <h2 className="text-xl font-bold text-white">For venue owners</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Use this free market report for context, then turn corporate
              enquiries into structured packages, quotes and follow-ups with the{" "}
              <Link
                href="/digital-downloads/rage-room-corporate-booking-system"
                className="font-semibold text-orange-500 hover:text-orange-400"
              >
                Rage Room Corporate Booking System
              </Link>{" "}
              (£79 interactive workspace for operators).
            </p>
          </section>

          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-6 text-center">
            <p className="text-zinc-300">
              Explore the underlying directory through the{" "}
              <Link href="/rage-room-prices-uk" className="font-semibold text-orange-500">UK prices hub</Link>,{" "}
              <Link href="/uk-map" className="font-semibold text-orange-500">UK map</Link> or{" "}
              <Link href="/listings" className="font-semibold text-orange-500">full listings</Link>.
            </p>
            <p className="mt-3 text-sm text-zinc-500">Source URL: {absoluteUrl(PATH)}</p>
          </div>
        </article>
      </div>
    </div>
  )
}
