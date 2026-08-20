"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import ConsentControlledProviders from "@/components/ConsentControlledProviders"
import {
  clearAnalyticsStorage,
  denyGoogleConsent,
  OPEN_PRIVACY_SETTINGS_EVENT,
  readConsentPreferences,
  type ConsentPreferences,
  writeConsentPreferences,
} from "@/lib/consent"

type ConsentManagerProps = {
  gaMeasurementId: string
  cloudflareToken: string
}

export default function ConsentManager({
  gaMeasurementId,
  cloudflareToken,
}: ConsentManagerProps) {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null)
  const [ready, setReady] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [analyticsDraft, setAnalyticsDraft] = useState(false)
  const settingsHeadingRef = useRef<HTMLHeadingElement>(null)
  const settingsRef = useRef<HTMLElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const stored = readConsentPreferences()
    setPreferences(stored)
    setAnalyticsDraft(stored?.analytics ?? false)
    setReady(true)

    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[privacy] Consent state: ${
          stored ? (stored.analytics ? "analytics granted" : "optional rejected") : "undecided"
        }`
      )
    }
  }, [])

  useEffect(() => {
    function openSettings() {
      previousFocusRef.current = document.activeElement as HTMLElement | null
      setAnalyticsDraft(preferences?.analytics ?? false)
      setSettingsOpen(true)
    }

    window.addEventListener(OPEN_PRIVACY_SETTINGS_EVENT, openSettings)
    return () => window.removeEventListener(OPEN_PRIVACY_SETTINGS_EVENT, openSettings)
  }, [preferences])

  useEffect(() => {
    if (!settingsOpen) return
    settingsHeadingRef.current?.focus()

    function handleDialogKeys(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSettings()
        return
      }
      if (event.key !== "Tab" || !settingsRef.current) return

      const focusable = Array.from(
        settingsRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (event.shiftKey && (!active || !focusable.includes(active) || active === first)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", handleDialogKeys)
    return () => document.removeEventListener("keydown", handleDialogKeys)
  }, [settingsOpen])

  function closeSettings() {
    setSettingsOpen(false)
    window.setTimeout(() => previousFocusRef.current?.focus(), 0)
  }

  function applyDecision(analytics: boolean) {
    const wasEnabled = preferences?.analytics === true
    const next = writeConsentPreferences(analytics)

    if (!analytics) {
      denyGoogleConsent()
      clearAnalyticsStorage()
    }

    setPreferences(next)
    setAnalyticsDraft(analytics)
    setSettingsOpen(false)

    if (process.env.NODE_ENV !== "production") {
      console.info(`[privacy] Analytics ${analytics ? "enabled" : "disabled"}`)
    }

    if (wasEnabled && !analytics) {
      window.location.reload()
    }
  }

  if (!ready) return null

  return (
    <>
      {preferences?.analytics && (
        <ConsentControlledProviders
          gaMeasurementId={gaMeasurementId}
          cloudflareToken={cloudflareToken}
        />
      )}

      {!preferences && !settingsOpen && (
        <section
          aria-label="Privacy choices"
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[120] mx-auto max-w-4xl rounded-xl border border-zinc-700 bg-zinc-950 p-4 shadow-2xl sm:p-5"
          data-testid="consent-banner"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-base font-bold text-white">Your privacy choices</h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-300">
                We use optional analytics to understand directory use and improve the site.
                They stay off unless you accept. Essential browser storage keeps requested
                features working. <Link href="/privacy" className="underline hover:text-orange-400">Privacy details</Link>.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
              <button
                type="button"
                onClick={() => applyDecision(false)}
                className="min-h-12 rounded-md bg-zinc-200 px-4 text-sm font-bold text-zinc-950 hover:bg-white"
              >
                Reject analytics
              </button>
              <button
                type="button"
                onClick={() => {
                  previousFocusRef.current = document.activeElement as HTMLElement
                  setSettingsOpen(true)
                }}
                className="min-h-12 rounded-md border border-zinc-600 px-4 text-sm font-semibold text-white hover:border-zinc-400"
              >
                Manage preferences
              </button>
              <button
                type="button"
                onClick={() => applyDecision(true)}
                className="min-h-12 rounded-md bg-orange-500 px-4 text-sm font-bold text-white hover:bg-orange-600"
              >
                Accept analytics
              </button>
            </div>
          </div>
        </section>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-[130] flex items-end justify-center bg-black/70 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center">
          <section
            ref={settingsRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-settings-title"
            className="max-h-[min(90dvh,40rem)] w-full max-w-xl overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-950 p-5 shadow-2xl"
            data-testid="privacy-settings"
          >
            <h2
              id="privacy-settings-title"
              ref={settingsHeadingRef}
              tabIndex={-1}
              className="text-xl font-bold text-white outline-none"
            >
              Privacy settings
            </h2>
            <p className="mt-2 text-sm text-zinc-300">
              Choose whether optional measurement may run. You can change this at any time.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-lg border border-zinc-800 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">Essential</h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      Saves this choice and powers features you request, such as planners and purchased workspaces.
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-zinc-300">Always on</span>
                </div>
              </div>

              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-zinc-800 p-4">
                <span>
                  <span className="block font-semibold text-white">Analytics</span>
                  <span className="mt-1 block text-sm text-zinc-400">
                    Allows GA4, Vercel Web Analytics and Cloudflare Web Analytics to measure visits, conversions and performance. We do not send form text, contact details or precise location.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={analyticsDraft}
                  onChange={(event) => setAnalyticsDraft(event.target.checked)}
                  className="mt-1 h-5 w-5 accent-orange-500"
                />
              </label>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              Google Maps loads only when you press a map button and is separate from analytics. Advertising is currently disabled. See the <Link href="/privacy" className="underline hover:text-orange-400">privacy policy</Link> for provider details.
            </p>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={closeSettings}
                className="min-h-[44px] rounded-md border border-zinc-600 px-4 text-sm font-semibold text-white hover:border-zinc-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => applyDecision(analyticsDraft)}
                className="min-h-[44px] rounded-md bg-orange-500 px-4 text-sm font-bold text-white hover:bg-orange-600"
              >
                Save settings
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
