import type {
  DailyChallengeProgress,
  RageResetProgression,
  RageResetSettings,
  RageResetStorageV1,
  SessionHistoryEntry,
  ActiveSessionSnapshot,
  RoomId,
  WeaponId,
} from "./types"
import { HISTORY_RETENTION_DAYS, STORAGE_KEY } from "./types"

export const DEFAULT_SETTINGS: RageResetSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  reducedEffects: false,
}

export const DEFAULT_PROGRESSION: RageResetProgression = {
  calmEnergy: 0,
  completedSessions: 0,
  unlockedRooms: ["office-meltdown"],
  unlockedWeapons: ["baseball-bat", "rubber-chicken"],
  currentResetStreak: 0,
  weaponEffectsUnlocked: [],
  cooldownEverCompleted: false,
  sessionsSinceLastPromo: 0,
  installPromptShown: false,
}

export function createDefaultStorage(): RageResetStorageV1 {
  return {
    version: 1,
    settings: { ...DEFAULT_SETTINGS },
    progression: {
      ...DEFAULT_PROGRESSION,
      unlockedRooms: [...DEFAULT_PROGRESSION.unlockedRooms],
      unlockedWeapons: [...DEFAULT_PROGRESSION.unlockedWeapons],
      weaponEffectsUnlocked: [],
    },
    history: [],
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isScore(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 1 && value <= 10
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value))
}

const ROOM_IDS = new Set<string>([
  "office-meltdown",
  "kitchen-chaos",
  "technology-breakdown",
  "monday-morning",
  "traffic-nightmare",
])

const WEAPON_IDS = new Set<string>([
  "baseball-bat",
  "rubber-chicken",
  "sledgehammer",
  "frying-pan",
  "boxing-glove",
  "crowbar",
])

function parseRoomId(value: unknown): RoomId | undefined {
  return typeof value === "string" && ROOM_IDS.has(value) ? (value as RoomId) : undefined
}

function parseWeaponId(value: unknown): WeaponId | undefined {
  return typeof value === "string" && WEAPON_IDS.has(value)
    ? (value as WeaponId)
    : undefined
}

function parseSettings(raw: unknown): RageResetSettings {
  if (!isObject(raw)) return { ...DEFAULT_SETTINGS }
  return {
    soundEnabled:
      typeof raw.soundEnabled === "boolean"
        ? raw.soundEnabled
        : DEFAULT_SETTINGS.soundEnabled,
    hapticsEnabled:
      typeof raw.hapticsEnabled === "boolean"
        ? raw.hapticsEnabled
        : DEFAULT_SETTINGS.hapticsEnabled,
    reducedEffects:
      typeof raw.reducedEffects === "boolean"
        ? raw.reducedEffects
        : DEFAULT_SETTINGS.reducedEffects,
  }
}

