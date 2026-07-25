import type { Metadata } from "next"
import { Check, ClipboardList, Download, Sparkles } from "lucide-react"
import DigitalBundleOffer from "@/components/DigitalBundleOffer"
import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import DigitalEditorialByline from "@/components/DigitalEditorialByline"
import DigitalProductCover from "@/components/DigitalProductCover"
import {
  DigitalCompactTrust,
  DigitalPurchaseReassurance,
  DigitalRefundNote,
  DigitalValueStack,
  WhatHappensAfterPayment,
} from "@/components/DigitalPurchaseDetails"
import DigitalSampleStrip from "@/components/DigitalSampleStrip"
import FAQ from "@/components/FAQ"
import ProductViewTracker from "@/components/ProductViewTracker"
import TrackedProductLink from "@/components/TrackedProductLink"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"
import { buildDigitalProductSchema } from "@/lib/seo-schema"

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

export default function RageRoomPartyPlannerPackPage() {
  const productSchema = buildDigitalProductSchema({
    name: product.name,
    description: product.description,
    url: `/digital-downloads/${product.slug}`,
    price: product.unitAmount / 100,
    currency: product.currency,
    image: product.marketingImage || product.previewPdf,
    sku: product.analyticsItemId,
  })

  return (
    <div className="bg-dark-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
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
            <DigitalEditorialByline className="mt-3" />
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
            <DigitalCompactTrust />
            <DigitalRefundNote />
          </div>
          {product.marketingImage && (
            <DigitalProductCover
              src={product.marketingImage}
              alt={`${product.name} cover`}
              priority
            />
          )}
        </div>
      </section>

      {product.previewImages?.length ? (
        <section className="px-4 pb-4 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-lg border border-zinc-800 bg-[#181818] p-5 sm:p-6">
            <DigitalSampleStrip
              images={product.previewImages}
              productName={product.name}
              previewPdf={product.previewPdf}
            />
          </div>
        </section>
      ) : null}

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
          <DigitalValueStack
            title="Updated for UK venues 2026"
            items={[
              "15 printable pages — venue scorecard, budget, RSVP, invites and checklists",
              "Built for birthdays, date nights, hen/stag and group smash nights",
              "Sample preview available before you buy",
            ]}
            timeCompare="Worth hours of DIY planning for less than a coffee round."
          />
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
            <DigitalRefundNote className="text-center" />
          </div>
        </div>
      </section>
    </div>
  )
}
