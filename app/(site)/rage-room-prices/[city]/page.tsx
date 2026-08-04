import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Breadcrumbs from "@/components/Breadcrumbs"
import ListingsGrid from "@/components/ListingsGrid"
import {
  CITY_PRICE_PAGE_CITIES,
} from "@/lib/priority-seo-cities"
import { cityToSlug, slugToCity } from "@/lib/location"
import { buildOgImageUrl } from "@/lib/seo-schema"
import { absoluteUrl } from "@/lib/site-url"
import { isIndexableLocationPage } from "@/lib/location-indexing"

type PageProps = {
  params: { city: string }
}

const ALLOWED = new Set(
  CITY_PRICE_PAGE_CITIES.map((city) => cityToSlug(city))
)

export async function generateStaticParams() {
  return CITY_PRICE_PAGE_CITIES.map((city) => ({
    city: cityToSlug(city),
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  if (!ALLOWED.has(params.city)) {
    return { title: "Rage Room Prices" }
  }

  const cityName = slugToCity(params.city)
  const { getListingsNearCity } = await import("@/lib/listings")
  const { inCity, nearby } = await getListingsNearCity(cityName)
  const isIndexable = isIndexableLocationPage({
    city: cityName,
    inCity,
    nearby,
  })
  const ogImage = buildOgImageUrl({
    title: `Rage Room Prices in ${cityName}`,
    subtitle: "Starting prices compared · Book verified venues",
    badge: "Pricing",
  })

  return {
    title: `Rage Room Prices in ${cityName} | Starting Costs 2026`,
    description: `Compare rage room prices in ${cityName}. See starting prices for verified smash rooms near ${cityName}, what packages usually include, and book directly with venues.`,
    alternates: { canonical: `/rage-room-prices/${params.city}` },
    ...(!isIndexable ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `Rage Room Prices in ${cityName}`,
      description: `Starting prices and packages for rage rooms near ${cityName}.`,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Rage room prices in ${cityName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Rage Room Prices in ${cityName}`,
      description: `Compare smash room starting prices near ${cityName}.`,
      images: [ogImage],
    },
  }
}

export const revalidate = 3600
export const dynamicParams = false

export default async function CityRageRoomPricesPage({ params }: PageProps) {
  if (!ALLOWED.has(params.city)) {
    notFound()
  }

  const cityName = slugToCity(params.city)
  const { getListingsNearCity } = await import("@/lib/listings")
  const { inCity, nearby, allForSchema } = await getListingsNearCity(cityName)
  const priced = allForSchema.filter(
    (l): l is typeof l & { price: number } => typeof l.price === "number"
  )
  const minPrice = priced.length
    ? Math.min(...priced.map((l) => l.price))
    : null
  const maxPrice = priced.length
    ? Math.max(...priced.map((l) => l.price))
    : null
  const hasNearbyOnly = inCity.length === 0 && nearby.length > 0

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Rage Room Prices in ${cityName}`,
    description: `Starting prices for rage rooms and smash rooms near ${cityName}`,
    url: absoluteUrl(`/rage-room-prices/${params.city}`),
  }

  const aggregateOfferSchema =
    minPrice !== null && maxPrice !== null
      ? {
          "@context": "https://schema.org",
          "@type": "AggregateOffer",
          priceCurrency: "GBP",
          lowPrice: minPrice.toFixed(2),
          highPrice: maxPrice.toFixed(2),
          offerCount: priced.length,
          availability: "https://schema.org/InStock",
          url: absoluteUrl(`/rage-room-prices/${params.city}`),
        }
      : null

  return (
    <div className="py-6 sm:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
        />
        {aggregateOfferSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(aggregateOfferSchema),
            }}
          />
        )}

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "UK Prices", href: "/rage-room-prices-uk" },
            { label: cityName },
          ]}
        />

        <h1 className="mb-3 text-3xl font-bold text-white sm:mb-4 sm:text-4xl">
          Rage Room Prices in {cityName}
        </h1>
        <p className="mb-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          {hasNearbyOnly
            ? `We do not currently list a dedicated venue in central ${cityName}. Below are starting prices for the nearest verified smash rooms within travelling distance.`
            : `Compare starting prices for verified rage rooms ${inCity.length ? `in` : `near`} ${cityName}. Prices shown are typical per-person starting rates — always confirm packages directly with the venue.`}
        </p>

        {!allForSchema.length ? (
          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-6">
            <p className="text-zinc-300">
              We do not have priced venues near {cityName} yet.{" "}
              <Link
                href="/list-your-rage-room"
                className="font-semibold text-orange-500 hover:text-orange-400"
              >
                List a venue
              </Link>{" "}
              or browse the{" "}
              <Link
                href="/rage-room-prices-uk"
                className="font-semibold text-orange-500 hover:text-orange-400"
              >
                UK prices hub
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap gap-4 rounded-lg border border-zinc-800 bg-[#181818] p-4 sm:gap-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-400">
                  Venues compared
                </p>
                <p className="text-xl font-bold text-white">
                  {allForSchema.length}
                </p>
              </div>
              {minPrice !== null && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">
                    From
                  </p>
                  <p className="text-xl font-bold text-orange-500">
                    £{minPrice.toFixed(0)}
                  </p>
                </div>
              )}
              {maxPrice !== null && maxPrice !== minPrice && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">
                    Up to
                  </p>
                  <p className="text-xl font-bold text-orange-500">
                    £{maxPrice.toFixed(0)}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-8 overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="bg-[#151515] text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Venue</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">From</th>
                  </tr>
                </thead>
                <tbody>
                  {allForSchema.map((listing) => (
                    <tr
                      key={listing.id}
                      className="border-t border-zinc-800 text-zinc-200"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/listing/${listing.slug || listing.id}`}
                          className="font-semibold text-orange-500 hover:text-orange-400"
                        >
                          {listing.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{listing.city}</td>
                      <td className="px-4 py-3 font-semibold text-white">
                        {typeof listing.price === "number"
                          ? `£${listing.price.toFixed(0)}`
                          : "Ask venue"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <section className="mb-10">
              <h2 className="mb-4 text-2xl font-bold text-white">
                {hasNearbyOnly
                  ? `Nearest venues to ${cityName}`
                  : `Venues in and near ${cityName}`}
              </h2>
              <ListingsGrid listings={allForSchema} />
            </section>
          </>
        )}

        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            href={`/city/${params.city}`}
            className="font-semibold text-orange-500 hover:text-orange-400"
          >
            Browse {cityName} city page →
          </Link>
          <Link
            href="/rage-room-prices-uk"
            className="font-semibold text-zinc-300 hover:text-white"
          >
            Full UK prices hub
          </Link>
          <Link
            href="/guides/how-much-do-rage-rooms-cost-uk"
            className="font-semibold text-zinc-300 hover:text-white"
          >
            How pricing works
          </Link>
        </div>
      </div>
    </div>
  )
}
