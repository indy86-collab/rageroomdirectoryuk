import type { Metadata } from "next"
import { AlertTriangle, BriefcaseBusiness, Check, ClipboardList, Download, Sparkles } from "lucide-react"
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

const product = getDigitalProduct("corporate-team-building-toolkit")!
const analyticsProduct = getDigitalProductAnalytics(product)
const giftProduct = getDigitalProduct("rage-room-gift-voucher-template-pack")!
const giftAnalyticsProduct = getDigitalProductAnalytics(giftProduct)

export const metadata: Metadata = {
  title: "Corporate Rage Room Team-Building Toolkit | HR Event Planner",
  description:
    "Download a printable corporate rage room team-building toolkit for HR teams, office managers and team leads. Includes budget approval worksheet, venue scorecard, staff invite email, safety questions, run sheet and feedback form.",
  alternates: {
    canonical: "/digital-downloads/corporate-rage-room-team-building-toolkit",
  },
}

const includedGroups = [
  {
    title: "Plan and approve",
    items: [
      "Internal planning checklist",
      "Budget approval worksheet",
      "Internal approval email",
      "ROI and goals worksheet",
    ],
  },
  {
    title: "Choose and check the venue",
    items: [
      "Venue comparison scorecard",
      "Safety questions for the venue",
      "Group size and session plan",
      "Risk and logistics checklist",
    ],
  },
  {
    title: "Run the event",
    items: [
      "Staff invite email",
      "Event schedule / run sheet",
      "Post-event feedback form",
      "Team reflection worksheet",
      "Final booking checklist",
    ],
  },
]

const audiences = [
  "HR managers",
  "Office managers",
  "Founders",
  "Team leads",
  "People and culture teams",
  "Startup operators",
  "Department heads planning team socials",
]

const benefits = [
  "Save planning time",
  "Make budget approval easier",
  "Ask better venue questions",
  "Communicate clearly with staff",
  "Capture useful feedback after the event",
]

const faqs = [
  {
    question: "Does this include a rage room booking?",
    answer: "No. This is a planning toolkit. You still book directly with your chosen venue.",
  },
  {
    question: "Is this only for HR teams?",
    answer:
      "No. It is also useful for office managers, founders, team leads and anyone organising a workplace team event.",
  },
  {
    question: "Is it UK-specific?",
    answer: "Yes. It uses UK-focused language and GBP budgeting fields.",
  },
  {
    question: "Is it printable?",
    answer: "Yes. It is designed as a printable PDF.",
  },
  {
    question: "Can I use the email templates directly?",
    answer: "Yes. Copy, paste and adapt them for your company, venue and team.",
  },
  {
    question: "Is this legal or safety advice?",
    answer:
      "No. It is a planning aid only. Always follow venue rules, waivers, staff instructions and company policy.",
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

export default function CorporateToolkitPage() {
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
              Printable corporate toolkit
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-wide text-white sm:text-5xl lg:text-6xl">
              Corporate Rage Room Team-Building Toolkit
            </h1>
            <DigitalEditorialByline className="mt-3" />
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
              Plan, approve and run a rage room team-building event without starting from a blank page.
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
                Get HR-ready templates — £19
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
              sampleUnlockHint={product.sampleUnlockHint}
            />
          </div>
        </section>
      ) : null}

      <section className="section-textured px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="section-title">
            Team events are easy to suggest. They are harder to get approved and organised.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg">
            Between budget approval, venue questions, staff invites, safety checks, timings
            and feedback, a simple team social can become messy. This toolkit gives HR teams,
            office managers and team leads a ready-made structure.
          </p>
          <DigitalValueStack
            title="Worth far more than one messy team day"
            items={[
              "16 HR-ready pages — approval email, budget worksheet, venue scorecard, run sheet and feedback form",
              "Email templates your manager can approve without another meeting",
              "Updated for UK venues and GBP budgeting — 2026",
            ]}
            timeCompare="A poorly planned team event costs far more than £19 in time, rework and awkward follow-ups."
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
                <BriefcaseBusiness className="h-4 w-4 flex-shrink-0 text-rage-500" />
                <span className="text-sm font-semibold text-zinc-200">{audience}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title mb-6">Why Buy This</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {benefits.map((benefit) => (
              <div key={benefit} className="card-base p-4">
                <Sparkles className="h-5 w-5 text-rage-500" />
                <h3 className="mt-3 text-sm font-bold text-white">{benefit}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-textured px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl rounded-lg border border-zinc-800 bg-[#181818] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rage-500" />
            <div>
              <h2 className="text-lg font-bold text-white">Important disclaimer</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                This toolkit is an entertainment planning aid. It is not medical, legal,
                insurance, safety, or HR compliance advice. Always follow the venue’s rules,
                waiver process, staff instructions and your company policies.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <WhatHappensAfterPayment />
          <div className="card-base p-5">
            <FAQ items={faqs} title="Corporate Toolkit FAQs" />
          </div>
        </div>
      </section>

      <section className="section-textured px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-4xl text-center">
          <TrackedProductLink
            href="/digital-downloads/rage-room-gift-voucher-template-pack"
            product={giftAnalyticsProduct}
            listName="Digital Product Cross-Sell"
            className="text-sm font-semibold text-rage-500 hover:text-rage-400"
          >
            Planning a non-work gift instead? View the gift voucher pack.
          </TrackedProductLink>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 sm:pb-16">
        <div className="mx-auto max-w-4xl rounded-lg border border-rage-500/30 bg-[#181818] p-6 text-center sm:p-8">
          <Download className="mx-auto h-10 w-10 text-rage-500" />
          <h2 className="mt-4 text-2xl font-black uppercase tracking-wide text-white">
            Get HR-ready templates — £19
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-300">
            Instant PDF for approval, venue checks, staff communication, run sheets and feedback.
          </p>
          <div className="mt-6 flex justify-center">
            <DigitalCheckoutButton
              productId={product.id}
              analyticsProduct={analyticsProduct}
            >
              Get HR-ready templates — £19
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