function parseProgression(raw: unknown): RageResetProgression {
  if (!isObject(raw)) {
    return {
      ...DEFAULT_PROGRESSION,
      unlockedRooms: [...DEFAULT_PROGRESSION.unlockedRooms],
      unlockedWeapons: [...DEFAULT_PROGRESSION.unlockedWeapons],
    }
  }

  const rooms = Array.isArray(raw.unlockedRooms)
    ? (raw.unlockedRooms.map(parseRoomId).filter(Boolean) as RoomId[])
    : [...DEFAULT_PROGRESSION.unlockedRooms]

  const weapons = Array.isArray(raw.unlockedWeapons)
    ? (raw.unlockedWeapons.map(parseWeaponId).filter(Boolean) as WeaponId[])
    : [...DEFAULT_PROGRESSION.unlockedWeapons]

  if (!rooms.includes("office-meltdown")) rooms.unshift("office-meltdown")
  for (const w of DEFAULT_PROGRESSION.unlockedWeapons) {
    if (!weapons.includes(w)) weapons.push(w)
  }

  return {
    calmEnergy:
      typeof raw.calmEnergy === "number" && Number.isFinite(raw.calmEnergy)
        ? Math.max(0, Math.floor(raw.calmEnergy))
        : 0,
    completedSessions:
      typeof raw.completedSessions === "number" && Number.isFinite(raw.completedSessions)
        ? Math.max(0, Math.floor(raw.completedSessions))
        : 0,
    unlockedRooms: rooms,
    unlockedWeapons: weapons,
    currentResetStreak:
      typeof raw.currentResetStreak === "number" && Number.isFinite(raw.currentResetStreak)
        ? Math.max(0, Math.floor(raw.currentResetStreak))
        : 0,
    lastCompletedDate: isIsoDate(raw.lastCompletedDate)
      ? raw.lastCompletedDate.slice(0, 10)
      : undefined,
    weaponEffectsUnlocked: Array.isArray(raw.weaponEffectsUnlocked)
      ? raw.weaponEffectsUnlocked.filter((x): x is string => typeof x === "string")
      : [],
    cooldownEverCompleted: Boolean(raw.cooldownEverCompleted),
    sessionsSinceLastPromo:
      typeof raw.sessionsSinceLastPromo === "number" &&
      Number.isFinite(raw.sessionsSinceLastPromo)
        ? Math.max(0, Math.floor(raw.sessionsSinceLastPromo))
        : 0,
    installPromptShown: Boolean(raw.installPromptShown),
  }
}

function parseHistoryEntry(raw: unknown): SessionHistoryEntry | null {
  if (!isObject(raw)) return null
  const roomId = parseRoomId(raw.roomId)
  const weaponId = parseWeaponId(raw.weaponId)
  if (!roomId || !weaponId) return null
  if (typeof raw.id !== "string") return null
  if (!isIsoDate(raw.startedAt) || !isIsoDate(raw.completedAt)) return null
  if (!isScore(raw.initialScore) || !isScore(raw.finalScore)) return null

  return {
    id: raw.id,
    startedAt: raw.startedAt,
    completedAt: raw.completedAt,
    initialScore: raw.initialScore,
    finalScore: raw.finalScore,
    trigger:
      typeof raw.trigger === "string" ? (raw.trigger as SessionHistoryEntry["trigger"]) : undefined,
    roomId,
    weaponId,
    objectsDestroyed:
      typeof raw.objectsDestroyed === "number" ? Math.max(0, raw.objectsDestroyed) : 0,
    bestCombo: typeof raw.bestCombo === "number" ? Math.max(0, raw.bestCombo) : 0,
    controlledStrikes:
      typeof raw.controlledStrikes === "number" ? Math.max(0, raw.controlledStrikes) : 0,
    cooldownCompleted: Boolean(raw.cooldownCompleted),
    cooldownSkipped: Boolean(raw.cooldownSkipped),
    calmEnergyEarned:
      typeof raw.calmEnergyEarned === "number" ? Math.max(0, raw.calmEnergyEarned) : 0,
    maxHeatReached:
      typeof raw.maxHeatReached === "number" ? Math.max(0, raw.maxHeatReached) : 0,
    smashScore: typeof raw.smashScore === "number" ? Math.max(0, raw.smashScore) : 0,
  }
}

