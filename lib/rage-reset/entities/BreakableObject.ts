/**
 * Breakable office object with staged damage and material identity.
 */

import type { ObjectDefinition } from "../types"
import type { DamageTier, MaterialKind, Rect } from "../engine/types"
import { damageTierFromHp } from "../engine/types"
import { drawIllustratedObject } from "../art/objectIllustrators"

export interface ObjectLayout {
  /** Normalized 0..1 placement within playfield */
  nx: number
  ny: number
  /** Relative size scale */
  scale: number
  depth: number
  material: MaterialKind
  weight: number
}

export class BreakableObject {
  id: string
  def: ObjectDefinition
  x = 0
  y = 0
  w = 80
  h = 70
  baseX = 0
  baseY = 0
  hp: number
  maxHp: number
  broken = false
  vx = 0
  vy = 0
  rotation = 0
  shake = 0
  lean = 0
  flash = 0
  selected = false
  nameTimer = 0
  depth: number
  material: MaterialKind
  weight: number
  layoutScale: number
  unlockAt = 0
  unlocked = true
  specificPhase = 0 // object-specific destruction progress extras

  constructor(def: ObjectDefinition, layout: ObjectLayout) {
    this.id = def.id
    this.def = def
    this.hp = def.durability
    this.maxHp = def.durability
    this.depth = layout.depth
    this.material = layout.material
    this.weight = layout.weight
    this.layoutScale = layout.scale
    this.nx = layout.nx ?? 0.5
    this.ny = layout.ny ?? 0.5
  }

  place(play: Rect) {
    const sizeMul =
      this.def.size === "large" ? 1.35 : this.def.size === "small" ? 0.85 : 1.1
    this.w = Math.min(play.w * 0.34, 150) * this.layoutScale * sizeMul
    this.h = this.w * 0.9
    this.baseX = play.x + play.w * this.getNx() - this.w / 2
    this.baseY = play.y + play.h * this.getNy() - this.h / 2
    this.x = this.baseX
    this.y = this.baseY
  }

  private nx = 0.5
  private ny = 0.5

  setNormalized(nx: number, ny: number) {
    this.nx = nx
    this.ny = ny
  }

  getNx() {
    return this.nx
  }
  getNy() {
    return this.ny
  }

  get tier(): DamageTier {
    return damageTierFromHp(this.hp, this.maxHp, this.broken)
  }

  /** Expanded hitbox for mobile forgiveness */
  contains(px: number, py: number, pad = 14): boolean {
    if (this.broken) return false
    return (
      px >= this.x - pad &&
      px <= this.x + this.w + pad &&
      py >= this.y - pad &&
      py <= this.y + this.h + pad
    )
  }

  applyHit(damage: number, dx: number, dy: number, force: number) {
    if (this.broken) return { destroyed: false, tier: this.tier }
    this.hp = Math.max(0, this.hp - damage)
    this.shake = Math.min(1, 0.35 + force * 0.4)
    this.flash = 1
    this.nameTimer = 1.2
    const knock = (force * 40) / this.weight
    this.vx += (dx || 0) * 0.15 * knock
    this.vy += (dy || -30) * 0.08 * knock
    this.lean += (Math.random() - 0.5) * 0.08 * force
    this.specificPhase = Math.min(1, 1 - this.hp / this.maxHp)

    if (this.hp <= 0) {
      this.broken = true
      this.vy = -80 / this.weight
      this.vx += (Math.random() - 0.5) * 60
      return { destroyed: true, tier: "destroyed" as DamageTier }
    }
    return { destroyed: false, tier: this.tier }
  }

