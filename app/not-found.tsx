import Link from "next/link"
import type { Metadata } from "next"
import { Search, MapPin, BookOpen, Compass, Home } from "lucide-react"
import NotFoundSearch from "@/components/NotFoundSearch"

export const metadata: Metadata = {
  title: "Page Not Found (404)",
  description:
    "This page doesn't exist. Browse UK rage rooms by city, read our guides, or search the directory.",
  robots: { index: false, follow: true },
}

// Every major city we currently rank for. Hard-coded rather than fetched so
// the 404 page can be served statically with zero DB hit — we don't want a
// database round-trip on every crawler's bad URL.
const TOP_CITIES = [
  { city: "London", slug: "london" },
  { city: "Manchester", slug: "manchester" },
  { city: "Birmingham", slug: "birmingham" },
  { city: "Leeds", slug: "leeds" },
  { city: "Liverpool", slug: "liverpool" },
  { city: "Bristol", slug: "bristol" },
  { city: "Newcastle", slug: "newcastle" },
  { city: "Sheffield", slug: "sheffield" },
  { city: "Nottingham", slug: "nottingham" },
  { city: "Glasgow", slug: "glasgow" },
  { city: "Edinburgh", slug: "edinburgh" },
  { city: "Cardiff", slug: "cardiff" },
]

const POPULAR_GUIDES = [
  {
    title: "What happens in a rage room?",
    href: "/guides/what-happens-in-a-rage-room",
  },
  {
    title: "How much do rage rooms cost in the UK?",
    href: "/guides/how-much-do-rage-rooms-cost-uk",
  },
  { title: "Are rage rooms safe?", href: "/guides/are-rage-rooms-safe-uk" },
  {
    title: "Best rage rooms for couples",
    href: "/guides/best-rage-rooms-for-couples",
  },
  {
    title: "Best rage rooms for team building",
    href: "/guides/best-rage-rooms-for-team-building",
  },
]

export default function NotFound() {
  return (
    <div className="min-h-[70vh] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-3">
            404 · Page not found
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display uppercase text-white tracking-tight mb-4">
            We couldn&apos;t smash our way to that page.
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto">
            The URL you followed doesn&apos;t exist or has moved. No
            worries — here are some useful starting points, or jump back to
            the homepage.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-md transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to home
            </Link>
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-zinc-700 font-semibold px-5 py-3 rounded-md transition-colors"
            >
              <Compass className="w-4 h-4" />
              Browse every UK rage room
            </Link>
          </div>
        </div>

        <section
          aria-labelledby="search-heading"
          className="mb-10 bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6"
        >
          <h2
            id="search-heading"
            className="flex items-center gap-2 text-xl font-bold text-white mb-3"
          >
            <Search className="w-5 h-5 text-orange-500" />
            Search the directory
          </h2>
          <p className="text-zinc-400 text-sm mb-4">
            Try searching by venue name, city, or postcode.
          </p>
          <NotFoundSearch />
        </section>

        <div className="grid gap-6 sm:grid-cols-2">
          <section
            aria-labelledby="city-heading"
            className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6"
          >
            <h2
              id="city-heading"
              className="flex items-center gap-2 text-xl font-bold text-white mb-3"
            >
              <MapPin className="w-5 h-5 text-orange-500" />
              Browse by city
            </h2>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              {TOP_CITIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/city/${c.slug}`}
                    className="text-zinc-300 hover:text-orange-500 transition-colors"
                  >
                    {c.city}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="guide-heading"
            className="bg-[#181818] rounded-lg border border-zinc-800 p-5 sm:p-6"
          >
            <h2
              id="guide-heading"
              className="flex items-center gap-2 text-xl font-bold text-white mb-3"
            >
              <BookOpen className="w-5 h-5 text-orange-500" />
              Popular guides
            </h2>
            <ul className="space-y-2 text-sm">
              {POPULAR_GUIDES.map((g) => (
                <li key={g.href}>
                  <Link
                    href={g.href}
                    className="text-zinc-300 hover:text-orange-500 transition-colors"
                  >
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link
                href="/guides"
                className="text-orange-500 hover:text-orange-600 underline text-sm font-medium"
              >
                See all guides →
              </Link>
            </div>
          </section>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-10">
          Think this page should exist?{" "}
          <a
            href="mailto:ukrageroom@gmail.com"
            className="text-orange-500 hover:text-orange-600 underline"
          >
            Let us know
          </a>
          .
        </p>
      </div>
    </div>
  )
}
