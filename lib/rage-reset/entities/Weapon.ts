/**
 * Foreground weapon — animated swing, charge, heat glow.
 */

import { RR_COLORS } from "../art/styleGuide"

export type WeaponAnim =
  | "idle"
  | "pullback"
  | "swing"
  | "impact"
  | "followthrough"
  | "recover"
  | "overheat"
  | "charge"

export class WeaponEntity {
  id: string
  x = 0
  y = 0
  angle = -0.35
  scale = 1
  anim: WeaponAnim = "idle"
  animT = 0
  trail: Array<{ x: number; y: number; a: number }> = []
  heat = 0
  squash = 1
  stretch = 1
  private targetX = 0
  private targetY = 0
  private swingForce = 1
  private chickenWobble = 0

  constructor(id: string) {
    this.id = id
  }

  resize(w: number, h: number) {
    this.x = w * 0.72
    this.y = h * 0.88
    this.targetX = this.x
    this.targetY = this.y
  }

  followPointer(px: number | null, py: number | null, w: number) {
    if (this.anim !== "idle" && this.anim !== "charge") return
    if (px == null || py == null) {
      this.targetX = w * 0.72
      return
    }
    this.targetX = w * 0.55 + (px / w) * w * 0.3
  }

  startSwing(tx: number, ty: number, force: number, charged = false) {
    this.targetX = tx
    this.targetY = ty
    this.swingForce = force
    this.anim = charged ? "charge" : "pullback"
    this.animT = 0
  }

  releaseCharge(force: number) {
    this.swingForce = force
    this.anim = "swing"
    this.animT = 0
  }

  setHeat(heat: number) {
    this.heat = heat
    if (heat >= 85 && this.anim === "idle") {
      this.anim = "overheat"
    } else if (heat < 70 && this.anim === "overheat") {
      this.anim = "idle"
      this.animT = 0
    }
  }

