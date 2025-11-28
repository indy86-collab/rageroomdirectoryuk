import { Metadata } from "next"
import Breadcrumbs from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "Disclaimer | RageRoom Directory",
  description: "Read RageRoom Directory's disclaimer. Understand that we are an informational directory platform and are not responsible for services provided by listed businesses.",
  openGraph: {
    title: "Disclaimer | RageRoom Directory",
    description: "Legal disclaimer for RageRoom Directory platform.",
    type: "website",
  },
}

export default function DisclaimerPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Disclaimer", href: "/disclaimer" },
  ]

  const lastUpdated = new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 mt-4">
          Disclaimer
        </h1>

        <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-zinc-300">
          <p className="text-sm text-zinc-400">
            Last updated: {lastUpdated}
          </p>

          <p>
            RageRoom Directory ("we" / "our") is an informational directory platform. We do not own or operate any of the businesses listed on this website.
          </p>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              1. No Professional Advice
            </h2>
            <p>Information on this site is provided for general informational purposes only. It should not be considered:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Professional advice</li>
              <li>Safety certification</li>
              <li>Endorsement</li>
              <li>Guarantee of service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              2. Business Accuracy
            </h2>
            <p>We attempt to keep listings accurate but:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Prices may change</li>
              <li>Packages may vary</li>
              <li>Rage rooms may update locations or opening hours</li>
              <li>Safety requirements may differ</li>
            </ul>
            <p className="mt-4 font-semibold text-white">
              Always contact the business directly before booking.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              3. No Responsibility for Third Parties
            </h2>
            <p>We are not responsible for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Services provided by listed businesses</li>
              <li>Injuries sustained at rage rooms</li>
              <li>Payment disputes</li>
              <li>Customer experience variance</li>
              <li>Safety practices</li>
            </ul>
            <p className="mt-4">
              All experiences are between you and the rage room business.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              4. External Links
            </h2>
            <p>
              We link to external websites.
            </p>
            <p>
              We do not control or guarantee the content or policies of third-party sites.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              5. Use at Your Own Risk
            </h2>
            <p>By using our site, you acknowledge:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You participate in rage room activities at your own risk</li>
              <li>RageRoom Directory cannot be held liable for injuries, damages, or losses arising from activities conducted by listed businesses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              6. Contact
            </h2>
            <p>If you have concerns about content accuracy:</p>
            <p>
              👉 Email us at <a href="mailto:ukrageroom@gmail.com" className="text-orange-500 hover:text-orange-600 underline">ukrageroom@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

