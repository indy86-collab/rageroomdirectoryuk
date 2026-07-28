"use client"

import { useState } from "react"
import { ScoreSelector } from "./ScoreSelector"
import type { TriggerCategory } from "@/lib/rage-reset/types"
import { TRIGGER_OPTIONS } from "@/lib/rage-reset/types"

export function CheckInScreen({
  onContinue,
  onBack,
}: {
  onContinue: (score: number) => void
  onBack: () => void
}) {
  const [score, setScore] = useState(5)

  return (
    <ScreenShell title="Check-in" onBack={onBack}>
      <ScoreSelector
        value={score}
        onChange={setScore}
        label="How fired up are you?"
      />
      <button
        type="button"
        className="btn-rage mt-8 w-full min-h-[52px] rounded-xl"
        onClick={() => onContinue(score)}
      >
        Continue
      </button>
    </ScreenShell>
  )
}

export function TriggerScreen({
  onSelect,
  onBack,
}: {
  onSelect: (trigger: TriggerCategory) => void
  onBack: () => void
}) {
  return (
    <ScreenShell title="Optional trigger" onBack={onBack}>
      <h2 className="font-display text-3xl tracking-wide text-white">What set you off?</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Optional. Stored only on this device. Never sent remotely.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {TRIGGER_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className="min-h-[52px] rounded-xl border border-zinc-700 bg-dark-700 px-3 py-3 text-sm font-semibold text-zinc-100 hover:border-rage-500/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rage-400"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </ScreenShell>
  )
}

export function FinalCheckInScreen({
  beforeScore,
  calmEnergyEarned,
  onContinue,
}: {
  beforeScore: number
  calmEnergyEarned: number
  onContinue: (score: number) => void
}) {
  const [score, setScore] = useState(Math.max(1, beforeScore - 1))

  return (
    <ScreenShell title="Final check-in">
      <ScoreSelector value={score} onChange={setScore} label="How do you feel now?" />
      <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
        <Stat label="Before" value={String(beforeScore)} />
        <Stat label="Now" value={String(score)} />
        <Stat
          label="Change"
          value={score === beforeScore ? "0" : score < beforeScore ? `−${beforeScore - score}` : `+${score - beforeScore}`}
        />
      </div>
      <p className="mt-4 text-center text-sm text-zinc-400">
        Calm Energy earned this session so far: {calmEnergyEarned}
      </p>
      <button
        type="button"
        className="btn-rage mt-8 w-full min-h-[52px] rounded-xl"
        onClick={() => onContinue(score)}
      >
        See results
      </button>
    </ScreenShell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-dark-800 px-2 py-3">
      <div className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 font-display text-2xl text-rage-400">{value}</div>
    </div>
  )
}

export function ScreenShell({
  title,
  children,
  onBack,
}: {
  title: string
  children: React.ReactNode
  onBack?: () => void
}) {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="mb-6 flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] min-w-[44px] rounded-xl border border-zinc-700 bg-dark-800 px-3 text-sm"
            aria-label="Go back"
          >
            Back
          </button>
        )}
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{title}</p>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  )
}
