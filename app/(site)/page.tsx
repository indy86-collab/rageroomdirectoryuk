import { Metadata } from "next"
import { cityToSlug } from "@/lib/location"
import Hero from "@/components/Hero"
import FeaturedRooms from "@/components/FeaturedRooms"
import FAQ from "@/components/FAQ"
import DigitalGuidesChooser from "@/components/DigitalGuidesChooser"
import RageResetHomeFeature from "@/components/RageResetHomeFeature"
import { globalFAQs } from "@/lib/faqs"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Ticket, HardHat, Hammer, Heart, ShieldCheck, Users, Sparkles, Star, Gift } from "lucide-react"
import TrackedProductLink from "@/components/TrackedProductLink"
import TrackedDiscoveryLink from "@/components/TrackedDiscoveryLink"
import { buildOgImageUrl } from "@/lib/seo-schema"
import { getSiteUrl } from "@/lib/site-url"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"
import {
  ACTIVITY_DEFINITIONS,
  MIN_ACTIVITY_PAGE_LISTINGS,
  OCCASION_DEFINITIONS,
  matchesOccasionDefinition,
} from "@/lib/discovery"
import { getCityHeroImagePath } from "@/lib/city-images"

export const revalidate = 900

const baseUrl = getSiteUrl()

const HOME_OG = buildOgImageUrl({
  title: "UK Rage Rooms",
  subtitle: "Compare venues, prices and book in seconds",
  badge: "Directory",
})

