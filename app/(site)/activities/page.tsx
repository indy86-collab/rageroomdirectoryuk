import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Breadcrumbs from "@/components/Breadcrumbs"
import TrackedDiscoveryLink from "@/components/TrackedDiscoveryLink"
import {
  ACTIVITY_DEFINITIONS,
  MIN_ACTIVITY_PAGE_LISTINGS,
} from "@/lib/discovery"
import { getAllListingsForAdmin } from "@/lib/listings"
import { buildBreadcrumbSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "Rage Rooms & Destructive Activities Across the UK",
  description:
    "Find UK rage rooms and venues that also offer axe throwing, paint splatter, escape rooms, VR and other complementary experiences.",
  alternates: { canonical: "/activities" },
}

export const revalidate = 3600

export default async function ActivitiesPage() {
  const listings = await getAllListingsForAdmin()
  const activities = ACTIVITY_DEFINITIONS.map((activity) => ({
    ...activity,
    count: listings.filter((listing) => listing.activities.includes(activity.value)).length,
  }))
    .filter((activity) => activity.count >= MIN_ACTIVITY_PAGE_LISTINGS)
    .sort((a, b) => {
      if (a.value === "rage-room") return -1
      if (b.value === "rage-room") return 1
      return b.count - a.count
    })
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Activities", url: "/activities" },
  ])

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Activities" }]} />
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-rage-500">
            Rage rooms first
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-wide text-white sm:text-5xl">
            Choose Your Experience
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-300">
            Start with the UK&apos;s verified rage-room inventory, then narrow it to venues offering
            axe throwing, paint splatter, escape rooms, VR and target activities alongside the
            main smash experience.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => {
            return (
              <TrackedDiscoveryLink
                key={activity.value}
                eventName="activity_discovery_click"
                sourcePageType="activity"
                destinationIdentifier={activity.slug}
                destinationPath={`/activities/${activity.slug}`}
                className="group"
              >
              <div className="flex h-full flex-col rounded-lg border border-zinc-800 bg-[#181818] p-5 transition-colors group-hover:border-rage-500/60">
                <div className="text-3xl" aria-hidden="true">{activity.emoji}</div>
                <h2 className="mt-4 text-xl font-bold text-white">{activity.label}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                  {activity.description}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4 text-sm">
                  <span className="font-semibold text-zinc-300">
                    {activity.count} {activity.count === 1 ? "venue" : "venues"}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-rage-500">
                    {activity.value === "rage-room" ? "Find rage rooms" : `Find ${activity.shortLabel}`}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
              </TrackedDiscoveryLink>
            )
          })}
        </div>
        <div className="mt-8 rounded-lg border border-zinc-800 bg-dark-900/60 p-5 text-sm text-zinc-400">
          <p>
            Activity categories with only one verified venue stay unpublished until there is
            enough real choice to compare. You can still find every verified rage room in the{" "}
            <Link href="/listings" className="font-semibold text-rage-400 hover:text-rage-300">full directory</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
