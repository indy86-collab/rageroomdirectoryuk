import { describe, expect, it } from "vitest"
import {
  canTransition,
  createInitialRuntime,
  rageResetReducer,
  clampScore,
} from "./reducer"

describe("rageResetReducer state transitions", () => {
  it("starts a session at check-in", () => {
    const next = rageResetReducer(createInitialRuntime(), { type: "START" })
    expect(next.state).toBe("check-in")
  })

  it("moves through the happy path", () => {
    let s = rageResetReducer(createInitialRuntime(), { type: "START" })
    s = rageResetReducer(s, { type: "SET_INITIAL_SCORE", score: 5 })
    expect(s.state).toBe("trigger")
    s = rageResetReducer(s, { type: "SET_TRIGGER", trigger: "work" })
    expect(s.state).toBe("room-select")
    s = rageResetReducer(s, { type: "SELECT_ROOM", roomId: "office-meltdown" })
    expect(s.state).toBe("weapon-select")
    s = rageResetReducer(s, { type: "SELECT_WEAPON", weaponId: "baseball-bat" })
    expect(s.state).toBe("free-smash")
    s = rageResetReducer(s, {
      type: "FREE_SMASH_COMPLETE",
      objectsDestroyed: 4,
      bestCombo: 3,
      smashScore: 100,
      maxHeat: 40,
      calmEnergyBonus: 5,
    })
    expect(s.state).toBe("controlled-smash")
    s = rageResetReducer(s, {
      type: "CONTROLLED_SMASH_COMPLETE",
      controlledStrikes: 3,
      calmEnergyBonus: 10,
      maxHeat: 50,
    })
    expect(s.state).toBe("cool-down")
    s = rageResetReducer(s, {
      type: "COOLDOWN_COMPLETE",
      skipped: false,
      calmEnergyBonus: 20,
    })
    expect(s.state).toBe("final-check-in")
    s = rageResetReducer(s, { type: "SET_FINAL_SCORE", score: 3 })
    expect(s.state).toBe("results")
  })

  it("shows safety gate for high initial scores", () => {
    let s = rageResetReducer(createInitialRuntime(), { type: "START" })
    s = rageResetReducer(s, { type: "SET_INITIAL_SCORE", score: 10 })
    expect(s.showSafetyGate).toBe(true)
    expect(s.state).toBe("check-in")
    s = rageResetReducer(s, { type: "ACK_SAFETY" })
    expect(s.state).toBe("trigger")
    expect(s.showSafetyGate).toBe(false)
  })

  it("allows restart from any stage", () => {
    let s = rageResetReducer(createInitialRuntime(), { type: "START" })
    s = rageResetReducer(s, { type: "SET_INITIAL_SCORE", score: 4 })
    s = rageResetReducer(s, { type: "RESTART" })
    expect(s.state).toBe("welcome")
  })

  it("blocks illegal transitions", () => {
    expect(canTransition("welcome", "results")).toBe(false)
    expect(canTransition("free-smash", "welcome")).toBe(true)
  })

  it("clamps scores", () => {
    expect(clampScore(0)).toBe(1)
    expect(clampScore(11)).toBe(10)
    expect(clampScore(4.6)).toBe(5)
  })
})
