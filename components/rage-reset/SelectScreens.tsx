"use client"

import { Lock } from "lucide-react"
import { ROOMS, WEAPONS } from "@/lib/rage-reset/content"
import type { RoomId, WeaponId } from "@/lib/rage-reset/types"
import { ScreenShell } from "./CheckInScreens"

export function RoomSelectScreen({
  unlockedRooms,
  onSelect,
  onBack,
}: {
  unlockedRooms: RoomId[]
  onSelect: (roomId: RoomId) => void
  onBack: () => void
}) {
  return (
    <ScreenShell title="Choose a room" onBack={onBack}>
      <h2 className="font-display text-3xl tracking-wide text-white">Pick your chaos</h2>
      <p className="mt-2 text-sm text-zinc-400">Three free rooms. More coming later.</p>
      <div className="mt-6 grid gap-3">
        {ROOMS.map((room) => {
          const unlocked = unlockedRooms.includes(room.id) && !room.comingLater
          const comingLater = Boolean(room.comingLater)
          const lockedByProgress = !comingLater && !unlockedRooms.includes(room.id)

          return (
            <button
              key={room.id}
              type="button"
              disabled={!unlocked}
              onClick={() => unlocked && onSelect(room.id)}
              className={`relative rounded-2xl border p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rage-400 ${
                unlocked
                  ? "border-zinc-700 bg-dark-700 hover:border-rage-500/60"
                  : "border-zinc-800 bg-dark-900/60 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl text-white">{room.name}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{room.description}</p>
                  {comingLater && (
                    <span className="mt-3 inline-block rounded-md bg-zinc-800 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-300">
                      Coming later
                    </span>
                  )}
                  {lockedByProgress && (
                    <span className="mt-3 inline-block text-xs text-zinc-400">
                      Unlock by completing more resets
                    </span>
                  )}
                </div>
                {(comingLater || lockedByProgress) && (
                  <Lock className="shrink-0 text-zinc-500" size={20} aria-hidden />
                )}
              </div>
              {unlocked && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {room.objects.slice(0, 4).map((o) => (
                    <span
                      key={o.id}
                      className="rounded-md px-2 py-0.5 text-[11px] font-medium text-dark-900"
                      style={{ backgroundColor: o.accent }}
                    >
                      {o.name.split(" ")[0]}
                    </span>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </ScreenShell>
  )
}

export function WeaponSelectScreen({
  unlockedWeapons,
  onSelect,
  onBack,
}: {
  unlockedWeapons: WeaponId[]
  onSelect: (weaponId: WeaponId) => void
  onBack: () => void
}) {
  return (
    <ScreenShell title="Choose a weapon" onBack={onBack}>
      <h2 className="font-display text-3xl tracking-wide text-white">Arm yourself</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Each weapon feels different — speed, sound and timing.
      </p>
      <div className="mt-6 grid gap-3">
        {WEAPONS.map((weapon) => {
          const unlocked = unlockedWeapons.includes(weapon.id) && !weapon.locked
          return (
            <button
              key={weapon.id}
              type="button"
              disabled={!unlocked}
              onClick={() => unlocked && onSelect(weapon.id)}
              className={`rounded-2xl border p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rage-400 ${
                unlocked
                  ? "border-zinc-700 bg-dark-700 hover:border-rage-500/60"
                  : "border-zinc-800 bg-dark-900/60 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl text-white">{weapon.name}</h3>
                  {unlocked ? (
                    <p className="mt-1 text-xs text-zinc-400">
                      Speed {Math.round(weapon.speed * 100)}% · Damage {weapon.baseDamage} · Calm
                      mult ×{weapon.controlledMultiplier}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      {weapon.unlockHint ?? "Future unlock"}
                    </p>
                  )}
                </div>
                {!unlocked && <Lock size={18} className="text-zinc-500" aria-hidden />}
              </div>
            </button>
          )
        })}
      </div>
    </ScreenShell>
  )
}
