"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import { storeDigitalCheckoutEmail } from "@/lib/digital-checkout-email"

const FREE_CHECKLIST_URL =
  "/digital-products/rage-room-first-visit-prep-pack-sample.pdf?v=5&source=lead-magnet"

export default function LeadMagnetForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  )
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")
    setMessage(null)

    try {
      const response = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "digital-downloads" }),
      })
      const data = (await response.json()) as {
        ok?: boolean
        error?: string
        downloadUrl?: string
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to send checklist")
      }

      trackEvent("generate_lead", {
        lead_source: "digital-downloads",
        lead_magnet: "first_visit_checklist",
      })
      storeDigitalCheckoutEmail(email)

      setStatus("success")
      setMessage("Check your inbox — we’ve sent the free checklist link.")
      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank", "noopener,noreferrer")
      }
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Unable to send checklist")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-md border border-zinc-700 bg-[#121212] p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rage-500" />
          <div>
            <p className="text-sm font-semibold text-white">{message}</p>
            <a
              href={FREE_CHECKLIST_URL}
              className="mt-2 inline-flex text-sm font-semibold text-rage-500 hover:text-rage-400"
            >
              Download the checklist now
            </a>
            <p className="mt-3 text-xs text-zinc-400">
              Ready for the full pack?{" "}
              <a
                href="/digital-downloads/rage-room-first-visit-prep-pack"
                className="font-semibold text-zinc-200 underline-offset-2 hover:underline"
              >
                First Visit Prep Pack — £5
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="lead-magnet-email">
          Email address
        </label>
        <input
          id="lead-magnet-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="min-h-[44px] w-full flex-1 rounded-md border border-zinc-700 bg-[#121212] px-3 text-sm text-white placeholder:text-zinc-500 focus:border-rage-500 focus:outline-none focus:ring-1 focus:ring-rage-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-rage inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap px-4 text-sm uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          Email me the free checklist
        </button>
      </div>
      <p className="text-xs text-zinc-500">
        Free sample PDF only. No spam — occasional planning tips and pack offers. Unsubscribe
        any time by replying.
      </p>
      {status === "error" && message && (
        <p className="text-sm text-red-300">{message}</p>
      )}
    </form>
  )
}
