/** Shared engine types for the next Rage Reset renderer. */

import type { EffectIntensity } from "../art/styleGuide"

export type DamageTier = "intact" | "light" | "medium" | "heavy" | "destroyed"

export type MaterialKind =
  | "plastic"
  | "metal"
  | "glass"
  | "wood"
  | "paper"
  | "ceramic"

export interface Vec2 {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface EngineSettings {
  soundEnabled: boolean
  hapticsEnabled: boolean
  reducedEffects: boolean
  effectIntensity: EffectIntensity
}

export interface HudSnapshot {
  timeLeftMs: number
  score: number
  combo: number
  heat: number
  heatLabel: string
  targetName: string
  targetHpRatio: number
  weaponId: string
  paused: boolean
  charge: number
  inCalmZone: boolean
  feedback: string
  bossHpRatio?: number
  bossPhase?: number
  instruction?: string
}

export interface FreeSmashResult {
  objectsDestroyed: number
  bestCombo: number
  smashScore: number
  maxHeat: number
  calmEnergyBonus: number
}

export interface ControlledSmashResult {
  controlledStrikes: number
  calmEnergyBonus: number
  maxHeat: number
}

export interface CooldownResult {
  skipped: boolean
  hadIncorrect: boolean
}

export function damageTierFromHp(hp: number, maxHp: number, broken: boolean): DamageTier {
  if (broken || hp <= 0) return "destroyed"
  const ratio = hp / Math.max(1, maxHp)
  if (ratio > 0.75) return "intact"
  if (ratio > 0.5) return "light"
  if (ratio > 0.28) return "medium"
  return "heavy"
}
