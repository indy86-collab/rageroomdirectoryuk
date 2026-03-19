import { Metadata } from "next"
import Breadcrumbs from "@/components/Breadcrumbs"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact Us | RageRoom Directory",
  description: "Get in touch with RageRoom Directory. Submit a venue, report incorrect information, ask a question, or suggest an improvement.",
}

export default function ContactPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 mt-4">
          Contact Us
        </h1>

        <div className="text-base sm:text-lg text-zinc-300 mb-6 space-y-3">
          <p>
            RageRoom Directory is maintained by a small team dedicated to keeping the UK's most
            complete rage room directory accurate and useful. Whether you've spotted an error,
            want to suggest a new venue, or just have a question — we'd like to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
              General Enquiries
            </h2>
            <p className="text-zinc-400 mb-3">
              Questions about the directory, how we operate, or anything rage-room related.
            </p>
            <a href="mailto:ukrageroom@gmail.com" className="text-orange-500 hover:text-orange-600 font-medium">
              ukrageroom@gmail.com
            </a>
          </div>

          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
              List Your Venue
            </h2>
            <p className="text-zinc-400 mb-3">
              Own a rage room? Get your venue in front of visitors searching across the UK.
            </p>
            <Link href="/list-your-rage-room" className="text-orange-500 hover:text-orange-600 underline font-medium">
              Submit your venue →
            </Link>
          </div>

          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
              Report Incorrect Information
            </h2>
            <p className="text-zinc-400 mb-3">
              Found wrong pricing, a closed venue, or outdated contact details? Let us know
              and we'll update it.
            </p>
            <a href="mailto:ukrageroom@gmail.com?subject=Listing%20Correction" className="text-orange-500 hover:text-orange-600 font-medium">
              Report an issue →
            </a>
          </div>

          <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
              Media & Partnerships
            </h2>
            <p className="text-zinc-400 mb-3">
              Press enquiries, partnership proposals, or collaboration ideas.
            </p>
            <a href="mailto:ukrageroom@gmail.com?subject=Partnership%20Enquiry" className="text-orange-500 hover:text-orange-600 font-medium">
              ukrageroom@gmail.com
            </a>
          </div>
        </div>

        {/* Response time note */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-5 sm:p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
            What to Expect
          </h2>
          <div className="space-y-3 text-zinc-300">
            <p>
              We aim to respond to all emails within 48 hours. If you're reporting a listing
              correction, we typically investigate and update within a few business days.
            </p>
            <p>
              For venue submissions, we verify the information provided before publishing,
              which usually takes 3-5 business days. See our{" "}
              <Link href="/editorial-policy" className="text-orange-500 hover:text-orange-600 underline">
                editorial policy
              </Link>{" "}
              for details on how we verify listings.
            </p>
          </div>
        </div>

        {/* Contact FAQ */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-5 sm:p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
            Common Questions
          </h2>
          <div className="space-y-4">
            <details className="group border-b border-zinc-700 pb-4">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium py-1 hover:text-orange-500 transition-colors">
                I own a rage room — how do I get listed?
                <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                Visit our <Link href="/list-your-rage-room" className="text-orange-500 hover:text-orange-600 underline">listing submission page</Link> and
                fill in your venue details. Alternatively, email us at ukrageroom@gmail.com with your
                venue name, location, website, and pricing. We'll verify the information and add your
                listing, typically within 3-5 business days.
              </p>
            </details>
            <details className="group border-b border-zinc-700 pb-4">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium py-1 hover:text-orange-500 transition-colors">
                The information on my venue's listing is wrong — how do I fix it?
                <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                Email us at ukrageroom@gmail.com with the venue name and what needs correcting. If
                you're the venue owner, let us know and we can prioritise the update. We can correct
                prices, contact details, descriptions, and images.
              </p>
            </details>
            <details className="group border-b border-zinc-700 pb-4">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium py-1 hover:text-orange-500 transition-colors">
                Do you charge venues to be listed?
                <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                No. Basic directory listings are free. We don't charge venues for inclusion, and
                listing placement is not influenced by payment. We may offer optional premium
                features in the future, but standard listings will always be free.
              </p>
            </details>
            <details className="group border-b border-zinc-700 pb-4">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium py-1 hover:text-orange-500 transition-colors">
                How often is the directory updated?
                <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                We review and update listings on an ongoing basis. New venues are added as we
                discover them, and existing listings are periodically re-checked for accuracy. If
                a venue has permanently closed, we remove it from the directory.
              </p>
            </details>
            <details className="group pb-4">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium py-1 hover:text-orange-500 transition-colors">
                Can I leave a review on a listing?
                <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                Yes. Registered users can leave reviews on any listing page. You'll need to create
                a free account first. We also display Google reviews for venues where we have a
                verified Google Place ID.
              </p>
            </details>
          </div>
        </div>

        {/* Helpful links */}
        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
            Helpful Links
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/listings" className="text-orange-500 hover:text-orange-600 underline text-sm">
              Browse All Listings
            </Link>
            <Link href="/guides" className="text-orange-500 hover:text-orange-600 underline text-sm">
              Guides & Resources
            </Link>
            <Link href="/editorial-policy" className="text-orange-500 hover:text-orange-600 underline text-sm">
              Editorial Policy
            </Link>
            <Link href="/about" className="text-orange-500 hover:text-orange-600 underline text-sm">
              About Us
            </Link>
            <Link href="/privacy" className="text-orange-500 hover:text-orange-600 underline text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-orange-500 hover:text-orange-600 underline text-sm">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
