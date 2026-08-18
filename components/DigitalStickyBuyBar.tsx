import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import type { AnalyticsProduct } from "@/lib/analytics"

type DigitalStickyBuyBarProps = {
  productId: string
  analyticsProduct: AnalyticsProduct
  priceLabel: string
  ctaLabel: string
}

export default function DigitalStickyBuyBar({
  productId,
  analyticsProduct,
  priceLabel,
  ctaLabel,
}: DigitalStickyBuyBarProps) {
  return (
    <>
      <div className="h-24 lg:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-dark-900/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <p className="min-w-0 text-sm font-bold text-white">
            {priceLabel}
            <span className="mt-0.5 block truncate text-xs font-medium text-zinc-400">
              Instant download · not a booking
            </span>
          </p>
          <DigitalCheckoutButton
            productId={productId}
            analyticsProduct={analyticsProduct}
            hideDisclaimer
            className="btn-rage inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 px-4 text-xs uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-70"
          >
            {ctaLabel}
          </DigitalCheckoutButton>
        </div>
      </div>
    </>
  )
}
