import type {
  LocalStats,
  RageResetProgression,
  RoomId,
  SessionHistoryEntry,
  SessionRuntime,
  WeaponId,
} from "./types"
import { HIGH_INTENSITY_THRESHOLD, PROMO_FREQUENCY_CAP } from "./types"
import { localDateKey } from "./dailyChallenge"

export function roomsUnlockedForSessions(completedSessions: number): RoomId[] {
  const rooms: RoomId[] = ["office-meltdown"]
  if (completedSessions >= 1) rooms.push("kitchen-chaos")
  if (completedSessions >= 3) rooms.push("technology-breakdown")
  return rooms
}

export function mergeUnlockedRooms(
  current: RoomId[],
  completedSessions: number
): RoomId[] {
  const earned = roomsUnlockedForSessions(completedSessions)
  const set = new Set<RoomId>([...current, ...earned])
  return Array.from(set)
}

export function calculateSessionCalmEnergy(input: {
  completedFullSession: boolean
  controlledStrikes: number
  cooldownCompleted: boolean
  cooldownSkipped: boolean
  maxHeatReached: number
  dailyChallengeCompleted: boolean
}): number {
  let energy = 0
  if (input.completedFullSession) energy += 25
  energy += Math.min(40, input.controlledStrikes * 8)
  if (input.cooldownCompleted && !input.cooldownSkipped) energy += 20
  if (input.maxHeatReached < 85) energy += 10
  if (input.maxHeatReached < 60) energy += 5
  if (input.dailyChallengeCompleted) energy += 15
  return energy
}

/** Streak: consecutive local calendar days with at least one completed session. */
export function calculateResetStreak(
  lastCompletedDate: string | undefined,
  previousStreak: number,
  completedOn: Date = new Date()
): { streak: number; dateKey: string } {
  const today = localDateKey(completedOn)
  if (!lastCompletedDate) {
    return { streak: 1, dateKey: today }
  }
  if (lastCompletedDate === today) {
    return { streak: Math.max(1, previousStreak), dateKey: today }
  }

  const last = parseLocalDate(lastCompletedDate)
  const current = parseLocalDate(today)
  const diffDays = Math.round((current.getTime() - last.getTime()) / 86_400_000)

  if (diffDays === 1) {
    return { streak: previousStreak + 1, dateKey: today }
  }
  return { streak: 1, dateKey: today }
}

function parseLocalDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function applySessionCompletion(
  progression: RageResetProgression,
  runtime: SessionRuntime,
  dailyChallengeCompleted: boolean,
  completedAt = new Date()
): {
  progression: RageResetProgression
  calmEnergyEarned: number
  historyEntry: SessionHistoryEntry
} {
  const calmEnergyEarned = calculateSessionCalmEnergy({
    completedFullSession: true,
    controlledStrikes: runtime.controlledStrikes,
    cooldownCompleted: runtime.cooldownCompleted,
    cooldownSkipped: runtime.cooldownSkipped,
    maxHeatReached: runtime.maxHeatReached,
    dailyChallengeCompleted,
  })

  const completedSessions = progression.completedSessions + 1
  const { streak, dateKey } = calculateResetStreak(
    progression.lastCompletedDate,
    progression.currentResetStreak,
    completedAt
  )

  const next: RageResetProgression = {
    ...progression,
    calmEnergy: progression.calmEnergy + calmEnergyEarned,
    completedSessions,
    unlockedRooms: mergeUnlockedRooms(progression.unlockedRooms, completedSessions),
    currentResetStreak: streak,
    lastCompletedDate: dateKey,
    cooldownEverCompleted:
      progression.cooldownEverCompleted || runtime.cooldownCompleted,
    sessionsSinceLastPromo: progression.sessionsSinceLastPromo + 1,
  }

  const historyEntry: SessionHistoryEntry = {
    id: `session-${completedAt.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    startedAt: runtime.startedAt,
    completedAt: completedAt.toISOString(),
    initialScore: runtime.initialScore ?? 1,
    finalScore: runtime.finalScore ?? 1,
    trigger: runtime.trigger ?? undefined,
    roomId: runtime.roomId ?? "office-meltdown",
    weaponId: runtime.weaponId ?? "baseball-bat",
    objectsDestroyed: runtime.objectsDestroyed,
    bestCombo: runtime.bestCombo,
    controlledStrikes: runtime.controlledStrikes,
    cooldownCompleted: runtime.cooldownCompleted,
    cooldownSkipped: runtime.cooldownSkipped,
    calmEnergyEarned,
    maxHeatReached: runtime.maxHeatReached,
    smashScore: runtime.smashScore,
  }

  return { progression: next, calmEnergyEarned, historyEntry }
}

export function shouldShowDirectoryPromo(input: {
  initialScore: number | null
  finalScore: number | null
  sessionsSinceLastPromo: number
}): boolean {
  const start = input.initialScore ?? 10
  const end = input.finalScore ?? 10
  if (start >= HIGH_INTENSITY_THRESHOLD || end >= HIGH_INTENSITY_THRESHOLD) {
    return false
  }
  return input.sessionsSinceLastPromo >= PROMO_FREQUENCY_CAP
}

export function computeLocalStats(
  history: SessionHistoryEntry[],
  currentResetStreak: number
): LocalStats {
  if (history.length === 0) {
    return {
      sessionsCompleted: 0,
      averageStartScore: null,
      averageFinishScore: null,
      mostUsedRoom: null,
      mostUsedWeapon: null,
      cooldownCompletionRate: null,
      currentResetStreak,
    }
  }

  const avg = (vals: number[]) =>
    vals.reduce((a, b) => a + b, 0) / Math.max(1, vals.length)

  const roomCounts = new Map<RoomId, number>()
  const weaponCounts = new Map<WeaponId, number>()
  let cooldownDone = 0

  for (const entry of history) {
    roomCounts.set(entry.roomId, (roomCounts.get(entry.roomId) ?? 0) + 1)
    weaponCounts.set(entry.weaponId, (weaponCounts.get(entry.weaponId) ?? 0) + 1)
    if (entry.cooldownCompleted) cooldownDone += 1
  }

  const mostUsed = <T extends string>(map: Map<T, number>): T | null => {
    let best: T | null = null
    let count = -1
    for (const [k, v] of map) {
      if (v > count) {
        best = k
        count = v
      }
    }
    return best
  }

  return {
    sessionsCompleted: history.length,
    averageStartScore: avg(history.map((h) => h.initialScore)),
    averageFinishScore: avg(history.map((h) => h.finalScore)),
    mostUsedRoom: mostUsed(roomCounts),
    mostUsedWeapon: mostUsed(weaponCounts),
    cooldownCompletionRate: cooldownDone / history.length,
    currentResetStreak,
  }
}

export function moodChangeCopy(before: number, after: number): string {
  const delta = before - after
  if (delta >= 2) {
    return `You reported feeling ${delta} points less fired up.`
  }
  if (delta === 1) {
    return "You reported feeling one point less fired up."
  }
  if (delta === 0) {
    return "No change this time. That is okay."
  }
  return "You reported feeling more fired up. Consider stepping away and taking a break."
}
