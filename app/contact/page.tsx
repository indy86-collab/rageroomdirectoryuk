import { Metadata } from "next"
import Breadcrumbs from "@/components/Breadcrumbs"

export const metadata: Metadata = {
  title: "Contact Us | RageRoom Directory",
  description: "Get in touch with RageRoom Directory. Have questions, suggestions, or want to list your rage room? Contact us today.",
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

        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-4 sm:p-6 mb-6 sm:mb-8">
          <p className="text-base sm:text-lg text-zinc-300 mb-4 sm:mb-6">
            Have questions about rage rooms, want to suggest a venue, or need help with your listing? We're here to help!
          </p>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                General Inquiries
              </h2>
              <p className="text-zinc-400">
                For general questions about rage rooms or our directory, please email us at{" "}
                <a href="mailto:ukrageroom@gmail.com" className="text-orange-500 hover:text-orange-600">
                  ukrageroom@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                List Your Rage Room
              </h2>
              <p className="text-zinc-400">
                Are you a rage room owner? <a href="/list-your-rage-room" className="text-orange-500 hover:text-orange-600 underline">List your venue</a> on our directory to reach more customers.
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                Report an Issue
              </h2>
              <p className="text-zinc-400">
                Found incorrect information or have a concern about a listing? Email us at{" "}
                <a href="mailto:ukrageroom@gmail.com" className="text-orange-500 hover:text-orange-600">
                  ukrageroom@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

