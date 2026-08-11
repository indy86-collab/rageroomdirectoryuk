import type { DigitalProduct } from "@/lib/digital-products"
import { DIGITAL_SALE, isDigitalSaleActive } from "@/lib/digital-promo"

type DigitalPriceDisplayProps = {
  product: DigitalProduct
  className?: string
  size?: "md" | "lg"
  showSaleBadge?: boolean
}

export default function DigitalPriceDisplay({
  product,
  className = "",
  size = "lg",
  showSaleBadge = true,
}: DigitalPriceDisplayProps) {
  const priceClass =
    size === "lg"
      ? "text-3xl font-black text-white"
      : "text-2xl font-black text-white"
  const wasClass =
    size === "lg"
      ? "text-lg font-semibold text-zinc-500 line-through"
      : "text-base font-semibold text-zinc-500 line-through"

  if (product.isFree) {
    return (
      <div className={className}>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className={`${priceClass} text-rage-500`}>{product.priceLabel}</span>
          <span className="rounded border border-rage-500/50 bg-rage-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rage-500">
            Lead magnet
          </span>
        </div>
        <p className="mt-1 text-xs font-semibold text-zinc-400">
          Free download · email unlock · no payment
        </p>
      </div>
    )
  }

  const saleOn =
    isDigitalSaleActive() &&
    Boolean(product.compareAtLabel) &&
    Boolean(product.compareAtAmount) &&
    (product.compareAtAmount as number) > product.unitAmount

  return (
    <div className={className}>
      <div className="flex flex-wrap items-baseline gap-2">
        {saleOn && (
          <span className={wasClass}>{product.compareAtLabel}</span>
        )}
        <span className={priceClass}>{product.priceLabel}</span>
        {saleOn && showSaleBadge && (
          <span className="rounded border border-rage-500/50 bg-rage-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rage-500">
            {DIGITAL_SALE.badge}
          </span>
        )}
      </div>
      {saleOn && (
        <p className="mt-1 text-xs font-semibold text-zinc-400">
          Limited-time demand drop — already applied at checkout
        </p>
      )}
    </div>
  )
}
