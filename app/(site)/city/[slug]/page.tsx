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
import { getCityGuidePath, hasEditorialCityGuide } from "@/lib/city-guides"

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
  const rageRoomCount = allForSchema.filter((listing) => listing.activities.includes("rage-room")).length
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
    title: hasNearbyOnly ? `Destructive Experiences Near ${cityName}` : `Rage Rooms & Destructive Experiences in ${cityName}`,
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
      ? `Destructive Experiences Near ${cityName} — ${nearbyCount} ${nearbyCount === 1 ? "Venue" : "Venues"}`
      : isEmpty
        ? `Rage Rooms & Destructive Experiences Near ${cityName}`
        : `Rage Rooms & Destructive Experiences in ${cityName} — ${inCityCount} ${inCityCount === 1 ? "Venue" : "Venues"}${nearbyCount > 0 ? ` + ${nearbyCount} Nearby` : ""}`,
    description: hasNearbyOnly
      ? `Find verified destructive and adrenaline experiences near ${cityName}. Compare ${nearbyCount} nearby ${nearbyCount === 1 ? "venue" : "venues"}, published prices and booking options.`
      : isEmpty
        ? `We do not have a verified destructive experience in ${cityName} yet. Browse nearby UK venues or suggest a missing one.`
        : `Compare ${inCityCount} verified ${inCityCount === 1 ? "venue" : "venues"} in ${cityName}${rageRoomCount > 0 ? `, including ${rageRoomCount} ${rageRoomCount === 1 ? "rage room" : "rage rooms"}` : ""}${nearbyCount > 0 ? ` plus ${nearbyCount} nearby ${nearbyCount === 1 ? "option" : "options"}` : ""}.`,
    alternates: { canonical: `/city/${cityToSlug(cityName)}` },
    ...(!isIndexable ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: hasNearbyOnly
        ? `Destructive Experiences Near ${cityName} | RageRoom Directory`
        : `Rage Rooms & Destructive Experiences in ${cityName} | RageRoom Directory`,
      description: hasNearbyOnly
        ? `Browse ${nearbyCount} verified ${nearbyCount === 1 ? "venue" : "venues"} near ${cityName}. Compare activities and prices.`
        : `Browse ${inCityCount} verified ${inCityCount === 1 ? "venue" : "venues"} in ${cityName}${nearbyCount > 0 ? ` and ${nearbyCount} nearby` : ""}.`,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: hasNearbyOnly ? `Destructive experiences near ${cityName}` : `Rage rooms and destructive experiences in ${cityName}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: hasNearbyOnly ? `Destructive Experiences Near ${cityName}` : `Rage Rooms & Destructive Experiences in ${cityName}`,
      description: hasNearbyOnly
        ? `${nearbyCount} verified venues near ${cityName}. Compare activities and prices.`
        : `${primaryCount} verified ${primaryCount === 1 ? "venue" : "venues"} in ${cityName}${nearbyCount > 0 ? ` plus ${nearbyCount} nearby` : ""}.`,
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
  const hasRageRoom = listings.some((listing) => listing.activities.includes("rage-room"))

  const cityUrl = absoluteUrl(`/city/${cityToSlug(cityName)}`)

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${cityUrl}#itemlist`,
    name: hasNearbyOnly ? `Destructive Experiences Near ${cityName}` : `Rage Rooms & Destructive Experiences in ${cityName}`,
    description: hasNearbyOnly
      ? `Directory of verified destructive and adrenaline experiences near ${cityName}`
      : `Directory of verified rage rooms and closely related experiences in ${cityName}`,
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
            ...(listing.streetAddress ? { streetAddress: listing.streetAddress } : {}),
            addressLocality: listing.city,
            ...(listing.region ? { addressRegion: listing.region } : {}),
            ...(listing.postcode ? { postalCode: listing.postcode } : {}),
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
              ? `Destructive experiences near ${cityName}`
              : `Destructive experiences in ${cityName}`,
            serviceType: "Destructive and adrenaline activity experiences",
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
            { label: "All Venues", href: "/listings" },
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
          {hasNearbyOnly ? `Destructive Experiences Near ${cityName}` : `Rage Rooms & Destructive Experiences in ${cityName}`}
        </h1>

        {hasEditorialCityGuide(cityName) && (
          <p className="mb-6 rounded-lg border border-orange-500/40 bg-[#181818] px-4 py-3 text-sm text-zinc-300 sm:text-base">
            Looking for a ranked comparison? Read the{" "}
            <Link
              href={getCityGuidePath(cityName)}
              className="font-semibold text-orange-500 underline hover:text-orange-400"
            >
              best rage rooms in {cityName} guide
            </Link>
            . This page is the booking list.
          </p>
        )}

        {/* Unique city-specific intro; ad after first paragraph only. */}
        <div className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <p>
            {hasNearbyOnly
              ? `We do not currently list a verified venue in central ${cityName}, but there ${nearby.length === 1 ? "is" : "are"} ${nearby.length} verified ${nearby.length === 1 ? "option" : "options"} within travelling distance.`
              : hasRageRoom
                ? cityContent.intro
                : `Browse verified destructive and adrenaline experiences in ${cityName}. The inventory below may include standalone specialists as well as multi-activity venues.`}
          </p>
          {hasRageRoom && <p>{cityContent.localContext}</p>}
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
              <section aria-label={`Verified venues in ${cityName}`}>
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
                aria-label={`Verified venues near ${cityName}`}
                className={inCity.length > 0 ? "mt-10" : undefined}
              >
                <h2 className="text-2xl font-bold text-white mb-4">
                  {inCity.length > 0
                    ? `Verified Venues Near ${cityName}`
                    : `Nearest Verified Venues to ${cityName}`}
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

            {hasRageRoom && (
              <div className="mt-8 mb-6">
                <NearbyActivitiesAffiliate city={cityName} placement="city" />
              </div>
            )}

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
              {hasRageRoom && <ListingLeadCapture
                source={`city:${params.slug}`}
                idPrefix={`city-${params.slug}`}
              />}
              {hasRageRoom && <RageResetCTA surface="city" variant="secondary" />}
              {hasRageRoom && <DigitalGuidesChooser highlight="firstVisit" />}
            </div>
            <PageLevelAds />

            {/* Cross-links */}
            <div className="mt-4 mb-6 flex flex-wrap gap-3">
              <Link
                href="/listings"
                className="text-sm text-orange-500 hover:text-orange-600 underline"
              >
                Browse All UK Venues
              </Link>
              {hasRageRoom && (
                <>
                  <span className="text-zinc-600">|</span>
                  <Link
                    href="/guides/how-much-do-rage-rooms-cost-uk"
                    className="text-sm text-orange-500 hover:text-orange-600 underline"
                  >
                    UK Rage Room Pricing Guide
                  </Link>
                  <span className="text-zinc-600">|</span>
                  <Link
                    href="/guides/what-happens-in-a-rage-room"
                    className="text-sm text-orange-500 hover:text-orange-600 underline"
                  >
                    Rage Room First-Time Guide
                  </Link>
                </>
              )}
            </div>

            {/* Deep internal linking: this city's dedicated guide + related
                city pages + full topical guide cluster. Boosts crawl depth
                and topical authority. */}
            {hasRageRoom && <CityRelatedLinks cityName={cityName} />}
          </>
        ) : (
          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-8 text-center">
            <p className="text-xl text-white mb-4">
              No verified venues found in {cityName} yet
            </p>
            <p className="text-zinc-400 mb-6">
              We&apos;re always adding verified rage rooms and closely related destructive experiences. Explore the UK map or tell us if we are missing a venue in {cityName}.
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

        {hasRageRoom && <FAQ items={cityFAQs} title={`Frequently Asked Questions About Rage Rooms in ${cityName}`} />}

        <div className="mt-12">
          <UGCButtons />
        </div>
      </div>
    </div>
  )
}
