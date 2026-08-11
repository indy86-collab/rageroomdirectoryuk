"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { btnSecondary } from "./fieldStyles"

export default function CopyButton({
  text,
  label = "Copy",
}: {
  text: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button type="button" onClick={handleCopy} className={btnSecondary}>
      {copied ? (
        <Check className="mr-1.5 h-4 w-4 text-emerald-400" />
      ) : (
        <Copy className="mr-1.5 h-4 w-4" />
      )}
      {copied ? "Copied" : label}
    </button>
  )
}
