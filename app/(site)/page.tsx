import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin, Gift, Users, Gamepad2, CheckCircle2 } from "lucide-react"
import Hero from "@/components/Hero"
import InspiredRoomsCarousel from "@/components/InspiredRoomsCarousel"
import DigitalHomeShowcase from "@/components/DigitalHomeShowcase"
import ShopHomeAnnouncement from "@/components/shop/ShopHomeAnnouncement"
import FAQ from "@/components/FAQ"
import ActivityArtwork from "@/components/ActivityArtwork"
import TrackedDiscoveryLink from "@/components/TrackedDiscoveryLink"
import { globalFAQs } from "@/lib/faqs"
import { ACTIVITY_DEFINITIONS, OCCASION_DEFINITIONS, MIN_ACTIVITY_PAGE_LISTINGS, formatListingPrice, getListingExperienceLabel, getListingHref } from "@/lib/discovery"
import { getCityHeroImagePath } from "@/lib/city-images"
import { buildOgImageUrl } from "@/lib/seo-schema"
import { getSiteUrl } from "@/lib/site-url"
import { pickDailyListings } from "@/lib/daily-inspiration"
import { getAuthorisedMedia, getListingDisplayImage } from "@/lib/listing-quality"

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

export default async function Home() {
  const { getAllListingsForAdmin } = await import("@/lib/listings")
  const listings = await getAllListingsForAdmin()
  const inspiredRooms = pickDailyListings(
    listings.filter((listing) => listing.locationType !== "mobile-service" && listing.activities.includes("rage-room") && listing.slug !== "rage-x-treme-polegate" && getListingDisplayImage(listing)),
    9
  ).flatMap((listing) => {
    const image = getListingDisplayImage(listing)
    if (!image) return []
    const alt = getAuthorisedMedia(listing).find((media) => media.type === "image")?.alt
    return [{
      id: listing.id,
      name: listing.name,
      city: listing.city,
      href: getListingHref(listing),
      image,
      alt: alt || `${listing.name} in ${listing.city}`,
      price: formatListingPrice(listing),
      experience: getListingExperienceLabel(listing),
    }]
  })
  const activities = ACTIVITY_DEFINITIONS.filter(a => ["rage-room", "paint-splatter", "axe-throwing"].includes(a.value)).map(a => ({ ...a, count: listings.filter(l => l.activities.includes(a.value)).length })).filter(a => a.count >= MIN_ACTIVITY_PAGE_LISTINGS)
  const cities = ["London", "Birmingham", "Liverpool", "Brighton"]
  return <>
    <Hero />
    <section className="site-container pb-12 sm:pb-16" aria-labelledby="explore-cities-heading">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div><p className="eyebrow mb-2">Close to home or worth the trip</p><h2 id="explore-cities-heading" className="section-title">Explore UK rage rooms</h2></div>
        <Link href="/uk-map" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-rage-300">All locations<ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-5">
        {cities.map(city => <Link key={city} href={`/city/${city.toLowerCase()}`} className="group relative flex h-40 items-end overflow-hidden rounded-xl bg-zinc-800 sm:h-52">
          {getCityHeroImagePath(city) && <Image src={getCityHeroImagePath(city)!} alt={`${city} skyline`} fill sizes="(max-width: 768px) 50vw, 300px" className="object-cover transition-transform duration-300 group-hover:scale-105" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
          <div className="relative w-full p-4 sm:p-5"><h3 className="text-lg font-bold text-white sm:text-xl">{city}</h3><p className="mt-1 text-xs text-zinc-200">In and around {city}</p></div>
        </Link>)}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-300">{["Manchester", "Leeds", "Edinburgh", "Bristol", "Newcastle", "Nottingham"].map(city => <Link key={city} href={`/city/${city.toLowerCase()}`} className="inline-flex min-h-11 items-center gap-1 hover:text-rage-300"><MapPin className="h-3.5 w-3.5" />{city}</Link>)}</div>
    </section>
    <section className="border-y border-zinc-800/70 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.14),transparent_46%),#101010] py-10 sm:py-14" aria-labelledby="featured-verified-heading">
      <div className="site-container">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">Get inspired</p>
            <h2 id="featured-verified-heading" className="section-title">Find a room worth smashing</h2>
            <p className="mt-3 text-sm text-zinc-300">Nine UK rage rooms, shuffled again each day. Let them play, or pick one.</p>
          </div>
          <Link href="/listings" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-rage-300">Browse all venues<ArrowRight className="h-4 w-4" /></Link>
        </div>
        <InspiredRoomsCarousel rooms={inspiredRooms} />
      </div>
    </section>
    <ShopHomeAnnouncement />
    <DigitalHomeShowcase />
    <section className="site-container py-12 sm:py-16" aria-labelledby="choose-experience-heading">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow mb-2">Make a little mess</p><h2 id="choose-experience-heading" className="section-title">Choose your experience</h2></div><Link href="/activities" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-rage-300">All activities<ArrowRight className="h-4 w-4" /></Link></div>
      <div className="grid gap-5 sm:grid-cols-3">{activities.map(a => <TrackedDiscoveryLink key={a.value} eventName="activity_discovery_click" sourcePageType="homepage" destinationIdentifier={a.slug} destinationPath={`/activities/${a.slug}`} className="card-base card-hover group overflow-hidden">
        <ActivityArtwork activity={a.value} className="h-48 lg:h-56" />
        <div className="p-5"><h3 className="text-xl font-bold">{a.label}</h3><p className="mt-2 text-sm text-zinc-300">{a.description}</p><p className="mt-4 flex items-center justify-between text-sm font-semibold text-rage-300">Explore {a.count} venues<ArrowRight className="h-4 w-4" /></p></div>
      </TrackedDiscoveryLink>)}</div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4"><h3 className="text-xl font-bold">What’s the occasion?</h3><Link href="/occasions" className="text-sm text-rage-300">All occasions →</Link></div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{OCCASION_DEFINITIONS.map(o => <TrackedDiscoveryLink key={o.slug} eventName="occasion_discovery_click" sourcePageType="homepage" destinationIdentifier={o.slug} destinationPath={`/occasions/${o.slug}`} className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-zinc-700 px-3 py-3 text-sm font-semibold hover:border-rage-400"><span aria-hidden="true">{o.emoji}</span>{o.shortLabel}</TrackedDiscoveryLink>)}</div>
    </section>
    <section className="site-container pb-12 sm:pb-16" aria-labelledby="how-it-works-heading">
      <div className="rounded-2xl border border-zinc-800 bg-[#171717] p-6 sm:p-9"><h2 id="how-it-works-heading" className="section-title">Your first smash session, made simple</h2>
        <div className="mt-8 grid gap-7 sm:grid-cols-3">{[["Find your room", "Compare locations, prices and age limits to find a session that suits you."], ["Book with the venue", "Check the package and available times, then book directly on the venue’s website."], ["Gear up. Have fun.", "Follow the venue’s safety briefing, put on your protective gear and enjoy the experience."]].map(([title,copy],i) => <div key={title}><p className="font-display text-4xl text-rage-400">0{i+1}</p><h3 className="mt-3 text-lg font-bold">{title}</h3><p className="mt-2 text-sm text-zinc-300">{copy}</p></div>)}</div>
      </div>
    </section>
    <section id="faq" className="site-container pb-12 sm:pb-16" aria-labelledby="first-visit-heading">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div><p className="eyebrow mb-2">Know before you go</p><h2 id="first-visit-heading" className="section-title">First time? You’re in the right place.</h2><p className="mt-4 max-w-md text-zinc-300">What to wear, what you can smash, and what to ask before booking. A little preparation makes the day easier.</p><Link href="/guides/what-happens-in-a-rage-room" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-rage-300">Read the first-visit guide<ArrowRight className="h-4 w-4" /></Link><Link href="/digital-downloads/rage-room-first-visit-prep-pack" className="mt-2 flex min-h-11 items-center gap-2 text-sm text-zinc-200"><CheckCircle2 className="h-4 w-4" />Get the £1 prep pack — helps maintain the site</Link></div>
        <FAQ items={globalFAQs.slice(0,5)} title="Common questions" />
      </div>
    </section>
    <section className="site-container pb-4" aria-label="More ways to plan">
      <div className="grid gap-5 border-t border-zinc-800 pt-8 sm:grid-cols-3">{[{href:"/corporate-event-builder",title:"Plan a team day",copy:"Build a budget and shortlist together.",Icon:Users},{href:"/digital-downloads",title:"Make it a gift",copy:"Browse planning packs and gift templates.",Icon:Gift},{href:"/rage-reset",title:"Try Rage Reset",copy:"A free three-minute smash game.",Icon:Gamepad2}].map(({href,title,copy,Icon}) => <Link key={href} href={href} className="group flex gap-3 py-3"><Icon className="mt-1 h-5 w-5 shrink-0 text-rage-300" /><div><h3 className="font-semibold group-hover:text-rage-300">{title} →</h3><p className="mt-1 text-sm text-zinc-400">{copy}</p></div></Link>)}</div>
    </section>
  </>
}
