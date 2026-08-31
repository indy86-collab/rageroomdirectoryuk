import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import GuideMeta from "@/components/GuideMeta"
import DigitalDownloadCTA from "@/components/DigitalDownloadCTA"
import RageResetCTA from "@/components/RageResetCTA"
import NearbyActivitiesAffiliate from "@/components/NearbyActivitiesAffiliate"
import FAQ from "@/components/FAQ"
import InArticleAd from "@/components/InArticleAd"
import ListingsGrid from "@/components/ListingsGrid"
import { getListingsByOccasions } from "@/lib/listings"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOgImageUrl,
} from "@/lib/seo-schema"

const PATH = "/guides/rage-rooms-for-hen-parties-uk"

const OG_IMAGE = buildOgImageUrl({
  title: "Rage Rooms for Hen Parties",
  subtitle: "Booking, packages & city picks",
  badge: "Hen · Stag",
})

export const metadata: Metadata = {
  title: "Rage Rooms for Hen Parties UK | Booking, Packages & Cost (2026)",
  description:
    "The definitive UK hen party rage room guide: how to book for groups of 6–20, what packages cost, which cities have the best venues, and what to expect on the day.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Rage Rooms for Hen Parties UK",
    description:
      "The definitive UK hen party rage room guide — booking, packages, costs and city picks.",
    type: "article",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Rage rooms for hen parties UK guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rage Rooms for Hen Parties UK",
    description: "Book, plan and price a UK hen party rage room session.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

const CITY_PICKS: { city: string; slug: string; why: string }[] = [
  {
    city: "Manchester",
    slug: "manchester",
    why: "Biggest hen-party market outside London. Several venues with dedicated hen packages, accessible by tram from most hen-weekend hotels.",
  },
  {
    city: "Liverpool",
    slug: "liverpool",
    why: "A classic UK hen destination; rage rooms sit near the Baltic Triangle bars so you can roll straight to drinks afterwards.",
  },
  {
    city: "London",
    slug: "london",
    why: "Highest concentration of venues; premium packages with longer sessions and professional photos on request.",
  },
  {
    city: "Nottingham",
    slug: "nottingham",
    why: "Compact city centre, rage rooms within walking distance of Lace Market bars and the tram network.",
  },
  {
    city: "Newcastle",
    slug: "newcastle",
    why: "Famous hen weekend city. Strong venue clusters near the Bigg Market and Quayside.",
  },
  {
    city: "Birmingham",
    slug: "birmingham",
    why: "Central Midlands base — easy travel from Coventry, Wolverhampton, Worcester and most of the South. Good mid-range pricing.",
  },
  {
    city: "Leeds",
    slug: "leeds",
    why: "Strong for Yorkshire hen weekends combining rage, afternoon tea and bar crawls. Good tram / walking access.",
  },
  {
    city: "Bristol",
    slug: "bristol",
    why: "Independent venue character fits a more alternative / creative hen party vibe.",
  },
  {
    city: "Sheffield",
    slug: "sheffield",
    why: "Most affordable large city in the list; ideal for budget-conscious hen groups of 8–12.",
  },
]

const FAQS = [
  {
    q: "How many people can a rage room fit for a hen party?",
    a: "Standard UK rage rooms comfortably fit 1–6 people per session. Larger venues run private hen sessions for groups of 8–12, and a few dedicated team-building sites can handle 15–20+. For groups above 12 you typically split into two back-to-back slots.",
  },
  {
    q: "How much should I budget for a hen party rage room?",
    a: "Budget around £25–£45 per person for a 30–45 minute private hen session including PPE and breakables. For a group of 10 that's £250–£450 total. Premium packages with extended breakables, longer sessions, and professional photos cost £500–£750.",
  },
  {
    q: "Can we drink alcohol before or during a rage room?",
    a: "No reputable UK venue allows anyone under the influence to enter the rage room — it's a standard insurance condition and a safety requirement. Alcohol is almost always prohibited before AND during sessions. Schedule the rage room as the first activity of the day, then go out after.",
  },
  {
    q: "What should the bride-to-be wear?",
    a: "All participants get coveralls over their clothes, a full-face visor helmet, heavy-duty gloves and boots. Underneath, wear something you don't mind sweating in — a tee and leggings work well. Bring hair ties and avoid jewellery. Most venues provide a small locker for valuables.",
  },
  {
    q: "Can we customise the room with the bride's photos?",
    a: "Many UK venues allow you to bring ex-boyfriend photos, old Tinder screenshots, or other printed images to smash. Some also let you bring physical items (old plates, unwanted gifts) for an extra fee. Always confirm in advance — some venues cap at 3–5 additional items.",
  },
  {
    q: "Do we need to book months ahead?",
    a: "Weekends in prime hen cities (London, Manchester, Liverpool, Newcastle) book up 4–8 weeks ahead, especially in spring and early summer. If you're hen-planning for a Saturday afternoon, reserve at least 6 weeks in advance and ideally longer for peak months.",
  },
  {
    q: "Is there a deposit?",
    a: "Most venues take a 25–50% deposit per booking, balance paid on the day. Cancellation policies vary: 14 days' notice for a full refund is common. Always read the terms before confirming.",
  },
  {
    q: "Can we combine the rage room with other hen activities?",
    a: "Yes — the most popular pairings are rage room + afternoon tea, rage room + cocktail class, and rage room + life drawing. Allow 90 minutes total at the rage room (briefing + session + photos + changing) before moving to the next activity.",
  },
]

export default async function RageRoomsForHenPartiesPage() {
  const matchingVenues = await getListingsByOccasions(["hen-parties"])
  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: "Rage Rooms for Hen Parties UK: Booking, Packages & Cost",
    description:
      "Complete UK hen party rage room guide covering group sizes, packages, costs, booking lead time, safety rules, and recommended cities.",
    datePublished: "2026-04-24",
    keywords: [
      "rage rooms hen party",
      "hen party rage room UK",
      "smash room hen do",
      "hen party activities UK",
      "alternative hen party ideas",
      "group rage room booking",
    ],
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: "Rage Rooms for Hen Parties", url: PATH },
  ])

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://www.rageroomdirectory.co.uk${PATH}#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: "Rage Rooms for Hen Parties" },
          ]}
        />

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Rage Rooms for Hen Parties: The UK Guide
          </h1>

          <GuideMeta
            updated="April 2026"
            readingTimeMinutes={9}
            keyTakeaways={[
              "Budget £25–£45 per person for a 30–45 minute private hen session, or £500–£750 for a premium package with extras.",
              "Most UK rage rooms take groups of 6–12; for 15+ you'll usually split across two back-to-back slots.",
              "No alcohol before or during — reputable venues will refuse entry. Rage first, drink after.",
              "Book 4–8 weeks ahead for weekend slots in London, Manchester, Liverpool and Newcastle.",
              "Many venues let you bring your own photos / unwanted gifts to smash for an extra personalised touch.",
            ]}
          />

          <p className="text-base sm:text-lg text-zinc-300 mb-4 leading-relaxed">
            A rage room sits near the top of the UK hen-party activity
            league: it&apos;s physical, photogenic, easy to combine with
            afternoon drinks, and works just as well for a bride who hates
            pink-sash clichés as for a full-on classic hen weekend. It also
            solves the hardest hen-party problem — finding one activity
            where everyone (fit, less-fit, shy, loud, half-sober) has an
            equally good time.
          </p>
          <p className="text-base sm:text-lg text-zinc-300 mb-8 leading-relaxed">
            This guide covers every practical question you&apos;ll hit while
            planning: how many people a venue can handle, what a 10-person
            package actually costs, which cities are easiest for out-of-
            towners, booking lead time, alcohol rules, and what to wear.
          </p>

          <InArticleAd />

          <section aria-labelledby="hen-venues-heading" className="mb-10 rounded-lg border border-rage-500/30 bg-dark-900 p-4 sm:p-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="hen-venues-heading" className="text-2xl font-bold text-white">Hen-party venues</h2>
                <p className="mt-2 text-sm text-zinc-400">Compare venues with confirmed hen-party suitability and direct booking details.</p>
              </div>
              <Link href="/occasions/hen-parties" className="text-sm font-bold text-rage-400 hover:text-rage-300">View all {matchingVenues.length} →</Link>
            </div>
            <ListingsGrid listings={matchingVenues.slice(0, 3)} />
          </section>


          <section aria-labelledby="cities-heading" className="mb-10">
            <h2
              id="cities-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              Best UK cities for a hen-party rage room
            </h2>
            <p className="text-zinc-300 mb-6 leading-relaxed">
              We&apos;ve ranked these by a mix of venue availability, hen-
              party infrastructure (hotels, restaurants, bars nearby) and
              transport links for out-of-town guests.
            </p>
            <div className="grid gap-4">
              {CITY_PICKS.map((c, i) => (
                <div
                  key={c.slug}
                  className="flex gap-4 bg-[#181818] border border-zinc-800 rounded-lg p-5"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white mb-1">
                      <Link
                      href={
                        ["london", "birmingham", "edinburgh"].includes(c.slug)
                          ? `/occasions/hen-parties/${c.slug}`
                          : `/city/${c.slug}`
                      }
                      className="hover:text-orange-500 transition-colors"
                    >
                      {c.city}
                    </Link>
                    </h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {c.why}
                    </p>
                    <Link
                      href={
                        ["london", "birmingham", "edinburgh"].includes(c.slug)
                          ? `/occasions/hen-parties/${c.slug}`
                          : `/city/${c.slug}`
                      }
                      className="inline-block mt-2 text-sm text-orange-500 hover:text-orange-400 underline"
                    >
                      Browse {c.city} hen-party venues →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mb-10">
            <NearbyActivitiesAffiliate
              placement="guide"
              variant="chips"
              cities={CITY_PICKS.map((pick) => pick.city)}
            />
          </div>

          <section aria-labelledby="cost-heading" className="mb-10">
            <h2
              id="cost-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              What does a hen-party rage room cost?
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#181818] border-b border-zinc-700">
                    <th className="text-left p-3 text-zinc-400 font-semibold">
                      Group size
                    </th>
                    <th className="text-left p-3 text-zinc-400 font-semibold">
                      Typical UK price (standard)
                    </th>
                    <th className="text-left p-3 text-zinc-400 font-semibold">
                      Premium package
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["6 people", "£180–£240 (≈£30–£40pp)", "£320–£400"],
                    ["8 people", "£220–£320 (≈£27–£40pp)", "£400–£520"],
                    ["10 people", "£270–£400 (≈£27–£40pp)", "£480–£620"],
                    ["12 people", "£320–£480 (≈£27–£40pp)", "£560–£720"],
                    ["15+ people (split session)", "£400–£650 total", "£750–£1,000"],
                  ].map((row) => (
                    <tr
                      key={row[0]}
                      className="border-b border-zinc-800 bg-[#111111]"
                    >
                      <td className="p-3 text-zinc-200 font-medium">{row[0]}</td>
                      <td className="p-3 text-zinc-300">{row[1]}</td>
                      <td className="p-3 text-zinc-300">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
              Standard packages typically include 30–40 minutes of
              smashing time, all PPE, and a starter load of breakables.
              Premium adds 45–60 minute sessions, extra breakables,
              music customisation and often professional photography.
              See our{" "}
              <Link
                href="/guides/how-much-do-rage-rooms-cost-uk"
                className="text-orange-500 hover:text-orange-400 underline"
              >
                full UK pricing guide
              </Link>{" "}
              for deeper breakdowns.
            </p>
          </section>

          <section aria-labelledby="plan-heading" className="mb-10">
            <h2
              id="plan-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              Planning timeline
            </h2>
            <ol className="space-y-4">
              {[
                {
                  when: "8+ weeks out",
                  what: "Lock the city and book the rage room. Peak-season Saturdays in London, Manchester and Liverpool go fastest.",
                },
                {
                  when: "4 weeks out",
                  what: "Confirm final numbers with the venue. Send the group a payment link for their share of the deposit.",
                },
                {
                  when: "2 weeks out",
                  what: "Share the safety rules, age requirement (usually 18+), and dress recommendations with the group.",
                },
                {
                  when: "3 days out",
                  what: "Confirm arrival time. Remind everyone: no alcohol before, bring layers under the coveralls, tie long hair up.",
                },
                {
                  when: "On the day",
                  what: "Arrive 15–20 minutes early to get kitted up. Hand phones to one designated person who stays out of the room. Smash. Photos afterwards.",
                },
              ].map((row) => (
                <li
                  key={row.when}
                  className="flex gap-4 bg-[#181818] border border-zinc-800 rounded-lg p-5"
                >
                  <div className="flex-shrink-0 text-xs font-bold uppercase tracking-wider text-orange-500 w-20 sm:w-28">
                    {row.when}
                  </div>
                  <p className="text-zinc-300 text-sm sm:text-base">{row.what}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="related-heading" className="mb-10">
            <h2
              id="related-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              Related guides
            </h2>
            <ul className="space-y-2 text-zinc-300">
              <li>
                <Link
                  href="/guides/rage-rooms-for-stag-parties-uk"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Rage rooms for stag parties
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/best-rage-rooms-for-couples"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Best rage rooms for couples
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/rage-rooms-for-birthdays-uk"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Rage rooms for birthday parties
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/best-rage-rooms-for-team-building"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Rage rooms for team building / corporate away-days
                </Link>
              </li>
              <li>
                <Link
                  href="/rage-room-prices-uk"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  UK pricing breakdown
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/are-rage-rooms-safe-uk"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Are rage rooms safe?
                </Link>
              </li>
              <li>
                <Link
                  href="/rage-room-vs-escape-room"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Rage room vs escape room
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/rage-room-vs-paint-splatter"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Rage room vs paint splatter
                </Link>
              </li>
            </ul>
          </section>

          <div className="my-8">
            <DigitalDownloadCTA variant="party" />
            <div className="mt-4">
              <RageResetCTA surface="guide" compact />
            </div>
          </div>

          <FAQ
            items={FAQS.map((f) => ({ question: f.q, answer: f.a }))}
            title="Hen-party rage room FAQs"
          />

          <div className="mt-10 text-center">
            <Link
              href="/listings"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Browse UK Rage Rooms
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
