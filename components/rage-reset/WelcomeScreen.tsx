"use client"

import { useState } from "react"
import { Volume2, VolumeX, Vibrate, Info, Shield } from "lucide-react"

export function WelcomeScreen({
  soundEnabled,
  hapticsEnabled,
  onToggleSound,
  onToggleHaptics,
  onStart,
  onOpenPrivacy,
  onOpenHowItWorks,
  onOpenStats,
  onOpenProgress,
}: {
  soundEnabled: boolean
  hapticsEnabled: boolean
  onToggleSound: () => void
  onToggleHaptics: () => void
  onStart: () => void
  onOpenPrivacy: () => void
  onOpenHowItWorks: () => void
  onOpenStats: () => void
  onOpenProgress?: () => void
}) {
  const [panel, setPanel] = useState<"none" | "how" | "privacy">("none")

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.28),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(220,38,38,0.22),_transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 top-24 h-40 w-40 rotate-12 rounded-3xl border-4 border-rage-500/30 bg-rage-500/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 bottom-40 h-32 w-32 -rotate-6 rounded-full border-4 border-zinc-600/40"
      />

      <div className="relative z-10 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
          RageRoom Directory
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-xl border border-zinc-700 bg-dark-800/80 px-3 text-sm"
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span className="hidden sm:inline">{soundEnabled ? "Sound" : "Muted"}</span>
          </button>
          <button
            type="button"
            onClick={onToggleHaptics}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-xl border border-zinc-700 bg-dark-800/80 px-3 text-sm"
            aria-pressed={hapticsEnabled}
            aria-label={hapticsEnabled ? "Disable haptics" : "Enable haptics"}
          >
            <Vibrate size={18} />
            <span className="hidden sm:inline">{hapticsEnabled ? "Haptics" : "Off"}</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="font-display text-[clamp(3.5rem,16vw,6rem)] leading-[0.9] tracking-wide text-white drop-shadow-[0_4px_0_rgba(220,38,38,0.85)]">
          Rage Reset
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-200 sm:text-lg">
          Three minutes. Smash something. Slow things down. Reset.
        </p>
        <p className="mt-2 max-w-sm text-sm text-zinc-400">
          Enter angry. Play something satisfying. Leave calmer.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="btn-rage mt-10 min-h-[56px] w-full max-w-xs rounded-2xl px-8 text-lg shadow-glow"
        >
          Start a reset
        </button>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
          <button
            type="button"
            onClick={() => setPanel("how")}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-zinc-300 underline-offset-4 hover:text-white hover:underline"
          >
            <Info size={16} aria-hidden />
            How it works
          </button>
          <button
            type="button"
            onClick={() => {
              setPanel("privacy")
              onOpenPrivacy()
            }}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-zinc-300 underline-offset-4 hover:text-white hover:underline"
          >
            <Shield size={16} aria-hidden />
            Privacy
          </button>
          <button
            type="button"
            onClick={onOpenStats}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-zinc-300 underline-offset-4 hover:text-white hover:underline"
          >
            Local stats
          </button>
          {onOpenProgress && (
            <button
              type="button"
              onClick={onOpenProgress}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-zinc-300 underline-offset-4 hover:text-white hover:underline"
            >
              Progress
            </button>
          )}
        </div>
      </div>

      <p className="relative z-10 mx-auto max-w-md text-center text-xs leading-relaxed text-zinc-500">
        Rage Reset is a casual entertainment game, not therapy or medical treatment.
      </p>

      {panel !== "none" && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-4 sm:items-center"
          onClick={() => setPanel("none")}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zinc-700 bg-dark-800 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl text-white">
              {panel === "how" ? "How it works" : "Privacy"}
            </h2>
            {panel === "how" ? (
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
                <li>Check how fired up you feel (stored only on this device).</li>
                <li>Smash cartoon objects in a free room.</li>
                <li>Land slower, timed controlled strikes.</li>
                <li>Sort fragments in a short cool-down.</li>
                <li>Check in again and see your local session summary.</li>
              </ol>
            ) : (
              <div className="mt-3 space-y-2 text-sm text-zinc-300">
                <p>
                  Check-in scores and trigger categories stay on this device. They are never sent
                  to analytics, APIs or remote databases.
                </p>
                <p>
                  Anonymous stage events (for example room selected) may be sent if site analytics
                  are active. You can delete all Rage Reset data from Local stats.
                </p>
              </div>
            )}
            <button
              type="button"
              className="btn-secondary mt-5 w-full min-h-[48px]"
              onClick={() => {
                setPanel("none")
                if (panel === "how") onOpenHowItWorks()
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
