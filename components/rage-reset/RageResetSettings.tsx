"use client"

import { useState } from "react"
import type { LocalStats } from "@/lib/rage-reset/types"
import { getRoom, getWeapon } from "@/lib/rage-reset/content"
import { ScreenShell } from "./CheckInScreens"

export function RageResetSettings({
  stats,
  soundEnabled,
  hapticsEnabled,
  reducedEffects,
  onToggleSound,
  onToggleHaptics,
  onToggleReduced,
  onDelete,
  onClose,
}: {
  stats: LocalStats
  soundEnabled: boolean
  hapticsEnabled: boolean
  reducedEffects: boolean
  onToggleSound: () => void
  onToggleHaptics: () => void
  onToggleReduced: () => void
  onDelete: () => void
  onClose: () => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <ScreenShell title="Local stats & settings" onBack={onClose}>
      <h2 className="font-display text-3xl text-white">Your device only</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Up to seven days of free history. Nothing here is uploaded.
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <Stat label="Sessions" value={String(stats.sessionsCompleted)} />
        <Stat label="Reset streak" value={String(stats.currentResetStreak)} />
        <Stat
          label="Avg start"
          value={stats.averageStartScore != null ? stats.averageStartScore.toFixed(1) : "—"}
        />
        <Stat
          label="Avg finish"
          value={stats.averageFinishScore != null ? stats.averageFinishScore.toFixed(1) : "—"}
        />
        <Stat
          label="Most-used room"
          value={stats.mostUsedRoom ? getRoom(stats.mostUsedRoom)?.name ?? "—" : "—"}
        />
        <Stat
          label="Most-used weapon"
          value={stats.mostUsedWeapon ? getWeapon(stats.mostUsedWeapon)?.name ?? "—" : "—"}
        />
        <Stat
          label="Cool-down rate"
          value={
            stats.cooldownCompletionRate != null
              ? `${Math.round(stats.cooldownCompletionRate * 100)}%`
              : "—"
          }
        />
      </dl>

      <div className="mt-6 space-y-2">
        <ToggleRow label="Sound" pressed={soundEnabled} onClick={onToggleSound} />
        <ToggleRow label="Haptics" pressed={hapticsEnabled} onClick={onToggleHaptics} />
        <ToggleRow
          label="Reduced motion / effects"
          pressed={reducedEffects}
          onClick={onToggleReduced}
        />
      </div>

      {!confirmDelete ? (
        <button
          type="button"
          className="mt-8 w-full min-h-[48px] rounded-xl border border-red-700/60 bg-red-950/40 px-4 text-sm font-semibold text-red-200"
          onClick={() => setConfirmDelete(true)}
        >
          Delete my Rage Reset data
        </button>
      ) : (
        <div className="mt-8 rounded-xl border border-red-600/50 bg-red-950/50 p-4">
          <p className="text-sm text-red-100">
            This permanently deletes session history, scores, triggers, unlocks, settings and any
            active session on this device.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="min-h-[44px] flex-1 rounded-xl bg-red-600 font-semibold"
              onClick={onDelete}
            >
              Confirm delete
            </button>
            <button
              type="button"
              className="btn-secondary min-h-[44px] flex-1"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </ScreenShell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-dark-800 px-3 py-3">
      <dt className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 font-semibold text-white">{value}</dd>
    </div>
  )
}

function ToggleRow({
  label,
  pressed,
  onClick,
}: {
  label: string
  pressed: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="flex min-h-[48px] w-full items-center justify-between rounded-xl border border-zinc-700 bg-dark-800 px-4 text-sm"
    >
      <span>{label}</span>
      <span className={`font-semibold ${pressed ? "text-rage-400" : "text-zinc-500"}`}>
        {pressed ? "On" : "Off"}
      </span>
    </button>
  )
}
