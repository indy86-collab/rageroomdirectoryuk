import type { Metadata } from "next"
import Link from "next/link"
import { Check, Gift, PartyPopper } from "lucide-react"
import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import {
  DigitalPurchaseReassurance,
  WhatHappensAfterPayment,
} from "@/components/DigitalPurchaseDetails"
import FAQ from "@/components/FAQ"
import ProductViewTracker from "@/components/ProductViewTracker"
import TrackedProductLink from "@/components/TrackedProductLink"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"

const product = getDigitalProduct("party-gift-bundle")!
const analyticsProduct = getDigitalProductAnalytics(product)
const partyProduct = getDigitalProduct("rage-room-party-planner")!
const partyAnalytics = getDigitalProductAnalytics(partyProduct)
const giftProduct = getDigitalProduct("rage-room-gift-voucher-template-pack")!
const giftAnalytics = getDigitalProductAnalytics(giftProduct)

export const metadata: Metadata = {
  title: "Party Planner + Gift Voucher Bundle | Save £3",
  description:
    "Get the Rage Room Party Planner Pack and Gift Voucher Template Pack together for £9 — save £3 vs buying separately. Instant digital downloads.",
  alternates: {
    canonical: "/digital-downloads/party-planner-gift-voucher-bundle",
  },
}

const faqs = [
  {
    question: "What do I receive?",
    answer:
      "Two downloads after payment: the 15-page Party Planner PDF and the Gift Voucher Template Pack ZIP.",
  },
  {
    question: "Does this include a rage room booking?",
    answer:
      "No. Both products are planning and presentation templates. You still book directly with your chosen venue.",
  },
  {
    question: "Can I get help or a refund?",
    answer:
      "If a file is faulty or will not open, we will replace it or refund you — contact us within 7 days. Change-of-mind refunds are not offered on instant digital downloads after a successful download.",
  },
]

export default function PartyGiftBundlePage() {
  return (
    <div className="bg-dark-900">
      <ProductViewTracker product={analyticsProduct} />
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-rage-500">
            Bundle & save £3
          </p>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-wide text-white sm:text-5xl">
            Party Planner + Gift Voucher Bundle
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Plan the smash night and present the experience as a polished gift.
            Normally £12 separately — get both for {product.priceLabel}.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div>
              <div className="text-3xl font-black text-white">
                {product.priceLabel}
              </div>
              <p className="mt-1 text-xs font-semibold text-zinc-400">
                Was £12 · Instant downloads
              </p>
            </div>
            <DigitalCheckoutButton
              productId={product.id}
              analyticsProduct={analyticsProduct}
            >
              Get the bundle — {product.priceLabel}
            </DigitalCheckoutButton>
          </div>
          <DigitalPurchaseReassurance className="justify-center" />
        </div>
      </section>

      <section className="section-textured px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <h2 id="whats-included" className="section-title mb-6 text-center">
            What’s Included
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card-base p-5">
              <PartyPopper className="h-6 w-6 text-rage-500" />
              <h3 className="mt-3 text-lg font-bold text-white">
                Party Planner Pack (£7 value)
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                {[
                  "15-page printable PDF",
                  "Venue scorecard & budget",
                  "Invites, RSVP and checklists",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-rage-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <TrackedProductLink
                href="/digital-downloads/rage-room-party-planner-pack"
                product={partyAnalytics}
                listName="Bundle Page"
                className="mt-4 inline-flex text-sm font-semibold text-rage-500 hover:text-rage-400"
              >
                View party planner details
              </TrackedProductLink>
            </div>
            <div className="card-base p-5">
              <Gift className="h-6 w-6 text-rage-500" />
              <h3 className="mt-3 text-lg font-bold text-white">
                Gift Voucher Pack (£5 value)
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                {[
                  "8 voucher themes",
                  "A4, A5, mobile and square formats",
                  "Gift note and redeem inserts",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-rage-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <TrackedProductLink
                href="/digital-downloads/rage-room-gift-voucher-template-pack"
                product={giftAnalytics}
                listName="Bundle Page"
                className="mt-4 inline-flex text-sm font-semibold text-rage-500 hover:text-rage-400"
              >
                View voucher pack details
              </TrackedProductLink>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <WhatHappensAfterPayment />
          <div className="card-base p-5">
            <FAQ items={faqs} title="Bundle FAQs" />
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 sm:pb-16">
        <div className="mx-auto max-w-4xl rounded-lg border border-rage-500/30 bg-[#181818] p-6 text-center sm:p-8">
          <h2 className="text-2xl font-black uppercase tracking-wide text-white">
            Get both for {product.priceLabel}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-300">
            Instant PDF + ZIP downloads. Save £3 vs buying separately.
          </p>
          <div className="mt-6 flex justify-center">
            <DigitalCheckoutButton
              productId={product.id}
              analyticsProduct={analyticsProduct}
            >
              Get the bundle — {product.priceLabel}
            </DigitalCheckoutButton>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            Prefer singles?{" "}
            <Link
              href="/digital-downloads/rage-room-party-planner-pack"
              className="font-semibold text-rage-500 hover:text-rage-400"
            >
              Party £7
            </Link>{" "}
            ·{" "}
            <Link
              href="/digital-downloads/rage-room-gift-voucher-template-pack"
              className="font-semibold text-rage-500 hover:text-rage-400"
            >
              Gift £5
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
