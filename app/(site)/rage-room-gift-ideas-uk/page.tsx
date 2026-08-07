import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle, Gift } from "lucide-react"
import TrackedProductLink from "@/components/TrackedProductLink"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"

export const metadata: Metadata = {
  title: "Rage Room Gift Ideas UK | Printable Voucher Templates",
  description:
    "Looking for an unusual rage room gift idea? Learn how to gift a rage room experience with printable vouchers, booking tips and digital gift templates.",
  alternates: { canonical: "/rage-room-gift-ideas-uk" },
}

const occasions = [
  "Birthday rage room gift",
  "Date night rage room gift",
  "Breakup rage room gift",
  "Best friend rage room gift",
  "Christmas or holiday rage room gift",
]

const checks = [
  "Confirm the venue, session type and price before gifting",
  "Check age rules, waivers and clothing requirements",
  "Add real booking details or a venue voucher code where relevant",
  "Make sure the recipient can travel to the chosen venue",
]

export default function RageRoomGiftIdeasUKPage() {
  const product = getDigitalProduct("rage-room-gift-voucher-template-pack")!
  const analyticsProduct = getDigitalProductAnalytics(product)

  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <article className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-widest text-rage-500">
          Gift ideas
        </p>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-wide text-white sm:text-5xl">
          Rage Room Gift Ideas UK
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-zinc-300">
          A rage room session can make a brilliant unusual experience gift, especially
          when you present it like a proper gift instead of sending a plain booking link.
        </p>

        <section className="mt-10 space-y-8 text-zinc-300">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Why rage rooms work as unusual experience gifts
            </h2>
            <p className="mt-3">
              They are memorable, physical, funny and a little unexpected. For the right
              person, a rage room gift can feel more personal than another generic voucher.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Best occasions for a rage room gift
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {occasions.map((occasion) => (
                <div key={occasion} className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-[#181818] p-4">
                  <Gift className="mt-0.5 h-4 w-4 flex-shrink-0 text-rage-500" />
                  <span className="text-sm">{occasion}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">How to present the gift properly</h2>
            <p className="mt-3">
              Choose a voucher design, add the recipient and sender details, include any
              real booking reference or venue voucher code, then print it or send the
              digital version by phone. The template makes the gift feel intentional while
              the actual booking still happens directly with the venue.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">What to check before booking</h2>
            <div className="mt-4 space-y-3">
              {checks.map((check) => (
                <div key={check} className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-[#181818] p-4">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rage-500" />
                  <span className="text-sm">{check}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-rage-500/30 bg-[#181818] p-6">
          <Gift className="h-9 w-9 text-rage-500" />
          <h2 className="mt-4 text-2xl font-bold text-white">
            Download the voucher pack — {product.priceLabel}
          </h2>
          <p className="mt-3 text-zinc-300">
            Get printable and digital voucher templates for birthdays, date nights,
            breakups, best friends, holidays and generic experience gifts. This is a
            presentation pack only, not a venue-issued voucher or booking.
          </p>
          <TrackedProductLink
            href="/digital-downloads/rage-room-gift-voucher-template-pack"
            product={analyticsProduct}
            listName="Gift Ideas Landing CTA"
            className="btn-rage mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 text-sm uppercase tracking-wider"
          >
            View voucher pack
            <ArrowRight className="h-4 w-4" />
          </TrackedProductLink>
        </section>
      </article>
    </div>
  )
}
