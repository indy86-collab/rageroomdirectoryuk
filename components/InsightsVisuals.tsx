import CopyStatisticButton from "@/components/CopyStatisticButton"
import TrackedInsightLink from "@/components/TrackedInsightLink"

export function InsightsBarList({
  rows,
  emptyLabel = "Not enough verified data to show this breakdown yet.",
}: {
  rows: Array<{ label: string; count: number; href: string | null }>
  emptyLabel?: string
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-zinc-400">{emptyLabel}</p>
  }

  const maximum = Math.max(1, ...rows.map((row) => row.count))

  return (
    <ul className="space-y-3">
      {rows.map((row) => {
        const width = `${Math.max(6, Math.round((row.count / maximum) * 100))}%`
        const countLabel = `${row.count} ${row.count === 1 ? "venue" : "venues"}`
        const content = (
          <>
            <span className="flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-white">{row.label}</span>
              <span className="shrink-0 text-zinc-400">{countLabel}</span>
            </span>
            <span className="mt-2 block h-2 overflow-hidden rounded-full bg-zinc-800">
              <span
                className="block h-full rounded-full bg-rage-500"
                style={{ width }}
              />
            </span>
          </>
        )

        return (
          <li key={row.label}>
            {row.href ? (
              <TrackedInsightLink href={row.href} className="block rounded-md hover:opacity-90">
                {content}
              </TrackedInsightLink>
            ) : (
              <div>{content}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export function InsightsCountTable({
  rows,
  labelHeading,
  countHeading = "Venues",
  extraHeading = "Detail",
  caption,
}: {
  rows: Array<{ label: string; count: number; href?: string | null; extra?: string }>
  labelHeading: string
  countHeading?: string
  extraHeading?: string
  caption: string
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-zinc-400">{caption}</p>
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full min-w-[320px] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-[#151515] text-zinc-400">
          <tr>
            <th scope="col" className="px-4 py-3">{labelHeading}</th>
            <th scope="col" className="px-4 py-3">{countHeading}</th>
            {rows.some((row) => row.extra) && (
              <th scope="col" className="px-4 py-3">{extraHeading}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-zinc-800">
              <th scope="row" className="px-4 py-3 font-medium text-zinc-200">
                {row.href ? (
                  <TrackedInsightLink href={row.href} className="hover:text-orange-400">
                    {row.label}
                  </TrackedInsightLink>
                ) : (
                  row.label
                )}
              </th>
              <td className="px-4 py-3 font-semibold text-white">{row.count}</td>
              {rows.some((item) => item.extra) && (
                <td className="px-4 py-3 text-zinc-400">{row.extra ?? ""}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function InsightsStatCard({
  label,
  value,
  href,
  statement,
  asOf,
  sourceUrl,
}: {
  label: string
  value: string
  href?: string | null
  statement?: string
  asOf?: string
  sourceUrl?: string
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-[#181818] p-4">
      <p className="text-xs uppercase tracking-wider text-zinc-400">{label}</p>
      {href ? (
        <TrackedInsightLink href={href} className="mt-2 block text-2xl font-black text-white hover:text-orange-400">
          {value}
        </TrackedInsightLink>
      ) : (
        <p className="mt-2 text-2xl font-black text-white">{value}</p>
      )}
      {statement && (
        <div className="mt-3">
          <CopyStatisticButton statement={statement} asOf={asOf} sourceUrl={sourceUrl} />
        </div>
      )}
    </div>
  )
}

export function InsightCitationBlock({
  statement,
  href,
  asOf,
  sourceUrl,
}: {
  statement: string
  href?: string
  asOf?: string
  sourceUrl?: string
}) {
  return (
    <figure className="rounded-lg border border-zinc-800 bg-[#181818] p-4 sm:p-5">
      <blockquote className="text-sm leading-relaxed text-zinc-200 sm:text-base">
        {href ? (
          <TrackedInsightLink href={href} className="hover:text-orange-400">
            {statement}
          </TrackedInsightLink>
        ) : (
          statement
        )}
      </blockquote>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-zinc-500">Source: RageRoom Directory</span>
        <CopyStatisticButton statement={statement} asOf={asOf} sourceUrl={sourceUrl} />
      </figcaption>
    </figure>
  )
}

export function InsightQuestion({
  question,
  children,
  headingLevel = "h2",
}: {
  question: string
  children: React.ReactNode
  headingLevel?: "h2" | "h3"
}) {
  const Heading = headingLevel
  return (
    <section className="mb-10">
      <Heading className="mb-3 text-2xl font-bold text-white">{question}</Heading>
      <div className="text-base leading-relaxed text-zinc-300">{children}</div>
    </section>
  )
}
