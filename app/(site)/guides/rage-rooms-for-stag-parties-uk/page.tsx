import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import GuideMeta from "@/components/GuideMeta"
import DigitalDownloadCTA from "@/components/DigitalDownloadCTA"
import FAQ from "@/components/FAQ"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOgImageUrl,
} from "@/lib/seo-schema"

const PATH = "/guides/rage-rooms-for-stag-parties-uk"

const OG_IMAGE = buildOgImageUrl({
  title: "Rage Rooms for Stag Parties",
  subtitle: "Booking, packages & city picks",
  badge: "Stag · Hen",
})

export const metadata: Metadata = {
  title: "Rage Rooms for Stag Parties UK | Booking, Packages & Cost (2026)",
  description:
    "The definitive UK stag party rage room guide: how to book for groups of 6–20, what packages cost, which cities have the best venues, and what to expect on the day.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Rage Rooms for Stag Parties UK",
    description:
      "The definitive UK stag party rage room guide — booking, packages, costs and city picks.",
    type: "article",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Rage rooms for stag parties UK guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rage Rooms for Stag Parties UK",
    description: "Book, plan and price a UK stag party rage room session.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

const CITY_PICKS: { city: string; slug: string; why: string }[] = [
  {
    city: "Newcastle",
    slug: "newcastle",
    why: "Legendary stag-weekend city. Rage rooms sit near Bigg Market and Quayside pubs, so you can smash first and crawl afterwards without a long taxi.",
  },
  {
    city: "Liverpool",
    slug: "liverpool",
    why: "Classic UK stag destination; venues around the Baltic Triangle and city centre put you minutes from Mathew Street and Albert Dock bars.",
  },
  {
    city: "Manchester",
    slug: "manchester",
    why: "Biggest stag-party market outside London. Multiple venues with group packages and easy tram links from most stag-weekend hotels.",
  },
  {
    city: "Leeds",
    slug: "leeds",
    why: "Strong for Yorkshire stag weekends pairing rage with Call Lane pubs and late bars. Compact centre means less travel between activities.",
  },
  {
    city: "Birmingham",
    slug: "birmingham",
    why: "Central Midlands hub — easy for stags travelling from Coventry, Wolverhampton, Worcester and the South. Solid mid-range group pricing.",
  },
  {
    city: "Glasgow",
    slug: "glasgow",
    why: "Scotland’s go-to stag city. Good venue choice plus Merchant City and Sauchiehall Street nightlife within easy reach after the session.",
  },
  {
    city: "London",
    slug: "london",
    why: "Highest concentration of venues; premium packages with longer sessions and professional photos if the best man wants a keepsake reel.",
  },
  {
    city: "Brighton",
    slug: "brighton",
    why: "Seaside stag favourite with a compact party strip. Rage rooms work well as the daytime opener before Lanes pubs and seafront bars.",
  },
]

const FAQS = [
  {
    q: "How many people can a rage room fit for a stag party?",
    a: "Standard UK rage rooms comfortably fit 1–6 people per session. Larger venues run private stag sessions for groups of 8–12, and a few dedicated team-building sites can handle 15–20+. For groups above 12 you typically split into two back-to-back slots.",
  },
  {
    q: "How much should I budget for a stag party rage room?",
    a: "Budget around £25–£45 per person for a 30–45 minute private stag session including PPE and breakables. For a group of 10 that's £250–£450 total. Premium packages with extended breakables, longer sessions, and professional photos cost £500–£750.",
  },
  {
    q: "Can we drink alcohol before or during a rage room?",
    a: "No reputable UK venue allows anyone under the influence to enter the rage room — it's a standard insurance condition and a safety requirement. Alcohol is almost always prohibited before AND during sessions. Schedule the rage room as the first activity of the day, then hit the pubs after.",
  },
  {
    q: "What should the stag and groomsmen wear?",
    a: "All participants get coveralls over their clothes, a full-face visor helmet, heavy-duty gloves and boots. Underneath, wear something you don't mind sweating in — a tee and joggers or shorts work well. Avoid jewellery and leave valuables in a locker if the venue provides one.",
  },
  {
    q: "Do we need to book months ahead?",
    a: "Weekends in prime stag cities (Newcastle, Liverpool, Manchester, London, Glasgow) book up 4–8 weeks ahead, especially in spring and early summer. If you're planning a Saturday afternoon slot, reserve at least 6 weeks in advance and ideally longer for peak months.",
  },
  {
    q: "Can we combine the rage room with a pub crawl?",
    a: "Yes — that's the most popular stag pairing. Do the rage room first (sober), then move on to pubs, axe throwing, or a bar crawl. Allow 90 minutes total at the venue (briefing + session + photos + changing) before the next stop.",
  },
  {
    q: "Is there a deposit?",
    a: "Most venues take a 25–50% deposit per booking, balance paid on the day. Cancellation policies vary: 14 days' notice for a full refund is common. Always read the terms before confirming.",
  },
]

export default function RageRoomsForStagPartiesPage() {
  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: "Rage Rooms for Stag Parties UK: Booking, Packages & Cost",
    description:
      "Complete UK stag party rage room guide covering group sizes, packages, costs, booking lead time, safety rules, and recommended cities.",
    datePublished: "2026-04-24",
    keywords: [
      "rage rooms stag party",
      "stag party rage room UK",
      "smash room stag do",
      "stag party activities UK",
      "alternative stag party ideas",
      "group rage room booking",
    ],
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: "Rage Rooms for Stag Parties", url: PATH },
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
            { label: "Rage Rooms for Stag Parties" },
          ]}
        />

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Rage Rooms for Stag Parties: The UK Guide
          </h1>

          <GuideMeta
            updated="April 2026"
            readingTimeMinutes={9}
            keyTakeaways={[
              "Budget £25–£45 per person for a 30–45 minute private stag session, or £500–£750 for a premium package with extras.",
              "Most UK rage rooms take groups of 6–12; for 15+ you'll usually split across two back-to-back slots.",
              "No alcohol before or during — reputable venues will refuse entry. Rage first, pubs after.",
              "Book 4–8 weeks ahead for weekend slots in Newcastle, Liverpool, Manchester, London and Glasgow.",
              "Pair with a pub crawl or axe throwing — leave 90 minutes at the venue before the next activity.",
            ]}
          />

          <p className="text-base sm:text-lg text-zinc-300 mb-4 leading-relaxed">
            A rage room sits near the top of the UK stag-party activity
            league: it&apos;s physical, competitive enough for the loud lads,
            easy for anyone who hates karaoke-and-sashes clichés, and it
            slots cleanly before a pub crawl. It also solves the hardest
            stag-party problem — finding one activity where the fitness
            levels, budgets and personalities in the group all get a fair
            go.
          </p>
          <p className="text-base sm:text-lg text-zinc-300 mb-8 leading-relaxed">
            This guide covers every practical question you&apos;ll hit while
            planning: how many people a venue can handle, what a 10-person
            package actually costs, which cities are easiest for out-of-
            towners, booking lead time, alcohol rules, and what to wear.
          </p>


          <section aria-labelledby="cities-heading" className="mb-10">
            <h2
              id="cities-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              Best UK cities for a stag-party rage room
            </h2>
            <p className="text-zinc-300 mb-6 leading-relaxed">
              We&apos;ve ranked these by a mix of venue availability, stag-
              party infrastructure (hotels, pubs, late bars nearby) and
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
                        href={`/city/${c.slug}`}
                        className="hover:text-orange-500 transition-colors"
                      >
                        {c.city}
                      </Link>
                    </h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {c.why}
                    </p>
                    <Link
                      href={`/city/${c.slug}`}
                      className="inline-block mt-2 text-sm text-orange-500 hover:text-orange-400 underline"
                    >
                      Browse {c.city} rage rooms →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="cost-heading" className="mb-10">
            <h2
              id="cost-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              What does a stag-party rage room cost?
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
                href="/rage-room-prices-uk"
                className="text-orange-500 hover:text-orange-400 underline"
              >
                UK rage room prices
              </Link>{" "}
              page for deeper breakdowns.
            </p>
          </section>

          <section aria-labelledby="booking-heading" className="mb-10">
            <h2
              id="booking-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              Booking tips for stag groups
            </h2>
            <ol className="space-y-4">
              {[
                {
                  when: "8+ weeks out",
                  what: "Lock the city and book the rage room. Peak-season Saturdays in Newcastle, Liverpool, Manchester and London go fastest.",
                },
                {
                  when: "4 weeks out",
                  what: "Confirm final numbers with the venue. Send the group a payment link for their share of the deposit (usually 25–50%).",
                },
                {
                  when: "2 weeks out",
                  what: "Share the safety rules, age requirement (usually 18+), and dress recommendations with the group.",
                },
                {
                  when: "3 days out",
                  what: "Confirm arrival time. Remind everyone: no drinking before, bring layers under the coveralls, leave valuables at the hotel or in a locker.",
                },
                {
                  when: "On the day",
                  what: "Arrive 15–20 minutes early to get kitted up. Hand phones to one designated person who stays out of the room. Smash. Photos afterwards — then pubs.",
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

          <section aria-labelledby="alcohol-heading" className="mb-10">
            <h2
              id="alcohol-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              Alcohol and safety rules
            </h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Every reputable UK rage room refuses entry to anyone who
              smells of drink or appears under the influence. That is an
              insurance condition, not optional venue pedantry — staff
              will turn the group away and you will lose the deposit.
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 mb-4">
              <li>
                Schedule the rage room as the{" "}
                <strong className="text-white">first activity</strong> of
                the day — before any pubs, beer bikes or bottomless brunch.
              </li>
              <li>
                No alcohol inside the venue before, during or between split
                sessions.
              </li>
              <li>
                Follow the briefing: two hands on the bat when swinging,
                stay clear of other people&apos;s arcs, stop when staff say
                stop.
              </li>
              <li>
                Anyone with recent injuries, heart conditions or who cannot
                wear a full-face visor should sit the session out.
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed">
              For a deeper dive, see our guide on{" "}
              <Link
                href="/guides/are-rage-rooms-safe-uk"
                className="text-orange-500 hover:text-orange-400 underline"
              >
                whether rage rooms are safe
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="wear-heading" className="mb-10">
            <h2
              id="wear-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              What to wear on a stag rage room
            </h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Venues kit you out in coveralls, a full-face visor helmet,
              heavy gloves and usually boots. What you wear underneath
              should be comfortable and expendable — you will sweat.
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 mb-4">
              <li>T-shirt and joggers, shorts or old jeans work best.</li>
              <li>Trainers or sturdy shoes if the venue does not provide boots.</li>
              <li>Leave watches, chains and rings at the hotel.</li>
              <li>
                Bring a change of top if you are heading straight to pubs
                afterwards.
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed">
              More detail in our{" "}
              <Link
                href="/guides/what-to-wear-to-a-rage-room"
                className="text-orange-500 hover:text-orange-400 underline"
              >
                what to wear to a rage room
              </Link>{" "}
              guide.
            </p>
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
                  href="/guides/rage-rooms-for-hen-parties-uk"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Rage rooms for hen parties
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
                  href="/rage-room-prices-uk"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  UK rage room prices
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
            </ul>
          </section>

          <div className="my-8">
            <DigitalDownloadCTA variant="party" />
          </div>

          <FAQ
            items={FAQS.map((f) => ({ question: f.q, answer: f.a }))}
            title="Stag-party rage room FAQs"
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
