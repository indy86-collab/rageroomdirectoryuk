import { Gift, PartyPopper } from "lucide-react"
import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"

export default function DigitalBundleOffer() {
  const bundle = getDigitalProduct("party-gift-bundle")
  if (!bundle) return null

  const analyticsProduct = getDigitalProductAnalytics(bundle)

  return (
    <aside className="rounded-lg border border-rage-500/40 bg-gradient-to-br from-rage-500/10 to-[#181818] p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-rage-500">
        Bundle & save £3
      </p>
      <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
        Party Planner + Gift Voucher Pack — {bundle.priceLabel}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-300">
        Plan the night and present it with DIY gift voucher templates. Downloads only
        — not a venue booking. Normally £12 separately — get both for {bundle.priceLabel}.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-zinc-200">
        <li className="flex items-center gap-2">
          <PartyPopper className="h-4 w-4 text-rage-500" />
          15-page Party Planner Pack (PDF)
        </li>
        <li className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-rage-500" />
          Gift Voucher Template Pack (ZIP)
        </li>
      </ul>
      <div className="mt-5">
        <DigitalCheckoutButton
          productId={bundle.id}
          analyticsProduct={analyticsProduct}
        >
          Get the bundle — {bundle.priceLabel}
        </DigitalCheckoutButton>
      </div>
    </aside>
  )
}
