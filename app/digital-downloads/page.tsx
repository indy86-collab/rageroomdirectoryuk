import type { Metadata } from "next"
import { ArrowRight, BriefcaseBusiness, Gift, PartyPopper } from "lucide-react"
import TrackedProductLink from "@/components/TrackedProductLink"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"

export const metadata: Metadata = {
  title: "Digital Guides | Rage Room Planning Downloads",
  description:
    "Browse digital rage room guides, printable planning downloads, corporate toolkits and gift voucher templates.",
  alternates: { canonical: "/digital-downloads" },
}

const downloads = [
  {
    title: "Rage Room Party Planner Pack",
    price: "£7",
    copy: "For planning birthdays, date nights and group nights.",
    cta: "View party planner",
    href: "/digital-downloads/rage-room-party-planner-pack",
    icon: PartyPopper,
    productId: "rage-room-party-planner",
  },
  {
    title: "Corporate Rage Room Team-Building Toolkit",
    price: "£19",
    copy: "For HR, office managers and work socials.",
    cta: "View corporate toolkit",
    href: "/digital-downloads/corporate-rage-room-team-building-toolkit",
    icon: BriefcaseBusiness,
    productId: "corporate-team-building-toolkit",
  },
  {
    title: "Rage Room Gift Voucher Template Pack",
    price: "£5",
    copy: "For giving a rage room experience as a gift.",
    cta: "View voucher pack",
    href: "/digital-downloads/rage-room-gift-voucher-template-pack",
    icon: Gift,
    productId: "rage-room-gift-voucher-template-pack",
  },
]

export default function DigitalDownloadsPage() {
  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black uppercase tracking-wide text-white sm:text-5xl">
          Digital Guides
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-300">
          Printable planning packs, corporate toolkits and gift templates for organising rage room experiences without starting from a blank page.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {downloads.map(({ title, price, copy, cta, href, icon: Icon, productId }) => {
            const product = getDigitalProduct(productId)
            const analyticsProduct = product
              ? getDigitalProductAnalytics(product)
              : null

            return (
              <article key={title} className="card-base p-5 sm:p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
                  <Icon className="h-5 w-5 text-rage-500" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{copy}</p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <span className="text-2xl font-black text-white">{price}</span>
                  {analyticsProduct && (
                    <TrackedProductLink
                      href={href}
                      product={analyticsProduct}
                      listName="Digital Products"
                      className="btn-rage inline-flex min-h-[44px] items-center justify-center gap-2 text-sm uppercase tracking-wider"
                    >
                      {cta}
                      <ArrowRight className="h-4 w-4" />
                    </TrackedProductLink>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
