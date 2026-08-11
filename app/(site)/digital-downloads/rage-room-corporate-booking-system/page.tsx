import type { Metadata } from "next"
import Link from "next/link"
import {
  Briefcase,
  Check,
  ClipboardList,
  FileText,
  Send,
  Workflow,
} from "lucide-react"
import CorporateBookingSystemPreview from "@/components/corporate-booking-system/CorporateBookingSystemPreview"
import BookingSystemViewTracker from "@/components/corporate-booking-system/BookingSystemViewTracker"
import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import DigitalEditorialByline from "@/components/DigitalEditorialByline"
import DigitalPriceDisplay from "@/components/DigitalPriceDisplay"
import {
  DigitalPurchaseReassurance,
  WhatHappensAfterPayment,
} from "@/components/DigitalPurchaseDetails"
import FAQ from "@/components/FAQ"
import TrackedProductLink from "@/components/TrackedProductLink"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"
import { buildDigitalProductSchema } from "@/lib/seo-schema"

const product = getDigitalProduct("rage-room-corporate-booking-system")!
const analyticsProduct = getDigitalProductAnalytics(product)
const consumerBuilder = getDigitalProduct("corporate-team-building-toolkit")!

export const metadata: Metadata = {
  title: "Rage Room Corporate Booking System | For Venue Owners",
  description:
    "Turn corporate enquiries into structured booking proposals. Build packages, calculate pricing, send quotes and manage follow-ups — for rage room owners and operators.",
  alternates: {
    canonical: "/digital-downloads/rage-room-corporate-booking-system",
  },
}

const outcomes = [
  {
    title: "Build profitable corporate packages",
    copy: "Set pricing and understand approximate margins from your own cost inputs.",
    icon: Briefcase,
  },
  {
    title: "Respond faster",
    copy: "Generate structured enquiry replies from the details you already collected.",
    icon: Send,
  },
  {
    title: "Send better proposals",
    copy: "Turn event requirements into a professional quote and proposal.",
    icon: FileText,
  },
  {
    title: "Never forget a follow-up",
    copy: "Track corporate leads, next actions and quotes awaiting a response.",
    icon: ClipboardList,
  },
  {
    title: "Run the booking",
    copy: "Generate confirmation, reminder and post-event messages from your venue policies.",
    icon: Workflow,
  },
]

const faqs = [
  {
    question: "Who is this for?",
    answer:
      "Rage room owners, venue managers, operations managers and sales/marketing people at an existing venue. It is not a consumer event planner and not a guide for starting a rage-room business.",
  },
  {
    question: "Is this the same as the Corporate Event Builder?",
    answer:
      "No. The Corporate Event Builder helps corporate organisers plan an employee event. The Corporate Booking System helps venues sell and manage corporate bookings. They are separate products with separate access.",
  },
  {
    question: "Is this a PDF download?",
    answer:
      "No. After payment you unlock an interactive venue workspace: package builder, quote tools, proposal generator and lead pipeline. Your workspace saves server-side for this purchase.",
  },
  {
    question: "Will this guarantee bookings?",
    answer:
      "No. It is built to help venues organise and improve their corporate-booking workflow. Results depend on your venue, pricing, outreach and follow-through.",
  },
  {
    question: "Does it send emails for me?",
    answer:
      "No. It generates copy and tracks opportunities. You choose who to contact and send communications yourself.",
  },
]

export default function CorporateBookingSystemProductPage() {
  const schema = buildDigitalProductSchema({
    name: product.name,
    description: product.description,
    url: `/digital-downloads/${product.slug}`,
    price: product.unitAmount / 100,
    currency: "GBP",
    sku: product.id,
  })

  return (
    <div className="bg-dark-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BookingSystemViewTracker product={analyticsProduct} source="product_page" />

      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.18),_transparent_55%),linear-gradient(180deg,#0a0a0a,#121212)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-rage-500">
              Rage Room Corporate Booking System
            </p>
            <h1 className="mt-3 text-4xl font-black uppercase leading-tight tracking-wide text-white sm:text-5xl">
              Win more corporate rage room bookings
            </h1>
            <p className="mt-4 max-w-xl text-base text-zinc-300 sm:text-lg">
              Build packages, create quotes, send professional proposals and keep
              every opportunity moving — without rebuilding the process every time.
            </p>
            <div className="mt-6">
              <DigitalEditorialByline />
            </div>
            <div className="mt-6 flex flex-wrap items-end gap-4">
              <DigitalPriceDisplay product={product} size="lg" />
              <DigitalCheckoutButton
                productId={product.id}
                analyticsProduct={analyticsProduct}
              >
                Get the Corporate Booking System — £79
              </DigitalCheckoutButton>
            </div>
            <p className="mt-3 max-w-lg text-sm text-zinc-500">
              Built to help venues organise and improve their corporate-booking
              workflow. One successful corporate booking can outweigh the product
              cost — results are not guaranteed.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              Interactive workspace access after payment.{" "}
              <Link
                href="/contact"
                className="font-semibold text-zinc-300 underline-offset-2 hover:text-white hover:underline"
              >
                Contact us
              </Link>{" "}
              within 7 days if access fails.
            </p>
          </div>
          <CorporateBookingSystemPreview />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
          A booking system, not a stack of templates
        </h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Lead → qualify → package → quote → proposal → follow-up → booked →
          event → feedback / repeat.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((item) => (
            <div key={item.title} className="border-t border-zinc-800 pt-4">
              <item.icon className="h-5 w-5 text-rage-500" />
              <h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-[#121212]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-black uppercase tracking-wide text-white">
            What you unlock
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {product.includedSections.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-zinc-300"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-rage-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wide text-white">
              Get the Corporate Booking System — £79
            </h2>
            <p className="mt-3 text-zinc-400">
              Interactive workspace access after payment. Configure your venue,
              build packages and start tracking corporate opportunities.
            </p>
            <div className="mt-6">
              <DigitalCheckoutButton
                productId={product.id}
                analyticsProduct={analyticsProduct}
              >
                Unlock for £79
              </DigitalCheckoutButton>
            </div>
            <div className="mt-6">
              <WhatHappensAfterPayment variant="booking-system" />
            </div>
            <DigitalPurchaseReassurance className="mt-4" />
          </div>
          <div className="space-y-4 text-sm text-zinc-400">
            <p>
              Looking for market context first? Read the free{" "}
              <Link
                href="/uk-rage-room-report-2026"
                className="font-semibold text-rage-500 hover:text-rage-400"
              >
                UK Rage Room Report 2026
              </Link>
              .
            </p>
            <p>
              Planning a team event as an organiser (not a venue)? Use the{" "}
              <TrackedProductLink
                href={`/digital-downloads/${consumerBuilder.slug}`}
                product={getDigitalProductAnalytics(consumerBuilder)}
                listName="CBS cross-sell"
                className="font-semibold text-rage-500 hover:text-rage-400"
              >
                Corporate Event Builder
              </TrackedProductLink>{" "}
              instead.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <FAQ items={faqs} />
      </section>
    </div>
  )
}
