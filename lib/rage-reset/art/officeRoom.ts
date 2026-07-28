/**
 * Full Office Meltdown room environment — walls, floor, furniture, clutter.
 */

import { RR_COLORS } from "./styleGuide"

export interface RoomDamageState {
  /** 0..1 how wrecked the environment looks */
  wreck: number
  papersLoose: number
  lightsFlicker: number
}

export function drawOfficeRoom(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  damage: RoomDamageState,
  timeMs: number
) {
  // Sky / rear wall gradient
  const wall = ctx.createLinearGradient(0, 0, 0, h * 0.62)
  wall.addColorStop(0, "#1A2740")
  wall.addColorStop(0.55, RR_COLORS.wall)
  wall.addColorStop(1, "#1E2A3D")
  ctx.fillStyle = wall
  ctx.fillRect(0, 0, w, h * 0.62)

  // Side wall perspective wedges
  ctx.fillStyle = RR_COLORS.navyMid
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(w * 0.08, h * 0.08)
  ctx.lineTo(w * 0.08, h * 0.62)
  ctx.lineTo(0, h * 0.7)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(w, 0)
  ctx.lineTo(w * 0.92, h * 0.08)
  ctx.lineTo(w * 0.92, h * 0.62)
  ctx.lineTo(w, h * 0.7)
  ctx.closePath()
  ctx.fill()

  // Window
  drawWindow(ctx, w * 0.55, h * 0.08, w * 0.28, h * 0.22, timeMs)

  // Notice board
  drawNoticeBoard(ctx, w * 0.08, h * 0.12, w * 0.22, h * 0.18)

  // Wall clock
  drawWallClock(ctx, w * 0.42, h * 0.1, Math.min(w, h) * 0.055, timeMs)

  // Floor with perspective
  const floor = ctx.createLinearGradient(0, h * 0.58, 0, h)
  floor.addColorStop(0, "#3A3026")
  floor.addColorStop(0.4, RR_COLORS.floor)
  floor.addColorStop(1, "#1A1510")
  ctx.fillStyle = floor
  ctx.beginPath()
  ctx.moveTo(0, h * 0.7)
  ctx.lineTo(w * 0.08, h * 0.62)
  ctx.lineTo(w * 0.92, h * 0.62)
  ctx.lineTo(w, h * 0.7)
  ctx.lineTo(w, h)
  ctx.lineTo(0, h)
  ctx.closePath()
  ctx.fill()

  // Floor planks
  ctx.strokeStyle = "rgba(0,0,0,0.2)"
  ctx.lineWidth = 1
  for (let i = 0; i < 8; i += 1) {
    const y = h * 0.68 + i * h * 0.04
    ctx.beginPath()
    ctx.moveTo(w * 0.05, y)
    ctx.lineTo(w * 0.95, y + 4)
    ctx.stroke()
  }

  // Desk (main surface)
  drawDesk(ctx, w, h)

  // Office chair
  drawChair(ctx, w * 0.28, h * 0.68, w * 0.16, h * 0.22)

  // Shelves
  drawShelves(ctx, w * 0.86, h * 0.2, w * 0.1, h * 0.28)

  // Waste bin
  drawBin(ctx, w * 0.1, h * 0.72, w * 0.07, h * 0.1)

  // Cables on floor
  ctx.strokeStyle = "#475569"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(w * 0.45, h * 0.64)
  ctx.quadraticCurveTo(w * 0.55, h * 0.72, w * 0.7, h * 0.68)
  ctx.stroke()

  // Ambient key light wash
  const light = ctx.createRadialGradient(
    w * 0.35,
    h * 0.15,
    10,
    w * 0.4,
    h * 0.4,
    w * 0.7
  )
  light.addColorStop(0, "rgba(255, 220, 160, 0.12)")
  light.addColorStop(1, "rgba(0,0,0,0)")
  ctx.fillStyle = light
  ctx.fillRect(0, 0, w, h)

  // Room wreck overlays
  if (damage.wreck > 0.15) {
    ctx.fillStyle = `rgba(15, 10, 8, ${damage.wreck * 0.15})`
    ctx.fillRect(0, 0, w, h)
    // Debris on floor
    ctx.fillStyle = RR_COLORS.paper
    for (let i = 0; i < Math.floor(damage.papersLoose * 8); i += 1) {
      const px = w * (0.15 + ((i * 37) % 70) / 100)
      const py = h * (0.7 + ((i * 17) % 20) / 100)
      ctx.save()
      ctx.translate(px, py)
      ctx.rotate(i * 0.7)
      ctx.globalAlpha = 0.7
      ctx.fillRect(-8, -3, 16, 6)
      ctx.restore()
    }
  }

  // Flicker
  if (damage.lightsFlicker > 0.5) {
    const flicker = 0.5 + 0.5 * Math.sin(timeMs / 80)
    ctx.fillStyle = `rgba(0,0,0,${0.08 * flicker * damage.lightsFlicker})`
    ctx.fillRect(0, 0, w, h)
  }
}

