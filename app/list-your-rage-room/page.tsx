import Link from "next/link"

export const metadata = {
  title: "List Your Rage Room | Rage Room Directory UK",
  description: "List your rage room business or update your existing listing. Contact us to add your rage room to the UK's premier directory.",
}

export default function ListYourRageRoomPage() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-white">
          List Your Rage Room
        </h1>
        <p className="text-lg text-zinc-300 mb-8">
          Are you a rage room business owner? Get your venue listed on the UK's premier rage room directory and reach thousands of potential customers.
        </p>

        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            For Existing Listings
          </h2>
          <p className="text-white mb-4">
            If your rage room is already listed on our directory and you'd like to update your information, add photos, or provide additional details, please contact us.
          </p>
          <p className="text-zinc-400 text-sm">
            We can help you enhance your listing with more information, better photos, and additional features to help customers find and book your venue.
          </p>
        </div>

        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            For New Listings
          </h2>
          <p className="text-white mb-4">
            Want to list your rage room business? We'd love to feature you on our directory!
          </p>
          <p className="text-zinc-400 text-sm mb-4">
            Listing your rage room on our directory helps you:
          </p>
          <ul className="list-disc list-inside text-zinc-400 text-sm space-y-2 mb-4">
            <li>Reach thousands of potential customers searching for rage rooms</li>
            <li>Increase your online visibility and bookings</li>
            <li>Get featured in our search results and city pages</li>
            <li>Build credibility with verified listings</li>
          </ul>
          <p className="text-zinc-400 text-sm">
            Contact us to get started with your listing today.
          </p>
        </div>

        <div className="bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Contact Us
          </h2>
          <p className="text-white mb-4">
            Ready to list your rage room or update your existing listing? Get in touch with us:
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">
                Email
              </p>
              <a
                href="mailto:ukrageroom@gmail.com"
                className="text-orange-500 hover:text-orange-600 transition-colors"
              >
                ukrageroom@gmail.com
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">
                What to Include
              </p>
              <ul className="list-disc list-inside text-zinc-400 text-sm space-y-1">
                <li>Your business name and location</li>
                <li>Contact information (phone, email, website)</li>
                <li>Photos of your rage room</li>
                <li>Pricing information</li>
                <li>Any special features or services</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

