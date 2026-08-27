import { createRequire } from "node:module"
import { describe, expect, it } from "vitest"
import sitemap from "@/app/sitemap"
import { generateMetadata as generateCityMetadata } from "@/app/(site)/city/[slug]/page"
import { generateMetadata as generateSearchMetadata } from "@/app/(site)/search/page"
import { metadata as insightsMetadata } from "@/app/(site)/insights/page"
import { generateMetadata as generateInsightMetadata } from "@/app/(site)/insights/[slug]/page"
import { metadata as badgeMetadata } from "@/app/(site)/for-venues/badge/page"
import { metadata as publishersMetadata } from "@/app/(site)/for-publishers/page"
import { metadata as embedMetadata } from "@/app/(embed)/embed/rage-room-finder/page"
import { metadata as reportMetadata } from "@/app/(site)/uk-rage-room-report-2026/page"
import { INSIGHT_PAGE_META, REPORT_META, REPORT_PATH } from "@/lib/insights-pages"
import { getListingsNearCity } from "@/lib/listings"
import { buildArticleSchema } from "@/lib/seo-schema"
import robots from "@/app/robots"

const require = createRequire(import.meta.url)
const nextConfig = require("../next.config.js")

describe("SEO regressions", () => {
  it("keeps mobile service areas out of fixed city routes", async () => {
    const entries = await sitemap()
    const urls = new Set(entries.map((entry) => entry.url))

    expect(urls.has("https://www.rageroomdirectory.co.uk/city/uk-wide")).toBe(false)
    expect(urls.has("https://www.rageroomdirectory.co.uk/city/london")).toBe(true)
  })

  it("uses stable, meaningful sitemap modification dates", async () => {
    const entries = await sitemap()
    const homepage = entries.find(
      (entry) => entry.url === "https://www.rageroomdirectory.co.uk"
    )
    const londonGuide = entries.find((entry) =>
      entry.url.endsWith("/guides/best-rage-rooms-london")
    )

    expect(homepage?.lastModified).toBeUndefined()
    expect(londonGuide?.lastModified).toEqual(
      new Date("2026-08-04T00:00:00.000Z")
    )
  })

  it("does not invent an Article dateModified value", () => {
    const withoutModified = buildArticleSchema({
      url: "/guides/example",
      headline: "Example guide",
      description: "Example description",
      datePublished: "2026-01-01",
    })
    const withModified = buildArticleSchema({
      url: "/guides/example",
      headline: "Example guide",
      description: "Example description",
      datePublished: "2026-01-01",
      dateModified: "2026-08-04",
    })

    expect(withoutModified).not.toHaveProperty("dateModified")
    expect(withModified).toHaveProperty("dateModified", "2026-08-04")
  })

  it("always marks internal search results noindex", async () => {
    const emptySearch = await generateSearchMetadata({ searchParams: {} })
    const querySearch = await generateSearchMetadata({
      searchParams: { query: "London" },
    })

    expect(emptySearch.robots).toEqual({ index: false, follow: true })
    expect(querySearch.robots).toEqual({ index: false, follow: true })
  })

  it("separates in-city and nearby venue counts in city titles", async () => {
    const { inCity, nearby } = await getListingsNearCity("London")
    const metadata = await generateCityMetadata({ params: { slug: "london" } })

    expect(metadata.title).toBe(
      `Rage Rooms & Destructive Experiences in London — ${inCity.length} Venues + ${nearby.length} Nearby`
    )
  })

  it("permanently redirects the apex host to www", async () => {
    const redirects = await nextConfig.redirects()
    const apexRedirect = redirects.find((redirect: { has?: Array<{ type: string; value: string }> }) =>
      redirect.has?.some(
        (condition) =>
          condition.type === "host" && condition.value === "rageroomdirectory.co.uk"
      )
    )

    expect(apexRedirect).toMatchObject({
      destination: "https://www.rageroomdirectory.co.uk/:path*",
      permanent: true,
    })
  })

  it("collapses the London keyword landing onto the editorial city guide", async () => {
    const redirects = await nextConfig.redirects()
    const londonRedirect = redirects.find(
      (redirect: { source?: string }) => redirect.source === "/rage-room-london"
    )

    expect(londonRedirect).toMatchObject({
      destination: "/guides/best-rage-rooms-london",
      permanent: true,
    })
  })

  it("includes the new commercial guides in the sitemap", async () => {
    const urls = new Set((await sitemap()).map((entry) => entry.url))
    expect(urls.has("https://www.rageroomdirectory.co.uk/guides/best-rage-rooms-northampton")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/guides/best-rage-rooms-huddersfield")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/guides/best-rage-rooms-bath")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/guides/best-rage-rooms-weston-super-mare")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/guides/cheapest-rage-rooms-uk")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/guides/rage-room-age-limits-uk")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/guides/can-you-smash-your-own-stuff-uk")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/guides/rage-room-vs-paint-splatter")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/activities/paint-splatter/london")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/activities/paint-splatter/birmingham")).toBe(false)
    expect(
      urls.has("https://www.rageroomdirectory.co.uk/blog/why-rage-rooms-are-becoming-popular-in-the-uk")
    ).toBe(false)
  })

  it("advertises both the page and image sitemaps", () => {
    expect(robots().sitemap).toEqual([
      "https://www.rageroomdirectory.co.uk/sitemap.xml",
      "https://www.rageroomdirectory.co.uk/image-sitemap.xml",
    ])
  })

  it("adds insights, badge and publisher routes to the sitemap and keeps the embed out", async () => {
    const urls = new Set((await sitemap()).map((entry) => entry.url))
    expect(urls.has("https://www.rageroomdirectory.co.uk/insights")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/insights/rage-room-prices")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/insights/rage-rooms-by-city")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/insights/rage-rooms-by-region")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/insights/rage-room-activities")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/uk-rage-room-report-2026")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/for-venues/badge")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/for-publishers")).toBe(true)
    expect(urls.has("https://www.rageroomdirectory.co.uk/embed/rage-room-finder")).toBe(false)
  })

  it("publishes citation metadata for the insights hub and subpages", async () => {
    expect(insightsMetadata.alternates).toEqual({ canonical: "/insights" })
    expect(insightsMetadata.robots).toBeUndefined()
    expect(String(insightsMetadata.title)).toContain("UK Rage Room Statistics")
    const prices = await generateInsightMetadata({ params: { slug: "rage-room-prices" } })
    expect(prices.alternates).toEqual({ canonical: "/insights/rage-room-prices" })
    expect(prices.robots).toBeUndefined()
    expect(badgeMetadata.alternates).toEqual({ canonical: "/for-venues/badge" })
    expect(badgeMetadata.robots).toBeUndefined()
    expect(publishersMetadata.alternates).toEqual({ canonical: "/for-publishers" })
    expect(publishersMetadata.robots).toBeUndefined()
    expect(embedMetadata.robots).toEqual({ index: false, follow: true })
  })

  it("publishes the flagship 2026 report as a distinct research article", () => {
    expect(reportMetadata.alternates).toEqual({ canonical: REPORT_PATH })
    expect(reportMetadata.robots).toBeUndefined()
    expect(String(reportMetadata.title)).toBe(REPORT_META.title)
    expect(String(reportMetadata.title)).not.toMatch(/Live Venue|Near You|Live Comparison/)
    expect(reportMetadata.openGraph?.url).toBe(REPORT_PATH)
  })

  it("keeps Insights titles statistical rather than interchangeable with directory pages", () => {
    expect(INSIGHT_PAGE_META["rage-room-prices"].title).toContain("Statistics")
    expect(INSIGHT_PAGE_META["rage-room-prices"].title).not.toMatch(/Near You|Live Venue/)
    expect(INSIGHT_PAGE_META["rage-rooms-by-city"].title).toMatch(/How Many Rage Rooms/)
    expect(INSIGHT_PAGE_META["rage-rooms-by-city"].heading).toContain("Statistics")
    expect(INSIGHT_PAGE_META["rage-rooms-by-city"].title).not.toMatch(/Rage Rooms & Destructive Experiences/)
    expect(INSIGHT_PAGE_META["rage-rooms-by-region"].heading).toContain("Statistics")
    expect(INSIGHT_PAGE_META["rage-room-activities"].heading).toContain("Statistics")
  })

  it("allows framing only on the embed widget route", async () => {
    const headers = await nextConfig.headers()
    const embed = headers.find((entry: { source: string }) => entry.source === "/embed/:path*")
    const site = headers.find((entry: { source: string }) => entry.source === "/:path((?!embed/).*)")
    const badges = headers.find((entry: { source: string }) => entry.source === "/badges/:path*")
    expect(embed.headers).toEqual([
      {
        key: "Content-Security-Policy",
        value: "frame-ancestors *",
      },
    ])
    expect(embed.headers.some((header: { key: string }) => header.key === "X-Frame-Options")).toBe(
      false
    )
    expect(site.headers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "X-Frame-Options", value: "SAMEORIGIN" }),
        expect.objectContaining({
          key: "Content-Security-Policy",
          value: "frame-ancestors 'self'",
        }),
      ])
    )
    expect(badges.headers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "Cache-Control",
          value: "public, max-age=86400, stale-while-revalidate=604800",
        }),
      ])
    )
  })

  it("disallows crawlers from embed routes while leaving Insights indexable", () => {
    const rules = robots().rules
    const star = Array.isArray(rules) ? rules[0] : rules
    expect(star.disallow).toEqual(expect.arrayContaining(["/api/", "/embed/"]))
  })
})
