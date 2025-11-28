import { Metadata } from "next"
import { searchListings } from "@/lib/listings"
import Link from "next/link"
import FAQ from "@/components/FAQ"
import { globalFAQs } from "@/lib/faqs"

export const metadata: Metadata = {
  title: "Best Rage Rooms for Couples | Date Night Guide 2024",
  description: "Discover the best rage rooms for couples and date nights. Find romantic smash room experiences perfect for couples looking for unique activities and stress relief together.",
  openGraph: {
    title: "Best Rage Rooms for Couples | Date Night Guide",
    description: "Find the best rage rooms perfect for couples and date nights. Unique romantic activities for stress relief.",
    type: "article",
  },
}

export default async function BestRageRoomsForCouplesPage() {
  // Get all listings (we'll filter/rank them for couples)
  const allListings = await searchListings(undefined)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Rage Rooms for Couples | Date Night Guide 2024",
    description: "Comprehensive guide to the best rage rooms for couples, date nights, and romantic stress-relief experiences.",
    author: {
      "@type": "Organization",
      name: "RageRoom Directory",
    },
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  }

  const couplesFAQs: typeof globalFAQs = [
    {
      question: "Are rage rooms good for date nights?",
      answer: "Yes, rage rooms make excellent date night activities! They're unique, fun, and provide a shared experience that's different from typical dinner-and-movie dates. Many couples find smashing items together to be a great bonding activity and stress reliever. Some venues even offer couples packages with romantic touches like music systems and extended sessions.",
    },
    {
      question: "What makes a rage room good for couples?",
      answer: "The best rage rooms for couples offer private or semi-private sessions, extended time options (45-60 minutes), music systems to set the mood, and sometimes special packages with additional items. Look for venues that allow you to book just for two people, ensuring you have the space to yourselves for a more intimate experience.",
    },
    {
      question: "How much does a couples rage room session cost?",
      answer: "Couples rage room sessions typically cost £50-£100 for two people, depending on the package and session duration. Basic 30-minute sessions start around £50-£60 for two, while premium packages with extended time and additional items can range from £80-£100. Some venues offer special couples discounts, so it's worth checking when booking.",
    },
    {
      question: "Do rage rooms offer private sessions for couples?",
      answer: "Many rage rooms offer private or semi-private sessions that are perfect for couples. These sessions ensure you have the space to yourselves without sharing with other groups. It's best to call ahead or check the venue's website to confirm private session availability and pricing, as this varies by location.",
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
            <li className="text-white">Best Rage Rooms for Couples</li>
          </ol>
        </nav>

        <article>
          <h1 className="text-4xl font-bold mb-4 text-white">
            Best Rage Rooms for Couples: Ultimate Date Night Guide (2024)
          </h1>

          <p className="text-lg text-zinc-300 mb-6">
            Looking for a unique date night activity? Rage rooms offer couples an exciting, stress-relieving experience that's far from the typical dinner and movie. Our guide helps you find the best rage rooms perfect for couples, with tips on what to look for and how to make the most of your romantic smashing session.
          </p>

          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Why Rage Rooms Make Great Date Nights
            </h2>
            <p className="text-zinc-300 mb-4">
              Rage rooms provide couples with a unique bonding experience that's both fun and therapeutic. Unlike traditional date activities, smashing items together creates shared memories, releases stress, and offers plenty of laughs. Many couples find it's a great way to break the ice on early dates or add excitement to long-term relationships.
            </p>
            <p className="text-zinc-300">
              The physical activity and adrenaline rush can be invigorating, while the controlled environment ensures safety. Plus, it's a great conversation starter and something you'll both remember long after the date is over.
            </p>
          </div>

          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              What to Look for in Couples-Friendly Rage Rooms
            </h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 mb-4">
              <li><strong>Private or Semi-Private Sessions:</strong> Look for venues that offer sessions for just two people</li>
              <li><strong>Extended Time Options:</strong> 45-60 minute sessions give you more time to enjoy together</li>
              <li><strong>Music Systems:</strong> Many venues allow you to play your own music for a more personalized experience</li>
              <li><strong>Couples Packages:</strong> Some venues offer special packages with additional items or romantic touches</li>
              <li><strong>Location:</strong> Choose a venue that's convenient for both of you</li>
              <li><strong>Reviews:</strong> Check reviews from other couples to see their experiences</li>
            </ul>
          </div>

          {allListings.length > 0 && (
            <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Recommended Rage Rooms for Couples
              </h2>
              <p className="text-zinc-300 mb-4">
                While most rage rooms welcome couples, here are some venues across the UK that are particularly well-suited for date nights:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {allListings.slice(0, 6).map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listing/${listing.slug || listing.id}`}
                    className="block p-4 bg-[#1a1a1a] rounded border border-zinc-700 hover:border-orange-500 transition-colors"
                  >
                    <h3 className="text-white font-semibold mb-1">{listing.name}</h3>
                    <p className="text-zinc-400 text-sm">{listing.city}</p>
                    {listing.price && (
                      <p className="text-orange-500 text-sm mt-2">From £{listing.price.toFixed(0)}</p>
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
              Tips for Your First Couples Rage Room Experience
            </h2>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Book in advance, especially for weekend sessions which are popular for date nights</li>
              <li>Arrive 10-15 minutes early for safety briefing and gear setup</li>
              <li>Bring a playlist if the venue allows music - it can enhance the experience</li>
              <li>Wear old clothes you don't mind getting dirty</li>
              <li>Take photos before and after (many venues allow this)</li>
              <li>Consider booking a longer session (45-60 minutes) for a more relaxed pace</li>
              <li>Plan something relaxing afterward - maybe dinner or drinks nearby</li>
            </ul>
          </div>

          <FAQ items={couplesFAQs} title="Frequently Asked Questions About Rage Rooms for Couples" />

          <div className="mt-12 text-center space-y-4">
            <Link
              href="/listings"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Browse All Rage Rooms
            </Link>
            <div>
              <Link
                href="/"
                className="text-orange-500 hover:text-orange-600 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}


