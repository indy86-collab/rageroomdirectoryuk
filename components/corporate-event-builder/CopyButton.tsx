"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

type CopyButtonProps = {
  text: string
  label?: string
  className?: string
  onCopied?: () => void
}

export default function CopyButton({
  text,
  label = "Copy",
  className = "",
  onCopied,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopied?.()
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-100 transition-colors hover:border-rage-500/50 hover:text-white ${className}`}
    >
      {copied ? (
        <Check className="h-4 w-4 text-rage-500" />
      ) : (
        <Copy className="h-4 w-4 text-rage-500" />
      )}
      {copied ? "Copied" : label}
    </button>
  )
}
