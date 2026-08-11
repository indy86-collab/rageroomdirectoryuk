"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle, Download, Loader2, MapPin } from "lucide-react"
import {
  trackFirstVisitChecklistCtaClick,
  trackFirstVisitChecklistDownload,
  trackFirstVisitChecklistEmailSubmit,
  trackFirstVisitChecklistFindVenueClick,
  trackFirstVisitChecklistSuccess,
  trackFirstVisitChecklistView,
} from "@/lib/analytics"
import { storeDigitalCheckoutEmail } from "@/lib/digital-checkout-email"
import FirstTimerChecklistPreview from "@/components/FirstTimerChecklistPreview"

type LeadMagnetFormProps = {
  source?: string
  /** Optional heading override for embedded placements. */
  showInlinePreviewOnSuccess?: boolean
  className?: string
  idPrefix?: string
}

export default function LeadMagnetForm({
  source = "digital-downloads",
  showInlinePreviewOnSuccess = true,
  className = "",
  idPrefix = "lead-magnet",
}: LeadMagnetFormProps) {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  )
  const [message, setMessage] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const viewedRef = useRef(false)

  useEffect(() => {
    if (viewedRef.current) return
    viewedRef.current = true
    trackFirstVisitChecklistView(source)
  }, [source])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")
    setMessage(null)
    trackFirstVisitChecklistEmailSubmit(source)

    try {
      const response = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: firstName.trim() || undefined,
          source,
          marketingOptIn,
        }),
      })
      const data = (await response.json()) as {
        ok?: boolean
        error?: string
        downloadUrl?: string
        emailSent?: boolean
      }

      if (!response.ok || !data.ok || !data.downloadUrl) {
        throw new Error(data.error || "Unable to unlock checklist")
      }

      storeDigitalCheckoutEmail(email)
      setDownloadUrl(data.downloadUrl)
      setStatus("success")
      trackFirstVisitChecklistSuccess(source)
      setMessage(
        data.emailSent
          ? "We’ve also emailed you a copy of the download link."
          : "Your checklist is ready to download below."
      )
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Unable to unlock checklist")
    }
  }

  if (status === "success" && downloadUrl) {
    return (
      <div className={`space-y-5 ${className}`}>
        <div className="rounded-lg border border-rage-500/40 bg-[#121212] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-rage-500" />
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold text-white sm:text-2xl">
                Your checklist is ready
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                You’re all set for your first rage room visit.
              </p>
              {message && (
                <p className="mt-1 text-xs text-zinc-500">{message}</p>
              )}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={downloadUrl}
                  onClick={() => trackFirstVisitChecklistDownload(source)}
                  className="btn-rage inline-flex min-h-[48px] items-center justify-center gap-2 px-5 text-sm uppercase tracking-wider"
                >
                  <Download className="h-4 w-4" />
                  Download Checklist
                </a>
                <Link
                  href="/listings"
                  onClick={() => trackFirstVisitChecklistFindVenueClick(source)}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md border border-zinc-700 bg-transparent px-5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:border-rage-500 hover:text-rage-500"
                >
                  <MapPin className="h-4 w-4" />
                  Find a Rage Room Near You
                </Link>
              </div>
            </div>
          </div>
        </div>
        {showInlinePreviewOnSuccess && (
          <FirstTimerChecklistPreview variant="full" />
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
            htmlFor={`${idPrefix}-first-name`}
          >
            First name <span className="normal-case text-zinc-600">(optional)</span>
          </label>
          <input
            id={`${idPrefix}-first-name`}
            type="text"
            name="firstName"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Alex"
            className="min-h-[48px] w-full rounded-md border border-zinc-700 bg-[#121212] px-3 text-base text-white placeholder:text-zinc-500 focus:border-rage-500 focus:outline-none focus:ring-1 focus:ring-rage-500"
          />
        </div>
        <div>
          <label
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400"
            htmlFor={`${idPrefix}-email`}
          >
            Email address
          </label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="min-h-[48px] w-full rounded-md border border-zinc-700 bg-[#121212] px-3 text-base text-white placeholder:text-zinc-500 focus:border-rage-500 focus:outline-none focus:ring-1 focus:ring-rage-500"
          />
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm leading-snug text-zinc-400">
        <input
          type="checkbox"
          checked={marketingOptIn}
          onChange={(event) => setMarketingOptIn(event.target.checked)}
          className="mt-1 h-4 w-4 flex-shrink-0 rounded border-zinc-600 bg-[#121212] text-rage-500 focus:ring-rage-500"
        />
        <span>
          Also send occasional planning tips and guide updates. Optional — not required
          for your free checklist.{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-zinc-200">
            Privacy policy
          </Link>
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        onClick={() => trackFirstVisitChecklistCtaClick(source)}
        className="btn-rage inline-flex w-full min-h-[48px] items-center justify-center gap-2 px-4 text-sm uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
        Get the Free Checklist
      </button>
      <p className="text-xs text-zinc-500">
        Free download. No account required.
      </p>
      {status === "error" && message && (
        <p className="text-sm text-red-300" role="alert">
          {message}
        </p>
      )}
    </form>
  )
}
