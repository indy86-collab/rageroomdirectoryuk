import type { Metadata } from "next"
import Link from "next/link"
import {
  AlertTriangle,
  BriefcaseBusiness,
  Check,
  ClipboardList,
  MapPinned,
  PoundSterling,
  Send,
  Sparkles,
} from "lucide-react"
import CorporateEventBuilderPreview from "@/components/corporate-event-builder/CorporateEventBuilderPreview"
import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import DigitalPriceDisplay from "@/components/DigitalPriceDisplay"
import DigitalSaleBanner from "@/components/DigitalSaleBanner"
import DigitalEditorialByline from "@/components/DigitalEditorialByline"
import DigitalProductCover from "@/components/DigitalProductCover"
import {
  DigitalPurchaseReassurance,
  DigitalRefundNote,
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
import { buildDigitalProductSchema } from "@/lib/seo-schema"

const product = getDigitalProduct("corporate-team-building-toolkit")!
const analyticsProduct = getDigitalProductAnalytics(product)
const giftProduct = getDigitalProduct("rage-room-gift-voucher-template-pack")!
const giftAnalyticsProduct = getDigitalProductAnalytics(giftProduct)

export const metadata: Metadata = {
  title: "Corporate Rage Room Event Builder | Team Event Planner",
  description:
    "Plan your team rage room event without starting from a blank page. Build budget, compare venues, prepare internal approval, organise the day and generate team messages.",
  alternates: {
    canonical: "/digital-downloads/corporate-rage-room-team-building-toolkit",
  },
}

const jobGroups = [
  {
    title: "Build your budget",
    icon: PoundSterling,
    items: [
      "Total or per-person budget",
      "Rage room / food / travel / contingency split",
      "Quick check: can we run this within budget?",
    ],
  },
  {
    title: "Compare rage rooms",
    icon: MapPinned,
    items: [
      "Shortlist using RageRoom Directory data",
      "Starting price and approx group estimate",
      "Enquiry questions ready to send venues",
    ],
  },
  {
    title: "Get internal approval",
    icon: ClipboardList,
    items: [
      "Ready-to-send event proposal",
      "Shorter email version with copy button",
      "Generated from your real event details",
    ],
  },
  {
    title: "Invite & run the day",
    icon: Send,
    items: [
      "Email, Slack/Teams and reminder messages",
      "Editable run sheet and event checklist",
      "Simple RSVP tracker and feedback survey",
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

const faqs = [
  {
    question: "Is this an interactive tool or a PDF?",
    answer:
      "It is primarily an interactive Event Builder. You plan for free — budget, venue shortlist, approval and invitation outputs. When you are happy, you can pay for a clean PDF of your plan. A 16-page printable toolkit is still included with that purchase.",
  },
  {
    question: "Does this include a rage room booking?",
    answer:
      "No. This helps you plan and organise the event. You still book directly with your chosen venue.",
  },
  {
    question: "Is this only for HR teams?",
    answer:
      "No. It is useful for office managers, founders, team leads and anyone organising a workplace team event.",
  },
  {
    question: "Is it UK-specific?",
    answer: "Yes. It uses UK-focused language, GBP budgeting and RageRoom Directory venue data.",
  },
  {
    question: "Will previous Corporate Toolkit purchasers get access?",
    answer:
      "Yes. Anyone can use the builder. Previous purchasers can still download the PDF pack from their order email or success page, or open /corporate-event-builder?token=… with an unexpired download token.",
  },
  {
    question: "Is this legal or safety advice?",
    answer:
      "No. It is a planning aid only. Always follow venue rules, waivers, staff instructions and company policy. Confirm PPE, age limits, accessibility and cancellation terms with the venue.",
  },
  {
    question: "Does my event plan save?",
    answer:
      "Yes. Your plan is saved in this browser so a refresh does not wipe your work. After you pay, bookmark the Event Builder link from your order email so you can download the PDF again later.",
  },
  {
    question: "Can I get help or a refund?",
    answer:
      "If the PDF pack is faulty, contact us within 7 days for a fix or refund. Change-of-mind refunds are not offered after a successful download.",
  },
]

export default function CorporateEventBuilderProductPage() {
  const productSchema = buildDigitalProductSchema({
    name: product.name,
    description: product.description,
    url: `/digital-downloads/${product.slug}`,
    price: product.unitAmount / 100,
    currency: product.currency,
    image: product.marketingImage || product.previewPdf,
    sku: product.analyticsItemId,
  })

  const startLabel = "Start planning — free"
  const unlockLabel = `Unlock full PDF — ${product.priceLabel}`

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
              Corporate Event Builder
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-wide text-white sm:text-5xl lg:text-6xl">
              Corporate Rage Room Event Builder
            </h1>
            <DigitalEditorialByline className="mt-3" />
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
              Plan your team rage room event without starting from a blank page.
            </p>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">
              Build your budget, compare venues, prepare internal approval,
              organise the day and generate messages for your team.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div>
                <DigitalPriceDisplay product={product} />
                <p className="mt-1 text-xs font-semibold text-zinc-400">
                  Free to plan. {product.priceLabel} when you want the full PDF pack.
                </p>
              </div>
              <Link
                href="/corporate-event-builder"
                className="btn-rage inline-flex min-h-[48px] items-center justify-center px-5 text-sm uppercase tracking-wider"
              >
                {startLabel}
              </Link>
            </div>
            <DigitalSaleBanner compact className="mt-3" />
            <p className="mt-4 text-sm font-semibold text-zinc-400">
              <span className="text-zinc-200">Plan first</span>
              <span className="mx-2 text-zinc-600">·</span>
              Pay only for the PDF pack
              <span className="mx-2 text-zinc-600">·</span>
              Plan saves in your browser
              <span className="mx-2 text-zinc-600">·</span>
              Not a venue booking
              <span className="mx-2 text-zinc-600">·</span>
              7-day faulty-file refund
            </p>
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

      <section className="px-4 pb-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <CorporateEventBuilderPreview />
        </div>
      </section>

      <section className="section-textured px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="section-title">Plan the whole event in one place</h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg">
            Team events are easy to suggest and harder to approve, shortlist and
            organise. Enter your details once and generate the outputs you need
            to move the event forward.
          </p>
          <DigitalValueStack
            title="Implementation over information"
            items={[
              "Budget and per-person calculator you can adjust",
              "Venue shortlist using RageRoom Directory listings",
              "Approval, invitation and reminder messages generated from your event",
            ]}
            timeCompare={`A messy team day costs far more than ${product.compareAtLabel || product.priceLabel} in rework and follow-ups.`}
          />
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 id="whats-included" className="section-title mb-6">
            What the builder does
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {jobGroups.map((group) => {
              const Icon = group.icon
              return (
                <div key={group.title} className="card-base p-5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
                    <Icon className="h-5 w-5 text-rage-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{group.title}</h3>
                  <ul className="mt-4 space-y-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-zinc-300"
                      >
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-rage-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-textured px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title mb-6">Who it is for</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((audience) => (
              <div
                key={audience}
                className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-[#181818] p-4"
              >
                <BriefcaseBusiness className="h-4 w-4 flex-shrink-0 text-rage-500" />
                <span className="text-sm font-semibold text-zinc-200">
                  {audience}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl rounded-lg border border-zinc-800 bg-[#181818] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rage-500" />
            <div>
              <h2 className="text-lg font-bold text-white">Important disclaimer</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                This Event Builder is an entertainment / team-social planning aid.
                It is not medical, legal, insurance, safety, or HR compliance
                advice. RageRoom Directory is not the venue operator. Always
                confirm prices, availability, PPE, accessibility and rules
                directly with your selected venue, and follow your company
                policies.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-textured px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <WhatHappensAfterPayment variant="corporate-builder" />
          <div className="card-base p-5">
            <FAQ items={faqs} title="Corporate Event Builder FAQs" />
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
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
          <Sparkles className="mx-auto h-10 w-10 text-rage-500" />
          <h2 className="mt-4 text-2xl font-black uppercase tracking-wide text-white">
            {startLabel}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-300">
            Enter your event details, build the plan, and generate the messages
            your team needs — then pay only if you want the full PDF.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4">
            <Link
              href="/corporate-event-builder"
              className="btn-rage inline-flex min-h-[48px] items-center justify-center px-5 text-sm uppercase tracking-wider"
            >
              {startLabel}
            </Link>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Already planned?
            </p>
            <DigitalCheckoutButton
              productId={product.id}
              analyticsProduct={analyticsProduct}
              returnTo="builder"
            >
              {unlockLabel}
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
