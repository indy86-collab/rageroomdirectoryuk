import { ArrowRight, ClipboardCheck } from "lucide-react"
import FirstVisitChecklistCTA from "@/components/FirstVisitChecklistCTA"
import TrackedProductLink from "@/components/TrackedProductLink"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"
import { DIGITAL_SALE, isDigitalSaleActive } from "@/lib/digital-promo"

type DigitalDownloadCTAVariant = "party" | "corporate" | "gift" | "firstVisit"

type DigitalDownloadCTAProps = {
  variant?: DigitalDownloadCTAVariant
  compact?: boolean
}

const ctaCopy = {
  party: {
    eyebrow: null as string | null,
    title: "Booking for a group?",
    copy: "Get the 15-page Rage Room Party Planner Pack PDF before you choose a venue.",
    buttonPrefix: "Get the planner PDF",
    href: "/digital-downloads/rage-room-party-planner-pack",
    productId: "rage-room-party-planner",
  },
  corporate: {
    eyebrow: "For work events",
    title: "Planning a corporate rage room team event?",
    copy: "Plan your budget, venues, approval and invitations for free. Pay only if you want a clean PDF of the finished plan.",
    buttonPrefix: "Start planning free",
    href: "/digital-downloads/corporate-rage-room-team-building-toolkit",
    productId: "corporate-team-building-toolkit",
  },
  gift: {
    eyebrow: "Gift idea",
    title: "Giving a rage room experience as a gift?",
    copy: "DIY printable and digital gift voucher templates for birthdays, date nights, breakups, best friends and holidays — not a venue booking.",
    buttonPrefix: "Get printable voucher templates",
    href: "/digital-downloads/rage-room-gift-voucher-template-pack",
    productId: "rage-room-gift-voucher-template-pack",
  },
}

export default function DigitalDownloadCTA({
  variant = "party",
  compact = false,
}: DigitalDownloadCTAProps) {
  if (variant === "firstVisit") {
    return <FirstVisitChecklistCTA compact={compact} source="guide-cta" />
  }

  const copy = ctaCopy[variant]
  const product = getDigitalProduct(copy.productId)
  const analyticsProduct = product ? getDigitalProductAnalytics(product) : null
  const saleOn = isDigitalSaleActive()
  const priceBit = product
    ? saleOn && product.compareAtLabel
      ? `${product.priceLabel} (was ${product.compareAtLabel})`
      : product.priceLabel
    : ""

  return (
    <aside className="rounded-lg border border-rage-500/30 bg-[#181818] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
            <ClipboardCheck className="h-5 w-5 text-rage-500" />
          </div>
          <div>
            {copy.eyebrow && (
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-rage-500">
                {copy.eyebrow}
              </p>
            )}
            {saleOn && (
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-rage-500">
                {DIGITAL_SALE.shortHeadline}
              </p>
            )}
            <h2 className="text-base font-bold uppercase tracking-wide text-white">
              {copy.title}
            </h2>
            <p className={`mt-1 text-sm text-zinc-300 ${compact ? "max-w-2xl" : ""}`}>
              {copy.copy}
            </p>
          </div>
        </div>
        {analyticsProduct && product && (
          <TrackedProductLink
            href={copy.href}
            product={analyticsProduct}
            listName="Digital Product CTA"
            className="btn-rage inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap text-sm uppercase tracking-wider"
          >
            {copy.buttonPrefix} — {priceBit}
            <ArrowRight className="h-4 w-4" />
          </TrackedProductLink>
        )}
      </div>
    </aside>
  )
}
