"use client"

import { getRoom, getWeapon, ROOMS, WEAPONS } from "@/lib/rage-reset/content"
import type { RageResetProgression, LocalStats, RoomId, WeaponId } from "@/lib/rage-reset/types"
import type { DailyChallengeDefinition } from "@/lib/rage-reset/dailyChallenge"
import { averageDurationBucket } from "@/lib/rage-reset/durationBuckets"
import { ScreenShell } from "./CheckInScreens"
import { FeedbackPrompt } from "./FeedbackPrompt"

export function ProgressScreen({
  progression,
  stats,
  historyDurationsMs,
  dailyChallenge,
  dailyCompleted,
  onBack,
  onDeleteRequest,
}: {
  progression: RageResetProgression
  stats: LocalStats
  historyDurationsMs: number[]
  dailyChallenge: DailyChallengeDefinition
  dailyCompleted: boolean
  onBack: () => void
  onDeleteRequest: () => void
}) {
  const avgBucket = averageDurationBucket(historyDurationsMs)
  const unlockedRoomNames = progression.unlockedRooms
    .map((id) => getRoom(id)?.name)
    .filter(Boolean)
  const unlockedWeaponNames = progression.unlockedWeapons
    .map((id) => getWeapon(id)?.name)
    .filter(Boolean)

  const lockedRooms = ROOMS.filter(
    (r) => !progression.unlockedRooms.includes(r.id as RoomId) && r.comingLater
  )
  const lockedWeapons = WEAPONS.filter(
    (w) => w.locked && !progression.unlockedWeapons.includes(w.id as WeaponId)
  )

  return (
    <ScreenShell title="Progress" onBack={onBack}>
      <h2 className="font-display text-3xl text-white">Local progress</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Stored on this device only. No accounts, no cloud sync.
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <Stat label="Sessions completed" value={String(progression.completedSessions)} />
        <Stat
          label="Reset streak"
          value={`${progression.currentResetStreak} day${progression.currentResetStreak === 1 ? "" : "s"}`}
        />
        <Stat label="Calm Energy" value={String(progression.calmEnergy)} />
        <Stat
          label="Avg session length"
          value={avgBucket ? avgBucket.replace(/_/g, " ") : "—"}
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
          label="Cool-down completion"
          value={
            stats.cooldownCompletionRate != null
              ? `${Math.round(stats.cooldownCompletionRate * 100)}%`
              : "—"
          }
        />
      </dl>

      <div className="mt-5 rounded-xl border border-zinc-800 bg-dark-800 p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Daily challenge</p>
        <p className="mt-1 font-semibold text-white">{dailyChallenge.title}</p>
        <p className="mt-1 text-sm text-zinc-400">{dailyChallenge.description}</p>
        <p className="mt-2 text-sm font-semibold text-rage-400">
          {dailyCompleted ? "Completed today" : "Not completed yet"}
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-zinc-800 bg-dark-800 p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Unlocked rooms</p>
        <p className="mt-2 text-sm text-zinc-200">{unlockedRoomNames.join(", ") || "—"}</p>
        {lockedRooms.length > 0 && (
          <p className="mt-2 text-xs text-zinc-500">
            Coming later: {lockedRooms.map((r) => r.name).join(", ")}
          </p>
        )}
      </div>

      <div className="mt-3 rounded-xl border border-zinc-800 bg-dark-800 p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Unlocked weapons</p>
        <p className="mt-2 text-sm text-zinc-200">{unlockedWeaponNames.join(", ") || "—"}</p>
        {lockedWeapons.length > 0 && (
          <p className="mt-2 text-xs text-zinc-500">
            Coming later: {lockedWeapons.map((w) => w.name).join(", ")}
          </p>
        )}
      </div>

      <FeedbackPrompt className="mt-5" />

      <button
        type="button"
        className="mt-8 w-full min-h-[48px] rounded-xl border border-red-700/60 bg-red-950/40 px-4 text-sm font-semibold text-red-200"
        onClick={onDeleteRequest}
      >
        Delete my Rage Reset data
      </button>
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
