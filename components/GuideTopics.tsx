import Link from "next/link"
export default function GuideTopics() {
  return <nav aria-label="Guide topics" className="mb-8 flex flex-wrap gap-2">{[
    ["First visit", "/guides/what-happens-in-a-rage-room"], ["Prices", "/rage-room-prices-uk"],
    ["Safety", "/guides/are-rage-rooms-safe-uk"], ["Group events", "/occasions"], ["All guides", "/guides"],
  ].map(([label, href]) => <Link key={href} href={href} className="inline-flex min-h-11 items-center rounded-full border border-zinc-700 px-4 text-sm font-semibold text-zinc-200 hover:border-rage-400 hover:text-white">{label}</Link>)}</nav>
}
