import Link from "next/link"
import { Clock, Download, HelpCircle, ShieldCheck, TicketX } from "lucide-react"

const reassuranceItems = [
  { label: "Secure checkout by Stripe", icon: ShieldCheck },
  { label: "Instant download after payment", icon: Download },
  { label: "No venue booking included", icon: TicketX },
  { label: "Download link valid for 72 hours", icon: Clock },
]

type DigitalPurchaseReassuranceProps = {
  className?: string
}

export function DigitalPurchaseReassurance({
  className = "",
}: DigitalPurchaseReassuranceProps) {
  return (
    <div className={`mt-5 flex flex-wrap gap-2 ${className}`}>
      {reassuranceItems.map(({ label, icon: Icon }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-[#181818] px-3 py-1.5 text-xs font-semibold text-zinc-200"
        >
          <Icon className="h-3.5 w-3.5 text-rage-500" />
          {label}
        </span>
      ))}
      <Link
        href="/contact"
        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-[#181818] px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-rage-500/60 hover:text-white"
      >
        <HelpCircle className="h-3.5 w-3.5 text-rage-500" />
        Questions? Contact us
      </Link>
    </div>
  )
}

export function WhatHappensAfterPayment() {
  return (
    <div className="card-base p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-rage-500/40 bg-rage-500/15">
        <ShieldCheck className="h-5 w-5 text-rage-500" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-white">
        What happens after payment
      </h2>
      <ol className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-300">
        <li>1. Stripe confirms the payment securely.</li>
        <li>2. Your download link is generated on the success page.</li>
        <li>3. Save a copy within 72 hours before the secure link expires.</li>
      </ol>
    </div>
  )
}
