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
import { getRageRoomAgeLimitRows } from "@/lib/listing-comparisons"

const PATH = "/guides/rage-room-age-limits-uk"
const OG_IMAGE = buildOgImageUrl({
  title: "UK Rage Room Age Limits",
  subtitle: "16 vs 18 — published minimum ages by venue",
  badge: "Safety",
})

export const metadata: Metadata = {
  title: "Rage Room Age Limits UK | 16 vs 18 by Venue (2026)",
  description:
    "Published minimum ages for verified UK rage rooms. See which smash rooms accept under-18s, which are 18+, and which still need a direct check.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Rage Room Age Limits UK | 16 vs 18 by Venue",
    description:
      "Compare published smash-room minimum ages across verified UK listings.",
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "UK rage room age limits" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rage Room Age Limits UK",
    description: "Published 16+ and 18+ rules from verified smash rooms.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 3600

export default async function RageRoomAgeLimitsUkPage() {
  const { getAllListingsForAdmin } = await import("@/lib/listings")
  const { known, unknown } = getRageRoomAgeLimitRows(await getAllListingsForAdmin())
  const adultOnly = known.filter((row) => (row.ageMin ?? 0) >= 18).length
  const under18 = known.filter((row) => (row.ageMin ?? 18) < 18).length
  const dateLabel = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: "Rage Room Age Limits UK",
    description:
      "Published minimum ages for verified UK rage rooms, including venues that accept under-18s.",
    datePublished: "2026-08-22",
    dateModified: "2026-08-22",
    keywords: [
      "rage room age limit UK",
      "are rage rooms 18+",
      "rage room 16th birthday",
      "smash room kids",
    ],
  })
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: "Rage Room Age Limits UK", url: PATH },
  ])

  const faqs = [
    {
      question: "Are UK rage rooms 18+?",
      answer: `Not all of them. In our current verified data, ${adultOnly} smash rooms publish a minimum age of 18 or over, while ${under18} publish a lower age. Package-level rules can still be stricter than the venue minimum, so confirm every participant before booking.`,
    },
    {
      question: "Can you take a 16-year-old to a rage room?",
      answer:
        "Only where the venue's published minimum age is 16 or below and the specific package allows it. Many rooms that accept 16–17 year olds still require an accompanying adult and a signed waiver.",
    },
    {
      question: "Why do some venues say “check venue”?",
      answer: `${unknown.length} verified smash rooms in this directory do not yet have a confirmed minimum age on file. Treat those as unknown rather than 18+, and ask the operator before travelling.`,
    },
  ]

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
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: "Rage Room Age Limits UK" },
          ]}
        />

        <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
          Rage Room Age Limits in the UK
        </h1>
        <GuideMeta
          updated={dateLabel}
          readingTimeMinutes={5}
          keyTakeaways={[
            `${known.length} verified smash rooms publish a minimum age in our data.`,
            `${under18} of those currently list a minimum under 18.`,
            `${unknown.length} listings still need a direct age check with the venue.`,
            "A venue minimum is not always the package minimum — confirm every participant.",
          ]}
        />

        <div className="mb-8 space-y-4 text-base text-zinc-300 sm:text-lg">
          <p>
            Parents, 16th and 18th birthday planners, and hen groups often
            search this before they look at price. The table below is generated
            from verified RageRoom Directory listings, not from a generic “18+
            everywhere” assumption.
          </p>
          <p>
            Also read the{" "}
            <Link
              href="/guides/are-rage-rooms-safe-uk"
              className="text-orange-500 underline hover:text-orange-400"
            >
              UK safety guide
            </Link>{" "}
            and compare{" "}
            <Link
              href="/guides/cheapest-rage-rooms-uk"
              className="text-orange-500 underline hover:text-orange-400"
            >
              starting prices
            </Link>
            .
          </p>
        </div>

        <InArticleAd />

        <AgeTable heading="Published minimum ages" rows={[...known, ...unknown]} />

        <FAQ items={faqs} title="Rage room age-limit FAQs" />

        <div className="mt-10 text-center">
          <Link
            href="/occasions/kids-families"
            className="inline-block rounded-md bg-orange-500 px-8 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Browse family-tagged venues
          </Link>
        </div>
      </div>
    </div>
  )
}

function AgeTable({
  heading,
  rows,
}: {
  heading: string
  rows: ReturnType<typeof getRageRoomAgeLimitRows>["known"]
}) {
  return (
    <section className="mb-10" aria-labelledby="age-table">
      <h2 id="age-table" className="mb-3 text-2xl font-bold text-white">
        {heading}
      </h2>
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-zinc-900 text-zinc-300">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Venue</th>
              <th scope="col" className="px-4 py-3 font-semibold">City</th>
              <th scope="col" className="px-4 py-3 font-semibold">Minimum age</th>
              <th scope="col" className="px-4 py-3 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 bg-[#181818]">
            {rows.map((row) => (
              <tr key={row.listing.id}>
                <th scope="row" className="px-4 py-3 font-semibold text-white">
                  {row.listing.name}
                </th>
                <td className="px-4 py-3 text-zinc-300">{row.listing.city}</td>
                <td className="px-4 py-3 text-white">{row.ageLabel}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/listing/${row.listing.slug || row.listing.id}`}
                    className="font-semibold text-orange-500 underline hover:text-orange-400"
                  >
                    View venue
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
