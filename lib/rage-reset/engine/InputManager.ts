/**
 * Pointer / keyboard input for the next renderer.
 * Forgiving hitboxes, tap vs swipe classification, hold charge.
 */

export type PointerKind = "tap" | "swipe" | "hold"

export interface PointerStroke {
  id: number
  startX: number
  startY: number
  x: number
  y: number
  startTime: number
  holding: boolean
  moved: boolean
}

export interface StrikeIntent {
  kind: PointerKind
  x: number
  y: number
  force: number // 0.6..1.6
  dx: number
  dy: number
  holdMs: number
}

const SWIPE_PX = 28
const HOLD_MS = 180

export class InputManager {
  private pointers = new Map<number, PointerStroke>()
  private pending: StrikeIntent[] = []
  private keys = new Set<string>()
  private holdCharge = 0
  private holding = false
  private holdOrigin: { x: number; y: number } | null = null
  enabled = true

  attach(el: HTMLElement) {
    const down = (e: PointerEvent) => {
      if (!this.enabled) return
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      this.pointers.set(e.pointerId, {
        id: e.pointerId,
        startX: x,
        startY: y,
        x,
        y,
        startTime: performance.now(),
        holding: true,
        moved: false,
      })
      this.holding = true
      this.holdOrigin = { x, y }
      try {
        el.setPointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    }

    const move = (e: PointerEvent) => {
      const p = this.pointers.get(e.pointerId)
      if (!p) return
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      p.x = e.clientX - rect.left
      p.y = e.clientY - rect.top
      const dist = Math.hypot(p.x - p.startX, p.y - p.startY)
      if (dist > SWIPE_PX) p.moved = true
    }

    const up = (e: PointerEvent) => {
      const p = this.pointers.get(e.pointerId)
      if (!p) return
      e.preventDefault()
      const now = performance.now()
      const holdMs = now - p.startTime
      const dx = p.x - p.startX
      const dy = p.y - p.startY
      const dist = Math.hypot(dx, dy)
      const speed = dist / Math.max(16, holdMs)

      let kind: PointerKind = "tap"
      let force = 1
      if (dist > SWIPE_PX) {
        kind = "swipe"
        force = Math.min(1.6, 1 + speed * 0.35)
      } else if (holdMs >= HOLD_MS) {
        kind = "hold"
        force = Math.min(1.5, 0.85 + holdMs / 1200)
      }

      this.pending.push({
        kind,
        x: p.x,
        y: p.y,
        force,
        dx,
        dy,
        holdMs,
      })
      this.pointers.delete(e.pointerId)
      if (this.pointers.size === 0) {
        this.holding = false
        this.holdCharge = 0
        this.holdOrigin = null
      }
    }

    const keyDown = (e: KeyboardEvent) => {
      this.keys.add(e.key)
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        this.holding = true
      }
    }
    const keyUp = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        this.pending.push({
          kind: "hold",
          x: el.clientWidth / 2,
          y: el.clientHeight * 0.45,
          force: 1.2,
          dx: 0,
          dy: -40,
          holdMs: 400,
        })
        this.holding = false
      }
      // Number keys map to directional taps across the stage
      if (e.key >= "1" && e.key <= "6") {
        const i = Number(e.key) - 1
        const col = i % 3
        const row = Math.floor(i / 3)
        this.pending.push({
          kind: "tap",
          x: el.clientWidth * (0.22 + col * 0.28),
          y: el.clientHeight * (0.32 + row * 0.22),
          force: 1,
          dx: 0,
          dy: 0,
          holdMs: 0,
        })
      }
      this.keys.delete(e.key)
    }

    el.addEventListener("pointerdown", down)
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerup", up)
    el.addEventListener("pointercancel", up)
    window.addEventListener("keydown", keyDown)
    window.addEventListener("keyup", keyUp)

    return () => {
      el.removeEventListener("pointerdown", down)
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerup", up)
      el.removeEventListener("pointercancel", up)
      window.removeEventListener("keydown", keyDown)
      window.removeEventListener("keyup", keyUp)
    }
  }

  update(dtSec: number) {
    if (this.holding) {
      this.holdCharge = Math.min(1, this.holdCharge + dtSec * 0.85)
    } else {
      this.holdCharge = Math.max(0, this.holdCharge - dtSec * 2.5)
    }
  }

  consumeStrikes(): StrikeIntent[] {
    const out = this.pending
    this.pending = []
    return out
  }

  getHoldCharge(): number {
    return this.holdCharge
  }

  isHolding(): boolean {
    return this.holding
  }

  getHoldOrigin() {
    return this.holdOrigin
  }

  getPrimaryPointer(): { x: number; y: number } | null {
    const first = this.pointers.values().next()
    if (first.done) return null
    return { x: first.value.x, y: first.value.y }
  }
}

/** Map swipe speed / force into clamped strike strength. */
export function swipeForceFromDistance(px: number, ms: number): number {
  const speed = px / Math.max(16, ms)
  return Math.min(1.6, Math.max(0.7, 0.85 + speed * 0.4))
}
