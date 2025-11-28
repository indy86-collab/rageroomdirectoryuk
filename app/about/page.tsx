import { Metadata } from "next"
import Breadcrumbs from "@/components/Breadcrumbs"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Us | RageRoom Directory - UK's First Dedicated Rage Room Platform",
  description: "Learn about RageRoom Directory, the UK's first dedicated platform for discovering, comparing, and exploring rage rooms, smash rooms, and destruction therapy experiences nationwide.",
  openGraph: {
    title: "About RageRoom Directory | UK's First Rage Room Platform",
    description: "Discover the UK's first dedicated platform for rage rooms. Compare prices, find locations, and explore stress-relief experiences nationwide.",
    type: "website",
  },
}

export default function AboutPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ]

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 mt-4">
          About RageRoom Directory
        </h1>

        <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-zinc-300">
          <p className="text-lg">
            RageRoom Directory is the UK's first dedicated platform for discovering, comparing, and exploring rage rooms, smash rooms, and destruction therapy experiences nationwide. Our mission is simple:
          </p>

          <p className="text-lg font-semibold text-white">
            Help people release stress safely, find unique experiences, and discover the best rage rooms near them.
          </p>

          <p>
            Whether you're planning a fun day out, looking for a unique date idea, organising a corporate team-building session, or simply curious about stress-relief experiences — we make it easy to find the right rage room for you.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
            ⭐ Why RageRoom Directory Exists
          </h2>
          <p>
            Rage rooms are growing fast across the UK, but information is scattered:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Outdated websites</li>
            <li>No central list of locations</li>
            <li>Hard to compare prices</li>
            <li>No consistent opening hours</li>
            <li>No easy way to know what each venue offers</li>
          </ul>
          <p className="mt-4">
            We built RageRoom Directory to fix that.
          </p>
          <p>
            Our directory brings all UK rage rooms into one place, making it easy to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>See accurate location information</li>
            <li>Compare packages and pricing</li>
            <li>View photos and facilities</li>
            <li>Check opening times</li>
            <li>Explore city-by-city</li>
            <li>Read helpful overviews</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
            ⭐ What Makes Us Different
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">✔ Nationwide Coverage</h3>
              <p>We list rage rooms from major cities to smaller towns across the UK.</p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">✔ Manually Verified Listings</h3>
              <p>Every listing is reviewed and updated regularly for accuracy.</p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">✔ User-Friendly</h3>
              <p>Clean design, fast navigation, simple search, and strong filters.</p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">✔ Trusted Information</h3>
              <p>We focus on clarity, transparency, and providing valuable detail for AI engines and humans alike.</p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">✔ Built for the Future</h3>
              <p>We use structured data, schema, and machine-readable formats so Google, ChatGPT, Perplexity, Bing Copilot and other AI systems correctly understand and surface our content.</p>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
            ⭐ Who We Help
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">For Visitors:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Find rage rooms near you</li>
                <li>Compare prices & packages</li>
                <li>Discover opening hours</li>
                <li>Read detailed summaries</li>
                <li>Get directions instantly</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">For Businesses:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Increase visibility</li>
                <li>Attract new customers</li>
                <li>Get direct traffic to your site</li>
                <li>Build authority with a verified listing</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
            ⭐ Our Background
          </h2>
          <p>
            RageRoom Directory was created by <strong>Indy Singh</strong>, an experienced engineer and founder passionate about useful directory tools, clean UI, structured content, and modern search optimisation.
          </p>
          <p>
            Indy's professional background (Adobe Commerce, enterprise engineering, SEO, AI product development) shaped this platform into a fast, reliable, high-quality directory that helps both users and business owners.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
            ⭐ How We Maintain Accuracy
          </h2>
          <p>To ensure listings stay up to date, we:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Manually verify each listing</li>
            <li>Encourage businesses to submit updates</li>
            <li>Review user-submitted corrections</li>
            <li>Refresh metadata regularly</li>
            <li>Monitor opening hours seasonally</li>
            <li>Optimise content for AI semantic search</li>
          </ul>
          <p className="mt-4">
            We aim to be the most accurate and trustworthy source for rage rooms in the UK.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
            ⭐ Want to Add or Update Your Listing?
          </h2>
          <p>
            We welcome business submissions.
          </p>
          <p>
            👉 Email us at <a href="mailto:ukrageroom@gmail.com" className="text-orange-500 hover:text-orange-600 underline">ukrageroom@gmail.com</a>
          </p>
          <p>
            👉 Or use the <Link href="/contact" className="text-orange-500 hover:text-orange-600 underline">contact page</Link> on this site.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
            ⭐ Keep Exploring
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/listings" className="text-orange-500 hover:text-orange-600 underline">
              🔥 Browse All Listings
            </Link>
            <Link href="/listings" className="text-orange-500 hover:text-orange-600 underline">
              🏙️ Find Rage Rooms by City
            </Link>
            <Link href="/blog" className="text-orange-500 hover:text-orange-600 underline">
              📚 Read Our Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