export const metadata: Metadata = {
  title: "Rage Rooms UK | Compare Venues, Prices & Book (2026)",
  description:
    "Find a rage room near you across the UK. Compare verified smash rooms, starting prices, age limits and booking links in one directory.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Rage Rooms UK | Compare Venues, Prices & Book (2026)",
    description:
      "Compare verified UK rage rooms with prices, locations and booking links — then book a smash session.",
    url: baseUrl,
    siteName: "RageRoom Directory",
    type: "website",
    images: [
      {
        url: HOME_OG,
        width: 1200,
        height: 630,
        alt: "RageRoom Directory — UK rage room & smash room directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rage Rooms UK | Compare Venues, Prices & Book (2026)",
    description:
      "Find & compare UK rage rooms — prices, locations and booking links in one place.",
    images: [HOME_OG],
  },
}

// Featured cities render as photo tiles (see section below). `image` is optional;
// gradient backgrounds are used when no photo is available.
const featuredCities: {
  city: string
  href: string
  guide: string
  image?: string
  gradient: string
  subtitle?: string
}[] = [
  {
    city: "London",
    href: "/city/london",
    guide: "/guides/best-rage-rooms-london",
    image: getCityHeroImagePath("London") ?? "/images/cities/london.jpg",
    gradient: "from-[#1e293b] via-[#0f172a] to-[#020617]",
  },
  {
    city: "Birmingham",
    href: "/city/birmingham",
    guide: "/guides/best-rage-rooms-birmingham",
    image: getCityHeroImagePath("Birmingham") ?? "/images/cities/birmingham.jpg",
    gradient: "from-[#3b0764] via-[#1e1b4b] to-[#0b0a1e]",
  },
  {
    city: "Liverpool",
    href: "/city/liverpool",
    guide: "/guides/best-rage-rooms-liverpool",
    image: getCityHeroImagePath("Liverpool") ?? "/images/cities/liverpool.jpg",
    gradient: "from-[#831843] via-[#3b0a25] to-[#10040a]",
  },
  {
    city: "Brighton",
    href: "/city/brighton",
    guide: "/guides/best-rage-rooms-brighton",
    image: getCityHeroImagePath("Brighton") ?? "/images/cities/brighton.jpg",
    gradient: "from-[#0c4a6e] via-[#082f49] to-[#020617]",
  },
]

const otherCities: {
  city: string
  href: string
  guide: string
  image?: string
  gradient: string
  subtitle?: string
}[] = [
  {
    city: "Manchester",
    href: "/city/manchester",
    guide: "/guides/best-rage-rooms-manchester",
    image: getCityHeroImagePath("Manchester") ?? undefined,
    gradient: "from-[#7f1d1d] via-[#450a0a] to-[#0f0606]",
    subtitle: "Nearby venues",
  },
  {
    city: "Leeds",
    href: "/city/leeds",
    guide: "/guides/best-rage-rooms-leeds",
    gradient: "from-[#4c1d95] via-[#1e1b4b] to-[#0a081d]",
    subtitle: "Nearby venues",
  },
  {
    city: "Newcastle",
    href: "/city/newcastle",
    guide: "/guides/best-rage-rooms-newcastle",
    gradient: "from-[#1e3a8a] via-[#0c1a3a] to-[#020617]",
  },
  {
    city: "Sheffield",
    href: "/city/sheffield",
    guide: "/guides/best-rage-rooms-sheffield",
    gradient: "from-[#78350f] via-[#3b1a05] to-[#10080a]",
    subtitle: "Nearby venues",
  },
  {
    city: "Nottingham",
    href: "/city/nottingham",
    guide: "/guides/best-rage-rooms-nottingham",
    gradient: "from-[#115e59] via-[#053433] to-[#031010]",
    subtitle: "Nearby venues",
  },
  {
    city: "Edinburgh",
    href: "/city/edinburgh",
    guide: "/guides/best-rage-rooms-edinburgh",
    gradient: "from-[#1e3a5f] via-[#0c1a3a] to-[#020617]",
  },
  {
    city: "Derby",
    href: "/city/derby",
    guide: "/guides/best-rage-rooms-derby",
    gradient: "from-[#365314] via-[#1a2e05] to-[#0a1004]",
  },
  {
    city: "Bristol",
    href: "/city/bristol",
    guide: "/guides/best-rage-rooms-bristol",
    gradient: "from-[#064e3b] via-[#022c22] to-[#010c08]",
    subtitle: "Nearby venues",
  },
  {
    city: "Northampton",
    href: "/city/northampton",
    guide: "/guides/best-rage-rooms-northampton",
    gradient: "from-[#7c2d12] via-[#431407] to-[#1c0a04]",
  },
  {
    city: "Huddersfield",
    href: "/city/huddersfield",
    guide: "/guides/best-rage-rooms-huddersfield",
    gradient: "from-[#1e3a8a] via-[#172554] to-[#020617]",
  },
  {
    city: "Bath",
    href: "/city/bath",
    guide: "/guides/best-rage-rooms-bath",
    gradient: "from-[#854d0e] via-[#422006] to-[#140a02]",
  },
  {
    city: "Weston-super-Mare",
    href: "/city/weston-super-mare",
    guide: "/guides/best-rage-rooms-weston-super-mare",
    gradient: "from-[#0e7490] via-[#164e63] to-[#083344]",
  },
]

export default async function Home() {
  const { getFeaturedListings, getListingsNearCity, getDistinctRegions, getListingsByRegion, getAllListingsForAdmin } =
    await import("@/lib/listings")
  const { regionToSlug } = await import("@/lib/location")
  const featuredListings = await getFeaturedListings(8, {
    excludeSlugs: ["rage-x-treme-polegate"],
  })
  const discoveryListings = await getAllListingsForAdmin()
  const featuredActivityValues = new Set(["rage-room", "axe-throwing", "paint-splatter", "car-smash"])
  const homeActivities = ACTIVITY_DEFINITIONS
    .filter((activity) => featuredActivityValues.has(activity.value))
    .map((activity) => ({
      ...activity,
      count: discoveryListings.filter((listing) => listing.activities.includes(activity.value)).length,
    }))
  const homeOccasions = OCCASION_DEFINITIONS.map((occasion) => ({
    ...occasion,
    count: discoveryListings.filter((listing) => matchesOccasionDefinition(listing, occasion)).length,
  }))

  const cityCounts = await Promise.all(
    featuredCities.map(async (c) => {
      const { allForSchema } = await getListingsNearCity(c.city)
      return { ...c, count: allForSchema.length }
    })
  )

  const regions = await getDistinctRegions()
  const regionCounts = await Promise.all(
    regions.map(async (region) => ({
      region,
      count: (await getListingsByRegion(region)).length,
    }))
  )
  const topRegions = regionCounts
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const corporateProduct = getDigitalProduct("corporate-team-building-toolkit")!
  const corporateAnalytics = getDigitalProductAnalytics(corporateProduct)
  const giftProduct = getDigitalProduct("rage-room-gift-voucher-template-pack")!
  const giftAnalytics = getDigitalProductAnalytics(giftProduct)

  return (
    <>
      <Hero featuredListings={featuredListings} />

      <section aria-labelledby="choose-experience-heading" className="w-full py-10 sm:py-14 section-textured">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rage-500">Rage rooms first</p>
              <h2 id="choose-experience-heading" className="section-title mt-2">Choose Your Experience</h2>
            </div>
            <Link href="/activities" className="inline-flex items-center gap-1 text-sm font-bold text-rage-400 hover:text-rage-300">
              All activities <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {homeActivities.map((activity) => {
              const hasPage = activity.count >= MIN_ACTIVITY_PAGE_LISTINGS
              return (
                <TrackedDiscoveryLink
                  key={activity.value}
                  eventName="activity_discovery_click"
                  sourcePageType="homepage"
                  destinationIdentifier={hasPage ? activity.slug : "activities"}
                  destinationPath={hasPage ? `/activities/${activity.slug}` : "/activities"}
                  className="group rounded-lg border border-zinc-800 bg-[#181818] p-4 transition-colors hover:border-rage-500/60 sm:p-5"
                >
                  <span className="text-3xl" aria-hidden="true">{activity.emoji}</span>
                  <h3 className="mt-3 text-base font-black uppercase tracking-wide text-white group-hover:text-rage-400 sm:text-lg">{activity.label}</h3>
                  <p className="mt-2 text-xs text-zinc-400">{activity.count} confirmed {activity.count === 1 ? "venue" : "venues"}</p>
                </TrackedDiscoveryLink>
              )
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rage-500">Plan the visit</p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">What Are You Planning?</h2>
            </div>
            <Link href="/occasions" className="inline-flex items-center gap-1 text-sm font-bold text-rage-400 hover:text-rage-300">
              All occasions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {homeOccasions.map((occasion) => (
              <TrackedDiscoveryLink
                key={occasion.slug}
                eventName="occasion_discovery_click"
                sourcePageType="homepage"
                destinationIdentifier={occasion.slug}
                destinationPath={`/occasions/${occasion.slug}`}
                className="rounded-lg border border-zinc-800 bg-dark-900 p-4 text-center transition-colors hover:border-rage-500/60"
              >
                <span className="text-2xl" aria-hidden="true">{occasion.emoji}</span>
                <h3 className="mt-2 text-sm font-bold text-white">{occasion.shortLabel}</h3>
                <p className="mt-1 text-[11px] text-zinc-500">{occasion.count} venues</p>
              </TrackedDiscoveryLink>
            ))}
          </div>

          <div className="mt-7 rounded-lg border border-zinc-800 bg-[#181818] p-4 sm:p-5">
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Popular combinations</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                ["💥 Smash + Axe Throwing", "/activities/axe-throwing"],
                ["💥 Smash + Paint", "/activities/paint-splatter"],
                ["💼 Corporate Rage Rooms", "/occasions/corporate-team-building"],
                ["🎂 Birthday Rage Rooms", "/occasions/birthdays"],
              ].map(([label, href]) => {
                const isActivity = href.startsWith("/activities/")
                return (
                  <TrackedDiscoveryLink
                    key={label}
                    eventName={isActivity ? "activity_discovery_click" : "occasion_discovery_click"}
                    sourcePageType="homepage"
                    destinationIdentifier={href.split("/").pop() || "discovery"}
                    destinationPath={href}
                    className="rounded-full border border-zinc-700 bg-dark-900 px-3 py-2.5 text-sm font-semibold text-zinc-200 hover:border-rage-500/60 hover:text-rage-300"
                  >
                    {label}
                  </TrackedDiscoveryLink>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Planning checklists" className="w-full pt-4 sm:pt-6">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <DigitalGuidesChooser highlight="firstVisit" />
        </div>
      </section>

      <RageResetHomeFeature />

      <section aria-labelledby="explore-cities-heading" className="w-full pt-4 sm:pt-6 pb-10 sm:pb-14">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <div className="mb-5 sm:mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 id="explore-cities-heading" className="section-title">
              Explore UK Rage Rooms
            </h2>
            <div className="flex flex-wrap gap-3 text-xs sm:text-sm font-semibold uppercase tracking-widest">
              <Link
                href="/near-me"
                className="inline-flex items-center gap-1 text-rage-500 hover:text-rage-400 transition-colors"
              >
                Near me map
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/guides/best-rage-rooms-london"
                className="inline-flex items-center gap-1 text-zinc-300 hover:text-rage-400 transition-colors"
              >
                Best of London
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* City tiles: real skyline photos + dark gradient for legibility (matches reference). */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {cityCounts.map((c) => (
              <Link
                key={c.city}
                href={c.href}
                className="group relative overflow-hidden rounded-lg border border-zinc-800 h-36 sm:h-40 lg:h-44 flex items-end bg-dark-900"
              >
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={`Rage rooms in ${c.city} — city skyline`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`}
                  />
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10"
                />
                <div className="relative p-3 sm:p-4 w-full">
                  <div className="text-white font-extrabold uppercase tracking-wide text-base sm:text-lg leading-tight group-hover:text-rage-400 transition-colors">
                    {c.city}
                  </div>
                  <div className="text-[11px] sm:text-xs text-zinc-200/90 font-medium">
                    {c.subtitle ??
                      `${c.count} ${c.count === 1 ? "Room" : "Rooms"}`}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {otherCities.map((c) => {
              const image = c.image ?? getCityHeroImagePath(c.city)
              return (
                <Link
                  key={c.city}
                  href={c.href}
                  className="group relative overflow-hidden rounded-lg border border-zinc-800 h-24 sm:h-28 flex items-end bg-dark-900"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={`${c.city} skyline`}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`}
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10"
                  />
                  <div className="relative p-2 sm:p-3 w-full">
                    <div className="text-white font-extrabold uppercase tracking-wide text-xs sm:text-sm leading-tight group-hover:text-rage-400 transition-colors">
                      {c.city}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {topRegions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-3">
                Browse by region
              </h3>
              <div className="flex flex-wrap gap-2">
                {topRegions.map(({ region, count }) => (
                  <Link
                    key={region}
                    href={`/region/${regionToSlug(region)}`}
                    className="inline-flex min-h-11 items-center gap-1.5 px-3 py-2 rounded-full bg-dark-800 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:border-rage-500/60 hover:text-white transition-colors"
                  >
                    {region}
                    <span className="text-zinc-500 font-normal">({count})</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="featured-verified-heading" className="w-full py-10 sm:py-14 section-textured">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <div className="flex items-end justify-between mb-5 sm:mb-6 flex-wrap gap-3">
            <h2 id="featured-verified-heading" className="section-title">
              Featured &amp; Verified Rage Rooms
            </h2>
            <Link
              href="/listings"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold uppercase tracking-widest text-rage-500 hover:text-rage-400 transition-colors"
            >
              Browse all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <FeaturedRooms listings={featuredListings} />
        </div>
      </section>

      <section aria-label="Corporate rage room planning toolkit" className="w-full pb-8 sm:pb-10 section-textured">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <div className="relative overflow-hidden rounded-lg border border-rage-500/35 bg-[#181818]">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-rage-500"
            />
            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_320px] lg:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rage-500/30 bg-rage-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-rage-400">
                  <Users className="h-3.5 w-3.5" />
                  For work events
                </div>
                <h2 className="max-w-3xl text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
                  Planning a work social or team-building day?
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                  Use the Corporate Rage Room Event Builder to build your budget, compare
                  venues, prepare internal approval and generate team invitations — without
                  starting from a blank page.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["Budget builder", "Venue shortlist", "Approval proposal", "Team invites"].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-dark-800 px-2.5 py-1.5 text-xs font-semibold text-zinc-200"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-rage-500" />
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <TrackedProductLink
                    href="/digital-downloads/corporate-rage-room-team-building-toolkit"
                    product={corporateAnalytics}
                    listName="Homepage Corporate CTA"
                    className="btn-rage inline-flex min-h-[46px] items-center justify-center gap-2 text-sm uppercase tracking-wider"
                  >
                    Build My Team Event
                    <ArrowRight className="h-4 w-4" />
                  </TrackedProductLink>
                  <p className="text-sm font-semibold text-zinc-300">
                    Interactive builder ·{" "}
                    <span className="text-white">{corporateProduct.priceLabel}</span>
                    {corporateProduct.compareAtLabel ? (
                      <span className="ml-1 text-zinc-500 line-through">
                        {corporateProduct.compareAtLabel}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>

              {corporateProduct.marketingImage && (
                <TrackedProductLink
                  href="/digital-downloads/corporate-rage-room-team-building-toolkit"
                  product={corporateAnalytics}
                  listName="Homepage Corporate CTA"
                  className="relative mx-auto block aspect-[16/10] w-full max-w-sm overflow-hidden rounded-lg border border-zinc-700 shadow-xl shadow-black/30"
                >
                  <Image
                    src={corporateProduct.marketingImage}
                    alt={corporateProduct.name}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                </TrackedProductLink>
              )}
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Rage room gift voucher template pack" className="w-full pb-8 sm:pb-10 section-textured">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                {giftProduct.marketingImage ? (
                  <TrackedProductLink
                    href="/digital-downloads/rage-room-gift-voucher-template-pack"
                    product={giftAnalytics}
                    listName="Homepage Gift CTA"
                    className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-md border border-zinc-700"
                  >
                    <Image
                      src={giftProduct.marketingImage}
                      alt={giftProduct.name}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </TrackedProductLink>
                ) : (
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
                    <Gift className="h-5 w-5 text-rage-500" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-rage-500">
                    Gift idea
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-white uppercase tracking-wide sm:text-xl">
                    Buying a rage room session as a gift?
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm text-zinc-300">
                    Download DIY printable and digital gift voucher templates — a
                    presentation pack only, not a venue booking.
                  </p>
                </div>
              </div>
              <TrackedProductLink
                href="/digital-downloads/rage-room-gift-voucher-template-pack"
                product={giftAnalytics}
                listName="Homepage Gift CTA"
                className="btn-rage inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap text-sm uppercase tracking-wider"
              >
                View voucher pack
                <ArrowRight className="h-4 w-4" />
              </TrackedProductLink>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="List your rage room" className="w-full py-8 sm:py-10">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <div className="rounded-xl bg-[#141414] border border-zinc-800 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                Own a Rage Room?{" "}
                <span className="text-rage-500">List Your Venue Here!</span>
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Reach customers looking to book their next smash session across the UK.
              </p>
            </div>
            <Link
              href="/list-your-rage-room"
              className="btn-rage inline-flex items-center gap-2 text-sm uppercase tracking-wider whitespace-nowrap"
            >
              List Your Venue
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="destruction-therapy-heading" className="w-full py-10 sm:py-14">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <div className="card-base p-6 sm:p-8 space-y-4 sm:space-y-5">
            <h2 id="destruction-therapy-heading" className="section-title">What Is Destruction Therapy?</h2>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
              <span className="text-rage-400 font-semibold">Rage rooms</span> (also called <span className="text-rage-400 font-semibold">smash rooms</span> or <span className="text-rage-400 font-semibold">anger rooms</span>) are safe, controlled environments where you can release stress and tension by breaking items like plates, electronics, and glass bottles. These unique experiences have become increasingly popular across the UK as an alternative form of stress relief and entertainment.
            </p>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
              <strong className="text-white">RageRoom Directory</strong> is the UK&rsquo;s comprehensive guide to finding and comparing rage room experiences. Our purpose is to help you discover the best smash rooms in your area, <Link href="/rage-room-prices-uk" className="text-rage-400 hover:text-rage-300 underline underline-offset-2 font-medium transition-colors">compare prices and packages</Link>, and make informed decisions about where to <Link href="/listings" className="text-rage-400 hover:text-rage-300 underline underline-offset-2 font-medium transition-colors">book a rage room in the UK</Link>. We cover major cities including <Link href="/city/birmingham" className="text-rage-400 hover:text-rage-300 underline underline-offset-2 font-medium transition-colors">Birmingham</Link>, <Link href="/city/london" className="text-rage-400 hover:text-rage-300 underline underline-offset-2 font-medium transition-colors">London</Link>, <Link href="/city/manchester" className="text-rage-400 hover:text-rage-300 underline underline-offset-2 font-medium transition-colors">Manchester</Link>, and many more locations across the country.
            </p>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
              Whether you&rsquo;re looking for a fun date night activity, corporate team building event, or simply need to let off steam, you can <Link href="/listings" className="text-rage-400 hover:text-rage-300 underline underline-offset-2 font-medium transition-colors">browse all rage rooms</Link> in our directory to view prices, packages, opening hours, and book your next stress-relief session. Each listing includes detailed information about what to expect, safety requirements, and nearby alternatives.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-it-works-heading" className="w-full section-textured py-10 sm:py-14">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <h2 id="how-it-works-heading" className="section-title mb-6 sm:mb-8">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              { icon: Ticket, title: "Book Your Session", copy: "Browse venues, compare packages and reserve your slot online." },
              { icon: HardHat, title: "Gear Up", copy: "Arrive, get a safety briefing and kit up in full protective gear." },
              { icon: Hammer, title: "Smash It", copy: "Unleash your rage on bottles, electronics and more in a safe room." },
            ].map(({ icon: Icon, title, copy }, i) => (
              <div key={title} className="card-base p-6 flex items-start gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-md bg-rage-500/15 border border-rage-500/40 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-rage-500" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-rage-500 mb-1">
                    Step {i + 1}
                  </div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wide">
                    {title}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="couples-heading" className="w-full py-10 sm:py-14">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <h2 id="couples-heading" className="section-title mb-5 sm:mb-6">
            Perfect For Couples
          </h2>

          <div className="card-base p-5 sm:p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-md bg-rage-500/15 border border-rage-500/40 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rage-500" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Why Rage Rooms Make Great Date Nights
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              {[
                "Unique experience that stands out from typical dates",
                "Shared bonding activity that creates lasting memories",
                "Stress relief together - release tension as a couple",
                "Fun and laughter guaranteed",
                "Perfect for anniversaries, birthdays, or just because",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5 p-3 bg-dark-800/60 rounded-md border border-zinc-800">
                  <Sparkles className="w-4 h-4 text-rage-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-300">{text}</span>
                </div>
              ))}
            </div>
            <Link
              href="/guides/best-rage-rooms-for-couples"
              className="btn-rage inline-flex items-center gap-2 text-sm uppercase tracking-wider"
            >
              Read Couples Guide
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="stress-relief-heading" className="w-full section-textured py-10 sm:py-14">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <h2 id="stress-relief-heading" className="section-title mb-5 sm:mb-6">
            Ultimate Stress Relief
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-6">
            <div className="card-base p-5 sm:p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-rage-500/15 border border-rage-500/40 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-rage-500" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">Benefits of Rage Rooms</h3>
              </div>
              <ul className="space-y-2 text-sm text-zinc-300">
                {[
                  "Immediate physical release of tension",
                  "Endorphin boost from physical activity",
                  "Safe outlet for frustration and anger",
                  "No judgment - break things without consequences",
                  "Controlled environment with professional supervision",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-rage-500 flex-shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-base p-5 sm:p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-rage-500/15 border border-rage-500/40 flex items-center justify-center">
                  <Users className="w-5 h-5 text-rage-500" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">Who Benefits Most?</h3>
              </div>
              <ul className="space-y-2 text-sm text-zinc-300">
                {[
                  "People with high-stress jobs",
                  "Anyone dealing with daily pressures",
                  "Those who need physical stress release",
                  "People looking for alternative therapy",
                  "Anyone needing to let off steam safely",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-rage-500 flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/listings"
            className="btn-rage inline-flex items-center gap-2 text-sm uppercase tracking-wider"
          >
            Find Stress Relief Near You
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section id="faq" aria-labelledby="how-rage-rooms-work-heading" className="w-full py-10 sm:py-14">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <h2 id="how-rage-rooms-work-heading" className="section-title mb-5 sm:mb-6">
            How Rage Rooms Work
          </h2>
          <p className="text-zinc-300 mb-6">
            New to rage rooms? Here&rsquo;s everything you need to know about how they work, what to expect, and how to get the most out of your experience.
          </p>
          <div className="card-base p-5 sm:p-7">
            <FAQ items={globalFAQs} title="Frequently Asked Questions About Rage Rooms" />
          </div>
        </div>
      </section>
    </>
  )
}
