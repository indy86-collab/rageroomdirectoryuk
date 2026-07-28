import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import { cityToSlug } from "@/lib/location"
import { buildArticleSchema, buildBreadcrumbSchema, buildOgImageUrl } from "@/lib/seo-schema"
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
    "Original research from RageRoom Directory: how many UK rage rooms we list, average starting prices, regional coverage, and where inventory is still thin in 2026.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "UK Rage Room Report 2026",
    description:
      "Venue counts, average prices and regional trends from the UK's independent rage room directory.",
    type: "article",
    images: [
      { url: OG_IMAGE, width: 1200, height: 630, alt: "UK Rage Room Report 2026" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Rage Room Report 2026",
    description: "Venue counts, prices and regional trends.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

export default async function UkRageRoomReport2026Page() {
  const { getAllListingsForAdmin } = await import("@/lib/listings")
  const listings = await getAllListingsForAdmin()

  const priced = listings.filter(
    (l): l is typeof l & { price: number } => typeof l.price === "number"
  )
  const avgPrice = priced.length
    ? Math.round(priced.reduce((sum, l) => sum + l.price, 0) / priced.length)
    : null
  const minPrice = priced.length
    ? Math.min(...priced.map((l) => l.price))
    : null
  const maxPrice = priced.length
    ? Math.max(...priced.map((l) => l.price))
    : null

  const byRegion = new Map<string, number>()
  const byCity = new Map<string, number>()
  for (const listing of listings) {
    const region = listing.region?.trim() || "Unspecified"
    byRegion.set(region, (byRegion.get(region) || 0) + 1)
    byCity.set(listing.city, (byCity.get(listing.city) || 0) + 1)
  }

  const topRegions = Array.from(byRegion.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  const topCities = Array.from(byCity.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)

  const priorityGaps = [
    "Manchester",
    "Leeds",
    "Glasgow",
    "Bristol",
    "Sheffield",
    "Nottingham",
  ].filter((city) => !byCity.has(city) || (byCity.get(city) || 0) === 0)

  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: "UK Rage Room Report 2026",
    description:
      "Original research on UK rage room venue counts, average starting prices and regional coverage.",
    datePublished: "2026-07-14",
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

  return (
    <div className="py-6 sm:py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

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
          <p className="mb-8 text-base leading-relaxed text-zinc-300 sm:text-lg">
            An original snapshot of the UK smash-room market based on verified
            listings in RageRoom Directory — venue counts, starting-price ranges
            and where coverage is still thin. Figures update as we verify new
            venues.
          </p>

          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Verified venues", value: String(listings.length) },
              {
                label: "Avg starting price",
                value: avgPrice != null ? `£${avgPrice}` : "—",
              },
              {
                label: "Price range",
                value:
                  minPrice != null && maxPrice != null
                    ? `£${minPrice}–£${maxPrice}`
                    : "—",
              },
              { label: "Cities covered", value: String(byCity.size) },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-zinc-800 bg-[#181818] p-4"
              >
                <p className="text-xs uppercase tracking-wider text-zinc-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-black text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">
              Venues by region
            </h2>
            <p className="mb-4 text-sm text-zinc-400">
              Based on the region field on each verified listing (as provided by
              venues / our editorial research).
            </p>
            <div className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full min-w-[360px] text-left text-sm">
                <thead className="bg-[#151515] text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Region</th>
                    <th className="px-4 py-3">Venues</th>
                  </tr>
                </thead>
                <tbody>
                  {topRegions.map(([region, count]) => (
                    <tr key={region} className="border-t border-zinc-800">
                      <td className="px-4 py-3 text-zinc-200">{region}</td>
                      <td className="px-4 py-3 font-semibold text-white">
                        {count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">
              Cities with the most listings
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {topCities.map(([city, count]) => (
                <li key={city}>
                  <Link
                    href={`/city/${cityToSlug(city)}`}
                    className="flex items-center justify-between rounded-md border border-zinc-800 bg-[#181818] px-4 py-3 text-sm transition-colors hover:border-orange-500"
                  >
                    <span className="font-semibold text-white">{city}</span>
                    <span className="text-zinc-400">{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {priorityGaps.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-bold text-white">
                Priority inventory gaps
              </h2>
              <p className="mb-4 text-zinc-300">
                These high-demand cities still have no (or vanishingly few)
                in-city listings. We show nearest venues on city pages — and we
                want operators there to{" "}
                <Link
                  href="/list-your-rage-room"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  get listed
                </Link>
                .
              </p>
              <ul className="flex flex-wrap gap-2">
                {priorityGaps.map((city) => (
                  <li key={city}>
                    <Link
                      href={`/city/${cityToSlug(city)}`}
                      className="inline-flex rounded-full border border-zinc-700 bg-[#151515] px-3 py-1.5 text-sm font-semibold text-zinc-200 hover:border-orange-500"
                    >
                      {city}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Methodology</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-300">
              <li>
                Dataset: verified listings published on{" "}
                <Link href="/" className="text-orange-500 underline">
                  RageRoom Directory
                </Link>{" "}
                ({listings.length} venues at last rebuild).
              </li>
              <li>
                Prices are typical per-person starting rates from venue pages or
                editorial research — packages and extras vary.
              </li>
              <li>
                Region names follow listing data and may not match formal UK NUTS
                regions.
              </li>
              <li>
                This report is informational, not financial advice or a market
                valuation.
              </li>
            </ul>
          </section>

          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-6 text-center">
            <p className="text-zinc-300">
              Explore the data yourself on the{" "}
              <Link
                href="/rage-room-prices-uk"
                className="font-semibold text-orange-500 hover:text-orange-400"
              >
                UK prices hub
              </Link>
              ,{" "}
              <Link
                href="/uk-map"
                className="font-semibold text-orange-500 hover:text-orange-400"
              >
                UK map
              </Link>
              , or{" "}
              <Link
                href="/listings"
                className="font-semibold text-orange-500 hover:text-orange-400"
              >
                full listings
              </Link>
              .
            </p>
            <p className="mt-3 text-sm text-zinc-500">
              Source URL: {absoluteUrl(PATH)}
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
