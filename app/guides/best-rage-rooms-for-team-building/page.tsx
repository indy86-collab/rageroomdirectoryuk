import { Metadata } from "next"
import { searchListings } from "@/lib/listings"
import Link from "next/link"
import FAQ from "@/components/FAQ"

export const metadata: Metadata = {
  title: "Best Rage Rooms for Team Building & Corporate Events | Guide 2024",
  description: "Discover the best rage rooms for corporate team building events. Find venues that accommodate large groups, offer team packages, and provide excellent team building experiences.",
  openGraph: {
    title: "Best Rage Rooms for Team Building & Corporate Events",
    description: "Find the best rage rooms for corporate team building. Group packages and team activities.",
    type: "article",
  },
}

export default async function BestRageRoomsForTeamBuildingPage() {
  const allListings = await searchListings(undefined)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Rage Rooms for Team Building & Corporate Events | Guide 2024",
    description: "Comprehensive guide to the best rage rooms for corporate team building and group events.",
    author: {
      "@type": "Organization",
      name: "RageRoom Directory",
    },
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  }

  const teamBuildingFAQs = [
    {
      question: "Are rage rooms good for team building?",
      answer: "Yes, rage rooms are excellent for team building! They encourage communication, collaboration, and provide a shared experience that breaks down workplace barriers. The physical activity and fun environment help team members bond in a relaxed setting, making it ideal for improving workplace relationships and morale.",
    },
    {
      question: "What group sizes can rage rooms accommodate?",
      answer: "Most rage rooms can accommodate groups of 4-12 people, with some larger venues handling up to 20+ participants. For corporate events, many venues offer private group bookings where your entire team has the space to themselves. It's best to contact venues directly for large group bookings to discuss custom packages.",
    },
    {
      question: "Do rage rooms offer corporate packages?",
      answer: "Many rage rooms offer special corporate packages that include group discounts, extended sessions, additional items, and sometimes refreshments. Some venues can arrange team-building activities, competitions, or structured sessions. Contact venues directly to discuss your team's needs and available corporate packages.",
    },
    {
      question: "How much does a team building rage room session cost?",
      answer: "Team building rage room sessions typically cost £25-£40 per person for groups of 6-12 people. Larger groups often receive discounts, and corporate packages may include additional benefits. Some venues offer flat-rate group bookings starting around £200-£300 for small teams. Always inquire about group discounts when booking.",
    },
    {
      question: "What makes a rage room good for corporate events?",
      answer: "The best rage rooms for corporate events offer private group sessions, flexible scheduling, group discounts, extended time options, and sometimes additional amenities like meeting spaces or refreshments. Venues that can accommodate larger groups (10+) and offer structured team-building activities are ideal for corporate bookings.",
    },
  ]

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-white">
            <li>
              <Link href="/" className="hover:text-orange-500 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/guides" className="hover:text-orange-500 transition-colors">
                Guides
              </Link>
            </li>
            <li>/</li>
            <li className="text-white">Best Rage Rooms for Team Building</li>
          </ol>
        </nav>

        <article>
          <h1 className="text-4xl font-bold mb-4 text-white">
            Best Rage Rooms for Team Building & Corporate Events (2024)
          </h1>

          <p className="text-lg text-zinc-300 mb-6">
            Rage rooms are becoming increasingly popular for corporate team building events. They offer a unique, engaging activity that helps teams bond, relieve stress, and improve workplace relationships. Our guide helps you find the best rage rooms for team building, with tips on group sizes, corporate packages, and what to expect.
          </p>

          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Why Rage Rooms Work for Team Building
            </h2>
            <p className="text-zinc-300 mb-4">
              Rage rooms provide an unconventional team building experience that breaks down barriers and encourages collaboration. Unlike traditional team building activities, smashing items together creates shared experiences, laughter, and memorable moments that strengthen team bonds.
            </p>
            <p className="text-zinc-300 mb-4">
              Benefits for teams include:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Stress relief and improved workplace morale</li>
              <li>Enhanced communication and collaboration</li>
              <li>Breaking down hierarchical barriers in a fun environment</li>
              <li>Creating shared memories and inside jokes</li>
              <li>Physical activity that's accessible to most fitness levels</li>
              <li>Unique experience that stands out from typical corporate events</li>
            </ul>
          </div>

          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              What to Look for in Team Building Rage Rooms
            </h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li><strong>Group Capacity:</strong> Venues that can accommodate 8-20+ people</li>
              <li><strong>Private Sessions:</strong> Ability to book the entire space for your team</li>
              <li><strong>Corporate Packages:</strong> Special pricing and packages for businesses</li>
              <li><strong>Flexible Scheduling:</strong> Availability during business hours or evenings</li>
              <li><strong>Extended Sessions:</strong> 45-60 minute options for larger groups</li>
              <li><strong>Additional Amenities:</strong> Meeting spaces, refreshments, or nearby facilities</li>
              <li><strong>Location:</strong> Convenient for your team to reach</li>
            </ul>
          </div>

          {allListings.length > 0 && (
            <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Rage Rooms Suitable for Team Building
              </h2>
              <p className="text-zinc-300 mb-4">
                Most rage rooms welcome corporate groups. Here are venues across the UK that accommodate team building events:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {allListings.slice(0, 8).map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listing/${listing.slug || listing.id}`}
                    className="block p-4 bg-[#1a1a1a] rounded border border-zinc-700 hover:border-orange-500 transition-colors"
                  >
                    <h3 className="text-white font-semibold mb-1">{listing.name}</h3>
                    <p className="text-zinc-400 text-sm">{listing.city}</p>
                    {listing.price && (
                      <p className="text-orange-500 text-sm mt-2">From £{listing.price.toFixed(0)} per person</p>
                    )}
                  </Link>
                ))}
              </div>
              <Link
                href="/listings"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md transition-colors"
              >
                Browse All Rage Rooms
              </Link>
            </div>
          )}

          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Planning Your Corporate Rage Room Event
            </h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li><strong>Book Early:</strong> Corporate bookings often require advance notice, especially for large groups</li>
              <li><strong>Discuss Packages:</strong> Contact venues directly to discuss group discounts and custom packages</li>
              <li><strong>Consider Timing:</strong> Some teams prefer after-work sessions, others prefer lunchtime or weekend events</li>
              <li><strong>Plan Transportation:</strong> Ensure your team can easily reach the venue</li>
              <li><strong>Follow Up:</strong> Consider combining with a meal or drinks afterward for extended team bonding</li>
              <li><strong>Safety First:</strong> Ensure all team members are aware of safety requirements and age restrictions</li>
            </ul>
          </div>

          <FAQ items={teamBuildingFAQs} title="Frequently Asked Questions About Rage Rooms for Team Building" />

          <div className="mt-12 text-center space-y-4">
            <Link
              href="/listings"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Browse All Rage Rooms
            </Link>
            <div>
              <Link
                href="/list-your-rage-room"
                className="text-orange-500 hover:text-orange-600 transition-colors"
              >
                List Your Rage Room for Corporate Events
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
    )
}


