import { describe, expect, it } from "vitest"
import { validateAssetManifest } from "./assetManifest"
import { damageTierFromHp } from "../engine/types"
import { swipeForceFromDistance } from "../engine/InputManager"
import { shakeLimit, particleBudget } from "./styleGuide"
import { CameraController } from "../engine/CameraController"
import { ParticlePool } from "../engine/ParticlePool"
import { getGameRenderer } from "../features"

describe("asset manifest", () => {
  it("is valid", () => {
    const result = validateAssetManifest()
    expect(result.ok).toBe(true)
    expect(result.errors).toEqual([])
  })
})

describe("damageTierFromHp", () => {
  it("maps hp ratios to damage tiers", () => {
    expect(damageTierFromHp(100, 100, false)).toBe("intact")
    expect(damageTierFromHp(70, 100, false)).toBe("light")
    expect(damageTierFromHp(40, 100, false)).toBe("medium")
    expect(damageTierFromHp(20, 100, false)).toBe("heavy")
    expect(damageTierFromHp(0, 100, false)).toBe("destroyed")
    expect(damageTierFromHp(50, 100, true)).toBe("destroyed")
  })
})

describe("swipeForceFromDistance", () => {
  it("clamps force into a safe band", () => {
    expect(swipeForceFromDistance(10, 200)).toBeGreaterThanOrEqual(0.7)
    expect(swipeForceFromDistance(200, 80)).toBeLessThanOrEqual(1.6)
    expect(swipeForceFromDistance(100, 50)).toBeGreaterThan(1)
  })
})

describe("reduced-motion effect budgets", () => {
  it("limits shake and particles", () => {
    expect(shakeLimit("minimal")).toBe(0)
    expect(shakeLimit("reduced")).toBeLessThan(shakeLimit("full"))
    expect(particleBudget("minimal")).toBeLessThan(particleBudget("full"))
  })
})

describe("CameraController", () => {
  it("caps shake under reduced intensity", () => {
    const cam = new CameraController()
    cam.setIntensity("reduced")
    cam.addShake(100)
    expect(cam.getShake()).toBeLessThanOrEqual(4)
  })

  it("skips punch under minimal intensity", () => {
    const cam = new CameraController()
    cam.setIntensity("minimal")
    cam.punch(0.2, 100)
    const scale = cam.update(0.016)
    expect(scale).toBe(1)
  })
})

describe("ParticlePool", () => {
  it("clears active particles", () => {
    const pool = new ParticlePool()
    pool.setIntensity("full")
    pool.burst({
      x: 10,
      y: 10,
      count: 20,
      colors: ["#fff"],
    })
    expect(pool.activeCount()).toBeGreaterThan(0)
    pool.clear()
    expect(pool.activeCount()).toBe(0)
  })
})

describe("getGameRenderer", () => {
  it("returns a known renderer id", () => {
    const id = getGameRenderer()
    expect(id === "legacy" || id === "next").toBe(true)
  })
})
