import type { Metadata } from "next"
import {
  ArrowRight,
  BriefcaseBusiness,
  Gift,
  Package,
  PartyPopper,
  ShieldCheck,
} from "lucide-react"
import TrackedProductLink from "@/components/TrackedProductLink"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"

export const metadata: Metadata = {
  title: "Digital Guides | Rage Room Planning Downloads",
  description:
    "Browse digital rage room guides, first-visit prep kits, printable planning downloads, corporate toolkits, gift voucher templates and money-saving bundles.",
  alternates: { canonical: "/digital-downloads" },
}

const downloads = [
  {
    title: "Rage Room First Visit Prep Pack",
    price: "£5",
    copy: "For first-timers who want to know what happens and how to arrive ready.",
    cta: "Get first-visit ready — £5",
    href: "/digital-downloads/rage-room-first-visit-prep-pack",
    icon: ShieldCheck,
    productId: "rage-room-first-visit-prep",
  },
  {
    title: "Rage Room Party Planner Pack",
    price: "£7",
    copy: "For planning birthdays, date nights and group nights.",
    cta: "Plan the whole night — £7",
    href: "/digital-downloads/rage-room-party-planner-pack",
    icon: PartyPopper,
    productId: "rage-room-party-planner",
  },
  {
    title: "Corporate Rage Room Team-Building Toolkit",
    price: "£19",
    copy: "For HR, office managers and work socials.",
    cta: "Get HR-ready templates — £19",
    href: "/digital-downloads/corporate-rage-room-team-building-toolkit",
    icon: BriefcaseBusiness,
    productId: "corporate-team-building-toolkit",
  },
  {
    title: "Rage Room Gift Voucher Template Pack",
    price: "£5",
    copy: "For giving a rage room experience as a gift.",
    cta: "Send a polished voucher — £5",
    href: "/digital-downloads/rage-room-gift-voucher-template-pack",
    icon: Gift,
    productId: "rage-room-gift-voucher-template-pack",
  },
]

export default function DigitalDownloadsPage() {
  const bundle = getDigitalProduct("party-gift-bundle")!
  const bundleAnalytics = getDigitalProductAnalytics(bundle)

  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black uppercase tracking-wide text-white sm:text-5xl">
          Digital Guides
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-300">
          Printable planning packs, corporate toolkits and gift templates for organising rage room experiences without starting from a blank page.
        </p>

        <article className="mt-8 rounded-lg border border-rage-500/40 bg-gradient-to-br from-rage-500/10 to-[#181818] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
                <Package className="h-5 w-5 text-rage-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-rage-500">
                  Bundle & save £3
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">
                  Party Planner + Gift Voucher Pack
                </h2>
                <p className="mt-2 text-sm text-zinc-300">
                  Both downloads for {bundle.priceLabel} (normally £12).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-white">{bundle.priceLabel}</span>
              <TrackedProductLink
                href="/digital-downloads/party-planner-gift-voucher-bundle"
                product={bundleAnalytics}
                listName="Digital Products"
                className="btn-rage inline-flex min-h-[44px] items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                View bundle
                <ArrowRight className="h-4 w-4" />
              </TrackedProductLink>
            </div>
          </div>
        </article>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
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
                <div className="mt-5 flex flex-col gap-3">
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
