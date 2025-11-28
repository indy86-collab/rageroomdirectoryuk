import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Rage Room Guides | Expert Tips & City Rankings",
  description: "Comprehensive guides to rage rooms across the UK. Find the best venues by city, for couples, team building, and more. Expert tips and rankings.",
}

export default function GuidesPage() {
  const guides = [
    {
      title: "Best Rage Rooms in London",
      description: "Discover the top-rated rage rooms in London. Our comprehensive guide ranks the best smash rooms in the capital based on reviews, pricing, and experience quality.",
      href: "/guides/best-rage-rooms-london",
      city: "London",
    },
    {
      title: "Best Rage Rooms in Manchester",
      description: "Find the best rage rooms in Manchester. Compare top-rated venues in the North West, view prices, and book your stress-relief session.",
      href: "/guides/best-rage-rooms-manchester",
      city: "Manchester",
    },
    {
      title: "Best Rage Rooms in Birmingham",
      description: "Top 5 ranked rage rooms in Birmingham. Compare venues, prices, packages, and find the perfect smash room experience in the Midlands.",
      href: "/guides/best-rage-rooms-birmingham",
      city: "Birmingham",
    },
    {
      title: "Best Rage Rooms for Couples",
      description: "Ultimate guide to rage rooms perfect for date nights. Find romantic smash room experiences ideal for couples looking for unique activities.",
      href: "/guides/best-rage-rooms-for-couples",
      category: "Couples",
    },
    {
      title: "Best Rage Rooms for Team Building",
      description: "Discover the best rage rooms for corporate team building events. Find venues that accommodate large groups and offer team packages.",
      href: "/guides/best-rage-rooms-for-team-building",
      category: "Corporate",
    },
  ]

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Rage Room Guides
        </h1>
        <p className="text-lg text-zinc-300 mb-8">
          Expert guides to help you find the perfect rage room experience. Whether you're looking for the best venues in your city, planning a date night, or organizing a corporate event, our comprehensive guides have you covered.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="block bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 hover:border-orange-500 transition-colors p-6"
            >
              <h2 className="text-xl font-bold text-white mb-2">
                {guide.title}
              </h2>
              <p className="text-zinc-400 text-sm mb-4">
                {guide.description}
              </p>
              <span className="text-orange-500 text-sm font-medium">
                Read Guide →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}


