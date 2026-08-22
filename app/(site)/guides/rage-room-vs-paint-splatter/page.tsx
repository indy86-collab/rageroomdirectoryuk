import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import FAQ from "@/components/FAQ"
import GuideMeta from "@/components/GuideMeta"
import InArticleAd from "@/components/InArticleAd"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOgImageUrl,
} from "@/lib/seo-schema"

const PATH = "/guides/rage-room-vs-paint-splatter"

const OG_IMAGE = buildOgImageUrl({
  title: "Rage Room vs Paint Splatter",
  subtitle: "Head-to-head comparison · UK prices, ages & which to pick",
  badge: "Comparison",
})

export const metadata: Metadata = {
  title: "Rage Room vs Paint Splatter UK | Which Should You Pick? (2026)",
  description:
    "Rage room or paint splatter — which is better for your group? Compare UK prices, ages, mess, intensity and which works for hens, birthdays and families.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Rage Room vs Paint Splatter UK | Which Should You Pick?",
    description:
      "Head-to-head: smash rooms vs paint rooms on price, age, physicality, mess and occasions. UK-specific comparison.",
    type: "article",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Rage room vs paint splatter UK comparison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rage Room vs Paint Splatter UK",
    description:
      "Which should you pick? Price, age, mess and occasions compared.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

const COMPARISON_ROWS: { factor: string; rageRoom: string; paint: string }[] = [
  {
    factor: "Typical price (per person)",
    rageRoom: "£25–£65",
    paint: "£20–£43",
  },
  {
    factor: "Session length",
    rageRoom: "15–60 min",
    paint: "30–60 min",
  },
  {
    factor: "Physical intensity",
    rageRoom: "High — full-body swinging",
    paint: "Low to moderate — throwing and flicking",
  },
  {
    factor: "Skill required",
    rageRoom: "None — just smash",
    paint: "None — the mess is the point",
  },
  {
    factor: "Typical minimum age",
    rageRoom: "16+ or 18+",
    paint: "Often 2+ to 8+",
  },
  {
    factor: "Keepsake",
    rageRoom: "Photos or video, if offered",
    paint: "Often a painted canvas to take home",
  },
  {
    factor: "Mess / clothing",
    rageRoom: "Dust and debris; full PPE",
    paint: "Wet paint; coveralls still stain",
  },
  {
    factor: "Best for stress relief",
    rageRoom: "Very high",
    paint: "Moderate — creative release",
  },
  {
    factor: "Noise",
    rageRoom: "Very loud",
    paint: "Loud laughter, not breaking glass",
  },
  {
    factor: "Combo bookings",
    rageRoom: "Some venues add paint after smash",
    paint: "Some studios sit inside multi-activity sites",
  },
]

const VERDICT_SCENARIOS: {
  scenario: string
  winner: "rage" | "paint" | "either"
  why: string
}[] = [
  {
    scenario: "Adult hen or stag group",
    winner: "rage",
    why: "Smash sessions are louder, more physical and easier to sell as a party peak. Paint works as a second activity if the venue offers both.",
  },
  {
    scenario: "Family or mixed-age birthday",
    winner: "paint",
    why: "Many paint studios publish ages well below smash-room rules. A 16+ or 18+ rage room will lock younger guests out of the main event.",
  },
  {
    scenario: "Stress relief after a bad week",
    winner: "rage",
    why: "The permission to break things is more cathartic than throwing paint. Paint is closer to a creative workshop than a physical release.",
  },
  {
    scenario: "Date night that wants a souvenir",
    winner: "paint",
    why: "A shared canvas is a better keepsake than a pile of broken electronics. Choose a private smash room if you want intensity over something to hang on the wall.",
  },
  {
    scenario: "Corporate team social",
    winner: "either",
    why: "Rage rooms suit high-energy away days. Paint is safer for mixed mobility, quieter offices and groups that do not want PPE or loud impact.",
  },
  {
    scenario: "You want both in one visit",
    winner: "either",
    why: "Book a verified smash-and-paint venue rather than two separate sites. Filter the paint hub for Rage Room + Paint.",
  },
]

const FAQS = [
  {
    question: "Is a paint splatter room the same as a rage room?",
    answer:
      "No. A rage room is controlled destruction with PPE and breakable props. A paint or splatter room is a protected studio where you throw, spray or flick paint. Some UK venues offer both.",
  },
  {
    question: "Which is cheaper in the UK?",
    answer:
      "Published paint-studio tickets are often a little cheaper per person than smash rooms, typically £20–£43 versus £25–£65. Room hires and combo packages change the total, so compare the live venue price.",
  },
  {
    question: "Can children do a paint room but not a rage room?",
    answer:
      "Often yes. Several paint listings publish ages from 2+ to 8+, while most smash rooms are 16+ or 18+. Smash-and-paint venues usually follow the smash-room age for the destructive half.",
  },
  {
    question: "What should I wear?",
    answer:
      "For smash rooms: closed-toe shoes and clothes that work under coveralls. For paint rooms: old clothes and shoes you can accept stains on, even when overalls are supplied.",
  },
]

export default function RageRoomVsPaintSplatterPage() {
  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: "Rage Room vs Paint Splatter UK",
    description:
      "UK head-to-head of smash rooms and paint splatter rooms: price, age, intensity, mess and which to pick.",
    datePublished: "2026-08-22",
    dateModified: "2026-08-22",
    keywords: [
      "rage room vs paint splatter",
      "smash room vs paint room",
      "paint throwing UK",
      "splatter room vs rage room",
    ],
  })
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: "Rage Room vs Paint Splatter", url: PATH },
  ])
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
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
            { label: "Rage Room vs Paint Splatter" },
          ]}
        />

        <article>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Rage Room vs Paint Splatter: Which Should You Pick?
          </h1>

          <GuideMeta
            updated="August 2026"
            readingTimeMinutes={7}
            keyTakeaways={[
              "Rage rooms are louder, more physical and usually 16+ or 18+.",
              "Paint studios are cheaper on many tickets and often welcome young children.",
              "Choose smash for stress relief and adult parties; choose paint for families and keepsakes.",
              "A dozen verified UK venues already offer both in one booking.",
            ]}
          />

          <p className="mb-4 text-base leading-relaxed text-zinc-300 sm:text-lg">
            Smash rooms and paint rooms sit next to each other in a lot of
            “things to do” lists, but they are not the same booking. One is
            controlled destruction with hammers and PPE. The other is a
            colourful mess you can sometimes take home on a canvas.
          </p>
          <p className="mb-8 text-base leading-relaxed text-zinc-300 sm:text-lg">
            This guide compares the two using typical UK prices, published ages
            and the occasions people actually search for — then points you at
            the live venue lists.
          </p>

          <section aria-labelledby="comparison-table-heading" className="mb-10">
            <h2
              id="comparison-table-heading"
              className="mb-4 text-2xl font-bold text-white sm:text-3xl"
            >
              Head-to-head comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 bg-[#181818]">
                    <th className="p-3 text-left font-semibold text-zinc-400">Factor</th>
                    <th className="p-3 text-left font-semibold text-orange-500">Rage Room</th>
                    <th className="p-3 text-left font-semibold text-zinc-400">Paint Splatter</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.factor} className="border-b border-zinc-800 bg-[#111111]">
                      <td className="p-3 font-medium text-zinc-300">{row.factor}</td>
                      <td className="p-3 text-zinc-200">{row.rageRoom}</td>
                      <td className="p-3 text-zinc-300">{row.paint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <InArticleAd />

          <section aria-labelledby="scenarios-heading" className="mb-10">
            <h2
              id="scenarios-heading"
              className="mb-4 text-2xl font-bold text-white sm:text-3xl"
            >
              Which wins for specific occasions?
            </h2>
            <div className="space-y-4">
              {VERDICT_SCENARIOS.map((s) => (
                <div
                  key={s.scenario}
                  className="rounded-lg border border-zinc-800 bg-[#181818] p-5"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-white">{s.scenario}</h3>
                    <span
                      className={`flex-shrink-0 rounded px-2 py-1 text-xs font-bold uppercase tracking-wider ${
                        s.winner === "rage"
                          ? "bg-orange-500/20 text-orange-400"
                          : s.winner === "paint"
                            ? "bg-zinc-700 text-zinc-300"
                            : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {s.winner === "rage"
                        ? "Rage Room"
                        : s.winner === "paint"
                          ? "Paint"
                          : "Either"}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-300">{s.why}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="do-both-heading" className="mb-10">
            <h2
              id="do-both-heading"
              className="mb-4 text-2xl font-bold text-white sm:text-3xl"
            >
              Smash and paint in one visit
            </h2>
            <p className="mb-4 leading-relaxed text-zinc-300">
              Several verified UK operators already run both activities. The
              usual order is smash first, then paint — you leave the high-impact
              session before you pick up a canvas. That only works if every
              guest clears the smash-room age rule.
            </p>
            <p className="leading-relaxed text-zinc-300">
              Browse the live combination list on the{" "}
              <Link
                href="/activities/paint-splatter"
                className="text-orange-500 underline hover:text-orange-400"
              >
                UK paint &amp; splatter hub
              </Link>
              , or start from{" "}
              <Link
                href="/activities/paint-splatter/london"
                className="text-orange-500 underline hover:text-orange-400"
              >
                paint rooms in London
              </Link>{" "}
              if you need a city shortlist.
            </p>
          </section>

          <section aria-labelledby="related-comparison-heading" className="mb-10">
            <h2
              id="related-comparison-heading"
              className="mb-4 text-2xl font-bold text-white sm:text-3xl"
            >
              Related guides
            </h2>
            <ul className="space-y-2 text-zinc-300">
              <li>
                <Link
                  href="/guides/rage-room-vs-axe-throwing"
                  className="text-orange-500 underline hover:text-orange-400"
                >
                  Rage room vs axe throwing
                </Link>
              </li>
              <li>
                <Link
                  href="/rage-room-vs-escape-room"
                  className="text-orange-500 underline hover:text-orange-400"
                >
                  Rage room vs escape room
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/rage-rooms-for-hen-parties-uk"
                  className="text-orange-500 underline hover:text-orange-400"
                >
                  Rage rooms for hen parties
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/rage-rooms-for-birthdays-uk"
                  className="text-orange-500 underline hover:text-orange-400"
                >
                  Rage rooms for birthdays
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/rage-room-age-limits-uk"
                  className="text-orange-500 underline hover:text-orange-400"
                >
                  UK rage room age limits
                </Link>
              </li>
            </ul>
          </section>

          <FAQ
            items={FAQS.map((f) => ({ question: f.question, answer: f.answer }))}
            title="Rage room vs paint splatter FAQs"
          />

          <div className="mt-10 text-center">
            <Link
              href="/activities/paint-splatter"
              className="inline-block rounded-md bg-orange-500 px-8 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Browse UK paint rooms
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
