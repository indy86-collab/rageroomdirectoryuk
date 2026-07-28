import Link from "next/link"

export const metadata = {
  title: "List Your Rage Room | Rage Room Directory UK",
  description:
    "List your rage room business or update your existing listing. Priority outreach for Manchester, Glasgow, Leeds and Bristol venues.",
  alternates: { canonical: "/list-your-rage-room" },
}

const PRIORITY_CITIES = [
  {
    city: "Manchester",
    why: "High search demand, thin in-city inventory — nearest venues already get Manchester traffic.",
  },
  {
    city: "Glasgow",
    why: "Scotland’s largest city and a major stag/hen destination with room for more verified listings.",
  },
  {
    city: "Leeds",
    why: "West Yorkshire search volume with limited dedicated in-city smash rooms.",
  },
  {
    city: "Bristol",
    why: "South West hub — strong group and creative-crowd demand for destruction therapy.",
  },
]

export default function ListYourRageRoomPage() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-4 text-4xl font-bold text-white">List Your Rage Room</h1>
        <p className="mb-8 text-lg text-zinc-300">
          Are you a rage room business owner? Get your venue listed on the UK&apos;s
          premier rage room directory and reach thousands of potential customers.
        </p>

        <div className="mb-8 rounded-lg border border-rage-500/40 bg-rage-500/10 p-6">
          <h2 className="mb-3 text-2xl font-bold text-white">
            Priority cities we want to list next
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-zinc-300">
            We are actively expanding inventory in high-demand cities. If you operate
            in Manchester, Glasgow, Leeds or Bristol (or nearby), email us first —
            we will prioritise verification and city-page placement.
          </p>
          <ul className="mb-5 space-y-3">
            {PRIORITY_CITIES.map(({ city, why }) => (
              <li
                key={city}
                className="rounded-md border border-zinc-800 bg-[#181818] p-4"
              >
                <p className="font-bold text-white">{city}</p>
                <p className="mt-1 text-sm text-zinc-400">{why}</p>
                <Link
                  href={`/city/${city.toLowerCase()}`}
                  className="mt-2 inline-flex text-sm font-semibold text-orange-500 hover:text-orange-400"
                >
                  See current {city} coverage →
                </Link>
              </li>
            ))}
          </ul>
          <a
            href="mailto:ukrageroom@gmail.com?subject=List%20my%20rage%20room%20(priority%20city)&body=Business%20name%3A%0ACity%3A%0AWebsite%3A%0AStarting%20price%20(approx)%3A%0A"
            className="btn-rage inline-flex min-h-[44px] items-center justify-center px-5 text-sm uppercase tracking-wider"
          >
            Email to get listed
          </a>
        </div>

        <div className="mb-8 overflow-hidden rounded-lg border border-zinc-800 bg-[#181818] p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">For Existing Listings</h2>
          <p className="mb-4 text-white">
            If your rage room is already listed and you&apos;d like to update information,
            add photos, or correct pricing, contact us.
          </p>
          <p className="text-sm text-zinc-400">
            Accurate prices and photos help you appear in city price pages and rich
            results.
          </p>
        </div>

        <div className="mb-8 overflow-hidden rounded-lg border border-zinc-800 bg-[#181818] p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">For New Listings</h2>
          <p className="mb-4 text-white">
            Want to list your rage room business? We&apos;d love to feature you.
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-5 text-sm text-zinc-400">
            <li>Reach customers searching for rage rooms near them</li>
            <li>Appear on city, region and price comparison pages</li>
            <li>Get included in guides and the UK map</li>
            <li>Build credibility with a verified listing</li>
          </ul>
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-800 bg-[#181818] p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">Contact Us</h2>
          <p className="mb-4 text-white">
            Ready to list or update? Email{" "}
            <a
              href="mailto:ukrageroom@gmail.com"
              className="text-orange-500 hover:text-orange-600"
            >
              ukrageroom@gmail.com
            </a>
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-400">
            <li>Business name and location</li>
            <li>Website, phone and booking link</li>
            <li>Photos of your rage room</li>
            <li>Starting price / package overview</li>
            <li>Any special features (BYO, corporate, hen/stag)</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-orange-500 hover:text-orange-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
