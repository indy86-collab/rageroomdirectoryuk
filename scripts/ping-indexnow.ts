/**
 * Ping IndexNow with all sitemap URLs after deploy or content updates.
 * Usage: npm run ping-indexnow
 */
import { pingIndexNow } from "../lib/indexnow"
import { getAllListingsForAdmin, getDistinctCities, getDistinctRegions } from "../lib/listings"
import { cityToSlug, regionToSlug } from "../lib/location"
import { getAllBlogPosts } from "../lib/blog-posts"
import { absoluteUrl } from "../lib/site-url"

const STATIC_PATHS = [
  "/",
  "/listings",
  "/near-me",
  "/guides",
  "/blog",
  "/rage-room-prices-uk",
  "/rage-room-vs-escape-room",
  "/smash-room-uk",
  "/break-room-uk",
  "/anger-room-uk",
  "/guides/best-rage-rooms-london",
  "/guides/best-rage-rooms-birmingham",
  "/guides/best-rage-rooms-manchester",
  "/guides/best-rage-rooms-leeds",
  "/guides/best-rage-rooms-liverpool",
  "/guides/best-rage-rooms-bristol",
  "/guides/best-rage-rooms-newcastle",
  "/guides/best-rage-rooms-sheffield",
  "/guides/best-rage-rooms-nottingham",
  "/guides/best-rage-rooms-edinburgh",
  "/guides/best-rage-rooms-leicester",
  "/guides/best-rage-rooms-derby",
  "/guides/best-rage-rooms-brighton",
  "/guides/how-much-do-rage-rooms-cost-uk",
  "/guides/are-rage-rooms-safe-uk",
  "/guides/rage-room-near-me",
]

async function collectUrls(): Promise<string[]> {
  const [listings, cities, regions, blogPosts] = await Promise.all([
    getAllListingsForAdmin(),
    getDistinctCities(),
    getDistinctRegions(),
    Promise.resolve(getAllBlogPosts()),
  ])

  const urls = new Set<string>(STATIC_PATHS.map((p) => absoluteUrl(p)))

  cities.forEach((city) => urls.add(absoluteUrl(`/city/${cityToSlug(city)}`)))
  regions.forEach((region) => urls.add(absoluteUrl(`/region/${regionToSlug(region)}`)))
  listings.forEach((listing) => {
    const slug = listing.slug || listing.id
    urls.add(absoluteUrl(`/listing/${slug}`))
  })
  blogPosts.forEach((post) => urls.add(absoluteUrl(`/blog/${post.slug}`)))

  return [...urls]
}

async function main() {
  if (!process.env.INDEXNOW_KEY) {
    console.error("INDEXNOW_KEY is required. Set it in .env.local or CI secrets.")
    process.exit(1)
  }

  const urls = await collectUrls()
  console.log(`Submitting ${urls.length} URLs to IndexNow...`)

  const batchSize = 10000
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize)
    const result = await pingIndexNow(batch)
    console.log(`Batch ${Math.floor(i / batchSize) + 1}: status ${result.status}`, result.ok ? "OK" : result.error || result.body)
    if (!result.ok) process.exit(1)
  }

  console.log("IndexNow ping complete.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
