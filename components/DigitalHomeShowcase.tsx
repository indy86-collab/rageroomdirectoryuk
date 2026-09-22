import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import ProductListViewTracker from "@/components/ProductListViewTracker"
import TrackedProductLink from "@/components/TrackedProductLink"
import {
  formatGbpFromPence,
  getDigitalProduct,
  getDigitalProductAnalytics,
  type DigitalProduct,
} from "@/lib/digital-products"

const LIST_NAME = "Homepage Digital Products"

const gift = getDigitalProduct("rage-room-gift-voucher-template-pack")!
const party = getDigitalProduct("rage-room-party-planner")!
const prep = getDigitalProduct("rage-room-first-visit-prep")!
const corporate = getDigitalProduct("corporate-team-building-toolkit")!
const bundle = getDigitalProduct("party-gift-bundle")!

const bundleSaving = party.unitAmount + gift.unitAmount - bundle.unitAmount

const tiles: {
  product: DigitalProduct
  kicker: string
  hook: string
  featured?: boolean
}[] = [
  {
    product: gift,
    kicker: "Gift it",
    hook: "Eight themes to print, text or post for birthdays, date nights and the friend who needs a reset.",
    featured: true,
  },
  {
    product: party,
    kicker: "Plan the night",
    hook: "Budget, RSVPs, invites and a venue scorecard for the group night.",
  },
  {
    product: prep,
    kicker: "First timer",
    hook: "What to wear, what happens, and a checklist before you arrive.",
  },
  {
    product: corporate,
    kicker: "Team day",
    hook: "Build the office outing in the planner, then download a clean PDF.",
  },
]

const bundleSavingLabel =
  bundleSaving > 0 ? formatGbpFromPence(bundleSaving) : null

export default function DigitalHomeShowcase() {
  const analytics = [...tiles.map((tile) => getDigitalProductAnalytics(tile.product)), getDigitalProductAnalytics(bundle)]

  return (
    <section
      id="digital-guides"
      aria-labelledby="digital-guides-heading"
      className="site-container scroll-mt-24 pb-12 sm:pb-16"
    >
      <ProductListViewTracker products={analytics} listName={LIST_NAME} />
      <div className="overflow-hidden rounded-2xl border border-rage-500/35 bg-[#121212] shadow-[0_28px_80px_-36px_rgba(249,115,22,0.55)]">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 px-5 py-6 sm:px-7 sm:py-7">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">Digital guides</p>
            <h2 id="digital-guides-heading" className="section-title">
              Plan it. Gift it. Arrive ready.
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300 sm:text-base">
              Printable UK kits for the night out, the gift and the first smash.
              Instant download — you still book the room with the venue.
            </p>
          </div>
          <Link
            href="/digital-downloads"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-rage-300"
          >
            See all digital guides
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-3 p-3 sm:p-4 md:grid-cols-2">
          {tiles.map((tile) => {
            const title = tile.product.shortName ?? tile.product.name
            const image = tile.product.marketingImage
            return (
              <article
                key={tile.product.id}
                className={tile.featured ? "md:col-span-2" : undefined}
              >
                <TrackedProductLink
                  href={`/digital-downloads/${tile.product.slug}`}
                  product={getDigitalProductAnalytics(tile.product)}
                  listName={LIST_NAME}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#171717] transition-colors hover:border-rage-400/80"
                >
                  {image && (
                    <div
                      className={`relative overflow-hidden bg-black ${
                        tile.featured ? "aspect-[8/5]" : "aspect-[3/2]"
                      }`}
                    >
                      <Image
                        src={image}
                        alt=""
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes={
                          tile.featured
                            ? "(max-width: 768px) 100vw, 1200px"
                            : "(max-width: 768px) 100vw, 600px"
                        }
                      />
                      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-rage-500 px-2.5 py-1 text-xs font-black text-white shadow-lg shadow-black/40">
                        {tile.product.priceLabel}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-rage-300">
                      {tile.kicker}
                    </p>
                    <h3
                      className={`mt-1 font-bold text-white ${
                        tile.featured ? "text-xl sm:text-2xl" : "text-lg"
                      }`}
                    >
                      {title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-300">{tile.hook}</p>
                    <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-rage-300">
                      Take a look
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </p>
                  </div>
                </TrackedProductLink>
              </article>
            )
          })}
          <article className="md:col-span-2">
            <TrackedProductLink
              href={`/digital-downloads/${bundle.slug}`}
              product={getDigitalProductAnalytics(bundle)}
              listName={LIST_NAME}
              className="group grid overflow-hidden rounded-xl border border-rage-500/40 bg-[#171717] transition-colors hover:border-rage-400 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
            >
              <div className="grid min-h-[168px] grid-cols-2">
                {party.marketingImage && (
                  <div className="relative min-h-[168px]">
                    <Image
                      src={party.marketingImage}
                      alt=""
                      fill
                      className="object-cover object-left"
                      sizes="240px"
                    />
                  </div>
                )}
                {gift.marketingImage && (
                  <div className="relative min-h-[168px]">
                    <Image
                      src={gift.marketingImage}
                      alt=""
                      fill
                      className="object-cover object-[72%_center]"
                      sizes="240px"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center p-4 sm:p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-rage-300">
                  Best value{bundleSavingLabel ? ` · save ${bundleSavingLabel}` : ""}
                </p>
                <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">
                  {bundle.shortName ?? bundle.name}
                </h3>
                <p className="mt-2 text-sm text-zinc-300">
                  Both downloads for {bundle.priceLabel}. Plan the night, then wrap it as a gift.
                </p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-rage-300">
                  Open the bundle
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </p>
              </div>
            </TrackedProductLink>
          </article>
        </div>
      </div>
    </section>
  )
}
