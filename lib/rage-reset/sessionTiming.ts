import { isRageResetE2eEnabled } from "./e2eMode"
import {
  COOLDOWN_DURATION_MS,
  CONTROLLED_SMASH_DURATION_MS,
  FREE_SMASH_DURATION_MS,
} from "./types"

/** Central timing knobs — adjust controlled-strike difficulty here. */
export const CONTROLLED_STRIKE_CONFIG = {
  /** Breath expand duration (ms). */
  expandMs: 4_000,
  /** Breath contract duration (ms). */
  contractMs: 6_000,
  /** Fraction of expand phase that counts as calm zone (end). */
  expandCalmStart: 0.78,
  /** Fraction of contract phase that still counts as calm zone (start). */
  contractCalmEnd: 0.12,
  /** Consecutive perfect strikes before multiplier caps. */
  comboCap: 5,
  /** Extra damage multiplier per consecutive controlled strike. */
  comboStep: 0.18,
  /** Heat relief on successful controlled strike. */
  heatRelief: 22,
  /** Boss HP. */
  bossDurability: 280,
}

export function getSessionDurations() {
  const e2e = isRageResetE2eEnabled()
  if (e2e) {
    return {
      freeSmashMs: 2_500,
      controlledSmashMs: 4_000,
      cooldownMs: 8_000,
      transitionDelayMs: 80,
      cooldownFragmentCount: 2,
      e2e: true as const,
    }
  }
  return {
    freeSmashMs: FREE_SMASH_DURATION_MS,
    controlledSmashMs: CONTROLLED_SMASH_DURATION_MS,
    cooldownMs: COOLDOWN_DURATION_MS,
    transitionDelayMs: 400,
    cooldownFragmentCount: 12,
    e2e: false as const,
  }
}

export function getControlledStrikeConfig() {
  const e2e = isRageResetE2eEnabled()
  if (e2e) {
    return {
      ...CONTROLLED_STRIKE_CONFIG,
      expandMs: 1_200,
      contractMs: 1_800,
      expandCalmStart: 0.55,
      contractCalmEnd: 0.35,
    }
  }
  return CONTROLLED_STRIKE_CONFIG
}