  update(dt: number, floorY: number) {
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 3)
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 4)
    if (this.nameTimer > 0) this.nameTimer = Math.max(0, this.nameTimer - dt)
    if (this.selected) this.nameTimer = Math.max(this.nameTimer, 0.3)

    this.vx *= 0.86
    this.vy *= 0.86
    this.x += this.vx * dt * 60
    this.y += this.vy * dt * 60
    this.rotation += this.lean * dt
    this.lean *= 0.92

    // Spring back to base if not broken
    if (!this.broken) {
      this.x += (this.baseX - this.x) * Math.min(1, dt * 6)
      this.y += (this.baseY - this.y) * Math.min(1, dt * 6)
      this.rotation *= 0.9
    } else {
      this.vy += 280 * dt
      if (this.y + this.h > floorY) {
        this.y = floorY - this.h
        this.vy *= -0.2
        this.vx *= 0.7
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.broken && this.hp < -50) return // fully faded debris handled by particles

    const sx = this.shake > 0 ? (Math.random() - 0.5) * this.shake * 10 : 0
    const sy = this.shake > 0 ? (Math.random() - 0.5) * this.shake * 8 : 0

    // Contact shadow
    ctx.save()
    ctx.fillStyle = "rgba(0,0,0,0.35)"
    ctx.beginPath()
    ctx.ellipse(
      this.x + this.w / 2 + sx,
      this.y + this.h + 4,
      this.w * 0.42,
      this.h * 0.08,
      0,
      0,
      Math.PI * 2
    )
    ctx.fill()
    ctx.restore()

    ctx.save()
    ctx.translate(this.x + this.w / 2 + sx, this.y + this.h / 2 + sy)
    ctx.rotate(this.rotation)
    if (this.broken) {
      ctx.globalAlpha = 0.55
      ctx.scale(1.05, 0.75)
    }
    drawIllustratedObject(ctx, this.id, this.w, this.h, this.tier, this.specificPhase)

    if (this.flash > 0) {
      ctx.globalAlpha = this.flash * 0.35
      ctx.fillStyle = "#FFF7ED"
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h)
    }

    if (this.selected) {
      ctx.strokeStyle = "#2DD4BF"
      ctx.lineWidth = 3
      ctx.setLineDash([6, 4])
      ctx.strokeRect(-this.w / 2 - 4, -this.h / 2 - 4, this.w + 8, this.h + 8)
      ctx.setLineDash([])
    }
    ctx.restore()

    // Brief name tag
    if (this.nameTimer > 0 && !this.broken) {
      ctx.save()
      ctx.globalAlpha = Math.min(1, this.nameTimer)
      ctx.fillStyle = "rgba(11,18,32,0.85)"
      const label = this.def.name.length > 22 ? `${this.def.name.slice(0, 20)}…` : this.def.name
      ctx.font = "bold 11px 'Segoe UI', system-ui, sans-serif"
      const tw = ctx.measureText(label).width
      const bx = this.x + this.w / 2 - tw / 2 - 8
      const by = this.y - 22
      roundRect(ctx, bx, by, tw + 16, 18, 6)
      ctx.fill()
      ctx.fillStyle = "#F8FAFC"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label, this.x + this.w / 2, by + 9)
      ctx.restore()
    }
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

/** Office Meltdown placement map — objects sit on desk / floor zones. */
export const OFFICE_LAYOUT: Record<string, ObjectLayout & { nx: number; ny: number }> = {
  "filing-cabinet": {
    nx: 0.12,
    ny: 0.52,
    scale: 1.15,
    depth: 1,
    material: "metal",
    weight: 2.4,
  },
  printer: {
    nx: 0.78,
    ny: 0.48,
    scale: 1.1,
    depth: 2,
    material: "plastic",
    weight: 1.8,
  },
  monitor: {
    nx: 0.48,
    ny: 0.36,
    scale: 1.05,
    depth: 3,
    material: "glass",
    weight: 1.5,
  },
  laptop: {
    nx: 0.32,
    ny: 0.5,
    scale: 0.95,
    depth: 4,
    material: "plastic",
    weight: 1.1,
  },
  keyboard: {
    nx: 0.5,
    ny: 0.55,
    scale: 0.9,
    depth: 5,
    material: "plastic",
    weight: 0.8,
  },
  "coffee-machine": {
    nx: 0.88,
    ny: 0.62,
    scale: 0.95,
    depth: 4,
    material: "metal",
    weight: 1.4,
  },
  "alarm-clock": {
    nx: 0.22,
    ny: 0.4,
    scale: 0.7,
    depth: 5,
    material: "plastic",
    weight: 0.6,
  },
  "desk-lamp": {
    nx: 0.65,
    ny: 0.38,
    scale: 0.85,
    depth: 4,
    material: "metal",
    weight: 0.9,
  },
  "mug-stack": {
    nx: 0.38,
    ny: 0.62,
    scale: 0.7,
    depth: 6,
    material: "ceramic",
    weight: 0.5,
  },
  "email-sign": {
    nx: 0.7,
    ny: 0.28,
    scale: 0.95,
    depth: 2,
    material: "paper",
    weight: 0.7,
  },
}
