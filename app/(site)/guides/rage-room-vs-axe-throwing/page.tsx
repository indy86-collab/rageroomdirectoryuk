import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import GuideMeta from "@/components/GuideMeta"
import FAQ from "@/components/FAQ"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOgImageUrl,
} from "@/lib/seo-schema"

const PATH = "/guides/rage-room-vs-axe-throwing"

const OG_IMAGE = buildOgImageUrl({
  title: "Rage Room vs Axe Throwing",
  subtitle: "Head-to-head comparison · UK prices & which to pick",
  badge: "Comparison",
})

export const metadata: Metadata = {
  title: "Rage Room vs Axe Throwing UK | Head-to-Head Comparison (2026)",
  description:
    "Rage room or axe throwing — which is better for your group? We compare price, physicality, skill level, age rules, group sizes and which works best for different occasions.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Rage Room vs Axe Throwing UK | Which Should You Pick?",
    description:
      "Complete head-to-head: rage rooms vs axe throwing on price, physicality, skill, age, groups and best occasions. UK-specific comparison.",
    type: "article",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Rage room vs axe throwing UK comparison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rage Room vs Axe Throwing UK",
    description: "Which should you pick? Price, physicality, groups and best occasions compared.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

const COMPARISON_ROWS: { factor: string; rageRoom: string; axeThrowing: string }[] = [
  {
    factor: "Typical price (per person)",
    rageRoom: "£25–£65",
    axeThrowing: "£20–£45",
  },
  {
    factor: "Session length",
    rageRoom: "15–60 min",
    axeThrowing: "60–90 min",
  },
  {
    factor: "Skill required",
    rageRoom: "None — just swing",
    axeThrowing: "Basic technique needed",
  },
  {
    factor: "Physical intensity",
    rageRoom: "High (full-body exertion)",
    axeThrowing: "Moderate (arm-focused)",
  },
  {
    factor: "Minimum age (typical)",
    rageRoom: "18+",
    axeThrowing: "14–16+ (varies by venue)",
  },
  {
    factor: "Group size",
    rageRoom: "Solo to 12+",
    axeThrowing: "Usually 2–10 per lane",
  },
  {
    factor: "Competitive element",
    rageRoom: "None (it&apos;s destructive)",
    axeThrowing: "Yes — scores and targets",
  },
  {
    factor: "Best for stress relief",
    rageRoom: "Very high",
    axeThrowing: "Moderate",
  },
  {
    factor: "Availability (UK cities)",
    rageRoom: "40+ towns / cities",
    axeThrowing: "30+ towns / cities",
  },
  {
    factor: "Accessibility (mobility)",
    rageRoom: "Most tools adaptable",
    axeThrowing: "Requires full arm mobility",
  },
]

const VERDICT_SCENARIOS: { scenario: string; winner: "rage" | "axe" | "either"; why: string }[] = [
  {
    scenario: "Birthday group of 6–10 adults",
    winner: "rage",
    why: "Rage rooms require no skill, so everyone can participate equally. The chaos and laughter of group smashing is more reliably fun than watching half the group struggle with axe technique.",
  },
  {
    scenario: "Competitive group who want a score",
    winner: "axe",
    why: "Axe throwing has built-in targets, scores and a natural competitive arc. Rage rooms have no competitive element — everyone just smashes until the timer stops.",
  },
  {
    scenario: "Stress relief after a bad week",
    winner: "rage",
    why: "The physical release of smashing, combined with the permission to be loud and destructive, is more cathartic for stress. Axe throwing is more meditative and skill-focused.",
  },
  {
    scenario: "Hen or stag party",
    winner: "rage",
    why: "The group energy, potential for brought-in personalised items to smash, and the photogenic chaos work better for stag/hen. Axe throwing works too but is slower paced.",
  },
  {
    scenario: "Corporate team building",
    winner: "either",
    why: "Both work for corporate groups. Axe throwing has a more structured competitive format that suits team-building scoring; rage rooms are better for purely social energy with no winners or losers.",
  },
  {
    scenario: "Date night for two",
    winner: "axe",
    why: "Axe throwing is more of a classic date-night activity — competitive, playful, slightly longer, and doesn&apos;t require coveralls and a helmet. Rage rooms work for couples but are louder and more intense.",
  },
  {
    scenario: "Group that includes non-drinkers or mobility concerns",
    winner: "rage",
    why: "Rage rooms require less precise physical coordination. Tools are adaptable for different strength levels, and there&apos;s no throwing technique to master. Axe throwing requires a specific arm and shoulder motion that some people find uncomfortable.",
  },
]

const FAQS = [
  {
    question: "Is a rage room or axe throwing better for a group?",
    answer:
      "Rage rooms tend to work better for large, mixed-ability groups because they require no skill or practice — everyone can participate equally immediately. Axe throwing has a learning curve, and groups where some people pick it up quickly and others struggle can create uneven experiences. For competitive groups who enjoy a challenge, axe throwing edges ahead.",
  },
  {
    question: "Which is cheaper — rage rooms or axe throwing?",
    answer:
      "Axe throwing is typically slightly cheaper per person (£20–£45 vs £25–£65 for rage rooms) and includes a longer session (60–90 minutes vs 15–60 minutes). For value on time, axe throwing generally wins. However, rage room prices include comprehensive PPE and all breakables; axe throwing pricing is more standardised.",
  },
  {
    question: "Is axe throwing or a rage room better for stress relief?",
    answer:
      "Rage rooms are generally considered better for acute stress relief. The physical exertion is more intense, the permission to be fully destructive is more cathartic, and there&apos;s no skill barrier to entry. Axe throwing is more meditative and skill-focused — good for switching off, less effective for the physical &apos;let go&apos; of stress.",
  },
  {
    question: "Can you do both at the same venue?",
    answer:
      "Some UK activity venues offer both rage rooms and axe throwing as bookable experiences on the same site. This is still relatively rare — most venues specialise in one or the other. If you want both, check whether the venue offers a combined booking, or plan a multi-venue day.",
  },
  {
    question: "Which is safer — rage rooms or axe throwing?",
    answer:
      "Both activities have strong safety records at reputable UK venues. Rage rooms require full PPE (coveralls, helmet, gloves, boots) and the smash room is fully enclosed. Axe throwing requires safety briefings, lane separation, and designated retrieval zones. Neither is statistically more dangerous when run by a professional venue.",
  },
  {
    question: "What age can you do axe throwing vs a rage room in the UK?",
    answer:
      "Rage rooms are typically 18+ at most UK venues, with some offering supervised 14–17 sessions. Axe throwing varies more by venue — many allow 14–16+ with parental supervision, making it slightly more accessible for younger groups. Always check age policies before booking for under-18s.",
  },
]

export default function RageRoomVsAxeThrowingPage() {
  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: "Rage Room vs Axe Throwing UK: Which Should You Pick?",
    description:
      "Head-to-head comparison of rage rooms and axe throwing in the UK — price, physicality, skill, groups, and which works best for different occasions.",
    datePublished: "2026-05-01",
    keywords: [
      "rage room vs axe throwing",
      "axe throwing vs rage room UK",
      "rage room comparison",
      "axe throwing UK",
      "group activity comparison UK",
      "rage room or axe throwing",
    ],
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: "Rage Room vs Axe Throwing", url: PATH },
  ])

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://www.rageroomdirectory.co.uk${PATH}#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
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
            { label: "Rage Room vs Axe Throwing" },
          ]}
        />

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Rage Room vs Axe Throwing: Which Should You Pick?
          </h1>

          <GuideMeta
            updated="May 2026"
            readingTimeMinutes={7}
            keyTakeaways={[
              "Rage rooms require no skill and suit large mixed-ability groups; axe throwing has a competitive element.",
              "Axe throwing is typically cheaper per person; rage rooms include more comprehensive PPE.",
              "For stress relief, rage rooms win on physical intensity and catharsis.",
              "For date nights and competitive groups, axe throwing is often the better pick.",
              "Both have good safety records at reputable UK venues.",
            ]}
          />

          <p className="text-base sm:text-lg text-zinc-300 mb-4 leading-relaxed">
            Both rage rooms and axe throwing are &ldquo;controlled destruction&rdquo; activities that have exploded in popularity across UK cities in the past five years. They&apos;re both fun, physical, and make genuinely memorable group experiences. But they&apos;re not interchangeable — the right choice depends on your group, the occasion, and what you want to get out of it.
          </p>
          <p className="text-base sm:text-lg text-zinc-300 mb-8 leading-relaxed">
            This guide breaks down both options across every important dimension — so you can make the right call.
          </p>


          <section aria-labelledby="comparison-table-heading" className="mb-10">
            <h2 id="comparison-table-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Head-to-head comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#181818] border-b border-zinc-700">
                    <th className="text-left p-3 text-zinc-400 font-semibold">Factor</th>
                    <th className="text-left p-3 text-orange-500 font-semibold">Rage Room</th>
                    <th className="text-left p-3 text-zinc-400 font-semibold">Axe Throwing</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.factor} className="border-b border-zinc-800 bg-[#111111]">
                      <td className="p-3 text-zinc-300 font-medium">{row.factor}</td>
                      <td
                        className="p-3 text-zinc-200"
                        dangerouslySetInnerHTML={{ __html: row.rageRoom }}
                      />
                      <td className="p-3 text-zinc-300">{row.axeThrowing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="scenarios-heading" className="mb-10">
            <h2 id="scenarios-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Which wins for specific occasions?
            </h2>
            <div className="space-y-4">
              {VERDICT_SCENARIOS.map((s) => (
                <div
                  key={s.scenario}
                  className="bg-[#181818] border border-zinc-800 rounded-lg p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-white font-semibold">{s.scenario}</h3>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded flex-shrink-0 ${
                        s.winner === "rage"
                          ? "bg-orange-500/20 text-orange-400"
                          : s.winner === "axe"
                          ? "bg-zinc-700 text-zinc-300"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {s.winner === "rage"
                        ? "Rage Room"
                        : s.winner === "axe"
                        ? "Axe Throwing"
                        : "Either"}
                    </span>
                  </div>
                  <p
                    className="text-zinc-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: s.why }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="do-both-heading" className="mb-10">
            <h2 id="do-both-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Why not do both?
            </h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Several UK operators now offer both activities — either at the same venue or as a combination booking. A popular format for larger groups and corporate days is:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-zinc-300 ml-2">
              <li>Axe throwing first (skill-based, competitive, a natural icebreaker)</li>
              <li>Rage room second (physical release, no skill pressure, ends on a high-energy note)</li>
              <li>Food or drinks afterwards</li>
            </ol>
            <p className="text-zinc-300 mt-4 leading-relaxed">
              This format works particularly well for groups of 8–16 where you want two distinct activity peaks and maximum variety within a half-day.
            </p>
          </section>

          <section aria-labelledby="related-comparison-heading" className="mb-10">
            <h2 id="related-comparison-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Related guides
            </h2>
            <ul className="space-y-2 text-zinc-300">
              <li>
                <Link href="/rage-room-vs-escape-room" className="text-orange-500 hover:text-orange-400 underline">
                  Rage room vs escape room
                </Link>
              </li>
              <li>
                <Link href="/guides/rage-rooms-for-stress-relief" className="text-orange-500 hover:text-orange-400 underline">
                  Do rage rooms relieve stress?
                </Link>
              </li>
              <li>
                <Link href="/guides/best-rage-rooms-for-team-building" className="text-orange-500 hover:text-orange-400 underline">
                  Rage rooms for team building
                </Link>
              </li>
              <li>
                <Link href="/guides/rage-rooms-for-birthdays-uk" className="text-orange-500 hover:text-orange-400 underline">
                  Rage rooms for birthday parties
                </Link>
              </li>
              <li>
                <Link href="/guides/how-much-do-rage-rooms-cost-uk" className="text-orange-500 hover:text-orange-400 underline">
                  How much do rage rooms cost in the UK?
                </Link>
              </li>
            </ul>
          </section>

          <FAQ items={FAQS.map((f) => ({ question: f.question, answer: f.answer }))} title="Rage room vs axe throwing FAQs" />

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
