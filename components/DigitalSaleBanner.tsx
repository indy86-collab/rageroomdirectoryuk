import { Flame } from "lucide-react"
import {
  DIGITAL_SALE,
  digitalSaleEndLabel,
  isDigitalSaleActive,
} from "@/lib/digital-promo"

type DigitalSaleBannerProps = {
  className?: string
  compact?: boolean
}

export default function DigitalSaleBanner({
  className = "",
  compact = false,
}: DigitalSaleBannerProps) {
  if (!isDigitalSaleActive()) return null

  if (compact) {
    return (
      <p
        className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-rage-500 ${className}`}
      >
        <Flame className="h-3.5 w-3.5" />
        {DIGITAL_SALE.shortHeadline} · ends {digitalSaleEndLabel()}
      </p>
    )
  }

  return (
    <aside
      className={`rounded-lg border border-rage-500/40 bg-gradient-to-br from-rage-500/15 to-[#181818] p-4 sm:p-5 ${className}`}
      aria-label="Limited-time digital guide sale"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
          <Flame className="h-5 w-5 text-rage-500" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-rage-500">
            {DIGITAL_SALE.eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
            {DIGITAL_SALE.headline}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">
            {DIGITAL_SALE.copy}
          </p>
          <p className="mt-2 text-xs font-semibold text-zinc-400">
            Offer ends {digitalSaleEndLabel()}. No code needed — sale price is at
            Stripe checkout.
          </p>
        </div>
      </div>
    </aside>
  )
}
