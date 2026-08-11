"use client"

import { useEffect, useRef } from "react"
import {
  buildApprovalEmail,
  buildApprovalProposal,
  type CorporateEvent,
} from "@/lib/corporate-event-builder"
import CopyButton from "./CopyButton"
import { helpClass, sectionClass } from "./fieldStyles"

type StepApprovalProps = {
  event: CorporateEvent
  onGenerated?: () => void
}

export default function StepApproval({ event, onGenerated }: StepApprovalProps) {
  const proposal = buildApprovalProposal(event)
  const email = buildApprovalEmail(event)
  const tracked = useRef(false)

  useEffect(() => {
    if (!tracked.current && (event.companyName || event.location)) {
      tracked.current = true
      onGenerated?.()
    }
  }, [event.companyName, event.location, onGenerated])

  return (
    <div className="space-y-4">
      <div className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              Internal approval proposal
            </h2>
            <p className={helpClass}>
              Ready to paste into a doc or email. Edit your event details anytime
              to refresh this text.
            </p>
          </div>
          <CopyButton text={proposal} label="Copy proposal" />
        </div>
        <pre className="mt-4 whitespace-pre-wrap rounded-md border border-zinc-800 bg-[#121212] p-4 text-sm leading-relaxed text-zinc-200">
          {proposal}
        </pre>
      </div>

      <div className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Email version</h2>
            <p className={helpClass}>Shorter approval request for inbox sending.</p>
          </div>
          <CopyButton
            text={`Subject: ${email.subject}\n\n${email.body}`}
            label="Copy email"
          />
        </div>
        <div className="mt-4 space-y-3 rounded-md border border-zinc-800 bg-[#121212] p-4 text-sm text-zinc-200">
          <p>
            <span className="text-zinc-500">Subject:</span> {email.subject}
          </p>
          <pre className="whitespace-pre-wrap leading-relaxed">{email.body}</pre>
        </div>
      </div>
    </div>
  )
}
