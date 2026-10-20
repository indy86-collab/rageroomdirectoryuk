import type { Metadata } from "next"
import CuratedActivitiesAffiliate from "@/components/CuratedActivitiesAffiliate"

export const metadata: Metadata = {
  title: "GetYourGuide recommendation preview",
  description: "Review the five-city GetYourGuide recommendation pilot.",
  robots: { index: false, follow: false },
}

const cities = ["London", "Manchester", "Birmingham", "Edinburgh", "Liverpool"]

export default function GetYourGuidePreviewPage() {
  return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
    <p className="text-sm font-semibold uppercase tracking-wider text-orange-400">Preview</p>
    <h1 className="mt-2 text-3xl font-bold text-white">GetYourGuide recommendations</h1>
    <p className="mt-4 max-w-3xl leading-7 text-zinc-300">
      Review the optional experiences for each pilot city. Use the planner to check different groups, interests and timings.
      This page shows the new cards while regular pages can remain on the measurement-first rollout. Venue bookings stay primary on the directory.
    </p>
    <nav aria-label="Preview cities" className="mt-5 flex flex-wrap gap-3">
      {cities.map(city => <a key={city} href={`#${city.toLowerCase()}`} className="inline-flex min-h-11 items-center rounded border border-zinc-600 px-3 text-orange-300">{city}</a>)}
    </nav>
    {cities.map(city => <div id={city.toLowerCase()} key={city} className="scroll-mt-24">
      <CuratedActivitiesAffiliate city={city} placement="preview" />
    </div>)}
  </main>
}
