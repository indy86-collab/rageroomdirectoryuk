import { Metadata } from "next"
import Breadcrumbs from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "Terms of Service | RageRoom Directory",
  description: "Read RageRoom Directory's terms of service. Understand the rules and guidelines for using our directory platform.",
  openGraph: {
    title: "Terms of Service | RageRoom Directory",
    description: "Terms and conditions for using RageRoom Directory platform.",
    type: "website",
  },
}

export default function TermsPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Terms", href: "/terms" },
  ]

  const lastUpdated = new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 mt-4">
          Terms of Service
        </h1>

        <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-zinc-300">
          <p className="text-sm text-zinc-400">
            Last updated: {lastUpdated}
          </p>

          <p>
            Welcome to RageRoom Directory. By accessing or using our website, you agree to these Terms of Service.
          </p>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              1. Use of Our Website
            </h2>
            <p>You may use this site for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Browsing rage rooms</li>
              <li>Contacting businesses</li>
              <li>Viewing listings</li>
              <li>Reading blog posts</li>
            </ul>

            <p className="mt-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Scrape or copy large portions of data</li>
              <li>Submit false information</li>
              <li>Interfere with site functionality</li>
              <li>Attempt to bypass security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              2. Business Listings
            </h2>

            <h3 className="text-lg sm:text-xl font-semibold text-white mt-4 sm:mt-6 mb-2 sm:mb-3">
              A. Accuracy
            </h3>
            <p>We strive for accuracy, but:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Listings may change</li>
              <li>Prices may vary</li>
              <li>Opening hours can change</li>
            </ul>
            <p className="mt-4">
              It is your responsibility to confirm details with the business directly.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold text-white mt-4 sm:mt-6 mb-2 sm:mb-3">
              B. Business Submissions
            </h3>
            <p>If you submit a listing:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You confirm the information is accurate</li>
              <li>You grant us permission to publish it</li>
              <li>We may revise, update, or remove content as needed</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              3. Intellectual Property
            </h2>
            <p>All website content:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Text</li>
              <li>Images</li>
              <li>Layout</li>
              <li>Branding</li>
              <li>Database structure</li>
            </ul>
            <p className="mt-4">
              …is owned by RageRoom Directory and may not be copied without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              4. User Accounts (Future Feature)
            </h2>
            <p>If user accounts are added later:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You are responsible for login credentials</li>
              <li>Accounts may be suspended for violations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              5. Liability Disclaimer
            </h2>
            <p>RageRoom Directory:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Does not operate rage rooms</li>
              <li>Does not set prices</li>
              <li>Does not handle bookings</li>
              <li>Is not responsible for injuries, damages, or disputes</li>
            </ul>
            <p className="mt-4">
              See full <a href="/disclaimer" className="text-orange-500 hover:text-orange-600 underline">Disclaimer page</a> below.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              6. Changes to Terms
            </h2>
            <p>
              These Terms may be updated at any time. Continued use of the website means you accept updated terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