function parseActiveSession(raw: unknown): ActiveSessionSnapshot | undefined {
  if (!isObject(raw)) return undefined
  if (typeof raw.state !== "string" || !isIsoDate(raw.startedAt)) return undefined
  return {
    state: raw.state as ActiveSessionSnapshot["state"],
    startedAt: raw.startedAt,
    roomId: parseRoomId(raw.roomId),
    weaponId: parseWeaponId(raw.weaponId),
    initialScore: isScore(raw.initialScore) ? raw.initialScore : undefined,
    finalScore: isScore(raw.finalScore) ? raw.finalScore : undefined,
    trigger:
      typeof raw.trigger === "string"
        ? (raw.trigger as ActiveSessionSnapshot["trigger"])
        : undefined,
    objectsDestroyed:
      typeof raw.objectsDestroyed === "number" ? raw.objectsDestroyed : undefined,
    bestCombo: typeof raw.bestCombo === "number" ? raw.bestCombo : undefined,
    controlledStrikes:
      typeof raw.controlledStrikes === "number" ? raw.controlledStrikes : undefined,
    smashScore: typeof raw.smashScore === "number" ? raw.smashScore : undefined,
    calmEnergyEarned:
      typeof raw.calmEnergyEarned === "number" ? raw.calmEnergyEarned : undefined,
    maxHeatReached:
      typeof raw.maxHeatReached === "number" ? raw.maxHeatReached : undefined,
    cooldownCompleted:
      typeof raw.cooldownCompleted === "boolean" ? raw.cooldownCompleted : undefined,
    cooldownSkipped:
      typeof raw.cooldownSkipped === "boolean" ? raw.cooldownSkipped : undefined,
    reachedMaxHeat:
      typeof raw.reachedMaxHeat === "boolean" ? raw.reachedMaxHeat : undefined,
    highIntensity: typeof raw.highIntensity === "boolean" ? raw.highIntensity : undefined,
    safetyAcknowledged:
      typeof raw.safetyAcknowledged === "boolean" ? raw.safetyAcknowledged : undefined,
    freeSmashComplete:
      typeof raw.freeSmashComplete === "boolean" ? raw.freeSmashComplete : undefined,
    controlledSmashComplete:
      typeof raw.controlledSmashComplete === "boolean"
        ? raw.controlledSmashComplete
        : undefined,
  }
}

function parseDailyChallenge(raw: unknown): DailyChallengeProgress | undefined {
  if (!isObject(raw)) return undefined
  if (typeof raw.date !== "string" || typeof raw.challengeId !== "string") return undefined
  return {
    date: raw.date.slice(0, 10),
    challengeId: raw.challengeId,
    completed: Boolean(raw.completed),
  }
}

/** Validate and normalise any value read from localStorage. */
export function parseStorage(raw: unknown): RageResetStorageV1 {
  if (!isObject(raw) || raw.version !== 1) {
    return createDefaultStorage()
  }

  const history = Array.isArray(raw.history)
    ? raw.history.map(parseHistoryEntry).filter((e): e is SessionHistoryEntry => e !== null)
    : []

  return {
    version: 1,
    settings: parseSettings(raw.settings),
    progression: parseProgression(raw.progression),
    history: trimHistory(history),
    activeSession: parseActiveSession(raw.activeSession),
    dailyChallenge: parseDailyChallenge(raw.dailyChallenge),
  }
}

export function trimHistory(
  history: SessionHistoryEntry[],
  now = new Date(),
  retentionDays = HISTORY_RETENTION_DAYS
): SessionHistoryEntry[] {
  const cutoff = now.getTime() - retentionDays * 24 * 60 * 60 * 1000
  return history
    .filter((entry) => Date.parse(entry.completedAt) >= cutoff)
    .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))
}

export function loadStorage(): RageResetStorageV1 {
  if (typeof window === "undefined") return createDefaultStorage()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultStorage()
    return parseStorage(JSON.parse(raw))
  } catch {
    return createDefaultStorage()
  }
}

export function saveStorage(data: RageResetStorageV1): void {
  if (typeof window === "undefined") return
  try {
    const next: RageResetStorageV1 = {
      ...data,
      version: 1,
      history: trimHistory(data.history),
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Quota or private mode — fail silently for MVP.
  }
}

export function deleteAllRageResetData(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem("rage-reset-seen")
    window.localStorage.removeItem("rage-reset-cooldown-challenge")
  } catch {
    // ignore
  }
}

export function updateStorage(
  mutator: (current: RageResetStorageV1) => RageResetStorageV1
): RageResetStorageV1 {
  const current = loadStorage()
  const next = mutator(current)
  saveStorage(next)
  return next
}
