import { Gift, PartyPopper } from "lucide-react"
import DigitalCheckoutButton from "@/components/DigitalCheckoutButton"
import DigitalPriceDisplay from "@/components/DigitalPriceDisplay"
import DigitalSaleBanner from "@/components/DigitalSaleBanner"
import {
  getDigitalProduct,
  getDigitalProductAnalytics,
} from "@/lib/digital-products"

export default function DigitalBundleOffer() {
  const bundle = getDigitalProduct("party-gift-bundle")
  if (!bundle) return null

  const party = getDigitalProduct("rage-room-party-planner")
  const gift = getDigitalProduct("rage-room-gift-voucher-template-pack")
  const analyticsProduct = getDigitalProductAnalytics(bundle)
  const separateWas =
    (party?.compareAtAmount ?? party?.unitAmount ?? 0) +
    (gift?.compareAtAmount ?? gift?.unitAmount ?? 0)
  const separateWasLabel =
    separateWas > 0 ? `£${(separateWas / 100).toFixed(separateWas % 100 === 0 ? 0 : 2)}` : "£12"

  return (
    <aside className="rounded-lg border border-rage-500/40 bg-gradient-to-br from-rage-500/10 to-[#181818] p-5 sm:p-6">
      <DigitalSaleBanner compact className="mb-3" />
      <p className="text-xs font-bold uppercase tracking-widest text-rage-500">
        Bundle deal
      </p>
      <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
        Party Planner + Gift Voucher Pack — {bundle.priceLabel}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-300">
        Plan the night and present it with DIY gift voucher templates. Downloads only
        — not a venue booking. Was {separateWasLabel} separately /{" "}
        {bundle.compareAtLabel || "£9"} as a bundle — now {bundle.priceLabel} for a
        limited time.
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
      <DigitalPriceDisplay product={bundle} size="md" className="mt-5" />
      <div className="mt-4">
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
