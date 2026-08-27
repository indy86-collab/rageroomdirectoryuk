import Link from "next/link"
import type { DirectoryInsightCalloutData } from "@/lib/directory-insights"

export default function DirectoryInsightCallout({
  statement,
  href,
  linkLabel,
}: DirectoryInsightCalloutData) {
  return (
    <aside className="mb-6 rounded-lg border border-zinc-800 bg-[#181818] px-4 py-3 text-sm leading-relaxed text-zinc-300">
      <p>{statement}</p>
      <p className="mt-2">
        <Link href={href} className="font-semibold text-orange-500 hover:text-orange-400">
          {linkLabel} →
        </Link>
      </p>
    </aside>
  )
}
