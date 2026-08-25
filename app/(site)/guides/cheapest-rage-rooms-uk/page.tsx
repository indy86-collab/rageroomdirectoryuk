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
import { getCheapestRageRoomRows } from "@/lib/listing-comparisons"

const PATH = "/guides/cheapest-rage-rooms-uk"
const OG_IMAGE = buildOgImageUrl({
  title: "Cheapest Rage Rooms UK",
  subtitle: "Live starting prices by published unit",
  badge: "Prices",
})

export const metadata: Metadata = {
  title: "Cheapest Rage Rooms UK | Live Starting Prices (2026)",
  description:
    "Lowest published UK rage room starting prices from verified listings. Per-person rates are ranked separately from per-room and per-group quotes.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Cheapest Rage Rooms UK | Live Starting Prices",
    description:
      "Compare the lowest published smash-room starting prices in the UK, with per-person and per-room rates kept separate.",
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Cheapest rage rooms UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cheapest Rage Rooms UK",
    description: "Live starting prices from verified UK smash rooms.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 3600

export default async function CheapestRageRoomsUkPage() {
  const { getAllListingsForAdmin } = await import("@/lib/listings")
  const { perPerson, perRoomOrGroup } = getCheapestRageRoomRows(
    await getAllListingsForAdmin()
  )
  const lowest = perPerson[0]
  const dateLabel = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: "Cheapest Rage Rooms UK",
    description:
      "Lowest published starting prices from verified UK rage room listings, ranked by price unit.",
    datePublished: "2026-08-22",
    dateModified: "2026-08-22",
    keywords: [
      "cheapest rage room UK",
      "cheap smash room",
      "rage room prices UK",
      "budget rage room",
    ],
  })
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: "Cheapest Rage Rooms UK", url: PATH },
  ])

  const faqs = [
    {
      question: "What is the cheapest rage room in the UK?",
      answer: lowest
        ? `In our current verified data, the lowest published per-person starting price is ${lowest.formattedPrice} at ${lowest.listing.name} in ${lowest.listing.city}. That figure is a starting rate, not a guaranteed quote.`
        : "We do not currently have enough comparable per-person prices to name a cheapest venue.",
    },
    {
      question: "Why are per-room prices listed separately?",
      answer:
        "A £30 per-person ticket is not the same as a £30 per-room hire. Mixing those units would make a couples room look cheaper than it is. This page ranks each unit on its own table.",
    },
    {
      question: "Does a low starting price include everything?",
      answer:
        "Usually not. Session length, number of breakables, electronics, BYO items and peak-time slots can change the total. Confirm the live package on the venue's own booking page.",
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
            { label: "Cheapest Rage Rooms UK" },
          ]}
        />

        <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
          Cheapest Rage Rooms in the UK
        </h1>
        <GuideMeta
          updated={dateLabel}
          readingTimeMinutes={5}
          keyTakeaways={[
            lowest
              ? `Lowest published per-person starting price in our data: ${lowest.formattedPrice} (${lowest.listing.city}).`
              : "Per-person starting prices are still being verified.",
            `${perPerson.length} verified smash rooms publish a per-person starting price.`,
            "Per-room and per-group rates are listed separately so units are not mixed.",
            "A starting price is not a final quote — confirm the package before travelling.",
          ]}
        />

        <div className="mb-8 space-y-4 text-base text-zinc-300 sm:text-lg">
          <p>
            This ranking uses live RageRoom Directory data for verified smash rooms.
            Per-person tickets are sorted from lowest published starting price.
            Room and group hires sit in a second table because they are not
            comparable on a per-head basis.
          </p>
          <p>
            For city-by-city context see the{" "}
            <Link href="/rage-room-prices-uk" className="text-orange-500 underline hover:text-orange-400">
              UK prices hub
            </Link>{" "}
            and the{" "}
            <Link href="/guides/rage-room-age-limits-uk" className="text-orange-500 underline hover:text-orange-400">
              age-limit table
            </Link>
            .
          </p>
        </div>

        <InArticleAd />

        <PriceTable
          heading="Lowest per-person starting prices"
          rows={perPerson}
          empty="No comparable per-person smash-room prices are published yet."
        />
        <PriceTable
          heading="Per-room and per-group starting prices"
          rows={perRoomOrGroup}
          empty="No per-room or per-group smash-room prices are published yet."
        />

        <FAQ items={faqs} title="Cheapest rage room FAQs" />

        <div className="mt-10 text-center">
          <Link
            href="/near-me"
            className="inline-block rounded-md bg-orange-500 px-8 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Find a rage room near you
          </Link>
        </div>
      </div>
    </div>
  )
}

function PriceTable({
  heading,
  rows,
  empty,
}: {
  heading: string
  rows: ReturnType<typeof getCheapestRageRoomRows>["perPerson"]
  empty: string
}) {
  return (
    <section className="mb-10" aria-labelledby={heading}>
      <h2 id={heading} className="mb-3 text-2xl font-bold text-white">
        {heading}
      </h2>
      {rows.length === 0 ? (
        <p className="text-zinc-400">{empty}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Venue</th>
                <th scope="col" className="px-4 py-3 font-semibold">City</th>
                <th scope="col" className="px-4 py-3 font-semibold">Published from</th>
                <th scope="col" className="px-4 py-3 font-semibold">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-[#181818]">
              {rows.map((row) => (
                <tr key={row.listing.id}>
                  <th scope="row" className="px-4 py-3 font-semibold text-white">
                    <Link
                      href={`/listing/${row.listing.slug || row.listing.id}`}
                      className="text-orange-500 hover:text-orange-400"
                    >
                      {row.listing.name}
                    </Link>
                  </th>
                  <td className="px-4 py-3 text-zinc-300">{row.listing.city}</td>
                  <td className="px-4 py-3 text-white">{row.formattedPrice}</td>
                  <td className="px-4 py-3 text-zinc-300">
                    {row.listing.ageMin != null ? `${row.listing.ageMin}+` : "Check venue"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
