import type { Metadata } from "next"
import Link from "next/link"
import { Check, ClipboardList, Download, Sparkles } from "lucide-react"
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

const product = getDigitalProduct("rage-room-first-visit-prep")!
const analyticsProduct = getDigitalProductAnalytics(product)
const partyProduct = getDigitalProduct("rage-room-party-planner")!
const partyAnalyticsProduct = getDigitalProductAnalytics(partyProduct)
const giftProduct = getDigitalProduct("rage-room-gift-voucher-template-pack")!
const giftAnalyticsProduct = getDigitalProductAnalytics(giftProduct)

export const metadata: Metadata = {
  title: "Rage Room First Visit Prep Pack | Printable UK First-Timer Kit",
  description:
    "Download a printable rage room first visit prep pack. Includes what happens, what to wear, can-I-take-part checks, venue questions, waiver tips and a final arrival checklist.",
  alternates: {
    canonical: "/digital-downloads/rage-room-first-visit-prep-pack",
  },
}

const trustBullets = [
  "Printable PDF",
  "12-page prep kit",
  "UK edition",
  "Sample preview available",
]

const includedGroups = [
  {
    title: "Know what to expect",
    items: [
      "What happens step-by-step",
      "Day-of timeline",
      "Common first-timer mistakes",
    ],
  },
  {
    title: "Arrive prepared",
    items: [
      "What to wear and bring",
      "Can I take part? self-check",
      "Waiver and arrival checklist",
    ],
  },
  {
    title: "Book with confidence",
    items: [
      "Venue questions before paying",
      "Booking snapshot",
      "Final prep checklist",
    ],
  },
]

const audiences = [
  "First-time visitors",
  "Nervous bookers",
  "Couples trying it once",
  "Parents checking rules for teens",
  "Anyone unsure what to wear",
  "Friends joining a group night",
]

const faqs = [
  {
    question: "Does this include a rage room booking?",
    answer:
      "No. This is a preparation pack. You still book directly with your chosen venue.",
  },
  {
    question: "Is it UK-specific?",
    answer:
      "Yes. It uses UK-focused planning language and typical UK venue processes (waivers, PPE, arrival timing).",
  },
  {
    question: "Is it printable?",
    answer: "Yes. It is designed as an A4 printable PDF.",
  },
  {
    question: "Is this medical or safety advice?",
    answer:
      "No. It is a planning aid only. Always follow the venue's rules, waiver requirements and staff instructions.",
  },
  {
    question: "How is this different from the Party Planner Pack?",
    answer:
      "This pack is for first-timers getting ready for a session. The Party Planner Pack is for organising a full group event with budgets, RSVPs and invites.",
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
            Printable UK Prep Kit
          </p>
          <h2 className="mt-4 font-display text-5xl leading-none text-white">
            First Visit
            <span className="block text-rage-500">Prep Pack</span>
          </h2>
          <p className="mt-4 text-sm text-zinc-300">
            What happens, what to wear, venue questions, waiver tips and arrival checklist.
          </p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-semibold">
          {["What happens", "What to wear", "Venue Qs", "Arrival"].map((item) => (
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

export default function RageRoomFirstVisitPrepPackPage() {
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
              Rage Room First Visit Prep Pack
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
              Arrive ready for your first smash session — what happens, what to wear, and
              what to ask before you book.
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
                Get first-visit ready — £5
              </DigitalCheckoutButton>
            </div>
            <DigitalValueStack
              title="Built for first-timers 2026"
              items={[
                "12 printable pages — expectations, clothing, venue questions and arrival checks",
                "Practical self-check before you pay a deposit",
                "Sample preview available before you buy",
              ]}
              timeCompare="Worth the calm before booking — less than a coffee."
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
            First visits feel exciting — until the admin questions pile up.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg">
            What should you wear? When do you arrive? Can everyone take part? What do you
            ask before paying? This pack answers those questions in one printable place so
            you show up ready.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 id="whats-included" className="section-title mb-6">
            What’s Included
          </h2>
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
            <FAQ items={faqs} title="First Visit Prep FAQs" />
          </div>
        </div>
      </section>

      <section className="section-textured px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-6">
            <h2 className="text-xl font-bold text-white">Organising a group night?</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              Use the Rage Room Party Planner Pack for budgets, RSVPs, invites and the full
              night-out plan.
            </p>
            <TrackedProductLink
              href="/digital-downloads/rage-room-party-planner-pack"
              product={partyAnalyticsProduct}
              listName="Digital Product Cross-Sell"
              className="mt-4 inline-flex text-sm font-semibold text-rage-500 hover:text-rage-400"
            >
              View party planner pack
            </TrackedProductLink>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-[#181818] p-6">
            <h2 className="text-xl font-bold text-white">Giving it as a gift?</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              Pair prep with presentation using the Gift Voucher Template Pack.
            </p>
            <TrackedProductLink
              href="/digital-downloads/rage-room-gift-voucher-template-pack"
              product={giftAnalyticsProduct}
              listName="Digital Product Cross-Sell"
              className="mt-4 inline-flex text-sm font-semibold text-rage-500 hover:text-rage-400"
            >
              View gift voucher pack
            </TrackedProductLink>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 sm:pb-16">
        <div className="mx-auto max-w-4xl rounded-lg border border-rage-500/30 bg-[#181818] p-6 text-center sm:p-8">
          <Download className="mx-auto h-10 w-10 text-rage-500" />
          <h2 className="mt-4 text-2xl font-black uppercase tracking-wide text-white">
            Get first-visit ready — £5
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-300">
            Instant PDF download for what happens, what to wear and how to arrive prepared.
          </p>
          <div className="mt-6 flex justify-center">
            <DigitalCheckoutButton
              productId={product.id}
              analyticsProduct={analyticsProduct}
            >
              Get first-visit ready — £5
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
