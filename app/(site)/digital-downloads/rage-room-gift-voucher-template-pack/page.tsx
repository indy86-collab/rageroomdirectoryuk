import type { Metadata } from "next"
import { AlertTriangle, Check, Gift, ListChecks, Sparkles } from "lucide-react"
import DigitalBundleOffer from "@/components/DigitalBundleOffer"
import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import DigitalPriceDisplay from "@/components/DigitalPriceDisplay"
import DigitalSaleBanner from "@/components/DigitalSaleBanner"
import DigitalEditorialByline from "@/components/DigitalEditorialByline"
import DigitalProductCover from "@/components/DigitalProductCover"
import {
  DigitalCompactTrust,
  DigitalFitCheck,
  DigitalProofBar,
  DigitalPurchaseReassurance,
  DigitalRefundNote,
  DigitalValueStack,
  WhatHappensAfterPayment,
} from "@/components/DigitalPurchaseDetails"
import DigitalSampleStrip from "@/components/DigitalSampleStrip"
import DigitalStickyBuyBar from "@/components/DigitalStickyBuyBar"
import FAQ from "@/components/FAQ"
import ProductViewTracker from "@/components/ProductViewTracker"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"
import { buildDigitalProductSchema } from "@/lib/seo-schema"

const product = getDigitalProduct("rage-room-gift-voucher-template-pack")!
const analyticsProduct = getDigitalProductAnalytics(product)

export const metadata: Metadata = {
  title: "Rage Room Gift Voucher Template Pack | Printable Experience Gift",
  description:
    "Download printable and digital rage room gift voucher templates for birthdays, date nights, breakup gifts, best friends, holidays and experience gifts. Includes A4, A5, mobile, square and blank versions.",
  alternates: {
    canonical: "/digital-downloads/rage-room-gift-voucher-template-pack",
  },
}

const includedGroups = [
  {
    title: "Voucher themes",
    items: [
      "Birthday",
      "Date night",
      "Breakup reset",
      "Stress relief",
      "Best friend",
      "You deserve this",
      "Holiday",
      "Generic experience gift",
    ],
  },
  {
    title: "Formats",
    items: [
      "A4 printable PDF",
      "A5 printable PDF",
      "Horizontal PNG",
      "Mobile-friendly vertical PNG",
      "Square social version",
      "Blank editable-style version",
    ],
  },
  {
    title: "Bonus items",
    items: [
      "Gift note template",
      "How to redeem insert",
      "Envelope insert",
      "Mini gift tag",
      "Preview catalogue",
    ],
  },
]

const audiences = [
  "Birthday gifts",
  "Date night surprises",
  "Breakup gifts",
  "Best friend gifts",
  "Christmas or holiday gifts",
  "Unusual experience gifts",
  "Last-minute printable gifts",
  "People gifting a rage room session",
]

const steps = [
  "Choose the voucher design",
  "Print it or send it digitally",
  "Add recipient, sender, voucher code and expiry/date details",
  "Book the rage room directly with your chosen venue",
  "Include the gift note or how-to-redeem insert",
]

const faqs = [
  {
    question: "Does this include a rage room booking?",
    answer:
      "No. This is a digital template pack for presenting a rage room experience as a gift. You still book directly with your chosen venue.",
  },
  {
    question: "What file do I receive?",
    answer:
      "You receive a ZIP file containing printable and digital voucher templates, bonus gift assets and a preview catalogue.",
  },
  {
    question: "Can I print the vouchers?",
    answer: "Yes. The pack includes A4 and A5 printable versions.",
  },
  {
    question: "Can I send the voucher by phone?",
    answer:
      "Yes. The pack includes mobile-friendly vertical versions and square social-sharing versions.",
  },
  {
    question: "Are the vouchers tied to a specific venue?",
    answer:
      "No. They are generic templates. Add your chosen venue, booking details or voucher code where relevant.",
  },
  {
    question: "Is this good for last-minute gifts?",
    answer: "Yes. You can download, print or send the voucher digitally after purchase.",
  },
  {
    question: "Why does the download link expire?",
    answer:
      "The secure link expires after 72 hours to keep delivery private. Once you download the ZIP, it is yours to keep forever. We also email the link to the address you use at checkout.",
  },
  {
    question: "Do I need a promo code?",
    answer:
      "No. The 20% demand drop is already in the price. You pay £4 at Stripe — no extra fees and no code to enter.",
  },
  {
    question: "Can I get help or a refund?",
    answer:
      "If the file is faulty or will not open, we will replace it or refund you — contact us within 7 days. Change-of-mind refunds are not offered on instant digital downloads after a successful download.",
  },
]

