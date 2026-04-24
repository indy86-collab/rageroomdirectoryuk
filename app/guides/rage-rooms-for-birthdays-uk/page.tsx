import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import GuideMeta from "@/components/GuideMeta"
import AdsenseInContent from "@/components/ads/AdsenseInContent"
import FAQ from "@/components/FAQ"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOgImageUrl,
} from "@/lib/seo-schema"

const PATH = "/guides/rage-rooms-for-birthdays-uk"

const OG_IMAGE = buildOgImageUrl({
  title: "Rage Rooms for Birthday Parties",
  subtitle: "UK booking, prices & planning guide",
  badge: "Birthdays",
})

export const metadata: Metadata = {
  title: "Rage Rooms for Birthday Parties UK | Prices & Best Venues 2026",
  description:
    "Throwing a birthday at a UK rage room? Full guide to group sizes, prices, age rules (adult and 14+ youth sessions), cake/food-on-site rules and top city picks.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Rage Rooms for Birthday Parties UK",
    description:
      "Book, plan and price a UK rage room birthday party — adult and teen options, venues, packages.",
    type: "article",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Rage rooms for birthday parties UK guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rage Rooms for Birthday Parties UK",
    description: "Adult & teen birthday rage rooms — prices, venues, planning.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

const FAQS = [
  {
    q: "What ages can book a rage room birthday?",
    a: "Most UK rage rooms require participants to be 18+ as standard. Some venues run dedicated 14–17 youth sessions with reduced tool weights and mandatory parental consent; under-14 is extremely rare and usually only available for over-the-shoulder participation with a parent. Always confirm age policy before booking a birthday.",
  },
  {
    q: "How much does a birthday rage room cost in the UK?",
    a: "Expect £25–£40 per person for a 30-minute standard group slot including PPE and starter breakables. A typical 10-person birthday session runs £280–£420 total. Premium packages — longer sessions, extra breakables, professional photos — run £450–£650 for a group of 10.",
  },
  {
    q: "Can I bring a birthday cake or food to the venue?",
    a: "Most rage rooms have a waiting area / lounge where cake, soft drinks and light snacks are allowed. Alcohol on the premises is almost never permitted due to insurance conditions. Some venues charge a small room-hire supplement (£15–£40) if you want to stay for cake after the session.",
  },
  {
    q: "Can the birthday person bring items to smash?",
    a: "Yes, at most UK venues. Printed photos, letters, old gifts or (check size rules) small items like an old keyboard or phone are often allowed. Heavy appliances, hazardous materials and anything with internal batteries (undamaged lithium) are usually forbidden.",
  },
  {
    q: "How long is a birthday session?",
    a: "Standard birthday bookings are 30 minutes of smashing with a 15-minute safety briefing beforehand — so plan for 60–75 minutes at the venue overall. Longer 45 or 60 minute sessions are available at premium price points.",
  },
  {
    q: "Can we take photos and videos?",
    a: "Phones aren't allowed inside the smash room. Most venues offer GoPro-style footage on request (often included, sometimes £15–£30 extra). Family members can take photos through the observation window where the venue layout allows.",
  },
  {
    q: "What's a good birthday party format around a rage room?",
    a: "Popular sequences: (1) Rage room first, then bowling/arcade/dinner — works for most ages. (2) Afternoon activity + rage room + evening cocktails — works for adult birthdays. (3) Rage room + mini golf — good low-cost combo for teenage birthdays 14–17 where parents are present.",
  },
  {
    q: "How early do I need to book a birthday?",
    a: "For Saturday slots in peak season (spring, early summer, pre-Christmas) book 4–6 weeks ahead. Weekday birthdays can often be confirmed with 1–2 weeks notice. Venues running youth sessions have fewer of them, so reserve earlier.",
  },
]

const PACKAGE_IDEAS: { name: string; description: string; good: string }[] = [
  {
    name: "Classic adult birthday (18+)",
    description:
      "Private 30-minute rage room session for 4–10 people, PPE included, plus 30 minutes in the lounge afterwards for cake and photos.",
    good: "Turning 25–35, mixed group, limited budget, want unique activity with low effort.",
  },
  {
    name: "Premium birthday (18+)",
    description:
      "60-minute extended session, double breakables load, custom playlist, professional photo / GoPro footage, decorated lounge area.",
    good: "Milestone birthday (30, 40, 50), close group of 6–12, want memorable photos.",
  },
  {
    name: "Teen birthday (14–17 venues only)",
    description:
      "20-minute youth-spec session with lightweight tools and extra staff supervision. Parental consent required.",
    good: "Post-GCSE celebration, sweet 16, end-of-exams. Parents usually wait in the lounge.",
  },
  {
    name: "Rage + recovery combo",
    description:
      "Rage room followed by spa / afternoon tea / cocktails at a nearby venue. Some venues offer bundle partnerships.",
    good: "Friend groups who want &lsquo;active chaos, then calm&rsquo;. Works best for 4–8 guests.",
  },
]

export default function RageRoomsForBirthdaysPage() {
  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: "Rage Rooms for Birthday Parties UK: Prices, Ages & Best Venues",
    description:
      "Complete UK guide to booking a rage room birthday party, covering costs, group sizes, age policies, food rules and the best birthday-friendly venues.",
    datePublished: "2026-04-24",
    keywords: [
      "rage room birthday party",
      "birthday rage room UK",
      "smash room birthday",
      "30th birthday activity UK",
      "40th birthday ideas UK",
      "teenage birthday rage room",
    ],
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: "Rage Rooms for Birthdays", url: PATH },
  ])

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://rageroomdirectory.co.uk${PATH}#faq`,
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
            { label: "Rage Rooms for Birthdays" },
          ]}
        />

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Rage Rooms for Birthdays: The UK Birthday Party Guide
          </h1>

          <GuideMeta
            updated="April 2026"
            readingTimeMinutes={8}
            keyTakeaways={[
              "Adult birthday groups of 8–10 typically cost £280–£420 total for a 30-minute session.",
              "Most venues are 18+; dedicated 14–17 youth sessions exist at select UK sites with parental consent.",
              "Cake and soft drinks are usually fine in the lounge afterwards; alcohol on premises is almost never allowed.",
              "Bring printed photos, unwanted gifts or small old items to personalise the smash.",
              "Book 4–6 weeks ahead for weekend slots in peak season (spring, summer, pre-Christmas).",
            ]}
          />

          <p className="text-base sm:text-lg text-zinc-300 mb-4 leading-relaxed">
            Rage rooms have become one of the fastest-rising UK birthday
            activities for adults and older teens: physical, memorable,
            photogenic and genuinely different from the usual escape room
            / bowling / dinner grooves. They work as a standalone session
            or as the headline act in a wider birthday day.
          </p>
          <p className="text-base sm:text-lg text-zinc-300 mb-8 leading-relaxed">
            This guide walks through age limits, realistic pricing by
            group size, what you can (and can&apos;t) bring to smash, how
            to structure the wider party around a rage room, and the
            lead time you&apos;ll need to lock a Saturday slot.
          </p>

          <AdsenseInContent />

          <section aria-labelledby="package-heading" className="mb-10">
            <h2
              id="package-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              Popular birthday package formats
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {PACKAGE_IDEAS.map((p) => (
                <div
                  key={p.name}
                  className="bg-[#181818] border border-zinc-800 rounded-lg p-5"
                >
                  <h3 className="text-lg font-bold text-white mb-2">
                    {p.name}
                  </h3>
                  <p className="text-zinc-300 text-sm mb-3 leading-relaxed">
                    {p.description}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-orange-500 mb-1">
                    Best for
                  </p>
                  <p
                    className="text-sm text-zinc-300"
                    dangerouslySetInnerHTML={{ __html: p.good }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="cost-heading" className="mb-10">
            <h2
              id="cost-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              Birthday rage room cost table
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#181818] border-b border-zinc-700">
                    <th className="text-left p-3 text-zinc-400 font-semibold">
                      Group size
                    </th>
                    <th className="text-left p-3 text-zinc-400 font-semibold">
                      30-min standard
                    </th>
                    <th className="text-left p-3 text-zinc-400 font-semibold">
                      60-min premium
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["4 people", "£120–£160", "£220–£300"],
                    ["6 people", "£180–£240", "£320–£400"],
                    ["8 people", "£220–£320", "£400–£520"],
                    ["10 people", "£280–£420", "£480–£620"],
                    ["12 people", "£330–£500", "£550–£720"],
                    ["15+ (split)", "£400–£650", "£750–£1,000+"],
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
              Cities vary: London runs 10–20% above these ranges, while
              Sheffield, Nottingham and Leeds sit at the lower end. See
              our{" "}
              <Link
                href="/guides/how-much-do-rage-rooms-cost-uk"
                className="text-orange-500 hover:text-orange-400 underline"
              >
                full UK pricing guide
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="format-heading" className="mb-10">
            <h2
              id="format-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              How to structure the day
            </h2>
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              <p>
                A birthday rage room works best when you give it some
                breathing room either side. A tight 60-minute slot ends up
                feeling rushed because you need 15 minutes to sign waivers
                and kit up, 30 minutes in the smash room, and another 15
                minutes to change, take photos and regroup.
              </p>
              <p>
                Our recommended format: arrive 20 minutes before your
                booking, do the rage room, allow 20 minutes of lounge /
                cake time at the venue, then move to the next stop. For
                an adult birthday the natural next stop is drinks or
                dinner; for a teen birthday it&apos;s usually bowling,
                arcade games, laser tag or dessert parlours.
              </p>
            </div>
          </section>

          <section aria-labelledby="personalise-heading" className="mb-10">
            <h2
              id="personalise-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              Personalise the smash
            </h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Most UK venues encourage you to bring small personalised
              items — it makes for better photos and is much more
              memorable than generic crockery alone. Common allowed
              items (check with the venue first):
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-300 ml-2">
              <li>Printed photos / mounted photos (ex-partners, embarrassing school pictures)</li>
              <li>Old CDs or DVDs (never vinyl — shards are dangerous)</li>
              <li>Old phones, keyboards, remotes (battery removed)</li>
              <li>Unwanted gifts, expired calendars, printed emails</li>
              <li>Plain ceramic items from your own cupboard</li>
            </ul>
            <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
              Typically not allowed: glass bottles containing liquid, lithium-
              battery devices, aerosols, anything sharp that can&apos;t be
              contained, items over a certain weight (commonly 5–10kg).
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
                  href="/guides/best-rage-rooms-for-team-building"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Rage rooms for corporate team building
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/best-rage-rooms-for-couples"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Rage rooms for couples / date night
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/how-much-do-rage-rooms-cost-uk"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  UK rage room pricing guide
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

          <FAQ
            items={FAQS.map((f) => ({ question: f.q, answer: f.a }))}
            title="Birthday rage room FAQs"
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
