import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import GuideMeta from "@/components/GuideMeta"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOgImageUrl,
} from "@/lib/seo-schema"

const PATH = "/rage-room-vs-escape-room"

const OG_IMAGE = buildOgImageUrl({
  title: "Rage Room vs Escape Room",
  subtitle: "Which is better for stress, groups & date nights?",
  badge: "Comparison",
})

export const metadata: Metadata = {
  title: "Rage Room vs Escape Room | Which Is Better in 2026?",
  description:
    "Rage rooms vs escape rooms compared head to head: cost, duration, group size, stress relief, accessibility and best-fit occasions. Pick the right UK activity.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Rage Room vs Escape Room — UK Comparison Guide",
    description:
      "Complete head-to-head comparison of rage rooms and escape rooms in the UK. Price, duration, group size, physicality and best use cases.",
    type: "article",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Rage room vs escape room comparison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rage Room vs Escape Room",
    description: "Head-to-head UK comparison — price, duration, vibe, best fit.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

const COMPARISON_ROWS: {
  label: string
  rage: string
  escape: string
}[] = [
  {
    label: "Typical duration",
    rage: "15–60 minutes of smashing (plus 15 min PPE briefing)",
    escape: "60-minute puzzle experience (fixed timer, no extension)",
  },
  {
    label: "Typical UK price",
    rage: "£20–£40 solo · £50–£90 couples · £90–£180 groups (3–6)",
    escape: "£22–£30 per person, groups of 2–6 (private room)",
  },
  {
    label: "Physical intensity",
    rage: "High — swinging sledgehammers, bats, crowbars",
    escape: "Low — puzzle-solving, light searching",
  },
  {
    label: "Mental intensity",
    rage: "Low — no rules, no time pressure to solve anything",
    escape: "High — timed puzzles, lateral thinking, teamwork",
  },
  {
    label: "Group size",
    rage: "1–6 typical; 8–20 for corporate bookings",
    escape: "2–8 per room; larger teams split across rooms",
  },
  {
    label: "Minimum age",
    rage: "Usually 18+ (14–17 with parental consent at some venues)",
    escape: "Usually 10–12+ depending on theme difficulty",
  },
  {
    label: "Accessibility",
    rage: "Physical; not suitable for pregnancy, certain back/heart conditions",
    escape: "Sedentary friendly; most rooms are step-free",
  },
  {
    label: "Best for stress relief",
    rage: "Best in class — cathartic, physical release",
    escape: "Fun but cognitively demanding, not relaxing",
  },
  {
    label: "Best for first dates",
    rage: "Great — private couples packages, no pressure to impress",
    escape: "Great — teamwork reveals personality quickly",
  },
  {
    label: "Best for stag/hen dos",
    rage: "Top-tier activity: physical, photogenic, easy to book",
    escape: "Good for smaller groups; avoid if heavy drinking involved",
  },
  {
    label: "Best for corporate team building",
    rage: "Good for morale / decompression days; needs structured brief",
    escape: "Excellent for strategy + communication training",
  },
  {
    label: "Repeat appeal",
    rage: "Most people do it once or twice a year",
    escape: "Lower — once you know a room you can't replay it",
  },
]

export default function RageRoomVsEscapeRoomPage() {
  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: "Rage Room vs Escape Room: UK Comparison Guide",
    description:
      "Head-to-head comparison of rage rooms and escape rooms in the UK across price, duration, group size, accessibility and best-fit occasions.",
    datePublished: "2026-04-24",
    keywords: [
      "rage room vs escape room",
      "rage room or escape room",
      "stress relief activities UK",
      "group activities UK",
      "date night ideas UK",
      "corporate team building UK",
    ],
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Rage Room vs Escape Room", url: PATH },
  ])

  const faqs = [
    {
      q: "Is a rage room or an escape room better for stress?",
      a: "A rage room is significantly better for acute stress relief. The physical act of smashing objects provides a short-term catharsis that escape rooms — which require sustained concentration — do not. Escape rooms are fun but mentally demanding. If the goal is to decompress, book a rage room.",
    },
    {
      q: "Which is cheaper, a rage room or an escape room?",
      a: "Per person, escape rooms are usually slightly cheaper for groups of 4–6 (around £22–£30 per head). Rage rooms cost less for solo sessions (from ~£20) but more per head for very small groups. For 2 people on a date night the total is comparable — around £50–£90.",
    },
    {
      q: "Which lasts longer?",
      a: "Escape rooms run for a fixed 60 minutes. Rage rooms range from 15 to 60 minutes of smashing time plus a 15-minute safety briefing. If raw time-in-the-room matters, escape rooms usually deliver more minutes. If intensity matters, rage rooms are far more concentrated.",
    },
    {
      q: "Are rage rooms or escape rooms safer?",
      a: "Both are low-risk when run by reputable operators. Escape rooms pose almost no injury risk. Rage rooms require full PPE (coveralls, full-face visor, gloves, boots) but injury rates are very low when rules are followed. Pregnancy, heart conditions and certain back injuries exclude rage rooms but not escape rooms.",
    },
    {
      q: "Which is better for a corporate team-building event?",
      a: "Escape rooms are better for communication, leadership and problem-solving training — they produce clear teamwork observations. Rage rooms are better for post-deadline decompression or morale days where the goal is shared catharsis rather than skill-building.",
    },
    {
      q: "Can you do both on the same day?",
      a: "Yes — many groups pair an escape room followed by a rage room. The order matters: start with the escape room while the team is mentally fresh, then release the energy at the rage room afterwards. Budget ~£60–£90 per person for both.",
    },
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://www.rageroomdirectory.co.uk${PATH}#faq`,
    mainEntity: faqs.map((f) => ({
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
            { label: "Rage Room vs Escape Room" },
          ]}
        />

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Rage Room vs Escape Room: Which Should You Book?
          </h1>

          <GuideMeta
            updated="April 2026"
            readingTimeMinutes={8}
            keyTakeaways={[
              "Rage rooms win for stress relief, physical release and short-notice group activities.",
              "Escape rooms win for mental challenge, communication-led team building and family-friendly ages (10+).",
              "Per-person cost is broadly comparable — ~£22–£35 for 4-person groups in both formats.",
              "Safety: both are low-risk, but rage rooms exclude pregnancy, heart conditions and some back injuries.",
              "Best-of-both-worlds: book an escape room first (mentally fresh), then a rage room afterwards.",
            ]}
          />

          <p className="text-base sm:text-lg text-zinc-300 mb-4 leading-relaxed">
            Rage rooms and escape rooms sit in the same slot on most people&apos;s
            mental map — &ldquo;novel UK activity for a group of adults,
            ~£25–£40 a head, takes about an hour.&rdquo; But the experiences
            they deliver are almost opposites. This guide compares them
            head-to-head so you can pick the right one for your budget,
            group and occasion.
          </p>
          <p className="text-base sm:text-lg text-zinc-300 mb-8 leading-relaxed">
            Short answer: if you want physical catharsis, book a rage room.
            If you want a teamwork-led mental challenge, book an escape
            room. If you want both, do an escape room first while your
            team is fresh, then blow off steam at a rage room afterwards.
          </p>


          <section aria-labelledby="table-heading" className="mb-10">
            <h2
              id="table-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              Head-to-head comparison
            </h2>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full text-sm sm:text-base border-collapse">
                <thead>
                  <tr className="bg-[#181818] border-b border-zinc-700">
                    <th className="text-left p-3 sm:p-4 text-zinc-400 font-semibold uppercase text-xs tracking-wider">
                      Criterion
                    </th>
                    <th className="text-left p-3 sm:p-4 text-orange-500 font-semibold">
                      Rage room
                    </th>
                    <th className="text-left p-3 sm:p-4 text-blue-400 font-semibold">
                      Escape room
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-zinc-800 bg-[#111111]"
                    >
                      <th
                        scope="row"
                        className="align-top text-left p-3 sm:p-4 text-zinc-300 font-medium"
                      >
                        {row.label}
                      </th>
                      <td className="align-top p-3 sm:p-4 text-zinc-200">
                        {row.rage}
                      </td>
                      <td className="align-top p-3 sm:p-4 text-zinc-200">
                        {row.escape}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="pick-heading" className="mb-10">
            <h2
              id="pick-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              Which should you pick?
            </h2>
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              <p>
                <strong className="text-white">Pick a rage room if…</strong>{" "}
                you or your group are stressed, burnt out, on a deadline, or
                recovering from a bad week at work. If the goal is to
                physically release energy — bachelor/hen parties, birthday
                blow-offs, post-breakup cathartic dates, post-exam celebration
                — rage rooms are unbeaten.
              </p>
              <p>
                <strong className="text-white">Pick an escape room if…</strong>{" "}
                the group wants to think, not smash. Escape rooms are better
                for mixed-age groups (kids 10+ can play), for team-building
                that involves observing communication patterns, and for
                people with physical limitations that rule out swinging
                heavy tools.
              </p>
              <p>
                <strong className="text-white">Pick both if…</strong> you have
                a full evening. The ideal sequence is escape room from ~6pm
                (mental energy high, pre-dinner), dinner, then rage room to
                decompress. Expect to spend £60–£90 per person for the
                combined experience, plus dinner.
              </p>
            </div>
          </section>

          <section aria-labelledby="occasions-heading" className="mb-10">
            <h2
              id="occasions-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              By occasion
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  occasion: "Date night",
                  winner: "Tie",
                  reason:
                    "Both work. Rage rooms reveal how a partner handles mess and physicality; escape rooms reveal problem-solving and patience. Rage rooms edge it for second dates; escape rooms for first dates.",
                },
                {
                  occasion: "Hen / stag do",
                  winner: "Rage room",
                  reason:
                    "Clearly better. Private sessions, alcohol-permitting venues, plenty of photo moments and easy accommodation of groups up to 12.",
                },
                {
                  occasion: "Corporate team building",
                  winner: "Escape room",
                  reason:
                    "Produces actionable observations on leadership, delegation and communication under pressure. Use rage rooms as an end-of-quarter decompression reward.",
                },
                {
                  occasion: "Birthday party (adults)",
                  winner: "Rage room",
                  reason:
                    "Higher intensity and more &lsquo;main character&rsquo; energy. Escape rooms work for birthdays too but feel less celebratory.",
                },
                {
                  occasion: "Family with teenagers (13+)",
                  winner: "Escape room",
                  reason:
                    "Most rage rooms require 18+; escape rooms typically admit 10–12+. Family-friendly.",
                },
                {
                  occasion: "Solo therapy after a bad week",
                  winner: "Rage room",
                  reason:
                    "Many venues offer 15–20 minute solo sessions from £20. Escape rooms are built for teams and rarely accept solo players.",
                },
              ].map((item) => (
                <div
                  key={item.occasion}
                  className="bg-[#181818] rounded-lg border border-zinc-800 p-5"
                >
                  <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                    {item.occasion}
                  </p>
                  <p className="text-lg font-bold text-orange-500 mb-2">
                    Winner: {item.winner}
                  </p>
                  <p
                    className="text-sm text-zinc-300"
                    dangerouslySetInnerHTML={{ __html: item.reason }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="faq-heading" className="mb-10">
            <h2
              id="faq-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-4"
            >
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group bg-[#181818] rounded-lg border border-zinc-800 p-5"
                >
                  <summary className="cursor-pointer text-white font-semibold hover:text-orange-500 transition-colors">
                    {f.q}
                  </summary>
                  <p className="text-zinc-300 mt-3 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="related-heading"
            className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6 mb-8"
          >
            <h2
              id="related-heading"
              className="text-xl sm:text-2xl font-bold text-white mb-3"
            >
              Related reading
            </h2>
            <ul className="space-y-2 text-zinc-300">
              <li>
                <Link
                  href="/guides/rage-room-vs-paint-splatter"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Rage room vs paint splatter
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/what-happens-in-a-rage-room"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  What happens in a rage room? Step-by-step guide
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/how-much-do-rage-rooms-cost-uk"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  How much do rage rooms cost in the UK?
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/best-rage-rooms-for-couples"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Best rage rooms for couples and date nights
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/best-rage-rooms-for-team-building"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Best rage rooms for corporate team building
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/are-rage-rooms-safe-uk"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Are rage rooms safe? (UK safety guide)
                </Link>
              </li>
            </ul>
          </section>

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
