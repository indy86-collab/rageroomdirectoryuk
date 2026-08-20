import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Breadcrumbs from "@/components/Breadcrumbs"
import {
  MIN_OCCASION_PAGE_LISTINGS,
  OCCASION_DEFINITIONS,
  matchesOccasionDefinition,
} from "@/lib/discovery"
import { getAllListingsForAdmin } from "@/lib/listings"
import { buildBreadcrumbSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "Rage Rooms for Birthdays, Dates, Groups & Team Building",
  description:
    "Plan a birthday, stag or hen party, team-building event, date night or family rage-room visit with matching UK venues.",
  alternates: { canonical: "/occasions" },
}

export const revalidate = 3600

export default async function OccasionsPage() {
  const listings = await getAllListingsForAdmin()
  const occasions = OCCASION_DEFINITIONS.map((occasion) => ({
    ...occasion,
    count: listings.filter((listing) => matchesOccasionDefinition(listing, occasion)).length,
  }))
    .filter((occasion) => occasion.count >= MIN_OCCASION_PAGE_LISTINGS)
    .sort((a, b) => b.count - a.count)
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Occasions", url: "/occasions" },
  ])

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Occasions" }]} />
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-rage-500">Plan the occasion</p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-wide text-white sm:text-5xl">
            What Are You Planning?
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-300">
            Go straight from inspiration to a shortlist of venues that advertise the right group,
            age and booking options for your occasion.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((occasion) => {
            const content = <div className="group flex h-full flex-col rounded-lg border border-zinc-800 bg-[#181818] p-5 transition-colors hover:border-rage-500/60">
              <div className="text-3xl" aria-hidden="true">{occasion.emoji}</div>
              <h2 className="mt-4 text-xl font-bold text-white">{occasion.label}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{occasion.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4 text-sm">
                <span className="font-semibold text-zinc-300">{occasion.count} {occasion.count === 1 ? "venue" : "venues"}</span>
                <span className="inline-flex items-center gap-1 font-bold text-rage-500">Find venues <ArrowRight className="h-4 w-4" /></span>
              </div>
            </div>
            return <Link key={occasion.slug} href={`/occasions/${occasion.slug}`} className="group">{content}</Link>
          })}
        </div>
      </div>
    </div>
  )
}
