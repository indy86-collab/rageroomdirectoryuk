import Link from "next/link"
import Logo from "./Logo"
import { getDistinctRegions, getListingsByRegion } from "@/lib/listings"
import { regionToSlug } from "@/lib/location"

export default async function Footer() {
  const currentYear = new Date().getFullYear()

  const regions = await getDistinctRegions()
  const regionCounts = await Promise.all(
    regions.map(async (region) => ({
      region,
      count: (await getListingsByRegion(region)).length,
    }))
  )
  const topRegions = regionCounts
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  const columns: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: "Popular Guides",
      links: [
        { label: "Best Rage Rooms London", href: "/guides/best-rage-rooms-london" },
        { label: "Rage Room vs Escape Room", href: "/rage-room-vs-escape-room" },
        { label: "Rage Rooms for Hen Parties", href: "/guides/rage-rooms-for-hen-parties-uk" },
        { label: "Rage Rooms for Stag Parties", href: "/guides/rage-rooms-for-stag-parties-uk" },
        { label: "Rage Rooms for Birthdays", href: "/guides/rage-rooms-for-birthdays-uk" },
        { label: "UK Pricing Guide", href: "/rage-room-prices-uk" },
      ],
    },
    {
      heading: "Explore",
      links: [
        { label: "All Listings", href: "/listings" },
        { label: "Near Me", href: "/near-me" },
        { label: "UK Map", href: "/uk-map" },
        { label: "UK Rage Room Report 2026", href: "/uk-rage-room-report-2026" },
        { label: "UK Prices Hub", href: "/rage-room-prices-uk" },
        { label: "All Guides", href: "/guides" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      heading: "Terminology",
      links: [
        { label: "Smash Room UK", href: "/smash-room-uk" },
        { label: "Break Room UK", href: "/break-room-uk" },
        { label: "Anger Room UK", href: "/anger-room-uk" },
        { label: "Rage Room vs Escape Room", href: "/rage-room-vs-escape-room" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "List Your Rage Room", href: "/list-your-rage-room" },
        { label: "FAQ", href: "/#faq" },
      ],
    },
  ]

  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-zinc-800/80 mt-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-zinc-400 max-w-sm leading-relaxed">
              The UK&rsquo;s leading directory for rage rooms and smash experiences. Compare venues, view prices and book with confidence.
            </p>
            {topRegions.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-2">
                  Browse by Region
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topRegions.map(({ region }) => (
                    <Link
                      key={region}
                      href={`/region/${regionToSlug(region)}`}
                      className="text-xs text-zinc-400 hover:text-rage-500 transition-colors"
                    >
                      {region}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-3">
                {col.heading}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-rage-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">
            © {currentYear} RageRoom Directory. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
            <Link href="/privacy" className="hover:text-rage-500 transition-colors">
              Privacy
            </Link>
            <span className="text-zinc-700">·</span>
            <Link href="/terms" className="hover:text-rage-500 transition-colors">
              Terms
            </Link>
            <span className="text-zinc-700">·</span>
            <Link href="/disclaimer" className="hover:text-rage-500 transition-colors">
              Disclaimer
            </Link>
            <span className="text-zinc-700">·</span>
            <Link href="/editorial-policy" className="hover:text-rage-500 transition-colors">
              Editorial
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
