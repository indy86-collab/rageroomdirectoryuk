/** Rage Reset — shared types */

export type RageResetState =
  | "welcome"
  | "check-in"
  | "trigger"
  | "room-select"
  | "weapon-select"
  | "free-smash"
  | "controlled-smash"
  | "cool-down"
  | "final-check-in"
  | "results"

export type TriggerCategory =
  | "work"
  | "traffic"
  | "relationships"
  | "money"
  | "family"
  | "technology"
  | "exams"
  | "social-media"
  | "something-else"
  | "prefer-not-to-say"

export type RoomId =
  | "office-meltdown"
  | "kitchen-chaos"
  | "technology-breakdown"
  | "monday-morning"
  | "traffic-nightmare"

export type WeaponId =
  | "baseball-bat"
  | "rubber-chicken"
  | "sledgehammer"
  | "frying-pan"
  | "boxing-glove"
  | "crowbar"

export const FREE_ROOM_IDS: RoomId[] = [
  "office-meltdown",
  "kitchen-chaos",
  "technology-breakdown",
]

export const LOCKED_PREVIEW_ROOM_IDS: RoomId[] = [
  "monday-morning",
  "traffic-nightmare",
]

export const FREE_WEAPON_IDS: WeaponId[] = ["baseball-bat", "rubber-chicken"]

export const LOCKED_PREVIEW_WEAPON_IDS: WeaponId[] = [
  "sledgehammer",
  "frying-pan",
  "boxing-glove",
  "crowbar",
]

export const TRIGGER_OPTIONS: { id: TriggerCategory; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "traffic", label: "Traffic" },
  { id: "relationships", label: "Relationships" },
  { id: "money", label: "Money" },
  { id: "family", label: "Family" },
  { id: "technology", label: "Technology" },
  { id: "exams", label: "Exams" },
  { id: "social-media", label: "Social media" },
  { id: "something-else", label: "Something else" },
  { id: "prefer-not-to-say", label: "Prefer not to say" },
]

export interface RageResetSettings {
  soundEnabled: boolean
  hapticsEnabled: boolean
  reducedEffects: boolean
}

export interface RageResetProgression {
  calmEnergy: number
  completedSessions: number
  unlockedRooms: RoomId[]
  unlockedWeapons: WeaponId[]
  currentResetStreak: number
  lastCompletedDate?: string
  weaponEffectsUnlocked: string[]
  cooldownEverCompleted: boolean
  sessionsSinceLastPromo: number
  installPromptShown: boolean
}

export interface SessionHistoryEntry {
  id: string
  startedAt: string
  completedAt: string
  initialScore: number
  finalScore: number
  trigger?: TriggerCategory
  roomId: RoomId
  weaponId: WeaponId
  objectsDestroyed: number
  bestCombo: number
  controlledStrikes: number
  cooldownCompleted: boolean
  cooldownSkipped: boolean
  calmEnergyEarned: number
  maxHeatReached: number
  smashScore: number
}

export interface ActiveSessionSnapshot {
  state: RageResetState
  startedAt: string
  roomId?: RoomId
  weaponId?: WeaponId
  initialScore?: number
  finalScore?: number
  trigger?: TriggerCategory
  objectsDestroyed?: number
  bestCombo?: number
  controlledStrikes?: number
  smashScore?: number
  calmEnergyEarned?: number
  maxHeatReached?: number
  cooldownCompleted?: boolean
  cooldownSkipped?: boolean
  reachedMaxHeat?: boolean
  highIntensity?: boolean
  safetyAcknowledged?: boolean
  freeSmashComplete?: boolean
  controlledSmashComplete?: boolean
}

export interface DailyChallengeProgress {
  date: string
  challengeId: string
  completed: boolean
}

export interface RageResetStorageV1 {
  version: 1
  settings: RageResetSettings
  progression: RageResetProgression
  history: SessionHistoryEntry[]
  activeSession?: ActiveSessionSnapshot
  dailyChallenge?: DailyChallengeProgress
}

export interface SessionRuntime {
  state: RageResetState
  startedAt: string
  initialScore: number | null
  finalScore: number | null
  trigger: TriggerCategory | null
  roomId: RoomId | null
  weaponId: WeaponId | null
  objectsDestroyed: number
  bestCombo: number
  controlledStrikes: number
  smashScore: number
  calmEnergyEarned: number
  maxHeatReached: number
  cooldownCompleted: boolean
  cooldownSkipped: boolean
  reachedMaxHeat: boolean
  freeSmashComplete: boolean
  controlledSmashComplete: boolean
  safetyAcknowledged: boolean
  showSafetyGate: boolean
}

export interface WeaponStats {
  id: WeaponId
  name: string
  speed: number
  baseDamage: number
  timingEase: number
  controlledMultiplier: number
  locked: boolean
  unlockHint?: string
}

export interface RoomDefinition {
  id: RoomId
  name: string
  description: string
  locked: boolean
  comingLater?: boolean
  objects: ObjectDefinition[]
}

export interface ObjectDefinition {
  id: string
  name: string
  durability: number
  scoreValue: number
  size: "small" | "medium" | "large"
  color: string
  accent: string
}

export interface LocalStats {
  sessionsCompleted: number
  averageStartScore: number | null
  averageFinishScore: number | null
  mostUsedRoom: RoomId | null
  mostUsedWeapon: WeaponId | null
  cooldownCompletionRate: number | null
  currentResetStreak: number
}

export const HIGH_INTENSITY_THRESHOLD = 9
export const PROMO_FREQUENCY_CAP = 3
export const HISTORY_RETENTION_DAYS = 7
export const FREE_SMASH_DURATION_MS = 35_000
export const CONTROLLED_SMASH_DURATION_MS = 45_000
export const COOLDOWN_DURATION_MS = 45_000
export const BREATH_EXPAND_MS = 4_000
export const BREATH_CONTRACT_MS = 6_000
export const STORAGE_KEY = "rage-reset-v1"
