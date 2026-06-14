import { Metadata } from "next"
import { cityToSlug } from "@/lib/location"
import Hero from "@/components/Hero"
import FeaturedRooms from "@/components/FeaturedRooms"
import FAQ from "@/components/FAQ"
import { globalFAQs } from "@/lib/faqs"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin, Ticket, HardHat, Hammer, Heart, ShieldCheck, Users, Sparkles, Star } from "lucide-react"
import { buildOgImageUrl } from "@/lib/seo-schema"
import { getSiteUrl } from "@/lib/site-url"

export const revalidate = 900

const baseUrl = getSiteUrl()

const HOME_OG = buildOgImageUrl({
  title: "UK Rage Rooms",
  subtitle: "Compare venues, prices and book in seconds",
  badge: "Directory",
})

export const metadata: Metadata = {
  title: "RageRoom Directory UK | Compare Rage Rooms, Prices & Locations",
  description:
    "Find and compare the best rage rooms across the UK. View prices, packages, photos, reviews and book your next stress-relief smash session.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RageRoom Directory UK",
    description:
      "Discover and compare UK rage rooms with prices, locations and booking links.",
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
    title: "RageRoom Directory UK",
    description:
      "Find & compare UK rage rooms — prices, locations and reviews in one place.",
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
    image: "/images/cities/london.jpg",
    gradient: "from-[#1e293b] via-[#0f172a] to-[#020617]",
  },
  {
    city: "Birmingham",
    href: "/city/birmingham",
    guide: "/guides/best-rage-rooms-birmingham",
    image: "/images/cities/birmingham.jpg",
    gradient: "from-[#3b0764] via-[#1e1b4b] to-[#0b0a1e]",
  },
  {
    city: "Liverpool",
    href: "/city/liverpool",
    guide: "/guides/best-rage-rooms-liverpool",
    gradient: "from-[#831843] via-[#3b0a25] to-[#10040a]",
  },
  {
    city: "Brighton",
    href: "/city/brighton",
    guide: "/guides/best-rage-rooms-brighton",
    gradient: "from-[#0c4a6e] via-[#082f49] to-[#020617]",
  },
]

const otherCities: {
  city: string
  href: string
  guide: string
  gradient: string
  subtitle?: string
}[] = [
  {
    city: "Manchester",
    href: "/city/manchester",
    guide: "/guides/best-rage-rooms-manchester",
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
]

export default async function Home() {
  const { getFeaturedListings, getListingsNearCity, getDistinctRegions, getListingsByRegion } =
    await import("@/lib/listings")
  const { regionToSlug } = await import("@/lib/location")
  const featuredListings = await getFeaturedListings(8, {
    excludeSlugs: ["rage-x-treme-polegate"],
  })

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

  return (
    <>
      <Hero featuredListings={featuredListings} />

      <section aria-labelledby="explore-cities-heading" className="w-full pt-4 sm:pt-6 pb-10 sm:pb-14">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <h2 id="explore-cities-heading" className="section-title mb-5 sm:mb-6">
            Explore UK Rage Rooms
          </h2>

          {/* City tiles: real skyline photos + dark gradient for legibility (matches reference). */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {cityCounts.map((c) => (
              <Link
                key={c.city}
                href={c.href}
                className="group relative overflow-hidden rounded-lg border border-zinc-800 h-32 sm:h-40 lg:h-44 flex items-end bg-dark-900"
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

          <div className="mt-4 flex flex-wrap gap-2">
            {otherCities.map((c) => (
              <Link
                key={c.city}
                href={c.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-800 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:border-rage-500/60 hover:text-white transition-colors"
              >
                <MapPin className="w-3 h-3 text-rage-500" />
                {c.city}
                {c.subtitle && (
                  <span className="text-zinc-500 font-normal">· {c.subtitle}</span>
                )}
              </Link>
            ))}
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-800 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:border-rage-500/60 hover:text-white transition-colors"
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
