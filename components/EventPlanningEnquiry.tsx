"use client"

import { useState } from "react"
import Link from "next/link"
import type { CorporateEvent } from "@/lib/corporate-event-builder/types"
import { buildEventEnquiry, eventEnquiryMailto } from "@/lib/event-enquiry"
import { trackEvent } from "@/lib/analytics"

export default function EventPlanningEnquiry({ event, placement }: { event?: CorporateEvent; placement: string }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const [status, setStatus] = useState("")
  function start() {
    setDraft(buildEventEnquiry(event))
    setOpen(true)
    trackEvent("planning_enquiry_start", { placement })
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(draft)
      setStatus("Brief copied. Paste it into an email to ukrageroom@gmail.com.")
      trackEvent("planning_enquiry_copy", { placement })
    } catch { setStatus("Copy is unavailable. Select the brief above and copy it manually.") }
  }
  return <section aria-label="Group event planning enquiry" className="my-8 rounded-lg border border-orange-500/30 bg-[#181818] p-5 sm:p-6 print:hidden">
    <p className="text-xs font-bold uppercase tracking-wider text-orange-400">For group organisers</p>
    <h2 className="mt-2 text-2xl font-bold text-white">Want help planning your event?</h2>
    <p className="mt-3 text-sm leading-6 text-zinc-300">Send the directory team your location, headcount and budget to discuss planning help. We&apos;ll confirm whether we can help, the scope and any fee before you decide.</p>
    {!open ? <button type="button" onClick={start} className="mt-4 inline-flex min-h-11 items-center rounded-md bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700">Prepare an enquiry</button>
      : <div className="mt-4">
        <label className="block text-sm font-semibold text-zinc-200">Review your enquiry
          <textarea value={draft} maxLength={3000} onChange={e => { setDraft(e.target.value); setStatus("") }} rows={11}
            className="mt-2 w-full rounded-md border border-zinc-600 bg-zinc-950 p-3 text-sm leading-6 text-white" />
        </label>
        <p className="mt-2 text-xs leading-5 text-zinc-400">This opens your email app; nothing is sent until you send the email. Include only event requirements, not attendee lists or sensitive personal details.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={eventEnquiryMailto(draft)} onClick={() => trackEvent("planning_enquiry_email_click", { placement })}
            className="inline-flex min-h-11 items-center rounded-md bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700">Open email draft</a>
          <button type="button" onClick={copy} className="inline-flex min-h-11 items-center rounded-md border border-zinc-600 px-4 py-2 font-semibold text-zinc-200">Copy enquiry</button>
        </div>
        <p className="mt-3 text-xs text-zinc-400">Or email ukrageroom@gmail.com directly.</p>
        <p role="status" className="mt-2 text-sm text-orange-300">{status}</p>
      </div>}
    <p className="mt-4 text-xs leading-5 text-zinc-400">An enquiry does not reserve a venue. Any introduction to an external organiser will be agreed with you first. <Link href="/privacy" className="underline">Privacy information</Link>.</p>
  </section>
}
