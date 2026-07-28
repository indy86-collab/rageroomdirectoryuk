/**
 * Camera controller — subtle tracking, shake, hit-zoom with reduced-motion caps.
 */

import { shakeLimit, type EffectIntensity } from "../art/styleGuide"

export class CameraController {
  x = 0
  y = 0
  zoom = 1
  private targetX = 0
  private targetY = 0
  private targetZoom = 1
  private shake = 0
  private hitStop = 0
  private reveal = 1
  private intensity: EffectIntensity = "full"

  setIntensity(intensity: EffectIntensity) {
    this.intensity = intensity
  }

  /** 0 = fully zoomed out reveal, 1 = settled */
  startReveal() {
    this.reveal = 0
    this.zoom = 0.88
    this.targetZoom = 1
  }

  lookAt(x: number, y: number, strength = 0.12) {
    this.targetX = x * strength
    this.targetY = y * strength * 0.6
  }

  recenter() {
    this.targetX = 0
    this.targetY = 0
    this.targetZoom = 1
  }

  addShake(amount: number) {
    const cap = shakeLimit(this.intensity)
    this.shake = Math.min(cap, this.shake + amount)
  }

  /** Brief slowdown / punch zoom for finishers */
  punch(zoomBoost = 0.04, hitStopMs = 40) {
    if (this.intensity === "minimal") return
    if (this.intensity === "reduced") {
      this.hitStop = Math.min(this.hitStop, 16)
      return
    }
    this.targetZoom = Math.min(1.08, 1 + zoomBoost)
    this.hitStop = Math.max(this.hitStop, hitStopMs)
  }

  update(dtSec: number): number {
    // Return time scale (1 = normal)
    let timeScale = 1
    if (this.hitStop > 0) {
      this.hitStop = Math.max(0, this.hitStop - dtSec * 1000)
      timeScale = this.intensity === "full" ? 0.35 : 0.7
    }

    if (this.reveal < 1) {
      this.reveal = Math.min(1, this.reveal + dtSec * 1.2)
      this.targetZoom = 0.88 + 0.12 * this.reveal
    }

    const lerp = 1 - Math.pow(0.001, dtSec)
    this.x += (this.targetX - this.x) * lerp
    this.y += (this.targetY - this.y) * lerp
    this.zoom += (this.targetZoom - this.zoom) * lerp

    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dtSec * 28)
    }

    // Ease zoom back
    if (this.hitStop <= 0 && this.reveal >= 1) {
      this.targetZoom += (1 - this.targetZoom) * 0.08
    }

    return timeScale
  }

  apply(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const sx =
      this.intensity === "minimal"
        ? 0
        : (Math.random() - 0.5) * this.shake * 2
    const sy =
      this.intensity === "minimal"
        ? 0
        : (Math.random() - 0.5) * this.shake * 2
    ctx.translate(w / 2 + this.x + sx, h / 2 + this.y + sy)
    ctx.scale(this.zoom, this.zoom)
    ctx.translate(-w / 2, -h / 2)
  }

  getShake(): number {
    return this.shake
  }
}
