"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import Link from "next/link"
import { getRageResetBuildId } from "@/lib/rage-reset/build"

type Props = { children: ReactNode; stage?: string }
type State = { hasError: boolean }

function browserFamily(): string {
  if (typeof navigator === "undefined") return "unknown"
  const ua = navigator.userAgent
  if (/Edg\//.test(ua)) return "edge"
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return "chrome"
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return "safari"
  if (/Firefox\//.test(ua)) return "firefox"
  return "other"
}

/**
 * Rage Reset error boundary — safe restart, no stack traces, no emotional data.
 */
export class RageResetErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Technical context only — never scores, triggers, or localStorage payloads.
    const stackHint = String(info.componentStack || "")
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.startsWith("at "))
      ?.slice(0, 80)

    let swStatus = "unsupported"
    try {
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        swStatus = navigator.serviceWorker.controller ? "controlled" : "registered_or_pending"
      }
    } catch {
      swStatus = "unknown"
    }

    const payload = {
      route: "/rage-reset",
      stage: this.props.stage ?? "unknown",
      error_name: error.name || "Error",
      message: String(error.message || "").slice(0, 120),
      build_version: getRageResetBuildId(),
      browser_family: browserFamily(),
      display_mode:
        typeof window !== "undefined" &&
        (window.matchMedia("(display-mode: standalone)").matches ||
          Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
          ? "standalone"
          : "browser",
      sw_status: swStatus,
      stack_location: stackHint || "unavailable",
    }
    try {
      // Prefer existing console for local; no third-party monitor in repo yet.
      console.error("[rage-reset]", payload)
    } catch {
      /* ignore */
    }
  }

  private restart = () => {
    this.setState({ hasError: false })
    try {
      // Keep progression; only clear active mid-session snapshot if present.
      const raw = window.localStorage.getItem("rage-reset-v1")
      if (raw) {
        const data = JSON.parse(raw)
        if (data && typeof data === "object") {
          data.activeSession = undefined
          window.localStorage.setItem("rage-reset-v1", JSON.stringify(data))
        }
      }
    } catch {
      /* ignore */
    }
    window.location.href = "/rage-reset"
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-dark-950 px-4 text-center text-white">
          <h1 className="font-display text-4xl">Something went wrong</h1>
          <p className="mt-3 max-w-sm text-sm text-zinc-400">
            Your local progress is still on this device. You can restart the game safely.
          </p>
          <button
            type="button"
            className="btn-rage mt-8 min-h-[48px] w-full max-w-xs rounded-xl"
            onClick={this.restart}
          >
            Restart Rage Reset
          </button>
          <Link
            href="/"
            className="btn-secondary mt-3 flex min-h-[48px] w-full max-w-xs items-center justify-center rounded-xl"
          >
            Back to RageRoom Directory
          </Link>
        </div>
      )
    }
    return this.props.children
  }
}
