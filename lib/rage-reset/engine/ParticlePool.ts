/**
 * Pooled particles + lightweight debris physics.
 */

import type { EffectIntensity } from "../art/styleGuide"
import { particleBudget } from "../art/styleGuide"

export interface Particle {
  active: boolean
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  rotation: number
  spin: number
  gravity: number
  drag: number
  kind: "dust" | "shard" | "spark" | "paper" | "smoke"
}

const POOL_SIZE = 120

export class ParticlePool {
  private pool: Particle[] = []
  private intensity: EffectIntensity = "full"

  constructor() {
    for (let i = 0; i < POOL_SIZE; i += 1) {
      this.pool.push(this.blank())
    }
  }

  setIntensity(intensity: EffectIntensity) {
    this.intensity = intensity
  }

  private blank(): Particle {
    return {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      size: 4,
      color: "#fff",
      rotation: 0,
      spin: 0,
      gravity: 420,
      drag: 0.98,
      kind: "dust",
    }
  }

  private acquire(): Particle | null {
    for (const p of this.pool) {
      if (!p.active) return p
    }
    return null
  }

  burst(opts: {
    x: number
    y: number
    count: number
    colors: string[]
    speed?: number
    kind?: Particle["kind"]
    gravity?: number
    upwardBias?: number
  }) {
    const budget = particleBudget(this.intensity)
    const n = Math.min(opts.count, budget)
    const speed = opts.speed ?? 180
    for (let i = 0; i < n; i += 1) {
      const p = this.acquire()
      if (!p) break
      const angle = Math.random() * Math.PI * 2
      const s = speed * (0.4 + Math.random() * 0.8)
      p.active = true
      p.x = opts.x
      p.y = opts.y
      p.vx = Math.cos(angle) * s
      p.vy = Math.sin(angle) * s - (opts.upwardBias ?? 60)
      p.life = 0.35 + Math.random() * 0.55
      p.maxLife = p.life
      p.size = 2 + Math.random() * (opts.kind === "paper" ? 7 : 5)
      p.color = opts.colors[i % opts.colors.length]
      p.rotation = Math.random() * Math.PI
      p.spin = (Math.random() - 0.5) * 8
      p.gravity = opts.gravity ?? (opts.kind === "smoke" ? -40 : 420)
      p.drag = opts.kind === "smoke" ? 0.94 : 0.985
      p.kind = opts.kind ?? "dust"
    }
  }

  update(dt: number, floorY: number) {
    for (const p of this.pool) {
      if (!p.active) continue
      p.life -= dt
      if (p.life <= 0) {
        p.active = false
        continue
      }
      p.vx *= p.drag
      p.vy = p.vy * p.drag + p.gravity * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.rotation += p.spin * dt
      if (p.y > floorY && p.kind !== "smoke") {
        p.y = floorY
        p.vy *= -0.28
        p.vx *= 0.7
        if (Math.abs(p.vy) < 30) p.vy = 0
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.pool) {
      if (!p.active) continue
      const a = Math.max(0, p.life / p.maxLife)
      ctx.save()
      ctx.globalAlpha = a
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.fillStyle = p.color
      if (p.kind === "paper") {
        ctx.fillRect(-p.size, -p.size * 0.4, p.size * 2, p.size * 0.8)
      } else if (p.kind === "shard") {
        ctx.beginPath()
        ctx.moveTo(0, -p.size)
        ctx.lineTo(p.size, p.size)
        ctx.lineTo(-p.size, p.size)
        ctx.closePath()
        ctx.fill()
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }
  }

  clear() {
    for (const p of this.pool) p.active = false
  }

  activeCount(): number {
    return this.pool.reduce((n, p) => n + (p.active ? 1 : 0), 0)
  }
}
