import { Check } from "lucide-react"

export default function ClaimedListingBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-emerald-700 bg-emerald-950 px-2.5 py-0.5 text-xs font-medium text-emerald-200">
      <Check className="h-3.5 w-3.5" aria-hidden="true" />
      Listing claimed
    </span>
  )
}
