import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import FAQ from "@/components/FAQ"
import GuideMeta from "@/components/GuideMeta"
import ListingsGrid from "@/components/ListingsGrid"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildOgImageUrl,
} from "@/lib/seo-schema"
import { getByoRageRoomListings } from "@/lib/listing-comparisons"

const PATH = "/guides/can-you-smash-your-own-stuff-uk"
const OG_IMAGE = buildOgImageUrl({
  title: "Smash your own stuff?",
  subtitle: "UK BYO rage-room rules",
  badge: "First visit",
})

export const metadata: Metadata = {
  title: "Can You Smash Your Own Stuff in a UK Rage Room? BYO Rules (2026)",
  description:
    "Which UK rage rooms let you bring your own smashables, what is usually banned, and how to ask before you travel.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Can You Smash Your Own Stuff in a UK Rage Room?",
    description:
      "BYO smashable rules from verified UK rage rooms — what is allowed and what to confirm first.",
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "UK rage room BYO rules" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Rage Room BYO Rules",
    description: "Can you bring your own items to smash? Check verified venues.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 3600

export default async function CanYouSmashYourOwnStuffPage() {
  const { getAllListingsForAdmin } = await import("@/lib/listings")
  const byo = getByoRageRoomListings(await getAllListingsForAdmin())

  const articleSchema = buildArticleSchema({
    url: PATH,
    headline: "Can You Smash Your Own Stuff in a UK Rage Room?",
    description:
      "Bring-your-own smashable rules at verified UK rage rooms.",
    datePublished: "2026-08-22",
    dateModified: "2026-08-22",
    keywords: [
      "rage room bring your own",
      "BYO smash room UK",
      "smash your own stuff",
      "rage room own items",
    ],
  })
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: "Smash your own stuff?", url: PATH },
  ])

  const faqs = [
    {
      question: "Can you bring your own things to smash in a rage room?",
      answer: byo.length
        ? `${byo.length} verified smash rooms in this directory currently list a bring-your-own option. Most UK venues still supply their own breakables and only accept extra items if you ask first.`
        : "Most UK venues supply their own breakables. A BYO option is venue-specific and should be confirmed in writing before you travel.",
    },
    {
      question: "What items are usually banned?",
      answer:
        "Electronics with remaining batteries, gas canisters, pressurised containers, large furniture, glass sheets, and anything containing fluids or food waste are commonly refused. Venues also reject items that create extra disposal cost or safety risk.",
    },
    {
      question: "Do BYO items cost extra?",
      answer:
        "Often yes. Some rooms include a small crate of extras in a premium package; others charge per item. Confirm the fee, quantity cap and drop-off time when you book.",
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
            { label: "Smash your own stuff?" },
          ]}
        />

        <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
          Can You Smash Your Own Stuff in a UK Rage Room?
        </h1>
        <GuideMeta
          updated="22 August 2026"
          readingTimeMinutes={4}
          keyTakeaways={[
            "BYO is not standard — most rooms supply their own smashables.",
            `${byo.length} verified listing${byo.length === 1 ? "" : "s"} currently flag a bring-your-own option.`,
            "Ask before packing items. Batteries, gas and fluids are commonly banned.",
            "Confirm any extra fee and how many items you can add.",
          ]}
        />

        <div className="mb-8 space-y-4 text-base text-zinc-300 sm:text-lg">
          <p>
            Searchers asking this usually have a specific object in mind: an
            old printer, a set of plates, or a photo they want to destroy
            during a hen or leaving-do. UK venues treat that as a waste and
            insurance question, not a default part of the ticket.
          </p>
          <p>
            If a listing does not mention BYO, assume you cannot bring items
            until the operator says otherwise. Use the{" "}
            <Link
              href="/guides/what-happens-in-a-rage-room"
              className="text-orange-500 underline hover:text-orange-400"
            >
              first-visit walkthrough
            </Link>{" "}
            for the rest of the session format.
          </p>
        </div>

        {byo.length > 0 && (
          <section className="mb-10" aria-labelledby="byo-venues">
            <h2 id="byo-venues" className="mb-3 text-2xl font-bold text-white">
              Venues that currently list a BYO option
            </h2>
            <p className="mb-5 text-zinc-400">
              These listings carry the verified bring-your-own feature. Rules
              still change — confirm what you can add when you book.
            </p>
            <ListingsGrid listings={byo} />
          </section>
        )}

        <FAQ items={faqs} title="BYO rage room FAQs" />
      </div>
    </div>
  )
}
