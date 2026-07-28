/** Weapon heat and combat scoring helpers. */

export interface HeatState {
  heat: number
}

export const MAX_HEAT = 100
export const DEFAULT_STRIKE_HEAT = 8
export const DEFAULT_COOLING_RATE = 18 // per second
export const CONTROLLED_STRIKE_HEAT_RELIEF = 22

export function clampHeat(heat: number): number {
  if (!Number.isFinite(heat)) return 0
  return Math.min(MAX_HEAT, Math.max(0, heat))
}

export function applyStrikeHeat(
  heat: number,
  strikeHeat = DEFAULT_STRIKE_HEAT
): number {
  return clampHeat(heat + strikeHeat)
}

export function coolHeat(
  heat: number,
  deltaTimeSeconds: number,
  coolingRate = DEFAULT_COOLING_RATE
): number {
  return clampHeat(heat - coolingRate * Math.max(0, deltaTimeSeconds))
}

export function damageMultiplierFromHeat(heat: number): number {
  if (heat < 60) return 1
  if (heat < 85) return 0.75
  return 0.45
}

export function accuracyPenaltyFromHeat(heat: number): number {
  if (heat < 60) return 0
  if (heat < 85) return 0.15
  return 0.35
}

export function heatStatusLabel(heat: number): string {
  if (heat < 60) return "Cool"
  if (heat < 85) return "Warm — pause briefly"
  return "Overheating — slow down"
}

export interface WeaponBalance {
  baseDamage: number
  strikeHeat: number
  controlledMultiplier: number
  timingWindowMs: number
}

export const WEAPON_BALANCE: Record<string, WeaponBalance> = {
  "baseball-bat": {
    baseDamage: 22,
    strikeHeat: 8,
    controlledMultiplier: 2.4,
    timingWindowMs: 420,
  },
  "rubber-chicken": {
    baseDamage: 14,
    strikeHeat: 6,
    controlledMultiplier: 3.2,
    timingWindowMs: 380,
  },
}

export function computeStrikeDamage(input: {
  weaponId: string
  heat: number
  isSwipe?: boolean
  isControlled?: boolean
  timingQuality?: number // 0..1
}): number {
  const balance = WEAPON_BALANCE[input.weaponId] ?? WEAPON_BALANCE["baseball-bat"]
  let damage = balance.baseDamage
  if (input.isSwipe) damage *= 1.45
  if (input.isControlled) {
    const quality = Math.max(0, Math.min(1, input.timingQuality ?? 0))
    damage *= balance.controlledMultiplier * (0.55 + 0.45 * quality)
  }
  damage *= damageMultiplierFromHeat(input.heat)
  return Math.max(1, Math.round(damage))
}

export interface BreathConfig {
  expandMs: number
  contractMs: number
  expandCalmStart: number
  contractCalmEnd: number
}

const DEFAULT_BREATH: BreathConfig = {
  expandMs: 4_000,
  contractMs: 6_000,
  expandCalmStart: 0.78,
  contractCalmEnd: 0.12,
}

/** Breath cycle: expand then contract. Calm zone near end of expand / start of contract. */
export function breathPhase(
  elapsedMs: number,
  config: BreathConfig = DEFAULT_BREATH
): {
  phase: "expand" | "contract"
  progress: number
  inCalmZone: boolean
  cycleProgress: number
} {
  const cycle = config.expandMs + config.contractMs
  const t = ((elapsedMs % cycle) + cycle) % cycle
  if (t < config.expandMs) {
    const progress = t / config.expandMs
    const inCalmZone = progress >= config.expandCalmStart
    return { phase: "expand", progress, inCalmZone, cycleProgress: t / cycle }
  }
  const progress = (t - config.expandMs) / config.contractMs
  const inCalmZone = progress <= config.contractCalmEnd
  return { phase: "contract", progress, inCalmZone, cycleProgress: t / cycle }
}

export function timingQualityFromBreath(
  elapsedMs: number,
  config: BreathConfig = DEFAULT_BREATH
): number {
  const { phase, progress, inCalmZone } = breathPhase(elapsedMs, config)
  if (!inCalmZone) {
    if (phase === "expand") {
      const target = (config.expandCalmStart + 1) / 2
      return Math.max(0, 1 - Math.abs(progress - target) * 4)
    }
    return Math.max(0, 1 - progress * 3)
  }
  return 1
}

export function controlledStrikeFeedback(
  quality: number,
  tooEarly: boolean
): "Perfect control" | "Strong hit" | "Too early" | "Missed window" {
  if (tooEarly) return "Too early"
  if (quality >= 0.92) return "Perfect control"
  if (quality >= 0.55) return "Strong hit"
  return "Missed window"
}

export function consecutiveControlMultiplier(
  consecutive: number,
  comboStep = 0.18,
  comboCap = 5
): number {
  const steps = Math.min(comboCap, Math.max(0, consecutive))
  return 1 + steps * comboStep
}

export function isControlledStrikeSuccessful(
  elapsedMs: number,
  wasHoldingDuringExpand: boolean,
  releasedDuringContract: boolean
): boolean {
  const { inCalmZone } = breathPhase(elapsedMs)
  return inCalmZone && wasHoldingDuringExpand && releasedDuringContract
}
