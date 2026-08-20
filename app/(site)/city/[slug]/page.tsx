import { Metadata } from "next"
import { slugToCity, cityToSlug } from "@/lib/location"
import { getCityContent, getGenericCityContent } from "@/lib/city-content"
import ListingsGrid from "@/components/ListingsGrid"
import Breadcrumbs from "@/components/Breadcrumbs"
import FAQ from "@/components/FAQ"
import { getCityFAQs } from "@/lib/faqs"
import UGCButtons from "@/components/UGCButtons"
import CityRelatedLinks from "@/components/CityRelatedLinks"
import DigitalGuidesChooser from "@/components/DigitalGuidesChooser"
import ListingLeadCapture from "@/components/ListingLeadCapture"
import PageLevelAds from "@/components/PageLevelAds"
import RageResetCTA from "@/components/RageResetCTA"
import Link from "next/link"
import TrackedDiscoveryLink from "@/components/TrackedDiscoveryLink"
import { buildOgImageUrl } from "@/lib/seo-schema"
import { absoluteUrl, listingUrl } from "@/lib/site-url"
import { isIndexableLocationPage } from "@/lib/location-indexing"
import NearbyActivitiesAffiliate from "@/components/NearbyActivitiesAffiliate"
import { getEligibleLocationDiscoveryPages } from "@/lib/location-discovery"

interface CityPageProps {
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const cityName = slugToCity(params.slug)
  const { getListingsNearCity } = await import("@/lib/listings")
  const { inCity, nearby, allForSchema } = await getListingsNearCity(cityName)
  const inCityCount = inCity.length
  const nearbyCount = nearby.length
  const hasNearbyOnly = inCity.length === 0 && nearby.length > 0
  const isEmpty = allForSchema.length === 0
  const isIndexable = isIndexableLocationPage({
    city: cityName,
    inCity,
    nearby,
  })
  const primaryCount = hasNearbyOnly ? nearbyCount : inCityCount
  const pricedListings = allForSchema.filter((l) => l.price != null) as Array<
    typeof allForSchema[number] & { price: number }
  >
  const minPrice = pricedListings.length
    ? Math.min(...pricedListings.map((l) => l.price))
    : null

  const ogImage = buildOgImageUrl({
    title: hasNearbyOnly ? `Rage Rooms Near ${cityName}` : `Rage Rooms in ${cityName}`,
    subtitle: isEmpty
      ? "Browse verified UK venues nearby"
      : hasNearbyOnly
        ? `${nearbyCount} nearby ${nearbyCount === 1 ? "venue" : "venues"} · Compare prices & book`
        : `${inCityCount} in-city${nearbyCount > 0 ? ` + ${nearbyCount} nearby` : ""} · Compare prices & book`,
    badge: "City",
    ...(minPrice ? { price: `From £${minPrice.toFixed(0)}` } : {}),
  })