export default function GiftVoucherTemplatePackPage() {
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
              Printable and digital templates · not a booking
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-wide text-white sm:text-5xl lg:text-6xl">
              Make a rage room gift look like a real voucher
            </h1>
            <p className="mt-2 text-sm font-semibold text-zinc-400">
              Rage Room Gift Voucher Template Pack · 8 themes
            </p>
            <DigitalEditorialByline className="mt-3" />
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
              8 themes. Print it or send it from your phone in minutes. You still book
              the session with your chosen venue.
            </p>
            <div className="mt-6 max-w-md space-y-4">
              <DigitalPriceDisplay product={product} />
              <DigitalCheckoutButton
                productId={product.id}
                analyticsProduct={analyticsProduct}
                collectEmail
              >
                Get instant ZIP access — {product.priceLabel}
              </DigitalCheckoutButton>
            </div>
            <DigitalSaleBanner compact className="mt-3" />
            <DigitalProofBar />
            <DigitalCompactTrust />
            <DigitalRefundNote />
          </div>
          {product.marketingImage && (
            <DigitalProductCover
              src={product.marketingImage}
              alt={`${product.name} mockup`}
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
            An experience gift feels better when it looks like a real gift.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg">
            If you are buying a rage room session for someone else, sending a plain booking
            link can feel underwhelming. This pack gives you printable and digital voucher
            designs so the gift feels more intentional, polished and shareable.
          </p>
          <DigitalValueStack
            title="Updated for UK experience gifts 2026"
            items={[
              "8 voucher themes across A4, A5, mobile and square formats",
              "Bonus gift note, redeem insert, envelope insert and mini gift tag",
              "Preview catalogue available before you buy",
            ]}
            timeCompare="Faster than designing a voucher from scratch — ready to print or send tonight."
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
                  <Gift className="h-5 w-5 text-rage-500" />
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

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <WhatHappensAfterPayment />
        </div>
      </section>

      <section className="section-textured px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title mb-6">Who It Is For</h2>
          <DigitalFitCheck
            forItems={[
              "You are gifting a rage room session and want it to look finished",
              "You need something printable tonight, or sendable on WhatsApp",
              "You still want to book the venue yourself",
            ]}
            notForItems={[
              "You want a venue-issued voucher or a prepaid session — this is a template pack only.",
              "You need us to book a rage room — we don’t take bookings.",
            ]}
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="mx-auto max-w-5xl">
          <h2 className="section-title mb-6">How It Works</h2>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-start gap-4 rounded-lg border border-zinc-800 bg-[#181818] p-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15 text-sm font-bold text-rage-500">
                  {index + 1}
                </div>
                <p className="text-sm font-semibold text-zinc-200">{step}</p>
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
              <h2 className="text-lg font-bold text-white">
                This is a gift presentation pack, not a venue booking.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                The voucher templates help you present a rage room experience as a gift.
                They do not include a session booking, and they are not issued by a specific
                venue. You should book directly with your chosen rage room and add the correct
                booking details or voucher code before giving the gift.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl card-base p-5">
          <FAQ items={faqs} title="Gift Voucher Pack FAQs" />
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <DigitalBundleOffer />
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 sm:pb-16">
        <div className="mx-auto max-w-4xl rounded-lg border border-rage-500/30 bg-[#181818] p-6 text-center sm:p-8">
          <ListChecks className="mx-auto h-10 w-10 text-rage-500" />
          <h2 className="mt-4 text-2xl font-black uppercase tracking-wide text-white">
            Get printable voucher templates — {product.priceLabel}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-300">
            Instant ZIP with printable PDFs, digital PNG templates and bonus gift inserts.
            You still book the session with your chosen venue.
          </p>
          <div className="mt-6 flex justify-center">
            <DigitalCheckoutButton
              productId={product.id}
              analyticsProduct={analyticsProduct}
              collectEmail
            >
              Get instant ZIP access — {product.priceLabel}
            </DigitalCheckoutButton>
          </div>
          <div className="mx-auto max-w-2xl">
            <DigitalPurchaseReassurance className="justify-center" />
            <DigitalRefundNote className="text-center" />
          </div>
        </div>
      </section>
      <DigitalStickyBuyBar
        productId={product.id}
        analyticsProduct={analyticsProduct}
        priceLabel={product.priceLabel}
        ctaLabel="Get the ZIP"
      />
    </div>
  )
}
