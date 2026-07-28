import { describe, expect, it } from "vitest"
import {
  applyStrikeHeat,
  coolHeat,
  damageMultiplierFromHeat,
  breathPhase,
  timingQualityFromBreath,
  isControlledStrikeSuccessful,
  computeStrikeDamage,
} from "./scoring"

describe("heat calculations", () => {
  it("increases heat on strike and cools over time", () => {
    let heat = 0
    heat = applyStrikeHeat(heat, 8)
    expect(heat).toBe(8)
    heat = coolHeat(heat, 1, 18)
    expect(heat).toBe(0)
  })

  it("applies damage multipliers by heat band", () => {
    expect(damageMultiplierFromHeat(10)).toBe(1)
    expect(damageMultiplierFromHeat(70)).toBe(0.75)
    expect(damageMultiplierFromHeat(90)).toBe(0.45)
  })

  it("does not fail completely at max heat", () => {
    const dmg = computeStrikeDamage({ weaponId: "baseball-bat", heat: 100 })
    expect(dmg).toBeGreaterThan(0)
  })
})

describe("controlled-strike timing", () => {
  it("marks calm zone near end of expand", () => {
    const mid = breathPhase(2000)
    expect(mid.phase).toBe("expand")
    expect(mid.inCalmZone).toBe(false)
    const late = breathPhase(3600)
    expect(late.phase).toBe("expand")
    expect(late.inCalmZone).toBe(true)
  })

  it("awards high timing quality in calm zone", () => {
    expect(timingQualityFromBreath(3600)).toBe(1)
  })

  it("requires hold + release pattern for success", () => {
    expect(isControlledStrikeSuccessful(3600, true, true)).toBe(true)
    expect(isControlledStrikeSuccessful(3600, false, true)).toBe(false)
    expect(isControlledStrikeSuccessful(2000, true, true)).toBe(false)
  })

  it("gives chicken a larger controlled multiplier", () => {
    const bat = computeStrikeDamage({
      weaponId: "baseball-bat",
      heat: 0,
      isControlled: true,
      timingQuality: 1,
    })
    const chicken = computeStrikeDamage({
      weaponId: "rubber-chicken",
      heat: 0,
      isControlled: true,
      timingQuality: 1,
    })
    expect(chicken).toBeGreaterThan(bat * 0.7)
  })
})
