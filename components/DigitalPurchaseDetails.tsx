import Link from "next/link"
import { Download, HelpCircle, Mail, RotateCcw, ShieldCheck, Sparkles } from "lucide-react"

const reassuranceItems = [
  { label: "Secure checkout by Stripe", icon: ShieldCheck },
  { label: "Instant download after payment", icon: Download },
  { label: "Keep forever after download", icon: Sparkles },
  { label: "UK-ready templates", icon: Mail },
  { label: "7-day faulty-file refund", icon: RotateCcw },
]

export function DigitalRefundNote({ className = "" }: { className?: string }) {
  return (
    <p className={`mt-3 text-xs leading-relaxed text-zinc-400 ${className}`}>
      Instant download after payment. Faulty or unreadable file? Contact us within 7
      days for a replacement or refund.{" "}
      <Link href="/contact" className="font-semibold text-zinc-300 underline-offset-2 hover:text-white hover:underline">
        Contact us
      </Link>
      <span className="mt-1 block text-zinc-500">
        Change-of-mind refunds are not offered after a successful download.
      </span>
    </p>
  )
}

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

/** Compact single-line trust for PDP heroes (less chip clutter). */
export function DigitalCompactTrust({ className = "" }: { className?: string }) {
  return (
    <p className={`mt-4 text-sm font-semibold text-zinc-400 ${className}`}>
      <span className="text-zinc-200">Stripe</span>
      <span className="mx-2 text-zinc-600">·</span>
      Instant download
      <span className="mx-2 text-zinc-600">·</span>
      Keep forever
      <span className="mx-2 text-zinc-600">·</span>
      Planning pack only — not a booking
      <span className="mx-2 text-zinc-600">·</span>
      7-day faulty-file refund
    </p>
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
        <li>2. Your download link appears on the success page.</li>
        <li>3. We also email the download link to the address you use at checkout.</li>
        <li>
          4. Save a copy of the file — the secure link expires after 72 hours, but
          your downloaded file is yours to keep.
        </li>
        <li>
          5. This is a planning/template pack only — it does not include a venue
          booking.
        </li>
      </ol>
    </div>
  )
}

type DigitalValueStackProps = {
  title: string
  items: string[]
  timeCompare?: string
}

export function DigitalValueStack({
  title,
  items,
  timeCompare,
}: DigitalValueStackProps) {
  return (
    <div className="mt-6 rounded-lg border border-rage-500/25 bg-rage-500/5 p-4 sm:p-5">
      <h2 className="text-sm font-bold uppercase tracking-widest text-rage-500">
        {title}
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-zinc-200">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-rage-500" />
            {item}
          </li>
        ))}
      </ul>
      {timeCompare && (
        <p className="mt-3 text-xs font-semibold text-zinc-400">{timeCompare}</p>
      )}
    </div>
  )
}
