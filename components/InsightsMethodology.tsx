import Link from "next/link"
import { formatInsightDate, type InsightsStats } from "@/lib/insights-stats"

export default function InsightsMethodology({ stats }: { stats: InsightsStats }) {
  const dateLabel = formatInsightDate(stats.lastUpdated)

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-2xl font-bold text-white">Methodology</h2>
      <p className="mb-4 text-sm font-semibold text-zinc-300">Last updated: {dateLabel}</p>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-300">
        <li>
          Statistics are calculated from {stats.verifiedListings} verified venues in the
          RageRoom Directory dataset. Unverified records are excluded.
        </li>
        <li>
          A venue is a listed operator with a published UK location or service area.
          Overall totals include both fixed venues and mobile operators.
        </li>
        <li>
          City rankings use the venue&apos;s recorded city field and fixed-location venues
          only. Directory location pages may include nearby or canonical region matches
          and can therefore show a different total. Mobile operators are excluded from
          city and region rankings.
        </li>
        <li>
          Blank city or region values are omitted from those rankings rather than treated
          as zero. Region names follow the directory&apos;s venue data and may not match
          official statistical regions.
        </li>
        <li>
          Activities can overlap. A venue offering a rage room and axe throwing is
          counted in both categories, so activity totals may exceed unique venue
          totals.
        </li>
        <li>
          Pricing formats vary. Per-person, per-room and per-group starting prices are
          never averaged together. A missing price is not treated as £0. Ranges and
          averages are published only when at least five comparable prices share the
          same unit.
        </li>
        <li>
          Occasion labels such as birthdays or corporate groups are included only when
          the directory has evidence-backed occasion data for that venue.
        </li>
        <li>
          Figures change as venues are added, updated or removed. Check the date above
          and the live{" "}
          <Link href="/listings" className="font-semibold text-orange-500 hover:text-orange-400">
            directory listings
          </Link>{" "}
          before publishing a story.
        </li>
        <li>
          The flagship annual publication is the{" "}
          <Link href="/uk-rage-room-report-2026" className="font-semibold text-orange-500 hover:text-orange-400">
            UK Rage Room Report 2026
          </Link>
          , which uses the same methodology and links to the aggregate dataset.
        </li>
      </ul>
    </section>
  )
}
