import type {
  ActiveSessionSnapshot,
  RageResetState,
  RoomId,
  SessionRuntime,
  TriggerCategory,
  WeaponId,
} from "./types"
import { HIGH_INTENSITY_THRESHOLD } from "./types"

export type RageResetAction =
  | { type: "HYDRATE_SESSION"; session: ActiveSessionSnapshot }
  | { type: "RESTART" }
  | { type: "GO_WELCOME" }
  | { type: "START" }
  | { type: "SET_INITIAL_SCORE"; score: number }
  | { type: "ACK_SAFETY" }
  | { type: "SET_TRIGGER"; trigger: TriggerCategory }
  | { type: "SELECT_ROOM"; roomId: RoomId }
  | { type: "SELECT_WEAPON"; weaponId: WeaponId }
  | {
      type: "FREE_SMASH_COMPLETE"
      objectsDestroyed: number
      bestCombo: number
      smashScore: number
      maxHeat: number
      calmEnergyBonus: number
    }
  | {
      type: "CONTROLLED_SMASH_COMPLETE"
      controlledStrikes: number
      calmEnergyBonus: number
      maxHeat: number
    }
  | {
      type: "COOLDOWN_COMPLETE"
      skipped: boolean
      calmEnergyBonus: number
    }
  | { type: "SET_FINAL_SCORE"; score: number }
  | { type: "ADD_CALM_ENERGY"; amount: number }
  | { type: "GOTO"; state: RageResetState }

export function createInitialRuntime(now = new Date()): SessionRuntime {
  return {
    state: "welcome",
    startedAt: now.toISOString(),
    initialScore: null,
    finalScore: null,
    trigger: null,
    roomId: null,
    weaponId: null,
    objectsDestroyed: numberOrZero(0),
    bestCombo: 0,
    controlledStrikes: 0,
    smashScore: 0,
    calmEnergyEarned: 0,
    maxHeatReached: 0,
    cooldownCompleted: false,
    cooldownSkipped: false,
    reachedMaxHeat: false,
    freeSmashComplete: false,
    controlledSmashComplete: false,
    safetyAcknowledged: false,
    showSafetyGate: false,
  }
}

function numberOrZero(n: number) {
  return n
}

export function snapshotFromRuntime(runtime: SessionRuntime): ActiveSessionSnapshot {
  return {
    state: runtime.state,
    startedAt: runtime.startedAt,
    roomId: runtime.roomId ?? undefined,
    weaponId: runtime.weaponId ?? undefined,
    initialScore: runtime.initialScore ?? undefined,
    finalScore: runtime.finalScore ?? undefined,
    trigger: runtime.trigger ?? undefined,
    objectsDestroyed: runtime.objectsDestroyed,
    bestCombo: runtime.bestCombo,
    controlledStrikes: runtime.controlledStrikes,
    smashScore: runtime.smashScore,
    calmEnergyEarned: runtime.calmEnergyEarned,
    maxHeatReached: runtime.maxHeatReached,
    cooldownCompleted: runtime.cooldownCompleted,
    cooldownSkipped: runtime.cooldownSkipped,
    reachedMaxHeat: runtime.reachedMaxHeat,
    highIntensity:
      runtime.initialScore != null &&
      runtime.initialScore >= HIGH_INTENSITY_THRESHOLD,
    safetyAcknowledged: runtime.safetyAcknowledged,
    freeSmashComplete: runtime.freeSmashComplete,
    controlledSmashComplete: runtime.controlledSmashComplete,
  }
}

export function runtimeFromSnapshot(snapshot: ActiveSessionSnapshot): SessionRuntime {
  const base = createInitialRuntime(new Date(snapshot.startedAt))
  return {
    ...base,
    state: snapshot.state,
    startedAt: snapshot.startedAt,
    initialScore: snapshot.initialScore ?? null,
    finalScore: snapshot.finalScore ?? null,
    trigger: snapshot.trigger ?? null,
    roomId: snapshot.roomId ?? null,
    weaponId: snapshot.weaponId ?? null,
    objectsDestroyed: snapshot.objectsDestroyed ?? 0,
    bestCombo: snapshot.bestCombo ?? 0,
    controlledStrikes: snapshot.controlledStrikes ?? 0,
    smashScore: snapshot.smashScore ?? 0,
    calmEnergyEarned: snapshot.calmEnergyEarned ?? 0,
    maxHeatReached: snapshot.maxHeatReached ?? 0,
    cooldownCompleted: snapshot.cooldownCompleted ?? false,
    cooldownSkipped: snapshot.cooldownSkipped ?? false,
    reachedMaxHeat: snapshot.reachedMaxHeat ?? false,
    freeSmashComplete: snapshot.freeSmashComplete ?? false,
    controlledSmashComplete: snapshot.controlledSmashComplete ?? false,
    safetyAcknowledged: snapshot.safetyAcknowledged ?? false,
    showSafetyGate: false,
  }
}

