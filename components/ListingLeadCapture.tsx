import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import { getDigitalProduct, getDigitalProductAnalytics } from "@/lib/digital-products"

type ListingLeadCaptureProps = {
  source: string
  className?: string
  idPrefix?: string
  city?: string
}

export default function ListingLeadCapture({
  source,
  className = "",
}: ListingLeadCaptureProps) {
  return (
    <aside
      className={`rounded-lg border border-rage-500/30 bg-[#181818] p-4 sm:p-5 ${className}`}
      aria-label="£1 first visit prep pack"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-rage-500">
        £1 supporter pack
      </p>
      <h2 className="mt-1 text-base font-bold uppercase tracking-wide text-white">
        First rage room visit?
      </h2>
      <p className="mt-1 mb-4 text-sm text-zinc-400">
        Get the 12-page PDF — what to wear, what to ask, and a final arrival checklist.
        Your £1 helps maintain the directory and venue research.
      </p>
      {(() => {
        const product = getDigitalProduct("rage-room-first-visit-prep")!
        return <DigitalCheckoutButton
          productId={product.id}
          analyticsProduct={getDigitalProductAnalytics(product)}
          checkoutSource={source}
          collectEmail
          className="btn-rage inline-flex min-h-11 w-full items-center justify-center text-sm uppercase tracking-wider"
        >
          Get the prep pack — {product.priceLabel}
        </DigitalCheckoutButton>
      })()}
    </aside>
  )
}
