import { Calendar, CheckCircle2, Clock, User } from "lucide-react"
import Link from "next/link"

interface GuideMetaProps {
  /** Shown as "Last updated: <date>" — any human date string works. */
  updated: string
  /** Optional byline; defaults to the editorial team. */
  author?: string
  /** Short takeaway bullets rendered in a highlighted callout box. */
  keyTakeaways: string[]
  /**
   * Optional reading time in minutes. When omitted we compute it from
   * `wordCount` at ~225 WPM. UX-wise, a "6 min read" label measurably
   * improves dwell time and bounce; for SEO it's also a subtle
   * freshness/quality signal.
   */
  readingTimeMinutes?: number
  /** Rough word count, used to compute reading time if needed. */
  wordCount?: number
}

function computeReadingTime(words: number): number {
  const wpm = 225
  return Math.max(1, Math.round(words / wpm))
}

/**
 * Editorial metadata strip + "Key takeaways" callout for guide pages.
 *
 * - Last-updated date + byline give LLMs / Google E-E-A-T signals.
 * - Key takeaways are what AI answer engines (ChatGPT Search, Perplexity,
 *   Gemini) tend to quote verbatim, so we keep them crisp and scannable.
 */
export default function GuideMeta({
  updated,
  author = "RageRoom Directory Editorial Team",
  keyTakeaways,
  readingTimeMinutes,
  wordCount,
}: GuideMetaProps) {
  const readTime =
    readingTimeMinutes ??
    (wordCount !== undefined ? computeReadingTime(wordCount) : undefined)

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs sm:text-sm text-zinc-400 mb-5">
        <span className="inline-flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-orange-500" />
          <span>
            By{" "}
            <Link
              href="/editorial-policy"
              className="underline-offset-2 hover:underline hover:text-orange-500 transition-colors"
            >
              {author}
            </Link>
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-orange-500" />
          <span>
            Last updated <time>{updated}</time>
          </span>
        </span>
        {readTime !== undefined && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-orange-500" />
            <span>{readTime} min read</span>
          </span>
        )}
      </div>

      {keyTakeaways.length > 0 && (
        <aside className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-5 sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-400 mb-3">
            Key takeaways
          </h2>
          <ul className="space-y-2">
            {keyTakeaways.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm sm:text-base text-zinc-200"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  )
}
