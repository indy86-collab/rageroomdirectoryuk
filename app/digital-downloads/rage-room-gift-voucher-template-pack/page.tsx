import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { AlertTriangle, Check, Gift, ListChecks, Sparkles } from "lucide-react"
import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import FAQ from "@/components/FAQ"
import ProductViewTracker from "@/components/ProductViewTracker"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"

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

const trustBullets = [
  "Printable and digital templates",
  "8 voucher themes",
  "A4, A5, mobile and square formats",
  "Instant ZIP download",
]

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
    answer: "To keep ZIP delivery private. Save a copy after purchase.",
  },
]

export default function GiftVoucherTemplatePackPage() {
  return (
    <div className="bg-dark-900">
      <ProductViewTracker product={analyticsProduct} />
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-rage-500">
              Printable and digital gift templates
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-wide text-white sm:text-5xl lg:text-6xl">
              Rage Room Gift Voucher Template Pack
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
              Give a rage room experience as a polished printable or digital gift voucher.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="text-3xl font-black text-white">{product.priceLabel}</div>
              <DigitalCheckoutButton
                productId={product.id}
                analyticsProduct={analyticsProduct}
              >
                Get instant access — £5
              </DigitalCheckoutButton>
            </div>
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
            {product.previewPdf && (
              <Link
                href={product.previewPdf}
                className="mt-5 inline-flex text-sm font-semibold text-rage-500 hover:text-rage-400"
              >
                View preview catalogue
              </Link>
            )}
          </div>
          {product.marketingImage && (
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-lg border border-zinc-800 bg-[#181818] p-3 shadow-2xl shadow-black/40">
              <Image
                src={product.marketingImage}
                alt="Rage Room Gift Voucher Template Pack mockup"
                width={1200}
                height={900}
                className="h-auto w-full rounded-md"
                priority
              />
            </div>
          )}
        </div>
      </section>

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
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title mb-6">What’s Included</h2>
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

      <section className="section-textured px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title mb-6">Who It Is For</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

      <section className="px-4 pb-14 sm:px-6 sm:pb-16">
        <div className="mx-auto max-w-4xl rounded-lg border border-rage-500/30 bg-[#181818] p-6 text-center sm:p-8">
          <ListChecks className="mx-auto h-10 w-10 text-rage-500" />
          <h2 className="mt-4 text-2xl font-black uppercase tracking-wide text-white">
            Download the voucher pack — £5
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-300">
            A ZIP file with printable PDFs, digital PNG vouchers and bonus gift inserts.
          </p>
          <div className="mt-6 flex justify-center">
            <DigitalCheckoutButton
              productId={product.id}
              analyticsProduct={analyticsProduct}
            >
              Download the voucher pack — £5
            </DigitalCheckoutButton>
          </div>
        </div>
      </section>
    </div>
  )
}
