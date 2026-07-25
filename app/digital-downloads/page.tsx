import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, FileText, Package } from "lucide-react"
import DigitalEditorialByline from "@/components/DigitalEditorialByline"
import DigitalGuidesChooser from "@/components/DigitalGuidesChooser"
import { DigitalPurchaseReassurance } from "@/components/DigitalPurchaseDetails"
import FAQ from "@/components/FAQ"
import LeadMagnetForm from "@/components/LeadMagnetForm"
import ProductListViewTracker from "@/components/ProductListViewTracker"
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
    productId: "rage-room-first-visit-prep",
  },
  {
    title: "Rage Room Party Planner Pack",
    price: "£7",
    copy: "For planning birthdays, date nights and group nights.",
    cta: "Plan the whole night — £7",
    href: "/digital-downloads/rage-room-party-planner-pack",
    productId: "rage-room-party-planner",
  },
  {
    title: "Corporate Rage Room Team-Building Toolkit",
    price: "£19",
    copy: "For HR, office managers and work socials.",
    cta: "Get HR-ready templates — £19",
    href: "/digital-downloads/corporate-rage-room-team-building-toolkit",
    productId: "corporate-team-building-toolkit",
  },
  {
    title: "Rage Room Gift Voucher Template Pack",
    price: "£5",
    copy: "For giving a rage room experience as a gift.",
    cta: "Send a polished voucher — £5",
    href: "/digital-downloads/rage-room-gift-voucher-template-pack",
    productId: "rage-room-gift-voucher-template-pack",
  },
]

const hubFaqs = [
  {
    question: "Does a digital guide include a venue booking?",
    answer:
      "No. These are planning and template packs only. You still book directly with your chosen rage room venue.",
  },
  {
    question: "What format do I get?",
    answer:
      "Most packs are printable PDF downloads. The gift voucher pack is a ZIP with printable and digital templates. Instant download after payment, plus an email with your link.",
  },
  {
    question: "Can I preview before buying?",
    answer:
      "Yes. Every pack shows sample pages on this site, plus a free sample PDF on its product page. You can also grab a free first-visit checklist by email below.",
  },
  {
    question: "What if a file is faulty?",
    answer:
      "Contact us within 7 days and we will replace it or refund you. Change-of-mind refunds are not offered after a successful download of instant digital content.",
  },
  {
    question: "Are these UK-specific?",
    answer:
      "Yes. Copy, budgeting fields and planning language are written for UK rage room experiences.",
  },
]

export default function DigitalDownloadsPage() {
  const bundle = getDigitalProduct("party-gift-bundle")!
  const bundleAnalytics = getDigitalProductAnalytics(bundle)
  const partyProduct = getDigitalProduct("rage-room-party-planner")!
  const giftProduct = getDigitalProduct("rage-room-gift-voucher-template-pack")!

  const listAnalytics = [
    bundleAnalytics,
    ...downloads
      .map(({ productId }) => {
        const product = getDigitalProduct(productId)
        return product ? getDigitalProductAnalytics(product) : null
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item)),
  ]

  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <ProductListViewTracker products={listAnalytics} listName="Digital Products" />
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black uppercase tracking-wide text-white sm:text-5xl">
          Digital Guides
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-300">
          Printable planning packs, corporate toolkits and gift templates for organising
          rage room experiences without starting from a blank page.
        </p>
        <DigitalEditorialByline className="mt-3" />

        <DigitalPurchaseReassurance className="mt-6" />

        <div className="mt-8">
          <DigitalGuidesChooser />
        </div>

        <article className="mt-8 overflow-hidden rounded-lg border border-rage-500/40 bg-gradient-to-br from-rage-500/10 to-[#181818]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {bundle.marketingImage && (
              <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[220px]">
                <Image
                  src={bundle.marketingImage}
                  alt={bundle.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                />
              </div>
            )}
            <div className="flex flex-col gap-4 p-5 sm:p-6">
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
                    Both downloads for {bundle.priceLabel} (normally £12) —{" "}
                    {partyProduct.shortName || partyProduct.name} +{" "}
                    {giftProduct.shortName || giftProduct.name}.
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
          </div>
        </article>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {downloads.map(({ title, price, copy, cta, href, productId }) => {
            const product = getDigitalProduct(productId)
            const analyticsProduct = product
              ? getDigitalProductAnalytics(product)
              : null
            const includes = product?.includedSections.slice(0, 3) ?? []

            return (
              <article key={title} className="card-base flex flex-col overflow-hidden p-0">
                {product?.marketingImage && (
                  <TrackedProductLink
                    href={href}
                    product={analyticsProduct!}
                    listName="Digital Products"
                    className="relative block aspect-[16/10] overflow-hidden border-b border-zinc-800"
                  >
                    <Image
                      src={product.marketingImage}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </TrackedProductLink>
                )}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">{copy}</p>
                  {includes.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs text-zinc-400"
                        >
                          <FileText className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-rage-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto flex flex-col gap-3 pt-5">
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
                    {product?.previewPdf && (
                      <Link
                        href={product.previewPdf}
                        className="inline-flex min-h-[40px] items-center justify-center text-sm font-semibold text-rage-500 hover:text-rage-400"
                      >
                        View free sample pages
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <section className="mt-10 rounded-lg border border-zinc-800 bg-[#181818] p-5 sm:p-6">
          <h2 className="text-xl font-bold text-white">
            Free first-visit checklist
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
            Not ready to buy? Get a free sample prep checklist by email — then upgrade to
            the full packs when you need the complete planner.
          </p>
          <div className="mt-5">
            <LeadMagnetForm />
          </div>
        </section>

        <FAQ items={hubFaqs} title="Digital guide FAQs" id="digital-guides-faq" />
      </div>
    </div>
  )
}
