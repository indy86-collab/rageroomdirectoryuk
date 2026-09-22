import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import ProductListViewTracker from "@/components/ProductListViewTracker"
import TrackedProductLink from "@/components/TrackedProductLink"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
  type DigitalProduct,
} from "@/lib/digital-products"

const LIST_NAME = "Homepage Digital Products"

const tiles: { product: DigitalProduct; label: string }[] = [
  { product: getDigitalProduct("rage-room-gift-voucher-template-pack")!, label: "Gift vouchers" },
  { product: getDigitalProduct("rage-room-party-planner")!, label: "Party planner" },
  { product: getDigitalProduct("rage-room-first-visit-prep")!, label: "First visit" },
  { product: getDigitalProduct("corporate-team-building-toolkit")!, label: "Team day" },
]

export default function DigitalHomeShowcase() {
  return (
    <section
      id="digital-guides"
      aria-labelledby="digital-guides-heading"
      className="site-container scroll-mt-24 pb-12 sm:pb-16"
    >
      <ProductListViewTracker
        products={tiles.map((tile) => getDigitalProductAnalytics(tile.product))}
        listName={LIST_NAME}
      />
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#171717]">
        <div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <div>
            <p className="eyebrow mb-2">Digital guides</p>
            <h2 id="digital-guides-heading" className="section-title">
              Planning packs
            </h2>
          </div>
          <Link
            href="/digital-downloads"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-rage-300"
          >
            Browse the guides
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:p-5">
          {tiles.map((tile) => {
            const image = tile.product.marketingImage
            return (
              <li key={tile.product.id}>
                <TrackedProductLink
                  href={`/digital-downloads/${tile.product.slug}`}
                  product={getDigitalProductAnalytics(tile.product)}
                  listName={LIST_NAME}
                  className="group block overflow-hidden rounded-xl bg-black"
                >
                  {image && (
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <Image
                        src={image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 46vw, 240px"
                      />
                    </div>
                  )}
                  <span className="flex items-baseline justify-between gap-2 bg-[#171717] px-2.5 py-2.5">
                    <span className="text-sm font-semibold text-white">{tile.label}</span>
                    <span className="shrink-0 text-xs text-zinc-400">{tile.product.priceLabel}</span>
                  </span>
                </TrackedProductLink>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
