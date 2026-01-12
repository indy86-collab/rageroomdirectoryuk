import { MetadataRoute } from "next"
import { getAllListingsForAdmin, getDistinctCities } from "@/lib/listings"
import { cityToSlug } from "@/lib/location"
import { getAllBlogPosts } from "@/lib/blog-posts"

// Mark sitemap as dynamic since it queries the database
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"

  // Get all listings, cities, and blog posts
  const [listings, cities, blogPosts] = await Promise.all([
    getAllListingsForAdmin(),
    getDistinctCities(),
    Promise.resolve(getAllBlogPosts()),
  ])

  // Homepage and static pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/listings`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/near-me`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rage-room-prices-uk`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rage-room-london`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/london-map`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/smash-room-uk`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/break-room-uk`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/anger-room-uk`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/list-your-rage-room`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  // Guide pages
  const guidePages = [
    "best-rage-rooms-london",
    "best-rage-rooms-birmingham",
    "best-rage-rooms-manchester",
    "best-rage-rooms-bristol",
    "best-rage-rooms-newcastle",
    "best-rage-rooms-nottingham",
    "best-rage-rooms-leeds",
    "best-rage-rooms-liverpool",
    "best-rage-rooms-sheffield",
    "best-rage-rooms-for-couples",
    "best-rage-rooms-for-team-building",
    "are-rage-rooms-safe-uk",
    "how-much-do-rage-rooms-cost-uk",
    "what-happens-in-a-rage-room",
  ]

  guidePages.forEach((guide) => {
    routes.push({
      url: `${baseUrl}/guides/${guide}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  })

  // City pages
  cities.forEach((city) => {
    routes.push({
      url: `${baseUrl}/city/${cityToSlug(city)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  })

  // Listing pages (use slug if available, fallback to id)
  listings.forEach((listing) => {
    const listingUrl = listing.slug 
      ? `${baseUrl}/listing/${listing.slug}`
      : `${baseUrl}/listing/${listing.id}`
    routes.push({
      url: listingUrl,
      lastModified: listing.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  })

  // Blog posts
  blogPosts.forEach((post) => {
    routes.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.6,
    })
  })

  return routes
}

