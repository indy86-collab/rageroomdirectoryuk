import { Metadata } from "next"
import Breadcrumbs from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "Privacy Policy | RageRoom Directory - UK GDPR Compliant",
  description: "Read RageRoom Directory's UK GDPR compliant privacy policy. Learn how we collect, use, store, and protect your personal data in accordance with UK data protection laws.",
  openGraph: {
    title: "Privacy Policy | RageRoom Directory",
    description: "UK GDPR compliant privacy policy explaining how we handle your personal data.",
    type: "website",
  },
}

export default function PrivacyPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Privacy", href: "/privacy" },
  ]

  const lastUpdated = new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 mt-4">
          Privacy Policy
        </h1>

        <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-zinc-300">
          <p className="text-sm text-zinc-400">
            Last updated: {lastUpdated}
          </p>

          <p>
            This Privacy Policy explains how RageRoom Directory ("we", "us", "our") collects, uses, stores, and protects your personal data when you use our website.
          </p>

          <p>
            We comply with the <strong>UK GDPR</strong>, the <strong>Data Protection Act 2018</strong>, and all applicable privacy regulations.
          </p>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              1. Information We Collect
            </h2>
            <p>We may collect the following information when you use our services:</p>

            <h3 className="text-lg sm:text-xl font-semibold text-white mt-4 sm:mt-6 mb-2 sm:mb-3">
              A. Automatically Collected Data
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device information</li>
              <li>Pages visited</li>
              <li>Time spent on the site</li>
              <li>Search queries</li>
              <li>Referring URLs</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold text-white mt-4 sm:mt-6 mb-2 sm:mb-3">
              B. Contact Form Submissions
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Message content</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold text-white mt-4 sm:mt-6 mb-2 sm:mb-3">
              C. Business Submissions or Listing Updates
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Business name</li>
              <li>Address</li>
              <li>Contact details</li>
              <li>Opening hours</li>
              <li>Photos</li>
              <li>Prices/packages</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold text-white mt-4 sm:mt-6 mb-2 sm:mb-3">
              D. Cookies and Tracking
            </h3>
            <p>We use cookies and analytics tools to improve website performance.</p>
            <p className="mt-2">If Google Analytics or Plausible is used, specify:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Cookies for analytics</li>
              <li>Cookies for functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              2. How We Use Your Data
            </h2>
            <p>We use personal data for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Improving website performance</li>
              <li>Enhancing directory content</li>
              <li>Responding to enquiries</li>
              <li>Maintaining accurate business listings</li>
              <li>Analytics and usage insights</li>
              <li>Detecting security issues</li>
              <li>Future personalisation features</li>
            </ul>
            <p className="mt-4 font-semibold text-white">
              We do not sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              3. Legal Basis for Processing (UK GDPR)
            </h2>
            <p>We process personal data under:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Legitimate interests (analytics, improvements)</li>
              <li>Consent (contact forms, cookies)</li>
              <li>Contractual necessity (when business owners submit listings)</li>
              <li>Compliance with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              4. Data Sharing
            </h2>
            <p>We may share data with:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Hosting provider (Vercel or equivalent)</li>
              <li>Database provider (Supabase, Neon)</li>
              <li>Analytics provider (Plausible, GA4)</li>
              <li>Email service (if using contact form)</li>
            </ul>
            <p className="mt-4">
              All providers comply with GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              5. Data Retention
            </h2>
            <p>We retain data only as long as needed:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Analytics: 12–24 months</li>
              <li>Contact submissions: until resolved</li>
              <li>Business listings: ongoing until business requests removal</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              6. Your Rights (UK GDPR)
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your data</li>
              <li>Request correction</li>
              <li>Request deletion</li>
              <li>Object to processing</li>
              <li>Request data transfer</li>
              <li>Withdraw consent</li>
            </ul>
            <p className="mt-4">
              To exercise any rights:
            </p>
            <p>
              👉 Email: <a href="mailto:ukrageroom@gmail.com" className="text-orange-500 hover:text-orange-600 underline">ukrageroom@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              7. Security
            </h2>
            <p>We implement:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>HTTPS encryption</li>
              <li>Secure hosting</li>
              <li>Access controls</li>
              <li>Regular audits</li>
            </ul>
            <p className="mt-4">
              No method is 100% secure, but we take reasonable steps to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              8. Third-Party Links
            </h2>
            <p>
              Our site links to external businesses. We are not responsible for their privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              9. Changes to this Policy
            </h2>
            <p>
              We may update this policy as needed. Changes will be posted on this page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

