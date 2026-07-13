import { MetadataRoute } from "next"
import { getAllListingsForAdmin, getDistinctCities, getDistinctRegions } from "@/lib/listings"
import { cityToSlug, regionToSlug } from "@/lib/location"
import { getAllBlogPosts } from "@/lib/blog-posts"
import { getBlogGuideCanonical } from "@/lib/blog-guide-canonicals"
import { mergeCitiesWithPriority, CITY_PRICE_PAGE_CITIES } from "@/lib/priority-seo-cities"
import { absoluteUrl, getSiteUrl, listingUrl } from "@/lib/site-url"

// ISR: sitemap reflects listings.json state but doesn't need to be live on every request.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()

  // Get all listings, cities, regions, and blog posts
  const [listings, citiesFromListings, regions, blogPosts] = await Promise.all([
    getAllListingsForAdmin(),
    getDistinctCities(),
    getDistinctRegions(),
    Promise.resolve(getAllBlogPosts()),
  ])
  const cities = mergeCitiesWithPriority(citiesFromListings)

  // Homepage and static pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/listings"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/near-me"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/rage-room-prices-uk"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/uk-map"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/uk-rage-room-report-2026"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/rage-room-vs-escape-room"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/digital-downloads"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/digital-downloads/rage-room-party-planner-pack"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/digital-downloads/corporate-rage-room-team-building-toolkit"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/digital-downloads/rage-room-gift-voucher-template-pack"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/digital-downloads/party-planner-gift-voucher-bundle"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/corporate-rage-room-team-building-uk"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/rage-room-gift-ideas-uk"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/london-map"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/smash-room-uk"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/break-room-uk"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/anger-room-uk"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/guides"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/editorial-policy"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/disclaimer"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/list-your-rage-room"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  // Guide pages (how-much-do-rage-rooms-cost-uk canonicals to /rage-room-prices-uk)
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
    "best-rage-rooms-edinburgh",
    "best-rage-rooms-leicester",
    "best-rage-rooms-derby",
    "best-rage-rooms-brighton",
    "best-rage-rooms-glasgow",
    "best-rage-rooms-cardiff",
    "best-rage-rooms-hull",
    "best-rage-rooms-for-couples",
    "best-rage-rooms-for-team-building",
    "are-rage-rooms-safe-uk",
    "what-happens-in-a-rage-room",
    "rage-rooms-for-hen-parties-uk",
    "rage-rooms-for-stag-parties-uk",
    "rage-rooms-for-birthdays-uk",
    "rage-room-near-me",
    "rage-room-gift-vouchers-uk",
    "rage-rooms-for-stress-relief",
    "rage-room-vs-axe-throwing",
    "what-to-wear-to-a-rage-room",
  ]

  guidePages.forEach((guide) => {
    routes.push({
      url: absoluteUrl(`/guides/${guide}`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  })

  // Programmatic city pricing pages
  CITY_PRICE_PAGE_CITIES.forEach((city) => {
    routes.push({
      url: absoluteUrl(`/rage-room-prices/${cityToSlug(city)}`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  })

  // City pages (listing cities + priority SEO cities)
  cities.forEach((city) => {
    routes.push({
      url: absoluteUrl(`/city/${cityToSlug(city)}`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  })

  // Region pages
  regions.forEach((region) => {
    routes.push({
      url: absoluteUrl(`/region/${regionToSlug(region)}`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    })
  })

  // Listing pages (use slug if available, fallback to id)
  listings.forEach((listing) => {
    const url = listingUrl(listing.slug || listing.id)
    routes.push({
      url,
      lastModified: listing.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  })

  // Blog posts that are not canonicalized to a guide
  blogPosts
    .filter((post) => !getBlogGuideCanonical(post.slug))
    .forEach((post) => {
      routes.push({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      })
    })

  return routes
}
