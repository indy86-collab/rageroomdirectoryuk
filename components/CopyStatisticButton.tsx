"use client"

import { useState } from "react"
import { trackAuthorityEvent, type AuthorityEventName } from "@/lib/analytics"
import { citationClipboardText } from "@/lib/insights-stats"

type CopyEventName = Extract<
  AuthorityEventName,
  "report_citation_copied"
>

export default function CopyStatisticButton({
  statement,
  asOf,
  sourceUrl,
  text,
  label = "Copy statistic",
  eventName,
}: {
  statement?: string
  asOf?: string
  sourceUrl?: string
  text?: string
  label?: string
  eventName?: CopyEventName
}) {
  const [copied, setCopied] = useState(false)
  const copiedText = text ?? citationClipboardText(statement ?? "", { asOf, sourceUrl })

  async function copy() {
    try {
      await navigator.clipboard.writeText(copiedText)
      setCopied(true)
      if (eventName) {
        trackAuthorityEvent(eventName, { surface: "flagship_report" })
      }
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-10 items-center rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-orange-500 hover:text-white"
    >
      {copied ? "Copied" : label}
    </button>
  )
}
