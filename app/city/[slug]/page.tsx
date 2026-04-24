import { Metadata } from "next"
import { slugToCity, cityToSlug } from "@/lib/location"
import { getCityContent, getGenericCityContent } from "@/lib/city-content"
import ListingsGrid from "@/components/ListingsGrid"
import Breadcrumbs from "@/components/Breadcrumbs"
import FAQ from "@/components/FAQ"
import { getCityFAQs } from "@/lib/faqs"
import UGCButtons from "@/components/UGCButtons"
import AdsenseInContent from "@/components/ads/AdsenseInContent"
import CityRelatedLinks from "@/components/CityRelatedLinks"
import Link from "next/link"
import { buildOgImageUrl } from "@/lib/seo-schema"

interface CityPageProps {
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const cityName = slugToCity(params.slug)
  const { getListingsByCity } = await import("@/lib/listings")
  const listings = await getListingsByCity(cityName)
  const count = listings.length
  const pricedListings = listings.filter((l) => l.price != null) as Array<
    typeof listings[number] & { price: number }
  >
  const minPrice = pricedListings.length
    ? Math.min(...pricedListings.map((l) => l.price))
    : null

  const ogImage = buildOgImageUrl({
    title: `Rage Rooms in ${cityName}`,
    subtitle: `${count} verified ${count === 1 ? "venue" : "venues"} · Compare prices & book`,
    badge: "City",
    ...(minPrice ? { price: `From £${minPrice.toFixed(0)}` } : {}),
  })

