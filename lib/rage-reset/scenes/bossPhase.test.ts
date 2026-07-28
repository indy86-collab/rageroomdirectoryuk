import { describe, expect, it } from "vitest"
import { damageTierFromHp } from "../engine/types"

/** Boss phase markers derived from remaining HP ratio. */
export function bossPhaseFromHpRatio(ratio: number): 1 | 2 | 3 {
  if (ratio <= 0.33) return 3
  if (ratio <= 0.66) return 2
  return 1
}

describe("bossPhaseFromHpRatio", () => {
  it("maps jammed / overloaded / final page phases", () => {
    expect(bossPhaseFromHpRatio(1)).toBe(1)
    expect(bossPhaseFromHpRatio(0.7)).toBe(1)
    expect(bossPhaseFromHpRatio(0.66)).toBe(2)
    expect(bossPhaseFromHpRatio(0.5)).toBe(2)
    expect(bossPhaseFromHpRatio(0.33)).toBe(3)
    expect(bossPhaseFromHpRatio(0.1)).toBe(3)
  })
})

describe("boss damage visual tier", () => {
  it("tracks destruction presentation", () => {
    expect(damageTierFromHp(280, 280, false)).toBe("intact")
    expect(damageTierFromHp(100, 280, false)).toBe("medium")
    expect(damageTierFromHp(0, 280, true)).toBe("destroyed")
  })
})