  return {
    title: hasNearbyOnly
      ? `Rage Rooms Near ${cityName} — ${nearbyCount} ${nearbyCount === 1 ? "Venue" : "Venues"}`
      : isEmpty
        ? `Rage Rooms Near ${cityName} | Find UK Smash Rooms`
        : `Rage Rooms in ${cityName} — ${inCityCount} ${inCityCount === 1 ? "Venue" : "Venues"}${nearbyCount > 0 ? ` + ${nearbyCount} Nearby` : ""}`,
    description: hasNearbyOnly
      ? `Find rage rooms near ${cityName}. Compare ${nearbyCount} nearby ${nearbyCount === 1 ? "venue" : "venues"} within travelling distance, view starting prices, and book a smash room session.`
      : isEmpty
        ? `We do not have a verified rage room in ${cityName} yet. Browse nearby UK rage rooms, compare prices, and suggest a missing venue.`
        : `Compare ${inCityCount} verified ${inCityCount === 1 ? "rage room" : "rage rooms"} in ${cityName}${nearbyCount > 0 ? ` plus ${nearbyCount} nearby ${nearbyCount === 1 ? "option" : "options"}` : ""}. View starting prices, age limits and booking details.`,
    alternates: { canonical: `/city/${cityToSlug(cityName)}` },
    ...(!isIndexable ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: hasNearbyOnly
        ? `Rage Rooms Near ${cityName} | RageRoom Directory`
        : `Rage Rooms in ${cityName} | RageRoom Directory`,
      description: hasNearbyOnly
        ? `Browse ${nearbyCount} rage ${nearbyCount === 1 ? "room" : "rooms"} near ${cityName}. Compare venues and prices.`
        : `Browse ${inCityCount} rage ${inCityCount === 1 ? "room" : "rooms"} in ${cityName}${nearbyCount > 0 ? ` and ${nearbyCount} nearby` : ""}. Compare venues and prices.`,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: hasNearbyOnly ? `Rage rooms near ${cityName}` : `Rage rooms in ${cityName}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: hasNearbyOnly ? `Rage Rooms Near ${cityName}` : `Rage Rooms in ${cityName}`,
      description: hasNearbyOnly
        ? `${nearbyCount} verified rage rooms near ${cityName}. Compare venues and prices.`
        : `${primaryCount} verified rage ${primaryCount === 1 ? "room" : "rooms"} in ${cityName}${nearbyCount > 0 ? ` plus ${nearbyCount} nearby` : ""}.`,
      images: [ogImage],
    },
  }
}

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const { getDistinctCities } = await import("@/lib/listings")
  const { mergeCitiesWithPriority } = await import("@/lib/priority-seo-cities")
  const cities = mergeCitiesWithPriority(await getDistinctCities())
  return cities.map((city) => ({ slug: cityToSlug(city) }))
}

export default async function CityPage({ params }: CityPageProps) {
  const cityName = slugToCity(params.slug)
  const { getAllListingsForAdmin, getListingsNearCity } = await import("@/lib/listings")
  const { inCity, nearby, allForSchema } = await getListingsNearCity(cityName)
  const directoryListings = await getAllListingsForAdmin()
  const locationDiscoveryPages = getEligibleLocationDiscoveryPages(directoryListings).filter(
    (page) => page.location.slug === cityToSlug(cityName)
  )
  const listings = allForSchema
  const hasNearbyOnly = inCity.length === 0 && nearby.length > 0
  const isEmpty = listings.length === 0

  const cityUrl = absoluteUrl(`/city/${cityToSlug(cityName)}`)

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${cityUrl}#itemlist`,
    name: hasNearbyOnly ? `Rage Rooms Near ${cityName}` : `Rage Rooms in ${cityName}`,
    description: hasNearbyOnly
      ? `Directory of rage rooms and smash rooms near ${cityName}`
      : `Directory of rage rooms and smash rooms in ${cityName}`,
    numberOfItems: listings.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: listings.map((listing, index) => {
      const url = listingUrl(listing.slug || listing.id)
      return {
        "@type": "ListItem",
        position: index + 1,
        url,
        item: {
          "@type": ["LocalBusiness", "EntertainmentBusiness"],
          "@id": `${url}#localbusiness`,
          name: listing.name,
          url,
          image: listing.image || absoluteUrl("/og-image.png"),
          address: {
            "@type": "PostalAddress",
            addressLocality: listing.city,
            ...(listing.region ? { addressRegion: listing.region } : {}),
            addressCountry: "GB",
          },
          ...(listing.price != null && listing.priceCurrency === "GBP" && listing.priceUnit
            ? {
                offers: {
                  "@type": "Offer",
                  priceCurrency: listing.priceCurrency,
                  price: listing.price.toFixed(2),
                  description: `Starting price ${listing.priceUnit.replace("-", " ")}`,
                  url,
                },
              }
            : {}),
        },
      }
    }),
  }

  const cityFAQs = getCityFAQs(cityName)
  const cityContent =
    getCityContent(cityName) ||
    getGenericCityContent(cityName, hasNearbyOnly ? nearby.length : inCity.length, {
      nearbyOnly: hasNearbyOnly,
    })

  const priceRange = listings
    .filter((listing) => listing.price != null && listing.priceUnit === "per-person")
    .map((listing) => listing.price as number)
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
          url: cityUrl,
          description: "Published per-person starting prices only; room and group prices are excluded.",
          itemOffered: {
            "@type": "Service",
            name: hasNearbyOnly
              ? `Rage room sessions near ${cityName}`
              : `Rage room sessions in ${cityName}`,
            serviceType: "Rage room / smash room experience",
            areaServed: { "@type": "City", name: cityName },
          },
        }
      : null

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
        {aggregateOfferSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(aggregateOfferSchema),
            }}
          />
        )}

        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
          {hasNearbyOnly ? `Rage Rooms Near ${cityName}` : `Rage Rooms in ${cityName}`}
        </h1>

        {/* Unique city-specific intro; ad after first paragraph only. */}
        <div className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <p>
            {hasNearbyOnly
              ? `We do not currently list a dedicated rage room in central ${cityName}, but there ${nearby.length === 1 ? "is" : "are"} ${nearby.length} verified ${nearby.length === 1 ? "venue" : "venues"} within travelling distance. Compare the closest options below, including prices, locations and booking links.`
              : cityContent.intro}
          </p>
          <p>{cityContent.localContext}</p>
        </div>

        {/* Quick stats bar */}
        {!isEmpty && (
          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-4 mb-6 flex flex-wrap gap-4 sm:gap-8">
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-wider">
                {hasNearbyOnly ? "Nearby Venues" : "In-City Venues"}
              </p>
              <p className="text-white text-xl font-bold">
                {hasNearbyOnly ? nearby.length : inCity.length}
              </p>
            </div>
            {!hasNearbyOnly && nearby.length > 0 && (
              <div>
                <p className="text-zinc-400 text-xs uppercase tracking-wider">
                  Nearby Options
                </p>
                <p className="text-white text-xl font-bold">{nearby.length}</p>
              </div>
            )}
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
        
        {!isEmpty ? (
          <>
            {inCity.length > 0 && (
              <section aria-label={`Rage rooms in ${cityName}`}>
                <ListingsGrid
                  listings={inCity}
                  discoveryContext={{
                    surface: "directory",
                    pageType: "city",
                    discoveryLocation: params.slug,
                  }}
                />
              </section>
            )}

            {nearby.length > 0 && (
              <section
                aria-label={`Rage rooms near ${cityName}`}
                className={inCity.length > 0 ? "mt-10" : undefined}
              >
                <h2 className="text-2xl font-bold text-white mb-4">
                  {inCity.length > 0
                    ? `Rage Rooms Near ${cityName}`
                    : `Nearest Rage Rooms to ${cityName}`}
                </h2>
                <ListingsGrid
                  listings={nearby}
                  discoveryContext={{
                    surface: "directory",
                    pageType: "city",
                    discoveryLocation: params.slug,
                  }}
                />
              </section>
            )}

            <div className="mt-8 mb-6">
              <NearbyActivitiesAffiliate city={cityName} placement="city" />
            </div>

            {locationDiscoveryPages.length > 0 && (
              <nav className="mt-8 mb-6 rounded-lg border border-zinc-800 bg-[#181818] p-4 sm:p-6" aria-label={`Experiences available in ${cityName}`}>
                <h2 className="text-xl font-bold text-white">Experiences available in {cityName}</h2>
                <p className="mt-2 text-sm text-zinc-400">Explore focused pages only where the verified local inventory supports useful comparison.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {locationDiscoveryPages.map((page) => (
                    <TrackedDiscoveryLink
                      key={page.href}
                      eventName="location_discovery_click"
                      sourcePageType="city"
                      destinationIdentifier={`${page.category.slug}:${page.location.slug}`}
                      destinationPath={page.href}
                      className="inline-flex min-h-11 items-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-200 hover:border-rage-500/50 hover:text-rage-300"
                    >
                      {page.category.shortLabel} ({page.listings.length})
                    </TrackedDiscoveryLink>
                  ))}
                </div>
              </nav>
            )}
            
            {/* Travel tip */}
            <div className="mt-8 mb-6">
              <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-white mb-2">Getting There</h2>
                <p className="text-base text-zinc-300">
                  {hasNearbyOnly
                    ? `The nearest listed venues may require a short train journey or drive from ${cityName}. Check each listing for postcode, parking, public transport options and booking availability before travelling.`
                    : cityContent.travelTip}
                </p>
              </div>
            </div>

            <div className="mt-8 mb-6 space-y-4">
              <ListingLeadCapture
                source={`city:${params.slug}`}
                idPrefix={`city-${params.slug}`}
              />
              <RageResetCTA surface="city" variant="secondary" />
              <DigitalGuidesChooser highlight="firstVisit" />
            </div>
            <PageLevelAds />

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
              No verified rage rooms found in {cityName} yet
            </p>
            <p className="text-zinc-400 mb-6">
              We're always adding new rage rooms to our directory. Explore the UK map or full directory, and tell us if we are missing a venue in {cityName}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/near-me"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors text-center"
              >
                Find Rage Rooms Near Me
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
