import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle, Clock, ClipboardCheck } from "lucide-react"
import TrackedProductLink from "@/components/TrackedProductLink"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"

export const metadata: Metadata = {
  title: "Corporate Rage Room Team Building UK | Planning Guide",
  description:
    "Plan a corporate rage room team-building event in the UK with venue questions, safety checks, budget approval tips and staff invite guidance.",
  alternates: { canonical: "/corporate-rage-room-team-building-uk" },
}

const checks = [
  "Group size, session length and rotation plan",
  "Protective equipment and staff briefing process",
  "Waivers, age rules and accessibility needs",
  "Travel, arrival times, food plans and after-event options",
]

export default function CorporateTeamBuildingGuidePage() {
  const product = getDigitalProduct("corporate-team-building-toolkit")!
  const analyticsProduct = getDigitalProductAnalytics(product)

  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-widest text-rage-500">
          Corporate planning guide
        </p>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-wide text-white sm:text-5xl">
          Corporate Rage Room Team Building UK
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-zinc-300">
          Rage rooms can make a memorable team social, morale reward or offsite activity,
          but work events need more planning than a casual night out.
        </p>

        <section className="mt-10 space-y-8 text-zinc-300">
          <div>
            <h2 className="text-2xl font-bold text-white">What is a corporate rage room team-building event?</h2>
            <p className="mt-3">
              It is a booked group experience where colleagues visit a supervised rage room
              or smash room as a shared novelty activity. The focus is entertainment,
              team social time and a memorable break from the usual office routine.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Who it works for</h2>
            <p className="mt-3">
              Rage room work socials can suit HR teams, startups, department leads and
              office managers planning staff rewards, company offsites or informal team days.
              They work best when staff know what to expect and the venue can support the group size.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">What to check before booking</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {checks.map((check) => (
                <div key={check} className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-[#181818] p-4">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rage-500" />
                  <span className="text-sm">{check}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Budget and approval considerations</h2>
            <p className="mt-3">
              Before asking for approval, collect the expected headcount, venue cost,
              travel costs, food plans, cancellation terms and the purpose of the event.
              Clear numbers make sign-off much easier.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Safety, waivers and staff communication</h2>
            <p className="mt-3">
              Ask the venue how briefings, protective equipment and waivers work. Share
              practical details with staff ahead of time, including what to wear, arrival
              time and any participation requirements. Venue rules, staff instructions and
              company policies should always come first.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Suggested 3-hour event schedule</h2>
            <div className="mt-4 card-base p-5">
              {[
                "Arrival, check-in and briefing",
                "Rage room sessions in groups",
                "Photos, regroup and travel",
                "Food, drinks or informal team reflection",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-zinc-800 py-3 last:border-b-0">
                  <Clock className="h-4 w-4 text-rage-500" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-rage-500/30 bg-[#181818] p-6">
          <ClipboardCheck className="h-9 w-9 text-rage-500" />
          <h2 className="mt-4 text-2xl font-bold text-white">
            Build your team event — {product.priceLabel}
          </h2>
          <p className="mt-3 text-zinc-300">
            Use the Corporate Event Builder to create your budget, shortlist venues,
            prepare internal approval and generate invite messages for your team.
          </p>
          <TrackedProductLink
            href="/digital-downloads/corporate-rage-room-team-building-toolkit"
            product={analyticsProduct}
            listName="Corporate Landing CTA"
            className="btn-rage mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 text-sm uppercase tracking-wider"
          >
            Build My Team Event
            <ArrowRight className="h-4 w-4" />
          </TrackedProductLink>
        </section>
      </article>
    </div>
  )
}
