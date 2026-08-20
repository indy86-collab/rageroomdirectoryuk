import { createRequire } from "node:module"
import { describe, expect, it } from "vitest"
import sitemap from "@/app/sitemap"
import { generateMetadata as generateCityMetadata } from "@/app/(site)/city/[slug]/page"
import { generateMetadata as generateSearchMetadata } from "@/app/(site)/search/page"
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

  it("advertises both the page and image sitemaps", () => {
    expect(robots().sitemap).toEqual([
      "https://www.rageroomdirectory.co.uk/sitemap.xml",
      "https://www.rageroomdirectory.co.uk/image-sitemap.xml",
    ])
  })
})
