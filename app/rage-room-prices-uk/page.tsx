import { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import FAQ from "@/components/FAQ"

export const metadata: Metadata = {
  title: "Rage Room Prices UK | Complete Pricing Guide 2025",
  description: "Complete guide to rage room prices across the UK. Compare prices by city, package types, and venues. Learn about BYO policies and find the best value.",
  openGraph: {
    title: "Rage Room Prices UK | Complete Pricing Guide 2025",
    description: "Compare rage room prices across the UK. Find the best value with our comprehensive pricing guide.",
    type: "website",
  },
}

export const dynamic = 'force-dynamic'

export default async function RageRoomPricesUKPage() {
  // WebPage and FAQPage Schema
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Rage Room Prices UK",
    description: "Complete guide to rage room prices across the UK with city comparisons and package details",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"}/rage-room-prices-uk`,
  }

  const faqItems = [
    {
      question: "How much does a rage room cost in the UK?",
      answer: "Rage room prices in the UK vary by venue and package. Thirty-minute sessions generally cost £25-£50 per person, while premium or group packages can reach £70-£155. Some venues offer shorter 15-minute sessions from about £22, whereas one-hour sessions may cost £65-£100+. London tends to be the most expensive area, with prices starting around £25 for 15 minutes and reaching up to £100 for one hour.",
    },
    {
      question: "Are there cheaper options for rage rooms?",
      answer: "Yes, there are cheaper options available. Rage Remedy in Margate offers a BYOS (Bring Your Own Smashables) session from £12.50 for 30 minutes, and Rage Out in Maidstone has base prices around £17.50 per person. However, standard sessions at most venues start around £30-£35. BYO options can significantly reduce costs if you bring your own items to smash.",
    },
    {
      question: "Do rage rooms allow you to bring your own items?",
      answer: "BYO policies vary by venue. Several venues welcome BYO items under certain conditions: Destroy'd Rage Rooms (Northampton) allows crockery, VHS tapes, and small electronics. Weston Rage Rooms encourages guests to bring their own smashables with guidelines. Rage Out (Maidstone) lets guests bring cups, plates, and electronics meeting safety requirements. Rage Remedy (Margate) has a BYOS option from £12.50-£15. Anger Issues Rage Rooms (Ellesmere Port) permits BYO by emailing a list beforehand. However, some venues like Angry Smash Ltd, The Rage House, and The Snake Room supply items and typically do not allow external weapons or smashables.",
    },
    {
      question: "Why do rage room prices vary so much?",
      answer: "Price differences reflect several factors: session length (15-60 minutes), number of participants, type and amount of items supplied, optional extras (e.g., recorded footage or additional breakables), and location. Venues in large cities like London often charge higher rates to cover higher operating costs, whereas some regional venues offer lower base prices or BYO discounts. Premium packages with more items and longer sessions cost more than basic packages.",
    },
    {
      question: "What's included in the price?",
      answer: "Typically included in rage room prices: protective gear (coveralls, gloves, face shield), smashable items (glass, ceramics, electronics), tools (hammers, bats, crowbars), safety briefing, session time, and staff supervision. Some venues include extras like music systems or photo opportunities, while others charge extra for these. Always check with the specific venue what's included in your chosen package.",
    },
    {
      question: "Are there group discounts?",
      answer: "Many venues offer group discounts. For example, Smash Space UK (Newcastle) charges £49.99 for 1-2 people, £59.99 for 3 people, and £69.99 for 4 people. Anger Issues Rage Rooms offers: Solo £35, Duo £60, Trio £80, Group of four £100. Group bookings typically offer 10-20% savings compared to individual rates. Corporate packages for larger groups often provide even better value.",
    },
    {
      question: "Which city has the cheapest rage rooms?",
      answer: "Based on current pricing, Margate offers some of the cheapest options with Rage Remedy's BYOS sessions from £12.50. Maidstone (Rage Out) has base prices around £17.50 per person. Weston-super-Mare offers 15-minute sessions from £22.50. However, prices vary significantly by package type, so it's worth comparing options in your area. Regional venues outside major cities often offer better value than London.",
    },
    {
      question: "Which city has the most expensive rage rooms?",
      answer: "London typically has the highest prices, with Smash It Rage Room starting around £25 for 15 minutes and reaching about £100 for one hour. Colchester also has premium pricing with packages ranging £34.99-£74.99. Major cities generally charge more due to higher operating costs, while regional venues often offer better value.",
    },
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  // Venue pricing data
  const venues = [
    {
      name: "Go Rage – Birmingham",
      city: "Birmingham",
      price30min: "£33-£37",
      price60min: "£35",
      byo: "Not mentioned (items provided)",
      notes: "Multiple 30-min packages available",
    },
    {
      name: "Smash Space UK",
      city: "Newcastle upon Tyne",
      price30min: "£49.99 (1-2 people)",
      price60min: "£59.99 (3 people), £69.99 (4 people)",
      byo: "Not stated (items supplied)",
      notes: "Group pricing, extras available",
    },
    {
      name: "Smash It Rage Room Ltd",
      city: "London",
      price30min: "£25+ (15 min from £25)",
      price60min: "Up to £100",
      byo: "Allowed (all types permitted)",
      notes: "Wide price range, premium location",
    },
    {
      name: "Destroy'd Rage Rooms",
      city: "Northampton",
      price30min: "£55 (2 people)",
      price60min: "N/A",
      byo: "Allowed (crockery, VHS, small electronics)",
      notes: "Room-based pricing",
    },
    {
      name: "Urban Xtreme Colchester",
      city: "Colchester",
      price30min: "£34.99-£74.99",
      price60min: "N/A",
      byo: "Possible (small items, larger items may incur charge)",
      notes: "Bronze/Silver/Gold packages",
    },
    {
      name: "Weston Rage Rooms",
      city: "Weston-super-Mare",
      price30min: "£34.50",
      price60min: "£65-£95",
      byo: "Allowed (guidelines apply)",
      notes: "Wide range of packages",
    },
    {
      name: "Rage Out",
      city: "Maidstone",
      price30min: "£17.50-£60",
      price60min: "N/A",
      byo: "Allowed (cups, plates, electronics)",
      notes: "Some of the cheapest options",
    },
    {
      name: "Rage Remedy",
      city: "Margate",
      price30min: "£30 (or £12.50-£15 BYOS)",
      price60min: "N/A",
      byo: "Welcomed (BYOS option available)",
      notes: "Cheapest BYO option",
    },
    {
      name: "Angry Smash Ltd",
      city: "Southend-on-Sea",
      price30min: "£50 (solo) - £155 (4 people)",
      price60min: "N/A",
      byo: "Not allowed (only provided weapons)",
      notes: "Group pricing varies significantly",
    },
    {
      name: "The Rage House",
      city: "Newcastle-under-Lyme",
      price30min: "£40 (up to 4 people)",
      price60min: "N/A",
      byo: "Not mentioned (items supplied)",
      notes: "Room-based pricing",
    },
    {
      name: "The Snake Room",
      city: "Chesterfield",
      price30min: "£50 (2 people)",
      price60min: "N/A",
      byo: "Not mentioned (items provided)",
      notes: "Session-based pricing",
    },
    {
      name: "Anger Issues Rage Rooms",
      city: "Ellesmere Port",
      price30min: "£35-£100",
      price60min: "N/A",
      byo: "Permitted (email list beforehand)",
      notes: "Solo £35, Duo £60, Trio £80, 4 people £100",
    },
  ]

  // City price comparison
  const cityPrices = [
    { city: "London", range: "£25-£100", note: "Most expensive, wide range" },
    { city: "Birmingham", range: "£33-£37", note: "Mid-range pricing" },
    { city: "Newcastle upon Tyne", range: "£49.99+", note: "Group pricing available" },
    { city: "Northampton", range: "£55", note: "Room-based pricing" },
    { city: "Colchester", range: "£34.99-£74.99", note: "Premium packages available" },
    { city: "Weston-super-Mare", range: "£22.50-£95", note: "Wide range of options" },
    { city: "Maidstone", range: "£17.50-£60", note: "Some cheapest options" },
    { city: "Margate", range: "£12.50-£30", note: "Cheapest BYO option" },
    { city: "Southend-on-Sea", range: "£50-£155", note: "Group size affects price" },
    { city: "Chesterfield", range: "£50", note: "Session-based pricing" },
    { city: "Ellesmere Port", range: "£35-£100", note: "Group discounts available" },
  ]

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Rage Room Prices UK" },
          ]}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-white">
          Rage Room Prices UK: Complete Pricing Guide 2025
        </h1>

        <div className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <p>
            Wondering how much a rage room costs in the UK? This comprehensive guide breaks down prices across different cities, package types, and venues. Whether you're looking for a budget-friendly option or a premium experience, we've got the pricing information you need.
          </p>
          <p>
            Rage room prices in the UK typically range from £12.50 to £155 depending on location, session length, group size, and package type. Most standard 30-minute sessions cost between £25-£50 per person, with premium packages and longer sessions costing more.
          </p>
        </div>

        {/* Quick Price Summary */}
        <section aria-labelledby="quick-summary-heading" className="mb-12">
          <h2 id="quick-summary-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Quick Price Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Budget Options</h3>
              <p className="text-2xl font-bold text-orange-500 mb-2">£12.50-£25</p>
              <p className="text-sm text-zinc-400">BYO sessions and basic packages</p>
            </div>
            <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Standard Range</h3>
              <p className="text-2xl font-bold text-orange-500 mb-2">£30-£50</p>
              <p className="text-sm text-zinc-400">Most common 30-minute sessions</p>
            </div>
            <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Premium Packages</h3>
              <p className="text-2xl font-bold text-orange-500 mb-2">£50-£155</p>
              <p className="text-sm text-zinc-400">Extended sessions and group packages</p>
            </div>
          </div>
        </section>

        {/* Price Comparison Table */}
        <section aria-labelledby="comparison-heading" className="mb-12">
          <h2 id="comparison-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Venue Price Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-[#181818] border border-zinc-800 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#1a1a1a] border-b border-zinc-800">
                  <th className="text-left p-4 text-white font-semibold">Venue</th>
                  <th className="text-left p-4 text-white font-semibold">City</th>
                  <th className="text-left p-4 text-white font-semibold">30-Min Price</th>
                  <th className="text-left p-4 text-white font-semibold">60-Min Price</th>
                  <th className="text-left p-4 text-white font-semibold">BYO Allowed</th>
                </tr>
              </thead>
              <tbody>
                {venues.map((venue, index) => (
                  <tr
                    key={index}
                    className="border-b border-zinc-800 hover:bg-[#1a1a1a] transition-colors"
                  >
                    <td className="p-4 text-white font-medium">{venue.name}</td>
                    <td className="p-4 text-zinc-300">{venue.city}</td>
                    <td className="p-4 text-orange-500 font-semibold">{venue.price30min}</td>
                    <td className="p-4 text-zinc-300">{venue.price60min || "N/A"}</td>
                    <td className="p-4 text-zinc-300 text-sm">{venue.byo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* City Price Differences */}
        <section aria-labelledby="city-prices-heading" className="mb-12">
          <h2 id="city-prices-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            City Price Comparison
          </h2>
          <p className="text-zinc-300 mb-6">
            Prices vary significantly by location. Major cities like London typically charge more due to higher operating costs, while regional venues often offer better value.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cityPrices.map((city, index) => (
              <div
                key={index}
                className="bg-[#181818] rounded-lg border border-zinc-800 p-6"
              >
                <h3 className="text-xl font-bold text-white mb-2">{city.city}</h3>
                <p className="text-2xl font-bold text-orange-500 mb-2">{city.range}</p>
                <p className="text-sm text-zinc-400">{city.note}</p>
                <Link
                  href={`/city/${city.city.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-orange-500 hover:text-orange-400 text-sm font-medium mt-3 inline-block"
                >
                  Find venues in {city.city} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Package Types */}
        <section aria-labelledby="packages-heading" className="mb-12">
          <h2 id="packages-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Package Types and Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Basic Packages</h3>
              <p className="text-2xl font-bold text-orange-500 mb-2">£12.50-£35</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 text-sm">
                <li>15-20 minute sessions</li>
                <li>Basic items (glass, ceramics)</li>
                <li>Standard tools</li>
                <li>Protective gear included</li>
                <li>Best for first-timers</li>
              </ul>
            </div>
            <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Standard Packages</h3>
              <p className="text-2xl font-bold text-orange-500 mb-2">£30-£55</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 text-sm">
                <li>30-minute sessions</li>
                <li>More variety of items</li>
                <li>Full tool selection</li>
                <li>Electronics included</li>
                <li>Most popular choice</li>
              </ul>
            </div>
            <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Premium Packages</h3>
              <p className="text-2xl font-bold text-orange-500 mb-2">£65-£155</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 text-sm">
                <li>45-60 minute sessions</li>
                <li>Premium/larger items</li>
                <li>All tools available</li>
                <li>Extras (photos, music)</li>
                <li>Group packages</li>
              </ul>
            </div>
          </div>
        </section>

        {/* BYO Information */}
        <section aria-labelledby="byo-heading" className="mb-12">
          <h2 id="byo-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Bring Your Own (BYO) Policies
          </h2>
          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6">
            <p className="text-zinc-300 mb-4">
              Many venues allow you to bring your own items to smash, which can significantly reduce costs. However, policies vary, and safety guidelines must be followed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Venues That Allow BYO:</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-2 text-sm">
                  <li><strong>Smash It Rage Room (London):</strong> All types permitted</li>
                  <li><strong>Destroy'd Rage Rooms (Northampton):</strong> Crockery, VHS, small electronics</li>
                  <li><strong>Weston Rage Rooms:</strong> Smashables with guidelines</li>
                  <li><strong>Rage Out (Maidstone):</strong> Cups, plates, electronics</li>
                  <li><strong>Rage Remedy (Margate):</strong> BYOS option from £12.50</li>
                  <li><strong>Anger Issues (Ellesmere Port):</strong> Email list beforehand</li>
                  <li><strong>Urban Xtreme (Colchester):</strong> Small items (larger may incur charge)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Venues That Don't Allow BYO:</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-2 text-sm">
                  <li><strong>Angry Smash Ltd (Southend):</strong> Only provided weapons</li>
                  <li><strong>The Rage House:</strong> Items supplied</li>
                  <li><strong>The Snake Room:</strong> Items provided</li>
                  <li><strong>Go Rage (Birmingham):</strong> Items provided</li>
                  <li><strong>Smash Space UK:</strong> Items supplied</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                <strong>Important:</strong> Always check with the venue before bringing items. Safety guidelines must be followed, and some items may be prohibited. BYO policies can change, so confirm current policies when booking.
              </p>
            </div>
          </div>
        </section>

        {/* Money-Saving Tips */}
        <section aria-labelledby="saving-tips-heading" className="mb-12">
          <h2 id="saving-tips-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Money-Saving Tips
          </h2>
          <div className="bg-[#181818] rounded-lg border border-zinc-800 p-6">
            <ul className="list-disc list-inside text-zinc-300 space-y-3">
              <li><strong>Choose BYO options:</strong> Rage Remedy's BYOS sessions start from just £12.50, significantly cheaper than standard packages</li>
              <li><strong>Book in groups:</strong> Many venues offer group discounts. For example, Anger Issues charges £35 solo but only £25 per person for a group of 4</li>
              <li><strong>Look for shorter sessions:</strong> 15-minute sessions (from £22.50) are cheaper if you just want to try it</li>
              <li><strong>Compare regional venues:</strong> Prices outside major cities are often lower. Margate and Maidstone offer some of the cheapest options</li>
              <li><strong>Book off-peak times:</strong> Weekday sessions may be cheaper than weekends</li>
              <li><strong>Check for promotions:</strong> Many venues offer special deals and discounts</li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ items={faqItems} title="Frequently Asked Questions About Rage Room Prices" />

        {/* Related Links */}
        <section aria-labelledby="related-heading" className="mb-12">
          <h2 id="related-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Related Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/near-me"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Find Rage Rooms Near Me</h3>
              <p className="text-zinc-400">Discover venues in your area with our location finder</p>
            </Link>
            <Link
              href="/listings"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Browse All Rage Rooms</h3>
              <p className="text-zinc-400">Compare all venues, prices, and packages in one place</p>
            </Link>
            <Link
              href="/guides/best-rage-rooms-for-couples"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Best Rage Rooms for Couples</h3>
              <p className="text-zinc-400">Find couple-friendly venues and packages</p>
            </Link>
            <Link
              href="/rage-room-london"
              className="bg-[#181818] hover:bg-[#252525] border border-zinc-800 hover:border-orange-500 rounded-lg p-6 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">Rage Room London</h3>
              <p className="text-zinc-400">Complete guide to rage rooms in the capital</p>
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-[#181818] rounded-lg border border-zinc-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Book Your Rage Room Session?
          </h2>
          <p className="text-zinc-300 mb-6">
            Now that you know the prices, browse our directory to find the perfect venue for your budget and location.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/listings"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Browse All Rage Rooms
            </Link>
            <Link
              href="/near-me"
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-zinc-700 font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Find Rage Rooms Near Me
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

