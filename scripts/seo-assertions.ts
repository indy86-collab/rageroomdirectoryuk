/**
 * Rendered SEO smoke tests.
 *
 * Run against a local or deployed site:
 *   SEO_ASSERT_BASE_URL=http://localhost:3001 npm run seo:assert
 */
const BASE_URL = (process.env.SEO_ASSERT_BASE_URL || "http://localhost:3001").replace(/\/+$/, "")
const CANONICAL_HOST = "https://www.rageroomdirectory.co.uk"

const SAMPLE_PATHS = [
  "/",
  "/city/manchester",
  "/city/bristol",
  "/guides/best-rage-rooms-manchester",
  "/listing/smash-space-uk-newcastle",
]

function fail(message: string): never {
  throw new Error(message)
}

async function read(path: string) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) fail(`${path} returned HTTP ${res.status}`)
  return res.text()
}

function matches(html: string, pattern: RegExp) {
  return [...html.matchAll(pattern)].map((match) => match[1])
}

function canonicalFor(html: string) {
  return matches(html, /<link rel="canonical" href="([^"]+)"/g)
}

function jsonLdBlocks(html: string) {
  return matches(
    html,
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
  )
}

async function assertSitemap() {
  const xml = await read("/sitemap.xml")
  const locs = matches(xml, /<loc>([^<]+)<\/loc>/g)
  if (locs.length === 0) fail("sitemap.xml has no <loc> URLs")
  const bad = locs.filter((url) => !url.startsWith(CANONICAL_HOST))
  if (bad.length > 0) fail(`Non-www sitemap URLs found: ${bad.slice(0, 5).join(", ")}`)
}

async function assertRobots() {
  const robots = await read("/robots.txt")
  if (!robots.includes(`Host: ${new URL(CANONICAL_HOST).host}`)) {
    fail("robots.txt host does not use canonical www host")
  }
  if (!robots.includes(`Sitemap: ${CANONICAL_HOST}/sitemap.xml`)) {
    fail("robots.txt sitemap does not use canonical www URL")
  }
}

async function assertPage(path: string) {
  const html = await read(path)
  const canonicals = canonicalFor(html)
  if (canonicals.length !== 1) {
    fail(`${path} should emit exactly one canonical, found ${canonicals.length}`)
  }
  if (!canonicals[0].startsWith(CANONICAL_HOST)) {
    fail(`${path} canonical is not www: ${canonicals[0]}`)
  }

  if (/0 Venues Listed/.test(html) && !/<meta name="robots" content="noindex, follow"/.test(html)) {
    fail(`${path} renders "0 Venues Listed" without noindex`)
  }

  let breadcrumbCount = 0
  for (const block of jsonLdBlocks(html)) {
    const parsed = JSON.parse(block)
    const nodes = Array.isArray(parsed) ? parsed : [parsed]
    breadcrumbCount += nodes.filter((node) => node?.["@type"] === "BreadcrumbList").length
  }
  if (breadcrumbCount > 1) {
    fail(`${path} emits duplicate BreadcrumbList schema`)
  }
}

async function main() {
  await assertSitemap()
  await assertRobots()
  for (const path of SAMPLE_PATHS) {
    await assertPage(path)
  }
  console.log(`SEO assertions passed for ${BASE_URL}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
