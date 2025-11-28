import { notFound, redirect } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import { 
  Shield, Hammer, Music, Package, Clock, Users, ParkingCircle, 
  CheckCircle, Star, MapPin, AlertTriangle, Plus, Zap, RefreshCw, UserCheck
} from "lucide-react"
import { getListingBySlug, getListingById, getSimilarListings } from "@/lib/listings"
import { cityToSlug } from "@/lib/location"
import { getGoogleReviews } from "@/lib/google-places"
import { generateListingContent } from "@/lib/ai-content"
import { calculateDistance } from "@/lib/distance"
import Breadcrumbs from "@/components/Breadcrumbs"
import Link from "next/link"
import ListingCard from "@/components/ListingCard"
import SimilarListingCard from "@/components/SimilarListingCard"
import UGCButtons from "@/components/UGCButtons"

interface ListingPageProps {
  params: { slug: string }
}

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
    // Use the slug if available, otherwise use the UUID
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"
    const canonicalUrl = listing.slug 
      ? `${baseUrl}/listing/${listing.slug}`
      : `${baseUrl}/listing/${listing.id}`
    
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
      },
    }
  } else {
    // It's a slug, find by slug
    listing = await getListingBySlug(params.slug)
  }

  if (!listing) {
    return {
      title: "Listing Not Found",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"
  const canonicalUrl = `${baseUrl}/listing/${listing.slug || listing.id}`

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
    
    // If listing has a slug, redirect to slug URL (permanent redirect)
    if (listing.slug) {
      redirect(`/listing/${listing.slug}`)
    }
    
    // If no slug exists yet, generate one (shouldn't happen after migration)
    const { generateUniqueSlug } = await import("@/lib/slugify")
    const { prisma } = await import("@/lib/prisma")
    const slug = await generateUniqueSlug(listing.name, listing.city)
    
    await prisma.listing.update({
      where: { id: listing.id },
      data: { slug },
    })

    // Redirect to the new slug
    redirect(`/listing/${slug}`)
  } else {
    // It's a slug, find by slug
    listing = await getListingBySlug(params.slug)
    
    if (!listing) {
      notFound()
    }
  }

  const location = listing.location as { lat: number; lng: number } | null

  // Get Google reviews if place ID exists
  const googleReviews = listing.googlePlaceId
    ? await getGoogleReviews(listing.googlePlaceId)
    : []

  // Calculate average rating from site reviews
  const siteAverageRating =
    listing.reviews.length > 0
      ? listing.reviews.reduce((sum, review) => sum + review.rating, 0) /
        listing.reviews.length
      : null

  // Calculate average rating from Google reviews
  const googleAverageRating =
    googleReviews.length > 0
      ? googleReviews.reduce((sum, review) => sum + review.rating, 0) /
        googleReviews.length
      : null

  // Calculate overall average rating (combining both)
  const totalReviews = listing.reviews.length + googleReviews.length
  const overallRating =
    totalReviews > 0
      ? ((siteAverageRating || 0) * listing.reviews.length +
          (googleAverageRating || 0) * googleReviews.length) /
        totalReviews
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"
  const listingUrl = `${baseUrl}/listing/${listing.slug}`

  // LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.name,
    image: listing.image ? [listing.image] : [],
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.city,
      addressRegion: listing.region || "",
      postalCode: listing.postcode || "",
      addressCountry: "GB",
    },
    ...(listing.phone && { telephone: listing.phone }),
    ...(listing.website && { url: listing.website }),
    ...(location && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: location.lat,
        longitude: location.lng,
      },
    }),
    ...(listing.price && { priceRange: `£${listing.price.toFixed(0)}` }),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "18:00",
      },
    ],
    ...(overallRating && totalReviews > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: overallRating.toFixed(1),
        reviewCount: totalReviews,
      },
    }),
    ...(listing.website && { sameAs: [listing.website] }),
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
                          ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

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

        {/* Packages & Pricing */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Packages & Pricing
          </h2>
          <div className="space-y-3">
            {listing.price ? (
              <>
                <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                  <span className="text-white">30-minute smash session</span>
                  <span className="text-orange-500 font-semibold">From £{listing.price.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                  <span className="text-white">Couples smash (60 minutes)</span>
                  <span className="text-orange-500 font-semibold">From £{(listing.price * 1.6).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                  <span className="text-white">Group session (4+ people)</span>
                  <span className="text-orange-500 font-semibold">From £{(listing.price * 0.9).toFixed(0)} per person</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-white">Premium package (extended time + extras)</span>
                  <span className="text-orange-500 font-semibold">From £{(listing.price * 1.5).toFixed(0)}</span>
                </div>
              </>
            ) : (
              <p className="text-zinc-400">Pricing varies by package. Please contact the venue for current rates.</p>
            )}
          </div>
          {listing.website && (
            <div className="mt-4">
              <a
                href={listing.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                View Full Pricing & Book →
              </a>
            </div>
          )}
        </div>

        {/* Quick Facts */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
            Quick Facts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Age Limit</h3>
                <p className="text-zinc-400 text-sm">16+ years</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Session Length</h3>
                <p className="text-zinc-400 text-sm">30-60 minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Group Size</h3>
                <p className="text-zinc-400 text-sm">1-6 people</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <ParkingCircle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Parking</h3>
                <p className="text-zinc-400 text-sm">Available on-site</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Safety Gear</h3>
                <p className="text-zinc-400 text-sm">Provided</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Hammer className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Tools</h3>
                <p className="text-zinc-400 text-sm">Provided</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Smash Items</h3>
                <p className="text-zinc-400 text-sm">Included</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Music</h3>
                <p className="text-zinc-400 text-sm">Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Opening Hours
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center py-2 border-b border-zinc-700">
              <span className="text-white">Monday - Friday</span>
              <span className="text-zinc-300">10:00 - 20:00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-700">
              <span className="text-white">Saturday</span>
              <span className="text-zinc-300">09:00 - 21:00</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-white">Sunday</span>
              <span className="text-zinc-300">10:00 - 18:00</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
              Open now
            </span>
            <span className="text-zinc-400 text-sm">(Hours may vary, please confirm with venue)</span>
          </div>
          {listing.phone && (
            <p className="text-zinc-400 text-sm mt-2">
              Call <a href={`tel:${listing.phone}`} className="text-orange-500 hover:text-orange-600">{listing.phone}</a> to confirm current hours
            </p>
          )}
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
            <div className="aspect-video w-full bg-zinc-900 rounded-lg overflow-hidden mb-4">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${location.lat},${location.lng}`}
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

        {/* About Section with AI Summary */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            About
          </h2>
          <p className="text-white mb-4">
            {aiContent.summary}
          </p>
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

        {/* Safety Notes */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Safety Notes
          </h2>
          <ul className="space-y-2">
            {aiContent.safetyNotes.map((note, index) => (
              <li key={index} className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-300">{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What You'll Get / Included Gear Section */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
            What You'll Get
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Protective Gear</h3>
                <p className="text-zinc-400 text-sm">Safety equipment provided for your protection</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Hammer className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Choice of Weapon</h3>
                <p className="text-zinc-400 text-sm">Select from various smashing tools</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Music className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Music System</h3>
                <p className="text-zinc-400 text-sm">Pump up the volume while you smash</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Smash Items Included</h3>
                <p className="text-zinc-400 text-sm">All breakable items provided</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Add-on Upgrades</h3>
                <p className="text-zinc-400 text-sm">Enhance your experience with extras</p>
              </div>
            </div>
          </div>
        </div>

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

        {/* Reviews Section */}
        <section aria-labelledby="reviews-heading" className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6">
          <h2 id="reviews-heading" className="text-xl sm:text-2xl font-bold text-white mb-4">
            Reviews ({listing.reviews.length + googleReviews.length})
          </h2>

          {/* Google Reviews */}
          {googleReviews.length > 0 && (
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
            </div>
          )}

          {/* Site Reviews */}
          {listing.reviews.length > 0 && (
            <div className={googleReviews.length > 0 ? "mt-8 pt-8 border-t border-zinc-700" : ""}>
              <h3 className="text-lg font-semibold text-white mb-4">Site Reviews</h3>
              <div className="space-y-6">
                {listing.reviews.map((review) => (
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

          {/* No reviews message */}
          {listing.reviews.length === 0 && googleReviews.length === 0 && (
            <p className="text-zinc-400">
              No reviews yet. Be the first to review this rage room!
            </p>
          )}
        </section>
      </div>
    </div>
  )
}

