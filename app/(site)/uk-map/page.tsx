import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import NearMeMap from "@/components/NearMeMap"
import { buildOgImageUrl } from "@/lib/seo-schema"
import { absoluteUrl, listingUrl } from "@/lib/site-url"
import { formatListingPrice } from "@/lib/discovery"

const OG_IMAGE = buildOgImageUrl({
  title: "UK Rage Room Map",
  subtitle: "Interactive map of verified smash rooms",
  badge: "Map · UK",
})

export const metadata: Metadata = {
  title: "UK Rage Room Map | Find Smash Rooms Across Britain",
  description:
    "Interactive map of verified rage rooms and smash rooms across the UK. Explore venues by location, compare prices and open listing pages to book.",
  alternates: { canonical: "/uk-map" },
  openGraph: {
    title: "UK Rage Room Map",
    description:
      "Interactive map of verified rage rooms and smash rooms across the UK.",
    type: "website",
    images: [
      { url: OG_IMAGE, width: 1200, height: 630, alt: "Map of UK rage rooms" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Rage Room Map",
    description: "Interactive map of verified UK smash rooms.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 3600

export default async function UkMapPage() {
  const { getListingsWithLocation } = await import("@/lib/listings")
  const listings = await getListingsWithLocation()

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "UK Rage Room Map",
    description: "Interactive map of verified rage rooms across the UK",
    url: absoluteUrl("/uk-map"),
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Rage Rooms Across the UK",
    numberOfItems: listings.length,
    itemListElement: listings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: listing.name,
        address: {
          "@type": "PostalAddress",
          addressLocality: listing.city,
          ...(listing.region ? { addressRegion: listing.region } : {}),
          addressCountry: "GB",
        },
        url: listingUrl(listing.slug || listing.id),
        ...(formatListingPrice(listing, { includeFrom: false })
          ? { priceRange: formatListingPrice(listing, { includeFrom: false }) }
          : {}),
      },
    })),
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "UK Map" },
          ]}
        />

        <h1 className="mb-3 text-3xl font-bold text-white sm:mb-4 sm:text-4xl">
          UK Rage Room Map
        </h1>
        <p className="mb-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          Explore {listings.length} verified smash rooms on an interactive map.
          Click a pin to open the listing, compare prices, then book directly
          with the venue. Prefer city lists? Try{" "}
          <Link href="/near-me" className="text-orange-500 hover:text-orange-400 underline">
            near me
          </Link>{" "}
          or the{" "}
          <Link href="/london-map" className="text-orange-500 hover:text-orange-400 underline">
            London map
          </Link>
          .
        </p>

        <div className="mb-10 overflow-hidden rounded-lg border border-zinc-800 bg-[#181818] p-4">
          <NearMeMap listings={listings} />
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            href="/listings"
            className="font-semibold text-orange-500 hover:text-orange-400"
          >
            Browse all listings →
          </Link>
          <Link
            href="/rage-room-prices-uk"
            className="font-semibold text-zinc-300 hover:text-white"
          >
            UK prices hub
          </Link>
          <Link
            href="/list-your-rage-room"
            className="font-semibold text-zinc-300 hover:text-white"
          >
            List your venue
          </Link>
        </div>
      </div>
    </div>
  )
}