/** Valid forward transitions for the session state machine. */
export const ALLOWED_TRANSITIONS: Record<RageResetState, RageResetState[]> = {
  welcome: ["check-in"],
  "check-in": ["trigger", "welcome"],
  trigger: ["room-select", "check-in", "welcome"],
  "room-select": ["weapon-select", "trigger", "welcome"],
  "weapon-select": ["free-smash", "room-select", "welcome"],
  "free-smash": ["controlled-smash", "welcome"],
  "controlled-smash": ["cool-down", "welcome"],
  "cool-down": ["final-check-in", "welcome"],
  "final-check-in": ["results", "welcome"],
  results: ["welcome", "check-in"],
}

export function canTransition(from: RageResetState, to: RageResetState): boolean {
  if (to === "welcome") return true
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false
}

export function rageResetReducer(
  state: SessionRuntime,
  action: RageResetAction
): SessionRuntime {
  switch (action.type) {
    case "HYDRATE_SESSION":
      return runtimeFromSnapshot(action.session)

    case "RESTART":
    case "GO_WELCOME":
      return createInitialRuntime()

    case "START":
      return {
        ...createInitialRuntime(),
        state: "check-in",
      }

    case "SET_INITIAL_SCORE": {
      const score = clampScore(action.score)
      const high = score >= HIGH_INTENSITY_THRESHOLD
      return {
        ...state,
        initialScore: score,
        showSafetyGate: high && !state.safetyAcknowledged,
        state: high && !state.safetyAcknowledged ? state.state : "trigger",
        safetyAcknowledged: high ? state.safetyAcknowledged : true,
      }
    }

    case "ACK_SAFETY":
      return {
        ...state,
        safetyAcknowledged: true,
        showSafetyGate: false,
        state: state.initialScore != null ? "trigger" : state.state,
      }

    case "SET_TRIGGER":
      return {
        ...state,
        trigger: action.trigger,
        state: "room-select",
      }

    case "SELECT_ROOM":
      return {
        ...state,
        roomId: action.roomId,
        state: "weapon-select",
      }

    case "SELECT_WEAPON":
      return {
        ...state,
        weaponId: action.weaponId,
        state: "free-smash",
      }

    case "FREE_SMASH_COMPLETE":
      return {
        ...state,
        objectsDestroyed: action.objectsDestroyed,
        bestCombo: Math.max(state.bestCombo, action.bestCombo),
        smashScore: action.smashScore,
        maxHeatReached: Math.max(state.maxHeatReached, action.maxHeat),
        reachedMaxHeat: state.reachedMaxHeat || action.maxHeat >= 100,
        calmEnergyEarned: state.calmEnergyEarned + action.calmEnergyBonus,
        freeSmashComplete: true,
        state: "controlled-smash",
      }

    case "CONTROLLED_SMASH_COMPLETE":
      return {
        ...state,
        controlledStrikes: action.controlledStrikes,
        maxHeatReached: Math.max(state.maxHeatReached, action.maxHeat),
        reachedMaxHeat: state.reachedMaxHeat || action.maxHeat >= 100,
        calmEnergyEarned: state.calmEnergyEarned + action.calmEnergyBonus,
        controlledSmashComplete: true,
        state: "cool-down",
      }

    case "COOLDOWN_COMPLETE":
      return {
        ...state,
        cooldownCompleted: !action.skipped,
        cooldownSkipped: action.skipped,
        calmEnergyEarned: state.calmEnergyEarned + action.calmEnergyBonus,
        state: "final-check-in",
      }

    case "SET_FINAL_SCORE":
      return {
        ...state,
        finalScore: clampScore(action.score),
        state: "results",
      }

    case "ADD_CALM_ENERGY":
      return {
        ...state,
        calmEnergyEarned: state.calmEnergyEarned + Math.max(0, action.amount),
      }

    case "GOTO":
      if (!canTransition(state.state, action.state) && action.state !== "welcome") {
        return state
      }
      return { ...state, state: action.state }

    default:
      return state
  }
}

export function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 1
  return Math.min(10, Math.max(1, Math.round(score)))
}

export function isHighIntensitySession(runtime: SessionRuntime): boolean {
  const start = runtime.initialScore ?? 0
  const end = runtime.finalScore ?? 0
  return start >= HIGH_INTENSITY_THRESHOLD || end >= HIGH_INTENSITY_THRESHOLD
}