  update(dt: number) {
    this.animT += dt
    this.chickenWobble += dt * 6

    // Soft follow
    this.x += (this.targetX - this.x) * Math.min(1, dt * 8)
    this.y += (this.targetY * 0.05 + this.y * 0.95 - this.y) // keep mostly bottom

    const isChicken = this.id === "rubber-chicken"

    switch (this.anim) {
      case "idle": {
        const bob = Math.sin(performance.now() / 400) * 0.04
        this.angle = -0.35 + bob
        this.squash = 1
        this.stretch = 1
        break
      }
      case "charge": {
        this.angle = -0.85 - this.animT * 0.15
        this.squash = 1.05
        this.stretch = 0.92
        break
      }
      case "pullback": {
        this.angle = -0.9
        if (this.animT > 0.05) {
          this.anim = "swing"
          this.animT = 0
        }
        break
      }
      case "swing": {
        const t = Math.min(1, this.animT / (0.12 / this.swingForce))
        this.angle = -0.9 + t * 1.6 * this.swingForce
        if (isChicken) {
          this.squash = 0.85 + Math.sin(t * Math.PI) * 0.35
          this.stretch = 1.2 - Math.sin(t * Math.PI) * 0.25
        }
        this.trail.push({ x: this.x, y: this.y - 80, a: 1 })
        if (this.trail.length > 10) this.trail.shift()
        if (t >= 1) {
          this.anim = "impact"
          this.animT = 0
        }
        break
      }
      case "impact": {
        this.angle = 0.75 * this.swingForce
        if (this.animT > 0.04) {
          this.anim = "followthrough"
          this.animT = 0
        }
        break
      }
      case "followthrough": {
        this.angle = 0.9 - this.animT * 0.5
        if (this.animT > 0.12) {
          this.anim = "recover"
          this.animT = 0
        }
        break
      }
      case "recover": {
        this.angle += (-0.35 - this.angle) * 0.15
        this.squash += (1 - this.squash) * 0.2
        this.stretch += (1 - this.stretch) * 0.2
        if (this.animT > 0.18) {
          this.anim = "idle"
          this.animT = 0
          this.trail = []
        }
        break
      }
      case "overheat": {
        this.angle = -0.35 + Math.sin(this.animT * 20) * 0.08
        break
      }
    }

    for (const t of this.trail) t.a -= dt * 3
    this.trail = this.trail.filter((t) => t.a > 0)
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Trail
    for (const t of this.trail) {
      ctx.fillStyle = `rgba(45, 212, 191, ${t.a * 0.35})`
      ctx.beginPath()
      ctx.ellipse(t.x, t.y, 18, 6, this.angle, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.scale(this.stretch, this.squash)

    // Heat glow
    if (this.heat > 50) {
      const a = ((this.heat - 50) / 50) * 0.45
      ctx.shadowColor = this.heat >= 85 ? RR_COLORS.heatHot : RR_COLORS.heatWarm
      ctx.shadowBlur = 18 * a
    }

    if (this.id === "rubber-chicken") {
      drawRubberChicken(ctx, this.chickenWobble)
    } else {
      drawBaseballBat(ctx)
    }

    ctx.shadowBlur = 0
    ctx.restore()
  }

  isInSwingImpact(): boolean {
    return this.anim === "impact" || (this.anim === "swing" && this.animT > 0.06)
  }
}

function drawBaseballBat(ctx: CanvasRenderingContext2D) {
  // Grip
  ctx.fillStyle = "#3F2A1E"
  roundRect(ctx, -8, -20, 16, 70, 4)
  ctx.fill()
  // Handle wrap
  ctx.strokeStyle = "#6B4423"
  ctx.lineWidth = 2
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath()
    ctx.moveTo(-7, -10 + i * 10)
    ctx.lineTo(7, -5 + i * 10)
    ctx.stroke()
  }
  // Barrel
  const grd = ctx.createLinearGradient(-14, -160, 14, -20)
  grd.addColorStop(0, "#C4A574")
  grd.addColorStop(0.5, "#E8C99B")
  grd.addColorStop(1, "#A67C52")
  ctx.fillStyle = grd
  ctx.beginPath()
  ctx.moveTo(-7, -25)
  ctx.quadraticCurveTo(-16, -100, -12, -155)
  ctx.quadraticCurveTo(0, -168, 12, -155)
  ctx.quadraticCurveTo(16, -100, 7, -25)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = RR_COLORS.outline
  ctx.lineWidth = 2
  ctx.stroke()
  // Tip highlight
  ctx.fillStyle = "rgba(255,255,255,0.25)"
  ctx.beginPath()
  ctx.ellipse(-3, -140, 4, 12, -0.2, 0, Math.PI * 2)
  ctx.fill()
}

function drawRubberChicken(ctx: CanvasRenderingContext2D, wobble: number) {
  const w = Math.sin(wobble) * 4
  // Body
  ctx.fillStyle = "#F5C542"
  ctx.beginPath()
  ctx.ellipse(w, -90, 28, 40, 0.15, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = RR_COLORS.outline
  ctx.lineWidth = 2
  ctx.stroke()
  // Head
  ctx.beginPath()
  ctx.ellipse(w + 8, -140, 18, 16, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  // Beak
  ctx.fillStyle = "#F97316"
  ctx.beginPath()
  ctx.moveTo(w + 22, -140)
  ctx.lineTo(w + 40, -136)
  ctx.lineTo(w + 22, -130)
  ctx.closePath()
  ctx.fill()
  // Eye
  ctx.fillStyle = "#0A0A0A"
  ctx.beginPath()
  ctx.arc(w + 12, -144, 3, 0, Math.PI * 2)
  ctx.fill()
  // Comb
  ctx.fillStyle = "#EF4444"
  ctx.beginPath()
  ctx.arc(w + 4, -152, 5, 0, Math.PI * 2)
  ctx.arc(w + 12, -156, 4, 0, Math.PI * 2)
  ctx.fill()
  // Legs / handle
  ctx.strokeStyle = "#F5C542"
  ctx.lineWidth = 8
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(0, -50)
  ctx.quadraticCurveTo(-10, -10, 0, 20)
  ctx.stroke()
  ctx.strokeStyle = RR_COLORS.outline
  ctx.lineWidth = 2
  ctx.stroke()
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