  return {
    title: `Rage Rooms in ${cityName} — ${count} ${count === 1 ? "Venue" : "Venues"} Listed`,
    description: `Find rage rooms in ${cityName}. Compare ${count} ${count === 1 ? "venue" : "venues"}, view starting prices, read reviews, and book a destruction therapy session near you.`,
    alternates: { canonical: `/city/${cityToSlug(cityName)}` },
    openGraph: {
      title: `Rage Rooms in ${cityName} | RageRoom Directory`,
      description: `Browse ${count} rage ${count === 1 ? "room" : "rooms"} in ${cityName}. Compare venues, prices, and reviews.`,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Rage rooms in ${cityName}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Rage Rooms in ${cityName}`,
      description: `${count} verified rage rooms in ${cityName}. Compare venues and prices.`,
      images: [ogImage],
    },
  }
}

export const revalidate = 3600
export const dynamicParams = true

export default async function CityPage({ params }: CityPageProps) {
  const cityName = slugToCity(params.slug)
  const { getListingsByCity } = await import("@/lib/listings")
  const listings = await getListingsByCity(cityName)

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"
  const cityUrl = `${baseUrl}/city/${cityToSlug(cityName)}`

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${cityUrl}#itemlist`,
    name: `Rage Rooms in ${cityName}`,
    description: `Directory of rage rooms and smash rooms in ${cityName}`,
    numberOfItems: listings.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: listings.map((listing, index) => {
      const url = `${baseUrl}/listing/${listing.slug || listing.id}`
      return {
        "@type": "ListItem",
        position: index + 1,
        url,
        item: {
          "@type": ["LocalBusiness", "EntertainmentBusiness"],
          "@id": `${url}#localbusiness`,
          name: listing.name,
          url,
          image: listing.image || `${baseUrl}/og-image.png`,
          address: {
            "@type": "PostalAddress",
            addressLocality: listing.city,
            ...(listing.region ? { addressRegion: listing.region } : {}),
            addressCountry: "GB",
          },
          ...(listing.price
            ? {
                offers: {
                  "@type": "Offer",
                  priceCurrency: "GBP",
                  price: listing.price.toFixed(2),
                  availability: "https://schema.org/InStock",
                  url,
                },
              }
            : {}),
        },
      }
    }),
  }

  const cityFAQs = getCityFAQs(cityName)
  const cityContent = getCityContent(cityName) || getGenericCityContent(cityName, listings.length)

  const priceRange = listings.filter(l => l.price).map(l => l.price!)
  const minPrice = priceRange.length > 0 ? Math.min(...priceRange) : null
  const maxPrice = priceRange.length > 0 ? Math.max(...priceRange) : null

  // AggregateOffer schema: the "from £X — up to £Y" signal for a whole city.
  // Unlocks richer SERP price badging and gives LLMs an at-a-glance price
  // range for the market, which is one of the most commonly asked questions.
  const aggregateOfferSchema =
    minPrice !== null && maxPrice !== null
      ? {
          "@context": "https://schema.org",
          "@type": "AggregateOffer",
          "@id": `${cityUrl}#aggregateoffer`,
          priceCurrency: "GBP",
          lowPrice: minPrice.toFixed(2),
          highPrice: maxPrice.toFixed(2),
          offerCount: priceRange.length,
          availability: "https://schema.org/InStock",
          url: cityUrl,
          offeredBy: {
            "@type": "Organization",
            name: "RageRoom Directory",
            url: baseUrl,
          },
          itemOffered: {
            "@type": "Service",
            name: `Rage room sessions in ${cityName}`,
            serviceType: "Rage room / smash room experience",
            areaServed: { "@type": "City", name: cityName },
          },
        }
      : null

  // Breadcrumb schema — gives this page proper hierarchy signal.
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Rage Rooms",
        item: `${baseUrl}/listings`,
      },
      { "@type": "ListItem", position: 3, name: cityName, item: cityUrl },
    ],
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "All Rage Rooms", href: "/listings" },
            { label: cityName },
          ]}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        {aggregateOfferSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(aggregateOfferSchema),
            }}
          />
        )}

        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
          Rage Rooms in {cityName}
        </h1>

        {/* Unique city-specific intro; ad after first paragraph only. */}
        <div className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <p>{cityContent.intro}</p>
          <AdsenseInContent />
          <p>{cityContent.localContext}</p>
        </div>

        {/* Quick stats bar */}
        {listings.length > 0 && (
          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-4 mb-6 flex flex-wrap gap-4 sm:gap-8">
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-wider">Venues Listed</p>
              <p className="text-white text-xl font-bold">{listings.length}</p>
            </div>
            {minPrice !== null && (
              <div>
                <p className="text-zinc-400 text-xs uppercase tracking-wider">Starting From</p>
                <p className="text-orange-500 text-xl font-bold">£{minPrice.toFixed(0)}</p>
              </div>
            )}
            {maxPrice !== null && minPrice !== maxPrice && (
              <div>
                <p className="text-zinc-400 text-xs uppercase tracking-wider">Up To</p>
                <p className="text-orange-500 text-xl font-bold">£{maxPrice.toFixed(0)}</p>
              </div>
            )}
          </div>
        )}
        
        {listings.length > 0 ? (
          <>
            <section aria-label={`Rage rooms in ${cityName}`}>
              <ListingsGrid listings={listings} />
            </section>
            
            {/* Travel tip */}
            <div className="mt-8 mb-6">
              <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-white mb-2">Getting There</h2>
                <p className="text-base text-zinc-300">
                  {cityContent.travelTip}
                </p>
              </div>
            </div>

            {/* Cross-links */}
            <div className="mt-4 mb-6 flex flex-wrap gap-3">
              <Link
                href="/listings"
                className="text-sm text-orange-500 hover:text-orange-600 underline"
              >
                Browse All UK Rage Rooms
              </Link>
              <span className="text-zinc-600">|</span>
              <Link
                href="/guides/how-much-do-rage-rooms-cost-uk"
                className="text-sm text-orange-500 hover:text-orange-600 underline"
              >
                UK Pricing Guide
              </Link>
              <span className="text-zinc-600">|</span>
              <Link
                href="/guides/what-happens-in-a-rage-room"
                className="text-sm text-orange-500 hover:text-orange-600 underline"
              >
                First Time Guide
              </Link>
            </div>

            {/* Deep internal linking: this city's dedicated guide + related
                city pages + full topical guide cluster. Boosts crawl depth
                and topical authority. */}
            <CityRelatedLinks cityName={cityName} />
          </>
        ) : (
          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-8 text-center">
            <p className="text-xl text-white mb-4">
              No rage rooms found in {cityName} yet
            </p>
            <p className="text-zinc-400 mb-6">
              We're always adding new rage rooms to our directory. Check back soon, or explore rage rooms in other cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors text-center"
              >
                Browse All Rage Rooms
              </Link>
              <Link
                href="/list-your-rage-room"
                className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-zinc-700 font-semibold px-6 py-3 rounded-md transition-colors text-center"
              >
                List Your Rage Room
              </Link>
            </div>
          </div>
        )}

        <FAQ items={cityFAQs} title={`Frequently Asked Questions About Rage Rooms in ${cityName}`} />

        <div className="mt-12">
          <UGCButtons />
        </div>
      </div>
    </div>
  )
}
