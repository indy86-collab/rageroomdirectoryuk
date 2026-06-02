import { Metadata } from "next"
import Link from "next/link"
import { buildOgImageUrl } from "@/lib/seo-schema"

const OG_IMAGE = buildOgImageUrl({
  title: "Rage Room Guides",
  subtitle: "UK city guides, pricing, safety & first-time tips",
  badge: "Guides",
})

export const metadata: Metadata = {
  title: "Rage Room Guides | UK City Guides, Safety & Pricing",
  description:
    "Editorial guides to rage rooms across the UK. City-by-city venue rankings, safety and age rules, pricing breakdowns, and first-time visitor tips.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Rage Room Guides | RageRoom Directory",
    description:
      "UK city guides, safety advice, pricing breakdowns and first-time tips for rage rooms.",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Rage Room Guides" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rage Room Guides | RageRoom Directory",
    description: "UK city guides, safety advice, pricing and first-time tips.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

interface Guide {
  title: string
  description: string
  href: string
  category: string
}

const CITY_GUIDES: Guide[] = [
  {
    title: "Best Rage Rooms in London",
    description:
      "London's verified rage room venues compared, with starting prices, package notes and travel tips for the capital.",
    href: "/guides/best-rage-rooms-london",
    category: "London",
  },
  {
    title: "Best Rage Rooms in Birmingham",
    description:
      "Midlands rage room venues ranked, covering Jewellery Quarter, Digbeth and Bordesley — with pricing and travel tips.",
    href: "/guides/best-rage-rooms-birmingham",
    category: "Birmingham",
  },
  {
    title: "Best Rage Rooms in Manchester",
    description:
      "Manchester's best rage rooms, from Northern Quarter to Trafford. Compare packages, prices and group options.",
    href: "/guides/best-rage-rooms-manchester",
    category: "Manchester",
  },
  {
    title: "Best Rage Rooms in Leeds",
    description:
      "West Yorkshire's growing rage room scene, with venues suited to students, young professionals and corporate groups.",
    href: "/guides/best-rage-rooms-leeds",
    category: "Leeds",
  },
  {
    title: "Best Rage Rooms in Liverpool",
    description:
      "Liverpool's rage rooms ranked — strong party-friendly venues in the Baltic Triangle and central Merseyside.",
    href: "/guides/best-rage-rooms-liverpool",
    category: "Liverpool",
  },
  {
    title: "Best Rage Rooms in Bristol",
    description:
      "Independent-spirited rage room venues in Bristol, from St Philips to Bedminster, with DIY character.",
    href: "/guides/best-rage-rooms-bristol",
    category: "Bristol",
  },
  {
    title: "Best Rage Rooms in Newcastle",
    description:
      "Newcastle and the North East's best rage rooms, ideal for stag/hen parties, birthdays and big groups.",
    href: "/guides/best-rage-rooms-newcastle",
    category: "Newcastle",
  },
  {
    title: "Best Rage Rooms in Sheffield",
    description:
      "South Yorkshire rage rooms compared, with particular strength in affordable group packages.",
    href: "/guides/best-rage-rooms-sheffield",
    category: "Sheffield",
  },
  {
    title: "Best Rage Rooms in Nottingham",
    description:
      "East Midlands rage rooms, popular with hen and stag groups visiting Nottingham for weekends away.",
    href: "/guides/best-rage-rooms-nottingham",
    category: "Nottingham",
  },
  {
    title: "Best Rage Rooms in Edinburgh",
    description:
      "Scottish capital rage rooms compared — ideal for city breaks, festival visitors and corporate groups.",
    href: "/guides/best-rage-rooms-edinburgh",
    category: "Edinburgh",
  },
  {
    title: "Best Rage Rooms in Leicester",
    description:
      "East Midlands hub with multiple verified venues — strong value compared to London pricing.",
    href: "/guides/best-rage-rooms-leicester",
    category: "Leicester",
  },
  {
    title: "Best Rage Rooms in Derby",
    description:
      "Derby's established smash rooms, also serving Nottingham and the wider East Midlands.",
    href: "/guides/best-rage-rooms-derby",
    category: "Derby",
  },
  {
    title: "Best Rage Rooms in Brighton",
    description:
      "South Coast rage rooms — popular with hen parties, birthdays and London day-trippers.",
    href: "/guides/best-rage-rooms-brighton",
    category: "Brighton",
  },
]

const TOPIC_GUIDES: Guide[] = [
  {
    title: "What Happens in a Rage Room?",
    description:
      "Step-by-step walkthrough of a UK rage room session: booking, PPE, safety briefing, the smashing phase and cleanup.",
    href: "/guides/what-happens-in-a-rage-room",
    category: "First-Time Guide",
  },
  {
    title: "Are Rage Rooms Safe in the UK?",
    description:
      "PPE, age limits, medical exclusions, insurance and injury risks — everything you need to know about UK rage room safety.",
    href: "/guides/are-rage-rooms-safe-uk",
    category: "Safety",
  },
  {
    title: "How Much Do Rage Rooms Cost in the UK?",
    description:
      "UK pricing breakdown for solo, couples, group and corporate rage room bookings — with regional cost differences.",
    href: "/guides/how-much-do-rage-rooms-cost-uk",
    category: "Pricing",
  },
  {
    title: "Best Rage Rooms for Couples",
    description:
      "UK date-night rage room guide. Private sessions, couples packages, pricing and how to book the perfect date.",
    href: "/guides/best-rage-rooms-for-couples",
    category: "Couples",
  },
  {
    title: "Best Rage Rooms for Team Building",
    description:
      "UK corporate rage room guide: group capacities, team-building packages, facilitation options and typical pricing.",
    href: "/guides/best-rage-rooms-for-team-building",
    category: "Corporate",
  },
  {
    title: "Rage Rooms for Hen Parties",
    description:
      "Hen-party booking guide: group sizes, packages, costs and the best UK cities for a hen weekend rage room session.",
    href: "/guides/rage-rooms-for-hen-parties-uk",
    category: "Hen & Stag",
  },
  {
    title: "Rage Rooms for Birthdays",
    description:
      "Plan a UK birthday rage room — adult and teen (14+) options, pricing by group size, food rules and personalised smash tips.",
    href: "/guides/rage-rooms-for-birthdays-uk",
    category: "Birthdays",
  },
  {
    title: "Rage Room vs Escape Room",
    description:
      "Head-to-head comparison: pricing, duration, physicality, accessibility and which to pick for stress, dates, stags and corporate days.",
    href: "/rage-room-vs-escape-room",
    category: "Comparison",
  },
  {
    title: "Rage Room vs Axe Throwing",
    description:
      "Which activity wins on price, physicality, groups and stress relief? UK head-to-head across all the factors that matter.",
    href: "/guides/rage-room-vs-axe-throwing",
    category: "Comparison",
  },
  {
    title: "Rage Rooms for Stress Relief",
    description:
      "Do rage rooms actually relieve stress? We examine the psychology and evidence — and explain what to realistically expect.",
    href: "/guides/rage-rooms-for-stress-relief",
    category: "Wellness",
  },
  {
    title: "Rage Room Gift Vouchers UK",
    description:
      "How to buy a UK rage room gift voucher — types, prices, expiry policies and what to check before purchasing.",
    href: "/guides/rage-room-gift-vouchers-uk",
    category: "Gift Ideas",
  },
  {
    title: "What to Wear to a Rage Room",
    description:
      "UK dress code guide: best clothing, footwear, what not to wear, and how to prepare for your PPE fitting.",
    href: "/guides/what-to-wear-to-a-rage-room",
    category: "First-Time Guide",
  },
  {
    title: "Rage Room Near Me",
    description:
      "Find verified rage rooms near you across 40+ UK towns and cities. Browse by city, compare prices and book online.",
    href: "/guides/rage-room-near-me",
    category: "Find a Venue",
  },
]

export default function GuidesPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"

  // Collection page schema — tells search engines this is a hub page
  // listing multiple articles under one topical theme.
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/guides#collection`,
    name: "Rage Room Guides",
    description:
      "Editorial guides to rage rooms across the UK — city-by-city venue rankings, safety rules, pricing breakdowns and first-time tips.",
    url: `${baseUrl}/guides`,
    inLanguage: "en-GB",
    isPartOf: { "@id": `${baseUrl}#website` },
    publisher: { "@id": `${baseUrl}#organization` },
    hasPart: [...CITY_GUIDES, ...TOPIC_GUIDES].map((g) => ({
      "@type": "Article",
      name: g.title,
      url: `${baseUrl}${g.href}`,
      description: g.description,
    })),
  }

  // Hub-level FAQ schema — these are the top-of-funnel questions we want
  // to rank for regardless of which city the user is in.
  const hubFaqs = [
    {
      question: "What is a rage room?",
      answer:
        "A rage room (also called a smash room, break room or anger room) is a controlled indoor space where guests wear full PPE and destroy pre-selected objects like glass bottles, crockery, electronics and small furniture using sledgehammers, bats and crowbars. It's marketed as stress relief, a novelty group activity and corporate team building.",
    },
    {
      question: "How much does a rage room cost in the UK?",
      answer:
        "UK solo rage room sessions typically cost £20–£40 for 15–20 minutes. Standard 30-minute sessions for 1–2 people are £35–£65. Couples packages are £50–£90, and group sessions for 3–6 people are £90–£180. Corporate team-building packages start at around £250.",
    },
    {
      question: "Are rage rooms safe?",
      answer:
        "Reputable UK rage rooms are low-risk when full PPE (coveralls, full-face visor helmet, heavy-duty gloves and boots) is worn and staff instructions are followed. Participants must usually be 18+, sign a waiver, and venues should carry at least £5 million public liability insurance.",
    },
    {
      question: "How long is a typical rage room session?",
      answer:
        "Most UK sessions run 15–60 minutes. Solo and quick packages are 15–20 minutes, standard packages 30 minutes, and couples / group packages 45–60 minutes. Session length excludes check-in, safety briefing and PPE fitting, which add around 15 minutes.",
    },
    {
      question: "Who are rage rooms good for?",
      answer:
        "Rage rooms suit people wanting stress relief, unique date nights, hen and stag parties, birthdays and corporate away-days. Most UK venues welcome solo customers, couples and groups; larger sites can host corporate groups of 8–20+.",
    },
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseUrl}/guides#faq`,
    mainEntity: hubFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <h1 className="text-4xl font-bold mb-4 text-white">Rage Room Guides</h1>
        <p className="text-lg text-zinc-300 mb-10 max-w-3xl">
          Editorial guides to help you find and prepare for a rage room
          experience in the UK. Browse city-by-city venue rankings, read up on
          safety and pricing, or get tips for specific occasions like date
          nights and corporate team events.
        </p>

        <section aria-labelledby="city-guides-heading">
          <h2
            id="city-guides-heading"
            className="text-2xl font-bold text-white mb-2"
          >
            City guides
          </h2>
          <p className="text-zinc-400 mb-6">
            Verified rage room venues, prices and tips for every major UK city.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {CITY_GUIDES.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="block bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 hover:border-orange-500 transition-colors p-6"
              >
                <span className="inline-block text-xs uppercase tracking-wider text-orange-500 mb-2">
                  {guide.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  {guide.title}
                </h3>
                <p className="text-zinc-400 text-sm mb-4">{guide.description}</p>
                <span className="text-orange-500 text-sm font-medium">
                  Read guide →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="topic-guides-heading">
          <h2
            id="topic-guides-heading"
            className="text-2xl font-bold text-white mb-2"
          >
            Topic guides
          </h2>
          <p className="text-zinc-400 mb-6">
            Safety rules, pricing, first-time tips and specialist occasions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOPIC_GUIDES.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="block bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 hover:border-orange-500 transition-colors p-6"
              >
                <span className="inline-block text-xs uppercase tracking-wider text-orange-500 mb-2">
                  {guide.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  {guide.title}
                </h3>
                <p className="text-zinc-400 text-sm mb-4">{guide.description}</p>
                <span className="text-orange-500 text-sm font-medium">
                  Read guide →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="hub-faq-heading"
          className="mt-14 bg-[#181818] rounded-lg border border-zinc-800 p-6 sm:p-8"
        >
          <h2
            id="hub-faq-heading"
            className="text-2xl font-bold text-white mb-5"
          >
            Rage room FAQs
          </h2>
          <div className="space-y-5">
            {hubFaqs.map((f, i) => (
              <details
                key={i}
                className="group border-b border-zinc-700 last:border-0 pb-4 last:pb-0"
              >
                <summary className="flex items-start justify-between cursor-pointer text-white font-semibold hover:text-orange-500 transition-colors">
                  {f.question}
                  <svg
                    className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="text-zinc-300 text-sm mt-3 leading-relaxed">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
