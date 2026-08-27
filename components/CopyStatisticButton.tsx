"use client"

import { useState } from "react"
import { citationClipboardText } from "@/lib/insights-stats"

export default function CopyStatisticButton({
  statement,
  asOf,
  sourceUrl,
}: {
  statement: string
  asOf?: string
  sourceUrl?: string
}) {
  const [copied, setCopied] = useState(false)
  const text = citationClipboardText(statement, { asOf, sourceUrl })

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
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
      {copied ? "Copied" : "Copy statistic"}
    </button>
  )
}
