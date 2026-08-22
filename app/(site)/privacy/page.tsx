import { Metadata } from "next"
import Breadcrumbs from "@/components/Breadcrumbs"
import PrivacySettingsButton from "@/components/PrivacySettingsButton"

export const metadata: Metadata = {
  title: "Privacy Policy | RageRoom Directory - UK GDPR Compliant",
  description: "Read RageRoom Directory's UK GDPR compliant privacy policy. Learn how we collect, use, store, and protect your personal data in accordance with UK data protection laws.",
  alternates: { canonical: "/privacy" },
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

  const lastUpdated = "22 August 2026"

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
              B2. Free Prep Pack / Lead Magnet
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Email address (required to deliver the free First Visit Prep Pack; a fulfilment copy is also sent to the site operator)</li>
              <li>First name (optional)</li>
              <li>Marketing opt-in preference (optional — requesting the pack alone is not marketing consent)</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold text-white mt-4 sm:mt-6 mb-2 sm:mb-3">
              B3. Digital Product Purchases
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Email address and payment confirmation details processed by Stripe for paid digital products</li>
              <li>Order metadata needed to unlock downloads or interactive tools after payment</li>
              <li>Transactional access emails (purchase confirmation / download or tool links)</li>
            </ul>
            <p className="mt-3 text-sm text-zinc-400">
              Payment card details are handled by Stripe and are not stored on our servers.
            </p>

            <h3 className="text-lg sm:text-xl font-semibold text-white mt-4 sm:mt-6 mb-2 sm:mb-3">
              B4. Corporate Event Builder (organiser tool)
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Event planning details you enter in the builder (for example team size, budget, venue shortlist notes, and generated message drafts)</li>
              <li>These plan details are stored in your browser (local storage) while you use the builder — not used as a public listing. Payment is only required to download the full PDF pack.</li>
            </ul>

            <h3 className="text-lg sm:text-xl font-semibold text-white mt-4 sm:mt-6 mb-2 sm:mb-3">
              B5. Corporate Booking System (venue-owner workspace)
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Venue/business profile details you enter in your workspace</li>
              <li>Corporate package, quote and proposal content you create</li>
              <li>Corporate lead/contact details and message drafts you choose to store for follow-up</li>
            </ul>
            <p className="mt-3 text-sm text-zinc-400">
              This is operational customer data you provide as a venue operator. It is stored so you can return to your paid workspace. It is separate from optional marketing consent.
            </p>

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
            <p>
              Essential browser storage supports features you request and records your privacy
              choice. Optional analytics is off until you accept it. The table below describes
              the technologies controlled by that choice.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 text-white">
                    <th className="p-3">Provider / technology</th>
                    <th className="p-3">Purpose and device access</th>
                    <th className="p-3">Optional?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <th className="p-3 align-top text-white">RageRoom consent preference</th>
                    <td className="p-3">First-party local storage records version, analytics choice and decision time for up to 180 days. It contains no visitor ID.</td>
                    <td className="p-3 align-top">No — needed to remember your choice</td>
                  </tr>
                  <tr>
                    <th className="p-3 align-top text-white">Google Analytics 4 (GA4)</th>
                    <td className="p-3">Measures page use, directory discovery and conversion events. GA4 may set first-party identifiers such as <code>_ga</code>. Our event contract excludes form text, contact details, query strings and precise coordinates.</td>
                    <td className="p-3 align-top">Yes — opt-in</td>
                  </tr>
                  <tr>
                    <th className="p-3 align-top text-white">Vercel Web Analytics</th>
                    <td className="p-3">Measures page views and basic usage. Vercel states that this product does not use cookies and derives a daily-changing hash rather than storing an IP address.</td>
                    <td className="p-3 align-top">Yes — opt-in on this site</td>
                  </tr>
                  <tr>
                    <th className="p-3 align-top text-white">Cloudflare Web Analytics</th>
                    <td className="p-3">Measures page-load and performance information. Cloudflare states that its Web Analytics beacon uses no cookies or local storage and does not fingerprint visitors.</td>
                    <td className="p-3 align-top">Yes — opt-in on this site</td>
                  </tr>
                  <tr>
                    <th className="p-3 align-top text-white">Feature storage</th>
                    <td className="p-3">First-party local or session storage saves user-entered planner/workspace state, purchase access email on the device, game progress and technical app state where those features are used.</td>
                    <td className="p-3 align-top">No — feature-led</td>
                  </tr>
                  <tr>
                    <th className="p-3 align-top text-white">Google Maps embed</th>
                    <td className="p-3">No map request is made until you press a load-map button. Google may then receive request, device and network information under its own policy.</td>
                    <td className="p-3 align-top">Separate user-requested feature</td>
                  </tr>
                  <tr>
                    <th className="p-3 align-top text-white">GetYourGuide widget</th>
                    <td className="p-3">No GetYourGuide widget or script is requested until you press the show-activities button. GetYourGuide may then receive request, device and network information and set an affiliate cookie under its own policy.</td>
                    <td className="p-3 align-top">Separate user-requested feature</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Google AdSense Auto ads can appear on directory pages. Advertising consent for UK,
              EEA and Swiss visitors is collected by Google&apos;s certified Privacy &amp; messaging
              CMP (IAB TCF), not by the analytics toggle on this page. Accepting analytics does not
              turn ads on, and rejecting analytics does not turn ads off. Use Google&apos;s privacy
              message to change ad choices, and the control below for analytics.
            </p>
            <PrivacySettingsButton className="mt-3 min-h-[44px] rounded-md border border-zinc-600 px-4 text-sm font-semibold text-white hover:border-orange-500" />
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
              <li>Delivering free checklists and paid digital products</li>
              <li>Providing the Corporate Event Builder, paid PDF downloads, and venue-owner workspaces</li>
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
              <li>Consent (optional analytics, optional marketing opt-in, and advertising via Google&apos;s CMP where required)</li>
              <li>Legitimate interests where appropriate for service security and improvement that does not rely on optional browser storage</li>
              <li>Contractual necessity (digital product fulfilment, listing submissions, venue-owner workspace operation)</li>
              <li>Compliance with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              4. Data Sharing
            </h2>
            <p>We may share data with:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Vercel</strong> - Our hosting provider, which processes your IP address and request data</li>
              <li><strong>Vercel Web Analytics</strong> - Optional page-view measurement after analytics opt-in</li>
              <li><strong>Cloudflare</strong> - Hosting-edge security and delivery may process request metadata independently of the optional Cloudflare Web Analytics beacon; the Web Analytics beacon runs only after analytics opt-in</li>
              <li><strong>Stripe</strong> - Payment processing for paid digital products</li>
              <li><strong>Resend</strong> - Transactional email delivery for checklist and purchase access messages (and optional marketing audience updates only when you opt in)</li>
              <li><strong>Upstash</strong> - Durable storage for Corporate Booking System venue-owner workspaces when configured</li>
              <li><strong>Google Analytics</strong> - Optional page, product, funnel and directory-event analytics after opt-in</li>
              <li><strong>Google AdSense</strong> - Advertising; Google and participating ad partners may receive request, device and consent signals under Google&apos;s CMP and policies</li>
              <li>Email service providers (contact forms and transactional mail)</li>
            </ul>
            <p className="mt-4">
              We limit disclosures to those needed for each service and review provider terms and safeguards. Provider use is also governed by its own terms and privacy information.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              5. Data Retention
            </h2>
            <p>We retain data only as long as needed:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Consent preference: up to 180 days, then we request a fresh choice</li>
              <li>Analytics: according to the retention configured in each provider; contact us for the current configuration</li>
              <li>Contact submissions: until resolved</li>
              <li>Free checklist delivery records: as needed to provide access and prevent abuse</li>
              <li>Paid digital purchase access links: according to the product (download links typically expire; interactive tool access follows the purchase access model)</li>
              <li>Corporate Booking System workspace data: while needed to provide the paid workspace, or until a deletion request is handled</li>
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
              8. Google Services
            </h2>
            <p>
              We use Google services only in the circumstances described here:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Google Analytics 4</strong> - loaded only after analytics opt-in; advertising storage, user-data and personalisation signals remain denied</li>
              <li><strong>Google Maps</strong> - loaded only when you explicitly press a load-map button; this choice is separate from analytics</li>
              <li><strong>Google AdSense</strong> - advertising network. UK/EEA/Swiss consent is handled by Google&apos;s certified Privacy &amp; messaging CMP; this is separate from analytics</li>
            </ul>
            <p className="mt-4">
              Google&apos;s use of information is governed by their <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 underline">Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              9. Cloudflare
            </h2>
            <p>
              Cloudflare may process requests at the hosting/network edge to protect the website and improve delivery. This is separate from the optional Cloudflare Web Analytics beacon. Edge services may process:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>IP addresses</li>
              <li>Request metadata</li>
              <li>Browser information</li>
              <li>Security logs</li>
            </ul>
            <p className="mt-4">
              The Web Analytics beacon is not requested until analytics opt-in. Cloudflare states that the beacon does not use cookies, local storage or fingerprinting.
            </p>
            <p className="mt-4">
              Cloudflare's privacy practices are detailed in their <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 underline">Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              10. Third-Party Links
            </h2>
            <p>
              Our site links to external businesses, including GetYourGuide for
              complementary tours around a rage-room visit. The GetYourGuide
              widget and script load only when you press the show-activities
              button; this choice is separate from analytics. We are not
              responsible for their privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              11. Changes to this Policy
            </h2>
            <p>
              We may update this policy as needed. Changes will be posted on this page with an updated "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 mb-3 sm:mb-4">
              12. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your data protection rights, please contact us:
            </p>
            <p className="mt-4">
              Email: <a href="mailto:ukrageroom@gmail.com" className="text-orange-500 hover:text-orange-600 underline">ukrageroom@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
