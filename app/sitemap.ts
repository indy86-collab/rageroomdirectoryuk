import { MetadataRoute } from "next"
import {
  getAllListingsForAdmin,
  getDistinctCities,
  getDistinctRegions,
  getListingsNearCity,
} from "@/lib/listings"
import { cityToSlug, regionToSlug } from "@/lib/location"
import { getAllBlogPosts } from "@/lib/blog-posts"
import { getBlogGuideCanonical } from "@/lib/blog-guide-canonicals"
import { mergeCitiesWithPriority, CITY_PRICE_PAGE_CITIES } from "@/lib/priority-seo-cities"
import { getCityGuideSlugs } from "@/lib/city-guides"
import { absoluteUrl, getSiteUrl, listingUrl } from "@/lib/site-url"
import { isIndexableLocationPage } from "@/lib/location-indexing"
import {
  ACTIVITY_DEFINITIONS,
  MIN_ACTIVITY_PAGE_LISTINGS,
  MIN_OCCASION_PAGE_LISTINGS,
  OCCASION_DEFINITIONS,
  matchesOccasionDefinition,
} from "@/lib/discovery"
import { getEligibleLocationDiscoveryPages } from "@/lib/location-discovery"
import { buildInsightsStats, getPublishedInsightPages } from "@/lib/insights-stats"

// ISR: sitemap reflects listings.json state but doesn't need to be live on every request.
export const revalidate = 3600

const CITY_GUIDE_LAST_MODIFIED = new Date("2026-08-04T00:00:00.000Z")

function latestListingDate(listings: Array<{ createdAt: string }>) {
  if (listings.length === 0) return undefined

  return new Date(
    Math.max(...listings.map((listing) => new Date(listing.createdAt).getTime()))
  )
}

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
  const cityEntries = (
    await Promise.all(
      cities.map(async (city) => {
        const { inCity, nearby, allForSchema } = await getListingsNearCity(city)
        if (!isIndexableLocationPage({ city, inCity, nearby })) return null

        return {
          city,
          lastModified: latestListingDate(allForSchema),
        }
      })
    )
  ).filter((entry): entry is NonNullable<typeof entry> => entry !== null)

  // Homepage and static pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/listings"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/rage-reset"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/near-me"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/rage-room-prices-uk"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/uk-map"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/uk-rage-room-report-2026"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/rage-room-vs-escape-room"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/digital-downloads"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/digital-downloads/rage-room-party-planner-pack"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/digital-downloads/rage-room-first-visit-prep-pack"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/digital-downloads/corporate-rage-room-team-building-toolkit"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/digital-downloads/rage-room-corporate-booking-system"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/digital-downloads/rage-room-gift-voucher-template-pack"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/digital-downloads/party-planner-gift-voucher-bundle"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/corporate-rage-room-team-building-uk"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/rage-room-gift-ideas-uk"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/london-map"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/smash-room-uk"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/break-room-uk"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/anger-room-uk"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/blog"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/guides"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/about"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/contact"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/editorial-policy"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/privacy"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/terms"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/disclaimer"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/list-your-rage-room"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/insights"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/for-venues/badge"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/for-publishers"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  routes.push(
    {
      url: absoluteUrl("/activities"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/occasions"),
      changeFrequency: "weekly",
      priority: 0.9,
    }
  )

  const insightStats = buildInsightsStats(listings)
  for (const slug of getPublishedInsightPages(insightStats)) {
    routes.push({
      url: absoluteUrl(`/insights/${slug}`),
      lastModified: insightStats.lastUpdated,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  }

  for (const activity of ACTIVITY_DEFINITIONS) {
    const activityListings = listings.filter((listing) =>
      listing.activities.includes(activity.value)
    )
    if (activityListings.length < MIN_ACTIVITY_PAGE_LISTINGS) continue
    routes.push({
      url: absoluteUrl(`/activities/${activity.slug}`),
      lastModified: latestListingDate(activityListings),
      changeFrequency: "weekly",
      priority: activity.value === "rage-room" ? 0.9 : 0.8,
    })
  }

  for (const occasion of OCCASION_DEFINITIONS) {
    const occasionListings = listings.filter((listing) =>
      matchesOccasionDefinition(listing, occasion)
    )
    if (occasionListings.length < MIN_OCCASION_PAGE_LISTINGS) continue
    routes.push({
      url: absoluteUrl(`/occasions/${occasion.slug}`),
      lastModified: latestListingDate(occasionListings),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  }

  for (const page of getEligibleLocationDiscoveryPages(listings)) {
    routes.push({
      url: absoluteUrl(page.href),
      lastModified: latestListingDate(page.listings),
      changeFrequency: "weekly",
      priority: page.qualification === "strong" ? 0.8 : 0.7,
    })
  }

  // Guide pages (how-much-do-rage-rooms-cost-uk canonicals to /rage-room-prices-uk)
  const cityGuidePages = getCityGuideSlugs()
  const guidePages = [
    ...cityGuidePages,
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
    "rage-room-vs-paint-splatter",
    "what-to-wear-to-a-rage-room",
    "cheapest-rage-rooms-uk",
    "rage-room-age-limits-uk",
    "can-you-smash-your-own-stuff-uk",
  ]

  guidePages.forEach((guide) => {
    routes.push({
      url: absoluteUrl(`/guides/${guide}`),
      lastModified: cityGuidePages.includes(guide)
        ? CITY_GUIDE_LAST_MODIFIED
        : undefined,
      changeFrequency: "monthly",
      priority: 0.8,
    })
  })

  // Programmatic city pricing pages
  for (const city of CITY_PRICE_PAGE_CITIES) {
    const { inCity, nearby } = await getListingsNearCity(city)
    if (!isIndexableLocationPage({ city, inCity, nearby })) continue
    routes.push({
      url: absoluteUrl(`/rage-room-prices/${cityToSlug(city)}`),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  }

  // City pages (listing cities + priority SEO cities)
  cityEntries.forEach(({ city, lastModified }) => {
    routes.push({
      url: absoluteUrl(`/city/${cityToSlug(city)}`),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  })

  // Region pages
  regions.forEach((region) => {
    const regionListings = listings.filter(
      (listing) => listing.region.toLowerCase() === region.toLowerCase()
    )
    routes.push({
      url: absoluteUrl(`/region/${regionToSlug(region)}`),
      lastModified: latestListingDate(regionListings),
      changeFrequency: "weekly",
      priority: 0.7,
    })
  })

  // Listing pages (use slug if available, fallback to id)
  listings.forEach((listing) => {
    const url = listingUrl(listing.slug || listing.id)
    routes.push({
      url,
      lastModified: listing.lastVerified || listing.createdAt,
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
