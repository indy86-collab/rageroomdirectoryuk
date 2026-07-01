import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, PartyPopper } from "lucide-react"

export const metadata: Metadata = {
  title: "Rage Room Planning Downloads | Printable Event Packs",
  description:
    "Browse printable rage room planning downloads for birthdays, group nights and corporate team-building events.",
  alternates: { canonical: "/digital-downloads" },
}

const downloads = [
  {
    title: "Rage Room Party Planner Pack",
    price: "£7",
    copy: "For birthdays, date nights, breakup nights and friends planning a group smash session.",
    cta: "View party planner",
    href: "/digital-downloads/rage-room-party-planner-pack",
    icon: PartyPopper,
  },
  {
    title: "Corporate Rage Room Team-Building Toolkit",
    price: "£19",
    copy: "For HR teams, office managers and team leads planning a rage room work social or team-building event.",
    cta: "View corporate toolkit",
    href: "/digital-downloads/corporate-rage-room-team-building-toolkit",
    icon: BriefcaseBusiness,
  },
]

export default function DigitalDownloadsPage() {
  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black uppercase tracking-wide text-white sm:text-5xl">
          Rage Room Planning Downloads
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-300">
          Printable planning packs for organising rage room events without starting from a blank page.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {downloads.map(({ title, price, copy, cta, href, icon: Icon }) => (
            <article key={title} className="card-base p-5 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
                <Icon className="h-5 w-5 text-rage-500" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{copy}</p>
              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="text-2xl font-black text-white">{price}</span>
                <Link
                  href={href}
                  className="btn-rage inline-flex min-h-[44px] items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  {cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
