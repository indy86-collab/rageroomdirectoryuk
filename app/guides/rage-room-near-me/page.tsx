import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import GuideMeta from "@/components/GuideMeta"
import AdsenseInContent from "@/components/ads/AdsenseInContent"
import DigitalDownloadCTA from "@/components/DigitalDownloadCTA"
import FAQ from "@/components/FAQ"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOgImageUrl,
} from "@/lib/seo-schema"

const PATH = "/guides/rage-room-near-me"

const OG_IMAGE = buildOgImageUrl({
  title: "Find a Rage Room Near Me",
  subtitle: "UK city guide · Compare venues & book online",
  badge: "Near Me",
})

export const metadata: Metadata = {
  title: "Rage Room Near Me | Find UK Venues by City (2026)",
  description:
    "Looking for a rage room near you? Browse verified UK rage rooms by city — London, Manchester, Birmingham, Leeds and more. Compare prices, read reviews and book online.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Rage Room Near Me | Find UK Venues by City",
    description:
      "Find verified rage rooms near you across the UK. Compare prices, read reviews and book a smash session online.",
    type: "article",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Rage room near me — UK venue finder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rage Room Near Me | UK Venue Finder",
    description: "Find a rage room near you in the UK — compare prices and book online.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

const CITY_LINKS: { city: string; slug: string; description: string }[] = [
  { city: "London", slug: "london", description: "The UK's largest rage room scene with venues across zones 1–3." },
  { city: "Manchester", slug: "manchester", description: "Strong Northern Quarter scene, great group packages." },
  { city: "Birmingham", slug: "birmingham", description: "Midlands hub with competitive pricing and central venues." },
  { city: "Leeds", slug: "leeds", description: "West Yorkshire options, popular with students and young professionals." },
  { city: "Liverpool", slug: "liverpool", description: "Baltic Triangle and Merseyside venues, party-group friendly." },
  { city: "Newcastle", slug: "newcastle", description: "North East's best for stag and hen groups." },
  { city: "Sheffield", slug: "sheffield", description: "Affordable South Yorkshire rage rooms with group-first pricing." },
  { city: "Nottingham", slug: "nottingham", description: "East Midlands options popular with weekend party groups." },
  { city: "Bristol", slug: "bristol", description: "Independent venues with character, strong in the South West." },
  { city: "Edinburgh", slug: "edinburgh", description: "Scottish capital options for city breaks and corporate groups." },
]

const FAQS = [
  {
    question: "How do I find a rage room near me in the UK?",
    answer:
      "Use our interactive near-me map at rageroomdirectory.co.uk/near-me, or browse by city using the links on this page. You can filter by location, group size, and price range to find venues within travelling distance.",
  },
  {
    question: "How far should I expect to travel to a rage room in the UK?",
    answer:
      "If you live in or near a major UK city, you're likely within 30 minutes of at least one venue. Rural areas may require 45–90 minutes of travel. London, Manchester, Birmingham and Leeds have the densest coverage.",
  },
  {
    question: "What is the closest rage room to me?",
    answer:
      "Use the near-me map to find the closest verified venue to your current location. Our directory covers 40+ UK towns and cities, from Margate to Edinburgh.",
  },
  {
    question: "Are rage rooms available in smaller UK towns?",
    answer:
      "Yes — venues exist in smaller towns including Colchester, Maidstone, Northampton, Chesterfield, and Weston-super-Mare, among others. The directory is growing, so check back if your town isn't listed yet.",
  },
  {
    question: "Do I need to book a rage room in advance?",
    answer:
      "Yes. Walk-in availability is rare. Book at least a week ahead for weekday slots, and 3–4 weeks ahead for weekend sessions, particularly in London and Manchester where demand is highest.",
  },
  {
    question: "Can I travel to a rage room on public transport?",
    answer:
      "Many UK rage rooms are in urban areas well served by bus, tram or tube. Check the venue's individual listing for transport notes. London venues are generally tube-accessible; Manchester, Birmingham and Leeds venues are often within walking distance of city centre rail stations.",
  },
  {
    question: "What should I look for when comparing nearby rage rooms?",
    answer:
      "Key factors: session length and price per person, minimum group size, age restrictions, included breakables vs add-ons, PPE provided, parking or public transport access, and review scores. Our listings show all of these side by side.",
  },
]

export default function RageRoomNearMePage() {
  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: "Rage Room Near Me: Find UK Venues by City",
    description:
      "Complete guide to finding a rage room near you in the UK — browse by city, compare prices and book online.",
    datePublished: "2026-05-01",
    keywords: [
      "rage room near me",
      "smash room near me",
      "rage room UK",
      "find rage room",
      "rage room nearby",
      "break room near me",
    ],
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: "Rage Room Near Me", url: PATH },
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
            { label: "Rage Room Near Me" },
          ]}
        />

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Rage Room Near Me: Find a UK Venue
          </h1>

          <GuideMeta
            updated="May 2026"
            readingTimeMinutes={6}
            keyTakeaways={[
              "Browse UK rage rooms by city — 40+ towns and cities in our directory.",
              "London, Manchester and Birmingham have the most venues; rural areas may require 45–90 minutes travel.",
              "Book at least 1 week ahead for weekday slots; 3–4 weeks for weekend sessions in busy cities.",
              "Use our near-me map to find the closest verified venue to your current location.",
              "Most rage rooms accept groups of 2–12; solo bookings available at many venues.",
            ]}
          />

          <p className="text-xl text-white font-semibold mb-4 leading-relaxed">
            To find a rage room near you in the UK, use our interactive map at /near-me or browse by city below — we list 40+ verified venues across London, Birmingham, Manchester, Liverpool, Edinburgh, Brighton and smaller towns. Most major-city residents are within 30 minutes of a venue; rural areas may need 45–90 minutes travel.
          </p>
          <p className="text-base sm:text-lg text-zinc-300 mb-8 leading-relaxed">
            This guide links to every city page with pricing, travel tips and direct booking links.
          </p>

          <AdsenseInContent />

          <section aria-labelledby="map-heading" className="mb-10">
            <h2 id="map-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Use the near-me map
            </h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              The quickest way to find a rage room near your current location is our interactive map. It shows all verified UK venues, colour-coded by city, with distance, price and group size filters.
            </p>
            <Link
              href="/near-me"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors"
            >
              Open the near-me map →
            </Link>
          </section>

          <section aria-labelledby="cities-heading" className="mb-10">
            <h2 id="cities-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Browse by city
            </h2>
            <p className="text-zinc-300 mb-6 leading-relaxed">
              Select your nearest city to see all verified venues, compare prices, and read reviews.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {CITY_LINKS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/city/${c.slug}`}
                  className="block bg-[#181818] border border-zinc-800 hover:border-orange-500 rounded-lg p-4 transition-colors"
                >
                  <span className="font-semibold text-white">Rage rooms in {c.city}</span>
                  <p className="text-zinc-400 text-sm mt-1">{c.description}</p>
                </Link>
              ))}
            </div>
            <p className="text-zinc-400 text-sm mt-4">
              Don&apos;t see your city?{" "}
              <Link href="/listings" className="text-orange-500 hover:text-orange-400 underline">
                Browse the full UK directory
              </Link>
              {" "}— we list venues in 40+ towns and cities.
            </p>
          </section>

          <section aria-labelledby="what-to-expect-heading" className="mb-10">
            <h2 id="what-to-expect-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              What to expect when you arrive
            </h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              First time visiting a rage room? Here&apos;s a quick overview of how a session works:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-zinc-300 ml-2">
              <li>
                <strong className="text-white">Check in and sign your waiver</strong> — all venues require a liability waiver before entry. Bring ID if you look under 25.
              </li>
              <li>
                <strong className="text-white">Safety briefing</strong> — staff will walk you through rules, tool handling and the emergency stop procedure. Takes around 10–15 minutes.
              </li>
              <li>
                <strong className="text-white">Get kitted up in PPE</strong> — coveralls, full-face visor helmet, gloves and boots. Non-negotiable at every reputable UK venue.
              </li>
              <li>
                <strong className="text-white">Enter the smash room</strong> — your timer starts once you&apos;re inside. Most sessions are 15–60 minutes.
              </li>
              <li>
                <strong className="text-white">Smash away</strong> — use sledgehammers, bats, crowbars and golf clubs on glass, crockery, electronics and more.
              </li>
              <li>
                <strong className="text-white">Clean up and leave</strong> — staff manage the room cleanup; you hand back PPE and head out.
              </li>
            </ol>
            <p className="text-zinc-400 text-sm mt-4">
              See our full step-by-step walkthrough in the{" "}
              <Link href="/guides/what-happens-in-a-rage-room" className="text-orange-500 hover:text-orange-400 underline">
                what happens in a rage room guide
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="tips-heading" className="mb-10">
            <h2 id="tips-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Tips for finding the right venue near you
            </h2>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold mt-0.5">1.</span>
                <span><strong className="text-white">Check opening hours carefully.</strong> Many UK rage rooms only open Thursday–Sunday. A venue &quot;near me&quot; is useless if it&apos;s closed when you want to visit.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold mt-0.5">2.</span>
                <span><strong className="text-white">Confirm group size minimums.</strong> Some venues require a minimum of 2 people; solo slots are sometimes available at off-peak times only.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold mt-0.5">3.</span>
                <span><strong className="text-white">Compare what&apos;s included.</strong> Base prices often cover only a small selection of breakables; check whether extra items cost more and whether PPE is always included.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold mt-0.5">4.</span>
                <span><strong className="text-white">Look at parking and transport.</strong> If driving, check for free or paid parking nearby. If using public transport, city-centre venues are generally easiest.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold mt-0.5">5.</span>
                <span><strong className="text-white">Read recent reviews.</strong> A venue&apos;s safety record, cleanliness and staff friendliness matter more than their marketing copy. Check Google and Trustpilot before booking.</span>
              </li>
            </ul>
          </section>

          <div className="mb-10">
            <DigitalDownloadCTA variant="firstVisit" />
          </div>

          <section aria-labelledby="related-guides-heading" className="mb-10">
            <h2 id="related-guides-heading" className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Related guides
            </h2>
            <ul className="space-y-2 text-zinc-300">
              <li>
                <Link href="/guides/what-happens-in-a-rage-room" className="text-orange-500 hover:text-orange-400 underline">
                  What happens in a rage room?
                </Link>
              </li>
              <li>
                <Link href="/guides/how-much-do-rage-rooms-cost-uk" className="text-orange-500 hover:text-orange-400 underline">
                  How much do rage rooms cost in the UK?
                </Link>
              </li>
              <li>
                <Link href="/guides/are-rage-rooms-safe-uk" className="text-orange-500 hover:text-orange-400 underline">
                  Are rage rooms safe?
                </Link>
              </li>
              <li>
                <Link href="/guides/what-to-wear-to-a-rage-room" className="text-orange-500 hover:text-orange-400 underline">
                  What to wear to a rage room
                </Link>
              </li>
              <li>
                <Link href="/guides/rage-rooms-for-stress-relief" className="text-orange-500 hover:text-orange-400 underline">
                  Do rage rooms relieve stress?
                </Link>
              </li>
            </ul>
          </section>

          <FAQ items={FAQS.map((f) => ({ question: f.question, answer: f.answer }))} title="Near-me FAQs" />

          <div className="mt-10 text-center">
            <Link
              href="/listings"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Browse All UK Rage Rooms
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
