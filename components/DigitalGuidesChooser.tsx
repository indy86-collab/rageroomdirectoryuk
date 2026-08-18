import Link from "next/link"
import TrackedProductLink from "@/components/TrackedProductLink"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"

export type DigitalGuideIntent = "firstVisit" | "party" | "corporate" | "gift"

type DigitalGuidesChooserProps = {
  highlight?: DigitalGuideIntent
  className?: string
}

const intents: {
  id: DigitalGuideIntent
  label: string
  hint: string
  productId: string
}[] = [
  {
    id: "firstVisit",
    label: "First time",
    hint: "Free prep pack — what to wear & expect",
    productId: "rage-room-first-visit-prep",
  },
  {
    id: "party",
    label: "Group / school / birthday",
    hint: "15-page PDF planner",
    productId: "rage-room-party-planner",
  },
  {
    id: "corporate",
    label: "Work / team building",
    hint: "Event Builder — budget & approval",
    productId: "corporate-team-building-toolkit",
  },
  {
    id: "gift",
    label: "Gift",
    hint: "Printable voucher templates",
    productId: "rage-room-gift-voucher-template-pack",
  },
]

export default function DigitalGuidesChooser({
  highlight,
  className = "",
}: DigitalGuidesChooserProps) {
  return (
    <aside
      className={`rounded-lg border border-zinc-800 bg-[#181818] p-4 sm:p-5 ${className}`}
      aria-label="Planning checklists"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-white sm:text-lg">
            What are you planning?
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Pick the checklist that matches — free first-timer tool, paid planners for groups.
          </p>
        </div>
        <Link
          href="/digital-downloads"
          className="mt-2 text-xs font-semibold text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline sm:mt-0"
        >
          Browse all digital guides
        </Link>
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {intents.map((intent) => {
          const product = getDigitalProduct(intent.productId)
          if (!product) return null
          const analyticsProduct = getDigitalProductAnalytics(product)
          const isHighlight = highlight === intent.id

          return (
            <li key={intent.id}>
              <TrackedProductLink
                href={`/digital-downloads/${product.slug}`}
                product={analyticsProduct}
                listName="Digital Guides Chooser"
                className={`block rounded-md border px-3 py-3 transition-colors ${
                  isHighlight
                    ? "border-zinc-600 bg-zinc-900/80"
                    : "border-zinc-800 bg-transparent hover:border-zinc-700 hover:bg-zinc-900/40"
                }`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span>
                    <span className="block text-sm font-semibold text-zinc-100">
                      {intent.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-zinc-500">
                      {intent.hint}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    {isHighlight && (
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Suggested
                      </span>
                    )}
                    {!product.isFree && product.compareAtLabel && (
                      <span className="block text-[10px] text-zinc-500 line-through">
                        {product.compareAtLabel}
                      </span>
                    )}
                    <span className="block text-xs font-bold text-rage-500">
                      {product.priceLabel}
                    </span>
                  </span>
                </span>
              </TrackedProductLink>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
