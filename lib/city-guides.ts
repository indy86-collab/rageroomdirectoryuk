import type { Metadata } from "next"
import { cityToSlug } from "@/lib/location"
import { buildOgImageUrl } from "@/lib/seo-schema"

export interface EditorialCityGuide {
  city: string
  slug: string
  blurb: string
}

/** Cities with a dedicated `/guides/best-rage-rooms-*` ranking page. */
export const EDITORIAL_CITY_GUIDES: EditorialCityGuide[] = [
  {
    city: "London",
    slug: "london",
    blurb:
      "London's verified rage room venues compared, with starting prices, package notes and travel tips for the capital.",
  },
  {
    city: "Birmingham",
    slug: "birmingham",
    blurb:
      "Midlands rage room venues ranked, covering Jewellery Quarter, Digbeth and Bordesley — with pricing and travel tips.",
  },
  {
    city: "Manchester",
    slug: "manchester",
    blurb:
      "Manchester's best rage rooms, from Northern Quarter to Trafford. Compare packages, prices and group options.",
  },
  {
    city: "Leeds",
    slug: "leeds",
    blurb:
      "West Yorkshire's growing rage room scene, with venues suited to students, young professionals and corporate groups.",
  },
  {
    city: "Liverpool",
    slug: "liverpool",
    blurb:
      "Liverpool's rage rooms ranked — strong party-friendly venues in the Baltic Triangle and central Merseyside.",
  },
  {
    city: "Bristol",
    slug: "bristol",
    blurb:
      "Independent-spirited rage room venues in Bristol, from St Philips to Bedminster, with DIY character.",
  },
  {
    city: "Newcastle",
    slug: "newcastle",
    blurb:
      "Newcastle and the North East's best rage rooms, ideal for stag/hen parties, birthdays and big groups.",
  },
  {
    city: "Sheffield",
    slug: "sheffield",
    blurb:
      "South Yorkshire rage rooms compared, with particular strength in affordable group packages.",
  },
  {
    city: "Nottingham",
    slug: "nottingham",
    blurb:
      "East Midlands rage rooms, popular with hen and stag groups visiting Nottingham for weekends away.",
  },
  {
    city: "Edinburgh",
    slug: "edinburgh",
    blurb:
      "Scottish capital rage rooms compared — ideal for city breaks, festival visitors and corporate groups.",
  },
  {
    city: "Leicester",
    slug: "leicester",
    blurb:
      "East Midlands hub with multiple verified venues — strong value compared to London pricing.",
  },
  {
    city: "Derby",
    slug: "derby",
    blurb:
      "Derby's established smash rooms, also serving Nottingham and the wider East Midlands.",
  },
  {
    city: "Brighton",
    slug: "brighton",
    blurb:
      "South Coast rage rooms — popular with hen parties, birthdays and London day-trippers.",
  },
  {
    city: "Glasgow",
    slug: "glasgow",
    blurb:
      "Nearest smash rooms for Glasgow and the Central Belt — stag parties, birthdays and stress-relief sessions.",
  },
  {
    city: "Cardiff",
    slug: "cardiff",
    blurb:
      "Wales' main hub for rage rooms — compare Cardiff venues for rugby weekends, birthdays and groups.",
  },
  {
    city: "Hull",
    slug: "hull",
    blurb:
      "East Yorkshire smash rooms compared — practical pricing for locals and regional visitors.",
  },
  {
    city: "Northampton",
    slug: "northampton",
    blurb:
      "East Midlands smash rooms serving Northampton — compare Destroy'd and nearby venues on price and travel.",
  },
  {
    city: "Huddersfield",
    slug: "huddersfield",
    blurb:
      "Kirklees smash rooms ranked, including SMASH IT, with travel notes for Leeds and Greater Manchester groups.",
  },
  {
    city: "Bath",
    slug: "bath",
    blurb:
      "Bath's verified smash room plus nearby Bristol and Weston options for visitors and hen groups.",
  },
  {
    city: "Weston-super-Mare",
    slug: "weston-super-mare",
    blurb:
      "The Activity Dome and nearby South West smash rooms compared for groups visiting Weston-super-Mare.",
  },
]

export function getCityGuidePath(city: string): string {
  return `/guides/best-rage-rooms-${cityToSlug(city)}`
}

export function hasEditorialCityGuide(city: string): boolean {
  const slug = cityToSlug(city)
  return EDITORIAL_CITY_GUIDES.some((guide) => guide.slug === slug)
}

export function getEditorialCityGuide(city: string): EditorialCityGuide | undefined {
  const slug = cityToSlug(city)
  return EDITORIAL_CITY_GUIDES.find((guide) => guide.slug === slug)
}

export function getCityGuideSlugs(): string[] {
  return EDITORIAL_CITY_GUIDES.map((guide) => `best-rage-rooms-${guide.slug}`)
}

export function buildCityGuideMetadata(city: string): Metadata {
  const path = getCityGuidePath(city)
  const ogImage = buildOgImageUrl({
    title: `Best Rage Rooms in ${city}`,
    subtitle: "Top venues ranked · Prices, packages & local tips",
    badge: "Guide",
  })

  return {
    title: `Best Rage Rooms in ${city} | Top Venues Ranked (2026)`,
    description: `Independent guide to the best rage rooms in ${city}. Compare verified smash rooms, starting prices, packages and local tips — updated for 2026.`,
    alternates: { canonical: path },
    openGraph: {
      title: `Best Rage Rooms in ${city} | Top Venues Ranked`,
      description: `Find the best rage rooms and smash rooms in ${city}. Compare venues, prices, and book your stress-relief session.`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Best Rage Rooms in ${city}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Best Rage Rooms in ${city}`,
      description: `Compare the best rage rooms in ${city} for 2026.`,
      images: [ogImage],
    },
  }
}
