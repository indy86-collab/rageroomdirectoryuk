import type { Metadata } from "next"
import Link from "next/link"
import { Check, ClipboardList, Download, Sparkles } from "lucide-react"
import DigitalBundleOffer from "@/components/DigitalBundleOffer"
import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import {
  DigitalPurchaseReassurance,
  DigitalValueStack,
  WhatHappensAfterPayment,
} from "@/components/DigitalPurchaseDetails"
import FAQ from "@/components/FAQ"
import ProductViewTracker from "@/components/ProductViewTracker"
import TrackedProductLink from "@/components/TrackedProductLink"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"

const product = getDigitalProduct("rage-room-party-planner")!
const analyticsProduct = getDigitalProductAnalytics(product)
const corporateProduct = getDigitalProduct("corporate-team-building-toolkit")!
const corporateAnalyticsProduct = getDigitalProductAnalytics(corporateProduct)
const giftProduct = getDigitalProduct("rage-room-gift-voucher-template-pack")!
const giftAnalyticsProduct = getDigitalProductAnalytics(giftProduct)

export const metadata: Metadata = {
  title: "Rage Room Party Planner Pack | Printable UK Event Planner",
  description:
    "Download a printable rage room party planner pack for birthdays, date nights, breakup nights and group events. Includes budget planner, venue scorecard, invite templates, safety checklist and final booking checklist.",
  alternates: {
    canonical: "/digital-downloads/rage-room-party-planner-pack",
  },
}

const trustBullets = [
  "Printable PDF",
  "15-page planning kit",
  "UK edition",
  "Sample preview available",
]

const includedGroups = [
  {
    title: "Plan the event",
    items: ["Event snapshot", "Planning timeline", "Budget planner", "RSVP tracker"],
  },
  {
    title: "Choose the venue",
    items: ["Venue scorecard", "Booking questions", "Safety checklist", "Travel planner"],
  },
  {
    title: "Make it fun",
    items: [
      "Invite templates",
      "Photo/video shot list",
      "Smash night games",
      "Mini invites",
      "Final checklist",
    ],
  },
]

const audiences = [
  "Birthday planners",
  "Date nights",
  "Breakup reset nights",
  "Group nights out",
  "Stag/hen groups",
  "Friends organising something different",
]

const faqs = [
  {
    question: "Does this include a rage room booking?",
    answer: "No. This is a planning template pack. You still book directly with your chosen venue.",
  },
  {
    question: "Is it UK-specific?",
    answer: "Yes. It uses UK-focused planning language and GBP budgeting fields.",
  },
  {
    question: "Is it printable?",
    answer: "Yes. It is designed as an A4 printable PDF.",
  },
  {
    question: "Can I use it digitally?",
    answer: "Yes. You can open it on phone, tablet or laptop.",
  },
  {
    question: "Is this safety advice?",
    answer:
      "No. It is a planning aid. Always follow the venue's rules, waiver requirements and staff instructions.",
  },
  {
    question: "Why does the download link expire?",
    answer:
      "The secure link expires after 72 hours to keep delivery private. Once you download the PDF, it is yours to keep forever. We also email the link to the address you use at checkout.",
  },
  {
    question: "Can I get help or a refund?",
    answer:
      "If the file is faulty or will not open, we will replace it or refund you — contact us within 7 days. Change-of-mind refunds are not offered on instant digital downloads after a successful download.",
  },
]

function ProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute left-8 top-8 h-full w-full rounded-lg bg-rage-500/25 blur-sm" />
      <div className="relative overflow-hidden rounded-lg border border-zinc-700 bg-zinc-100 p-5 text-zinc-950 shadow-2xl shadow-black/40">
        <div className="rounded-md bg-[#151515] p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-rage-500">
            Printable UK Planner
          </p>
          <h2 className="mt-4 font-display text-5xl leading-none text-white">
            Rage Room
            <span className="block text-rage-500">Party Planner</span>
          </h2>
          <p className="mt-4 text-sm text-zinc-300">
            Event snapshot, budget, venue scorecard, invites, games and final checklist.
          </p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-semibold">
          {["Budget", "RSVP", "Safety", "Itinerary"].map((item) => (
            <div key={item} className="rounded border border-zinc-300 bg-white p-3">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-5 h-2 rounded-full bg-rage-500" />
      </div>
    </div>
  )
}

export default function RageRoomPartyPlannerPackPage() {
  return (
    <div className="bg-dark-900">
      <ProductViewTracker product={analyticsProduct} />
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-rage-500">
              One-time digital download
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-wide text-white sm:text-5xl lg:text-6xl">
              Rage Room Party Planner Pack
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
              Plan a birthday, date night, breakup night or group smash session without
              the admin chaos.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div>
                <div className="text-3xl font-black text-white">{product.priceLabel}</div>
                <p className="mt-1 text-xs font-semibold text-zinc-400">
                  Instant PDF download
                </p>
              </div>
              <DigitalCheckoutButton
                productId={product.id}
                analyticsProduct={analyticsProduct}
              >
                Plan the whole night — £7
              </DigitalCheckoutButton>
            </div>
            <DigitalValueStack
              title="Updated for UK venues 2026"
              items={[
                "15 printable pages — venue scorecard, budget, RSVP, invites and checklists",
                "Built for birthdays, date nights, hen/stag and group smash nights",
                "Sample preview available before you buy",
              ]}
              timeCompare="Worth hours of DIY planning for less than a coffee round."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {trustBullets.map((bullet) => (
                <span
                  key={bullet}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-[#181818] px-3 py-1.5 text-xs font-semibold text-zinc-200"
                >
                  <Check className="h-3.5 w-3.5 text-rage-500" />
                  {bullet}
                </span>
              ))}
            </div>
            <DigitalPurchaseReassurance />
            {product.previewPdf && (
              <Link
                href={product.previewPdf}
                className="mt-5 inline-flex text-sm font-semibold text-rage-500 hover:text-rage-400"
              >
                View sample pages
              </Link>
            )}
          </div>
          <ProductMockup />
        </div>
      </section>

      <section className="section-textured px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="section-title">
            Rage room nights are fun. Organising them is the annoying part.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg">
            Picking the venue, confirming the group, chasing payments, checking rules,
            sending invites and planning food after can quickly become messy. This planner
            gives you one simple place to organise it all.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 id="whats-included" className="section-title mb-6">What’s Included</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {includedGroups.map((group) => (
              <div key={group.title} className="card-base p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
                  <ClipboardList className="h-5 w-5 text-rage-500" />
                </div>
                <h3 className="text-lg font-bold text-white">{group.title}</h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-rage-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-textured px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title mb-6">Who It Is For</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((audience) => (
              <div
                key={audience}
                className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-[#181818] p-4"
              >
                <Sparkles className="h-4 w-4 flex-shrink-0 text-rage-500" />
                <span className="text-sm font-semibold text-zinc-200">{audience}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <WhatHappensAfterPayment />
          <div className="card-base p-5">
            <FAQ items={faqs} title="Planner Pack FAQs" />
          </div>
        </div>
      </section>

      <section className="section-textured px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl rounded-lg border border-zinc-800 bg-[#181818] p-6">
          <h2 className="text-xl font-bold text-white">Planning for work?</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            For workplace team-building, use the Corporate Rage Room Team-Building Toolkit
            instead. It includes approval templates, staff invite emails, a venue scorecard
            and a feedback form.
          </p>
          <TrackedProductLink
            href="/digital-downloads/corporate-rage-room-team-building-toolkit"
            product={corporateAnalyticsProduct}
            listName="Digital Product Cross-Sell"
            className="mt-4 inline-flex text-sm font-semibold text-rage-500 hover:text-rage-400"
          >
            View corporate toolkit
          </TrackedProductLink>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <DigitalBundleOffer />
          <p className="mt-4 text-center text-sm text-zinc-400">
            Or get just the{" "}
            <TrackedProductLink
              href="/digital-downloads/rage-room-gift-voucher-template-pack"
              product={giftAnalyticsProduct}
              listName="Digital Product Cross-Sell"
              className="font-semibold text-rage-500 hover:text-rage-400"
            >
              gift voucher pack for £5
            </TrackedProductLink>
            .
          </p>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 sm:pb-16">
        <div className="mx-auto max-w-4xl rounded-lg border border-rage-500/30 bg-[#181818] p-6 text-center sm:p-8">
          <Download className="mx-auto h-10 w-10 text-rage-500" />
          <h2 className="mt-4 text-2xl font-black uppercase tracking-wide text-white">
            Plan the whole night — £7
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-300">
            Instant PDF download for venue, group, budget and night-out details.
          </p>
          <div className="mt-6 flex justify-center">
            <DigitalCheckoutButton
              productId={product.id}
              analyticsProduct={analyticsProduct}
            >
              Plan the whole night — £7
            </DigitalCheckoutButton>
          </div>
          <div className="mx-auto max-w-2xl">
            <DigitalPurchaseReassurance className="justify-center" />
          </div>
        </div>
      </section>
    </div>
  )
}
