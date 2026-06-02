import { notFound, redirect } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import { 
  Shield, Package, Users, 
  CheckCircle, Star, MapPin, Zap
} from "lucide-react"
import { getListingBySlug, getListingById, getSimilarListings } from "@/lib/listings"
import { cityToSlug } from "@/lib/location"
import { getGooglePlaceReviewData } from "@/lib/google-places"
import { generateListingContent, generateListingFAQs } from "@/lib/ai-content"
import { calculateDistance } from "@/lib/distance"
import Breadcrumbs from "@/components/Breadcrumbs"
import Link from "next/link"
import SimilarListingCard from "@/components/SimilarListingCard"
import UGCButtons from "@/components/UGCButtons"
import AdsenseInContent from "@/components/ads/AdsenseInContent"
import LazyMapEmbed from "@/components/LazyMapEmbed"
import { buildOgImageUrl } from "@/lib/seo-schema"

interface ListingPageProps {
  params: { slug: string }
}

// ISR: listing content is mostly static; Google Places enrichment also benefits
// from being cached here for 30 min. `dynamicParams` is kept for when we add
// `generateStaticParams`.
export const revalidate = 1800
export const dynamicParams = true

// Helper to check if a string looks like a UUID
function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  // Check if param is a UUID (legacy ID) or a slug
  let listing
  
  if (isUUID(params.slug)) {
    // It's a UUID, try to find by ID
    listing = await getListingById(params.slug)
    // If it's a UUID and has a slug, the page component will redirect
    // For metadata, we'll just return basic info
    if (!listing) {
      return {
        title: "Listing Not Found",
      }
    }
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"
    const canonicalUrl = listing.slug
      ? `${baseUrl}/listing/${listing.slug}`
      : `${baseUrl}/listing/${listing.id}`
    const ogImage = listing.image || buildOgImageUrl({
      title: listing.name,
      subtitle: `Rage room in ${listing.city}, UK`,
      badge: "Venue",
      ...(listing.price ? { price: `From £${listing.price.toFixed(0)}` } : {}),
    })

    return {
      title: `${listing.name} Rage Room in ${listing.city} | Prices, Packages & Booking`,
      description: `${listing.name} in ${listing.city} offers rage room and smash room experiences. View prices, packages, opening hours, location, and book your stress-relief session. ${listing.description.substring(0, 120)}...`,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${listing.name} Rage Room in ${listing.city}`,
        description: `Book a rage room session at ${listing.name} in ${listing.city}. View prices, packages, and reviews.`,
        type: "website",
        url: canonicalUrl,
        images: [{ url: ogImage, width: 1200, height: 630, alt: `${listing.name} rage room in ${listing.city}` }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${listing.name} — Rage Room in ${listing.city}`,
        description: `Book a rage room session at ${listing.name} in ${listing.city}.`,
        images: [ogImage],
      },
    }
  } else {
    listing = await getListingBySlug(params.slug)
  }

  if (!listing) {
    return {
      title: "Listing Not Found",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"
  const canonicalUrl = `${baseUrl}/listing/${listing.slug || listing.id}`
  const ogImage = listing.image || buildOgImageUrl({
    title: listing.name,
    subtitle: `Rage room in ${listing.city}, UK`,
    badge: "Venue",
    ...(listing.price ? { price: `From £${listing.price.toFixed(0)}` } : {}),
  })

  return {
    title: `${listing.name} Rage Room in ${listing.city} | Prices, Packages & Booking`,
    description: `${listing.name} in ${listing.city} offers rage room and smash room experiences. View prices, packages, opening hours, location, and book your stress-relief session. ${listing.description.substring(0, 120)}...`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${listing.name} Rage Room in ${listing.city}`,
      description: `Book a rage room session at ${listing.name} in ${listing.city}. View prices, packages, and reviews.`,
      type: "website",
      url: canonicalUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${listing.name} rage room in ${listing.city}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${listing.name} — Rage Room in ${listing.city}`,
      description: `Book a rage room session at ${listing.name} in ${listing.city}.`,
      images: [ogImage],
    },
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  // Check if param is a UUID (legacy ID) or a slug
  let listing
  
  if (isUUID(params.slug)) {
    // It's a UUID, try to find by ID
    listing = await getListingById(params.slug)
    
    if (!listing) {
      notFound()
    }
    
    if (listing.slug) {
      redirect(`/listing/${listing.slug}`)
    }

    notFound()
  } else {
    // It's a slug, find by slug
    listing = await getListingBySlug(params.slug)
    
    if (!listing) {
      notFound()
    }
  }

  const location = listing.location as { lat: number; lng: number } | null

  // Google: API returns at most 5 review texts; userRatingsTotal is the real count (e.g. 133)
  const googleReviewData = listing.googlePlaceId
    ? await getGooglePlaceReviewData(listing.googlePlaceId)
    : { reviews: [], rating: null, userRatingsTotal: null }

  const googleReviews = googleReviewData.reviews
  const googleOfficialRating = googleReviewData.rating
  const googleUserRatingsTotal = googleReviewData.userRatingsTotal

  const siteReviewCount = listing.reviews.length
  const siteAverageRating =
    siteReviewCount > 0
      ? listing.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) /
        siteReviewCount
      : null

  const googleCountForStats = googleUserRatingsTotal ?? 0
  let overallRating: number | null = null
  if (siteReviewCount > 0 && googleOfficialRating != null && googleCountForStats > 0) {
    overallRating =
      ((siteAverageRating ?? 0) * siteReviewCount +
        googleOfficialRating * googleCountForStats) /
      (siteReviewCount + googleCountForStats)
  } else if (siteReviewCount > 0) {
    overallRating = siteAverageRating
  } else if (googleOfficialRating != null) {
    overallRating = googleOfficialRating
  } else if (googleReviews.length > 0) {
    overallRating =
      googleReviews.reduce((sum, r) => sum + r.rating, 0) / googleReviews.length
  }

  const totalReviewCount =
    siteReviewCount + (googleUserRatingsTotal ?? googleReviews.length)

  const googleMapsPlaceUrl = listing.googlePlaceId
    ? `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(
        listing.googlePlaceId
      )}`
    : null

  // Get similar listings in the same city (with distance calculation)
  const similarListings = await getSimilarListings(
    listing.id,
    listing.city,
    4,
    location || undefined
  )

  // Generate AI-optimized content
  const aiContent = await generateListingContent(listing, similarListings)
  const listingFAQs = generateListingFAQs(listing, similarListings)

  const aboutTextLength =
    aiContent.summary.length + (listing.description?.trim().length ?? 0)
  const showAboutInContentAd = aboutTextLength >= 400

  // Price comparison data
  const similarWithPrice = similarListings.filter(l => l.price)
  const avgCityPrice = similarWithPrice.length > 0
    ? similarWithPrice.reduce((sum, l) => sum + (l.price || 0), 0) / similarWithPrice.length
    : null

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"
  const listingUrl = `${baseUrl}/listing/${listing.slug}`

  // Google Rich Results expect `priceRange` as a band ($/$$/$$$/$$$$) rather
  // than a raw number. Map our numeric starting price into £ bands.
  function priceBand(p: number | null): string | undefined {
    if (p == null) return undefined
    if (p < 30) return "£"
    if (p < 60) return "££"
    if (p < 100) return "£££"
    return "££££"
  }

  // Package catalogue is implied at most UK rage rooms — rendering these as a
  // hasOfferCatalog gives AI answer engines + Google a cleaner structured view
  // of what the venue actually sells.
  const hasOfferCatalog = listing.price
    ? {
        "@type": "OfferCatalog",
        name: `Session packages at ${listing.name}`,
        itemListElement: [
          {
            "@type": "Offer",
            name: "Solo / single session",
            priceCurrency: "GBP",
            price: listing.price.toFixed(2),
            availability: "https://schema.org/InStock",
            url: listing.website || listingUrl,
            itemOffered: {
              "@type": "Service",
              name: "Rage room session (1 person)",
              serviceType: "Rage room / smash room experience",
            },
          },
          {
            "@type": "Offer",
            name: "Couples / 2-person session",
            priceCurrency: "GBP",
            price: (listing.price * 1.8).toFixed(2),
            availability: "https://schema.org/InStock",
            url: listing.website || listingUrl,
            itemOffered: {
              "@type": "Service",
              name: "Rage room session (2 people)",
              serviceType: "Rage room / smash room experience",
            },
          },
          {
            "@type": "Offer",
            name: "Group session (3–6 people)",
            priceCurrency: "GBP",
            price: (listing.price * 4.5).toFixed(2),
            availability: "https://schema.org/InStock",
            url: listing.website || listingUrl,
            itemOffered: {
              "@type": "Service",
              name: "Rage room session (group)",
              serviceType: "Rage room / smash room experience",
            },
          },
        ],
      }
    : undefined

  // Per-review Review schema entries. Per Google's guidance we only embed
  // reviews that are actually visible on the page — Google reviews (up to
  // ~5 via the Places API) and any site-submitted reviews. This unlocks
  // review stars in rich results and gives LLMs discrete review quotes
  // they can cite back to us.
  const reviewSchemaItems: any[] = []

  for (const r of googleReviews) {
    reviewSchemaItems.push({
      "@type": "Review",
      author: { "@type": "Person", name: r.author_name || "Google reviewer" },
      datePublished: r.time
        ? new Date(r.time * 1000).toISOString()
        : undefined,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: (r.text || "").slice(0, 1000),
      publisher: { "@type": "Organization", name: "Google" },
    })
  }

  for (const r of listing.reviews as any[]) {
    reviewSchemaItems.push({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.user?.name || r.user?.email?.split("@")[0] || "Visitor",
      },
      datePublished:
        r.createdAt instanceof Date
          ? r.createdAt.toISOString()
          : new Date(r.createdAt).toISOString(),
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: (r.comment || "").slice(0, 1000),
      publisher: {
        "@type": "Organization",
        name: "RageRoom Directory",
        url: baseUrl,
      },
    })
  }

  // Expanded LocalBusiness schema. Uses `@type` as an array so Google treats
  // this both as a LocalBusiness (for local pack / maps) and an
  // EntertainmentBusiness (for category signals).
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EntertainmentBusiness"],
    "@id": `${listingUrl}#localbusiness`,
    name: listing.name,
    url: listingUrl,
    description:
      listing.description?.slice(0, 500) ||
      `${listing.name} is a rage room in ${listing.city}, UK, offering smash room and destruction therapy sessions.`,
    image: listing.image
      ? [listing.image]
      : [`${baseUrl}/og-image.png`],
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.city,
      ...(listing.region ? { addressRegion: listing.region } : {}),
      ...(listing.postcode ? { postalCode: listing.postcode } : {}),
      addressCountry: "GB",
    },
    areaServed: [
      { "@type": "City", name: listing.city },
      ...(listing.region ? [{ "@type": "AdministrativeArea", name: listing.region }] : []),
    ],
    ...(listing.phone ? { telephone: listing.phone } : {}),
    ...(location
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: location.lat,
            longitude: location.lng,
          },
        }
      : {}),
    ...(priceBand(listing.price ?? null) ? { priceRange: priceBand(listing.price ?? null) } : {}),
    currenciesAccepted: "GBP",
    paymentAccepted: "Credit Card, Debit Card, Cash",
    ...(listing.price
      ? {
          offers: {
            "@type": "Offer",
            name: `Rage room session at ${listing.name}`,
            priceCurrency: "GBP",
            price: listing.price.toFixed(2),
            availability: "https://schema.org/InStock",
            url: listing.website || listingUrl,
          },
        }
      : {}),
    ...(hasOfferCatalog ? { hasOfferCatalog } : {}),
    ...(listing.website
      ? {
          potentialAction: {
            "@type": "ReserveAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: listing.website,
              inLanguage: "en-GB",
              actionPlatform: [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform",
              ],
            },
            result: {
              "@type": "Reservation",
              name: `Rage room booking at ${listing.name}`,
            },
          },
        }
      : {}),
    ...(overallRating && totalReviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: overallRating.toFixed(1),
            reviewCount: totalReviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(reviewSchemaItems.length > 0 ? { review: reviewSchemaItems } : {}),
    ...(listing.website ? { sameAs: [listing.website] } : {}),
  }

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: listing.city,
        item: `${baseUrl}/city/${cityToSlug(listing.city)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: listing.name,
        item: listingUrl,
      },
    ],
  }

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: listingFAQs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: listing.city, href: `/city/${cityToSlug(listing.city)}` },
            { label: listing.name },
          ]}
        />

        {/* Main Listing Card */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image */}
            <div className="bg-zinc-900">
              {listing.image ? (
                <div className="aspect-video w-full relative">
                  <Image
                    src={listing.image}
                    alt={`${listing.name} rage room in ${listing.city} - smash room experience`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-400 text-lg">
                    No image available
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">
                    {listing.name}
                  </h1>
                  <div className="flex items-center gap-3 mb-2">
                    {listing.verified && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-600 text-white">
                        Verified
                      </span>
                    )}
                    {overallRating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.round(overallRating)
                                  ? "text-yellow-400"
                                  : "text-zinc-600"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-white font-semibold">
                          {overallRating.toFixed(1)}
                        </span>
                        <span className="text-zinc-400 text-sm">
                          ({totalReviewCount}{" "}
                          {totalReviewCount === 1 ? "review" : "reviews"})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Listing freshness indicator */}
              <p className="text-xs text-zinc-500 mb-3">
                Listing added {new Date(listing.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                {listing.verified && " · Verified by RageRoom Directory"}
              </p>

              {/* Location */}
              <div className="mb-4">
                <p className="text-white">
                  {listing.city}
                  {listing.region && `, ${listing.region}`}
                </p>
                {listing.postcode && (
                  <p className="text-white">
                    {listing.postcode}
                  </p>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-6">
                {listing.phone && (
                  <div>
                    <p className="text-white">
                      {listing.phone}
                    </p>
                  </div>
                )}
                {listing.website && (
                  <div>
                    <a
                      href={listing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-orange-500 transition-colors"
                    >
                      {listing.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>

              {/* Booking Link */}
              {listing.website && (
                <div className="mb-4">
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-base font-semibold min-h-[44px]"
                  >
                    Book Your Session →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Overview */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Pricing
          </h2>
          {listing.price ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                <span className="text-white">Starting price per person</span>
                <span className="text-orange-500 font-semibold text-lg">From £{listing.price.toFixed(0)}</span>
              </div>
              {avgCityPrice && similarWithPrice.length >= 2 && (
                <div className="flex items-center gap-2 py-2 border-b border-zinc-700">
                  <span className="text-zinc-400 text-sm">
                    {listing.price < avgCityPrice * 0.9
                      ? `Below average for ${listing.city} (avg ~£${Math.round(avgCityPrice)})`
                      : listing.price > avgCityPrice * 1.1
                      ? `Above average for ${listing.city} (avg ~£${Math.round(avgCityPrice)})`
                      : `In line with ${listing.city} average (~£${Math.round(avgCityPrice)})`
                    }
                  </span>
                </div>
              )}
              <p className="text-zinc-400 text-sm">
                This is the starting price listed by {listing.name}. Most rage rooms offer a range of packages
                at different price points, including options for couples, groups, and premium experiences.
                Visit the venue's website for their full and up-to-date pricing.
              </p>
            </div>
          ) : (
            <p className="text-zinc-400">
              Pricing information is not currently available for {listing.name}. Contact the venue
              directly for their latest rates and package options.
            </p>
          )}
          {listing.website && (
            <div className="mt-4">
              <a
                href={listing.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                View Full Pricing on Their Website →
              </a>
            </div>
          )}
        </div>

        {/* Venue Details & Booking Info */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Booking & Visit Information
          </h2>
          <div className="space-y-3 text-zinc-300">
            <p>
              Opening hours, session availability, and booking requirements vary. We recommend checking directly
              with {listing.name} before your visit to confirm their current schedule and any booking requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {listing.website && (
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-semibold"
                >
                  Visit Website for Hours & Booking
                </a>
              )}
              {listing.phone && (
                <a
                  href={`tel:${listing.phone}`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-colors text-sm font-semibold"
                >
                  Call {listing.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Map & Directions */}
        {location && (
          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Map & Directions
            </h2>
            <div className="mb-4">
              <p className="text-zinc-300 mb-2">
                {listing.city}
                {listing.region && `, ${listing.region}`}
                {listing.postcode && `, ${listing.postcode}`}
              </p>
            </div>
            <div className="mb-4">
              <LazyMapEmbed
                lat={location.lat}
                lng={location.lng}
                title={`${listing.name} — ${listing.city}`}
                previewImage={listing.image || undefined}
              />
            </div>
            <a
              href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-base font-semibold min-h-[44px]"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Get Directions on Google Maps
            </a>
          </div>
        )}

        {/* Cross-links */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Explore More
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Link
              href={`/city/${cityToSlug(listing.city)}`}
              className="text-orange-500 hover:text-orange-600 underline text-sm sm:text-base py-2"
            >
              ← Back to Rage Rooms in {listing.city}
            </Link>
            <span className="text-zinc-500 hidden sm:inline">•</span>
            <Link
              href="/listings"
              className="text-orange-500 hover:text-orange-600 underline text-sm sm:text-base py-2"
            >
              Browse All Rage Rooms
            </Link>
          </div>
        </div>

        {/* Helpful Guides */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Planning Your Visit
          </h2>
          <p className="text-zinc-300 mb-4">
            New to rage rooms? These guides cover everything you need to know before booking your session at {listing.name}.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/guides/what-happens-in-a-rage-room"
              className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-colors group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm group-hover:text-orange-500 transition-colors">What Happens in a Rage Room</p>
                <p className="text-zinc-400 text-xs">Step-by-step first visit guide</p>
              </div>
            </Link>
            <Link
              href="/guides/are-rage-rooms-safe-uk"
              className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-colors group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm group-hover:text-orange-500 transition-colors">Safety & Age Requirements</p>
                <p className="text-zinc-400 text-xs">Gear, rules, and age policies</p>
              </div>
            </Link>
            <Link
              href="/guides/how-much-do-rage-rooms-cost-uk"
              className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-colors group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm group-hover:text-orange-500 transition-colors">UK Rage Room Pricing Guide</p>
                <p className="text-zinc-400 text-xs">What to expect price-wise</p>
              </div>
            </Link>
            <Link
              href="/guides/best-rage-rooms-for-couples"
              className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-colors group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm group-hover:text-orange-500 transition-colors">Rage Rooms for Couples</p>
                <p className="text-zinc-400 text-xs">Date night ideas and tips</p>
              </div>
            </Link>
          </div>
        </div>

        {/* About Section with AI Summary */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            About
          </h2>
          <p className="text-white mb-4">
            {aiContent.summary}
          </p>
          {showAboutInContentAd && <AdsenseInContent />}
          {listing.description && (
            <p className="text-zinc-300 whitespace-pre-line text-sm">
              {listing.description}
            </p>
          )}
        </div>

        {/* Highlights Section */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Highlights
          </h2>
          <ul className="space-y-2">
            {aiContent.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-300">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Why This Rage Room is Unique */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Why {listing.name} is Unique
          </h2>
          <ul className="space-y-3">
            {aiContent.uniquePoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <Star className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0 fill-orange-500" />
                <span className="text-zinc-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nearby Recommendations */}
        {aiContent.nearbyRecommendations.length > 0 && (
          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Nearby Recommendations
            </h2>
            <ul className="space-y-2">
              {aiContent.nearbyRecommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}


        {/* Similar Rage Rooms Nearby */}
        {similarListings.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              Similar Rage Rooms Nearby
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {similarListings.map((similarListing) => {
                const similarLocation = similarListing.location as { lat: number; lng: number } | null
                const distance = location && similarLocation
                  ? calculateDistance(
                      location.lat,
                      location.lng,
                      similarLocation.lat,
                      similarLocation.lng
                    )
                  : undefined
                
                return (
                  <SimilarListingCard
                    key={similarListing.id}
                    listing={similarListing}
                    distance={distance}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* UGC Buttons */}
        <UGCButtons listingId={listing.id} listingName={listing.name} />

        {/* Venue FAQ */}
        {listingFAQs.length > 0 && (
          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Frequently Asked Questions About {listing.name}
            </h2>
            <div className="space-y-4">
              {listingFAQs.map((faq, index) => (
                <details key={index} className="group border-b border-zinc-700 last:border-0 pb-4 last:pb-0">
                  <summary className="flex items-center justify-between cursor-pointer text-white font-medium py-1 hover:text-orange-500 transition-colors">
                    {faq.question}
                    <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="text-zinc-300 text-sm mt-2 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <section aria-labelledby="reviews-heading" className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6">
          <h2 id="reviews-heading" className="text-xl sm:text-2xl font-bold text-white mb-4">
            Reviews ({totalReviewCount})
          </h2>

          {/* Google Reviews (API returns at most 5 review texts; userRatingsTotal is the full count) */}
          {(googleReviews.length > 0 ||
            (googleUserRatingsTotal != null && googleUserRatingsTotal > 0)) && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google Reviews
              </h3>
              {(googleOfficialRating != null && googleUserRatingsTotal != null) ||
              googleMapsPlaceUrl ? (
                <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                  {googleOfficialRating != null && googleUserRatingsTotal != null && (
                    <>
                      {googleOfficialRating.toFixed(1)}★ average from {googleUserRatingsTotal} reviews
                      on Google.{" "}
                    </>
                  )}
                  {googleUserRatingsTotal != null &&
                    googleUserRatingsTotal > googleReviews.length &&
                    googleReviews.length > 0 && (
                      <>
                        Google&apos;s Places API only allows third-party sites to display a sample of
                        up to five reviews, not the full list.{" "}
                      </>
                    )}
                  {googleMapsPlaceUrl && (
                    <a
                      href={googleMapsPlaceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-600 underline"
                    >
                      Read all reviews on Google
                    </a>
                  )}
                </p>
              ) : null}
              {googleReviews.length > 0 && (
                <div className="space-y-6">
                  {googleReviews.map((review, index) => (
                    <div
                      key={`google-${index}`}
                      className="border-b border-zinc-700 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {review.profile_photo_url && (
                            <Image
                              src={review.profile_photo_url}
                              alt={review.author_name}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? "text-yellow-400"
                                      : "text-zinc-600"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm font-medium text-white">
                              {review.author_name}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm text-zinc-400">
                          {review.relative_time_description}
                        </span>
                      </div>
                      <p className="text-white">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Site Reviews */}
          {listing.reviews.length > 0 && (
            <div
              className={
                googleReviews.length > 0 ||
                (googleUserRatingsTotal != null && googleUserRatingsTotal > 0)
                  ? "mt-8 pt-8 border-t border-zinc-700"
                  : ""
              }
            >
              <h3 className="text-lg font-semibold text-white mb-4">Site Reviews</h3>
              <div className="space-y-6">
                {listing.reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="border-b border-zinc-700 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "text-yellow-400"
                                  : "text-zinc-600"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm font-medium text-white">
                          {review.user.name || review.user.email}
                        </span>
                      </div>
                      <span className="text-sm text-zinc-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-white">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {listing.reviews.length === 0 &&
            googleReviews.length === 0 &&
            !(googleUserRatingsTotal != null && googleUserRatingsTotal > 0) && (
            <p className="text-zinc-400">
              No reviews available for this venue yet. Check back later, or visit their
              website to see reviews on other platforms.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}