function drawWindow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  timeMs: number
) {
  ctx.fillStyle = RR_COLORS.wallTrim
  roundRect(ctx, x - 4, y - 4, w + 8, h + 8, 4)
  ctx.fill()
  const sky = ctx.createLinearGradient(x, y, x, y + h)
  sky.addColorStop(0, "#7DD3FC")
  sky.addColorStop(1, "#FDBA74")
  ctx.fillStyle = sky
  roundRect(ctx, x, y, w, h, 2)
  ctx.fill()
  // City silhouette
  ctx.fillStyle = "rgba(30,41,59,0.45)"
  for (let i = 0; i < 5; i += 1) {
    const bw = w * 0.12
    const bh = h * (0.25 + ((i * 13) % 40) / 100)
    ctx.fillRect(x + 8 + i * (bw + 4), y + h - bh, bw, bh)
  }
  // Mullion
  ctx.strokeStyle = "rgba(255,255,255,0.35)"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x + w / 2, y)
  ctx.lineTo(x + w / 2, y + h)
  ctx.moveTo(x, y + h / 2)
  ctx.lineTo(x + w, y + h / 2)
  ctx.stroke()
  // Subtle blinds motion
  ctx.strokeStyle = `rgba(15,23,42,${0.08 + 0.04 * Math.sin(timeMs / 900)})`
  for (let i = 0; i < 6; i += 1) {
    const by = y + 6 + i * (h / 7)
    ctx.beginPath()
    ctx.moveTo(x + 4, by)
    ctx.lineTo(x + w - 4, by)
    ctx.stroke()
  }
}

function drawNoticeBoard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = "#5C4033"
  roundRect(ctx, x, y, w, h, 4)
  ctx.fill()
  ctx.fillStyle = "#3F2A1E"
  roundRect(ctx, x + 4, y + 4, w - 8, h - 8, 2)
  ctx.fill()
  const notes = ["#FEF3C7", "#DBEAFE", "#FCE7F3"]
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = notes[i]
    ctx.fillRect(x + 10 + i * (w * 0.28), y + 12 + (i % 2) * 10, w * 0.22, h * 0.35)
  }
}

function drawWallClock(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  timeMs: number
) {
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = "#F8FAFC"
  ctx.fill()
  ctx.strokeStyle = RR_COLORS.outline
  ctx.lineWidth = 2
  ctx.stroke()
  const ang = (timeMs / 1000) * 0.05
  ctx.strokeStyle = "#0F172A"
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(cx + Math.cos(ang) * r * 0.6, cy + Math.sin(ang) * r * 0.6)
  ctx.stroke()
}

function drawDesk(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Desktop top (perspective trapezoid)
  const topY = h * 0.5
  ctx.fillStyle = RR_COLORS.deskTop
  ctx.beginPath()
  ctx.moveTo(w * 0.1, topY)
  ctx.lineTo(w * 0.9, topY)
  ctx.lineTo(w * 0.95, topY + h * 0.08)
  ctx.lineTo(w * 0.05, topY + h * 0.08)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = RR_COLORS.outline
  ctx.lineWidth = 2
  ctx.stroke()

  // Desk edge
  ctx.fillStyle = RR_COLORS.desk
  ctx.beginPath()
  ctx.moveTo(w * 0.05, topY + h * 0.08)
  ctx.lineTo(w * 0.95, topY + h * 0.08)
  ctx.lineTo(w * 0.95, topY + h * 0.14)
  ctx.lineTo(w * 0.05, topY + h * 0.14)
  ctx.closePath()
  ctx.fill()

  // Legs
  ctx.fillStyle = RR_COLORS.desk
  ctx.fillRect(w * 0.14, topY + h * 0.14, w * 0.04, h * 0.16)
  ctx.fillRect(w * 0.82, topY + h * 0.14, w * 0.04, h * 0.16)

  // Drawer fronts
  ctx.fillStyle = "#4A3428"
  roundRect(ctx, w * 0.4, topY + h * 0.09, w * 0.2, h * 0.04, 2)
  ctx.fill()
}

function drawChair(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = "#1E293B"
  // Seat
  roundRect(ctx, x, y, w, h * 0.25, 6)
  ctx.fill()
  // Back
  roundRect(ctx, x + w * 0.1, y - h * 0.45, w * 0.8, h * 0.5, 8)
  ctx.fill()
  // Stem
  ctx.fillStyle = RR_COLORS.metal
  ctx.fillRect(x + w * 0.42, y + h * 0.2, w * 0.16, h * 0.35)
  // Base
  ctx.strokeStyle = RR_COLORS.metal
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x + w * 0.1, y + h * 0.55)
  ctx.lineTo(x + w * 0.9, y + h * 0.55)
  ctx.moveTo(x + w * 0.5, y + h * 0.45)
  ctx.lineTo(x + w * 0.5, y + h * 0.7)
  ctx.stroke()
}

function drawShelves(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = RR_COLORS.wood
  for (let i = 0; i < 3; i += 1) {
    ctx.fillRect(x, y + i * (h / 3), w, 6)
    // Binders
    ctx.fillStyle = i === 1 ? "#0369A1" : "#B45309"
    ctx.fillRect(x + 4, y + i * (h / 3) - h * 0.18, w * 0.35, h * 0.18)
    ctx.fillStyle = RR_COLORS.wood
  }
}

function drawBin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillStyle = "#334155"
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w, y)
  ctx.lineTo(x + w * 0.85, y + h)
  ctx.lineTo(x + w * 0.15, y + h)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = RR_COLORS.outline
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
