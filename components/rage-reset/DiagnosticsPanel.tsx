"use client"

import { useEffect, useState } from "react"
import { getRecentAnalyticsEvents } from "@/lib/rage-reset/analytics"
import { getRageResetBuildId, RAGE_RESET_RELEASE_NAME } from "@/lib/rage-reset/build"
import { getDisplayMode } from "@/lib/rage-reset/displayMode"
import { getCooldownChallenge, getGameRenderer, isDiagnosticsEnabled } from "@/lib/rage-reset/features"
import { STORAGE_KEY } from "@/lib/rage-reset/types"
import type { SessionRuntime } from "@/lib/rage-reset/types"

/**
 * Development-only diagnostics. Never enabled for public production traffic
 * unless NEXT_PUBLIC_RAGE_RESET_DIAGNOSTICS=1 is set intentionally.
 * Does not show emotional scores or triggers.
 */
export function DiagnosticsPanel({
  runtime,
  heat,
  sessionCount,
  unlocks,
  dailyChallengeId,
}: {
  runtime: SessionRuntime
  heat?: number
  sessionCount: number
  unlocks: { rooms: string[]; weapons: string[] }
  dailyChallengeId: string
}) {
  const [open, setOpen] = useState(false)
  const [swState, setSwState] = useState("unknown")
  const [events, setEvents] = useState<{ name: string }[]>([])
  const enabled = isDiagnosticsEnabled()

  useEffect(() => {
    if (!enabled) return
    const id = window.setInterval(() => {
      setEvents(getRecentAnalyticsEvents().map((e) => ({ name: e.name })))
    }, 1000)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration("/rage-reset").then((reg) => {
        if (!reg) setSwState("none")
        else if (reg.waiting) setSwState("waiting")
        else if (reg.active) setSwState("active")
        else setSwState("registered")
      })
    }
    return () => window.clearInterval(id)
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="fixed bottom-14 right-2 z-[60] max-w-[min(100vw-1rem,20rem)] text-left">
      <button
        type="button"
        className="rounded bg-zinc-800 px-2 py-1 text-[10px] font-mono text-zinc-300"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide debug" : "Debug"}
      </button>
      {open && (
        <div className="mt-1 max-h-[50vh] overflow-auto rounded border border-zinc-700 bg-black/90 p-2 font-mono text-[10px] text-zinc-300">
          <p>release: {RAGE_RESET_RELEASE_NAME}</p>
          <p>build: {getRageResetBuildId()}</p>
          <p>state: {runtime.state}</p>
          <p>room: {runtime.roomId ?? "—"}</p>
          <p>weapon: {runtime.weaponId ?? "—"}</p>
          <p>heat: {heat ?? "—"}</p>
          <p>display: {getDisplayMode()}</p>
          <p>sw: {swState}</p>
          <p>storage: {STORAGE_KEY}</p>
          <p>sessions: {sessionCount}</p>
          <p>unlocks rooms: {unlocks.rooms.join(",")}</p>
          <p>unlocks weapons: {unlocks.weapons.join(",")}</p>
          <p>daily: {dailyChallengeId}</p>
          <p>cooldown flag: {getCooldownChallenge()}</p>
          <p>renderer: {getGameRenderer()}</p>
          <p className="mt-1 text-zinc-500">analytics (names only):</p>
          <ul>
            {events.slice(-12).map((e, i) => (
              <li key={`${e.name}-${i}`}>{e.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
