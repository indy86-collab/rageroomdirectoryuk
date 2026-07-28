/**
 * Original illustrated office objects — multi-state canvas art (not UI cards).
 */

import type { DamageTier } from "../engine/types"
import { RR_COLORS } from "./styleGuide"

function rr(
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

function strokeFill(
  ctx: CanvasRenderingContext2D,
  fill: string,
  line: string = RR_COLORS.outline,
  lw = 2
) {
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = line
  ctx.lineWidth = lw
  ctx.stroke()
}

function cracks(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tier: DamageTier
) {
  const level =
    tier === "intact"
      ? 0
      : tier === "light"
        ? 0.3
        : tier === "medium"
          ? 0.55
          : tier === "heavy"
            ? 0.8
            : 1
  if (level <= 0) return
  ctx.strokeStyle = RR_COLORS.crack
  ctx.lineWidth = 1.5 + level
  ctx.beginPath()
  const n = Math.ceil(level * 6)
  for (let i = 0; i < n; i += 1) {
    const sx = -w * 0.35 + (i / n) * w * 0.7
    ctx.moveTo(sx, -h * 0.35)
    ctx.lineTo(sx + w * 0.08, 0)
    ctx.lineTo(sx - w * 0.05, h * 0.4)
  }
  ctx.stroke()
}

/** Draw object centered at origin in local space of size w×h */
export function drawIllustratedObject(
  ctx: CanvasRenderingContext2D,
  id: string,
  w: number,
  h: number,
  tier: DamageTier,
  phase = 0
) {
  ctx.save()
  switch (id) {
    case "printer":
      drawPrinter(ctx, w, h, tier, phase)
      break
    case "monitor":
      drawMonitor(ctx, w, h, tier, phase)
      break
    case "laptop":
      drawLaptop(ctx, w, h, tier, phase)
      break
    case "keyboard":
      drawKeyboard(ctx, w, h, tier, phase)
      break
    case "filing-cabinet":
      drawFilingCabinet(ctx, w, h, tier, phase)
      break
    case "coffee-machine":
      drawCoffeeMachine(ctx, w, h, tier, phase)
      break
    case "alarm-clock":
      drawAlarmClock(ctx, w, h, tier, phase)
      break
    case "desk-lamp":
      drawDeskLamp(ctx, w, h, tier, phase)
      break
    case "mug-stack":
      drawMugStack(ctx, w, h, tier, phase)
      break
    case "email-sign":
    case "meeting-sign":
      drawMeetingSign(ctx, w, h, tier, phase)
      break
    default:
      drawGeneric(ctx, w, h, tier)
  }
  ctx.restore()
}

function drawPrinter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tier: DamageTier,
  phase: number
) {
  const lean = tier === "heavy" || tier === "destroyed" ? 0.08 : 0
  ctx.rotate(lean)
  // Body
  rr(ctx, -w * 0.42, -h * 0.15, w * 0.84, h * 0.55, 8)
  strokeFill(ctx, tier === "destroyed" ? "#64748B" : RR_COLORS.plastic)
  // Paper tray
  const trayDrop = phase > 0.4 ? h * 0.08 * phase : 0
  rr(ctx, -w * 0.28, -h * 0.38 + trayDrop, w * 0.56, h * 0.16, 4)
  strokeFill(ctx, RR_COLORS.paper)
  // Ejected paper
  if (phase > 0.25) {
    ctx.fillStyle = RR_COLORS.paper
    for (let i = 0; i < Math.floor(phase * 4); i += 1) {
      ctx.save()
      ctx.translate(w * 0.1 * i - w * 0.15, -h * 0.48 - i * 6)
      ctx.rotate(-0.2 - i * 0.15)
      ctx.fillRect(-12, -2, 24, 4)
      ctx.restore()
    }
  }
  // Screen
  rr(ctx, -w * 0.12, -h * 0.02, w * 0.24, h * 0.12, 3)
  const screenOn =
    tier === "intact" ? "#22C55E" : tier === "light" ? "#F97316" : "#1F2937"
  strokeFill(ctx, screenOn)
  // Side panel ajar
  if (phase > 0.5) {
    ctx.fillStyle = RR_COLORS.metal
    ctx.save()
    ctx.translate(w * 0.42, 0)
    ctx.rotate(0.4 * phase)
    ctx.fillRect(0, -h * 0.1, w * 0.12, h * 0.4)
    ctx.restore()
  }
  // Legs
  ctx.fillStyle = RR_COLORS.metalDark
  ctx.fillRect(-w * 0.34, h * 0.38, w * 0.12, h * 0.1)
  ctx.fillRect(w * 0.22, h * 0.38, w * 0.12, h * 0.1)
  // Toner dust
  if (phase > 0.6) {
    ctx.fillStyle = "rgba(30,30,40,0.35)"
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath()
      ctx.arc(-w * 0.1 + i * 8, h * 0.2, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  cracks(ctx, w, h, tier)
}

function drawMonitor(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tier: DamageTier,
  phase: number
) {
  // Stand
  ctx.fillStyle = RR_COLORS.metalDark
  ctx.fillRect(-w * 0.08, h * 0.28, w * 0.16, h * 0.18)
  rr(ctx, -w * 0.22, h * 0.42, w * 0.44, h * 0.08, 4)
  strokeFill(ctx, RR_COLORS.metal)
  // Bezel
  rr(ctx, -w * 0.45, -h * 0.42, w * 0.9, h * 0.7, 6)
  strokeFill(ctx, "#1E293B")
  // Screen
  rr(ctx, -w * 0.38, -h * 0.34, w * 0.76, h * 0.52, 3)
  let screen: string = RR_COLORS.screenLit
  if (tier === "light") screen = "#7DD3FC"
  if (tier === "medium") screen = "#0369A1"
  if (tier === "heavy" || tier === "destroyed") screen = "#0F172A"
  strokeFill(ctx, screen, "#0F172A", 1)
  // Glitch / crack glass
  if (phase > 0.2) {
    ctx.strokeStyle = "rgba(248,250,252,0.7)"
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(-w * 0.2, -h * 0.2)
    ctx.lineTo(w * 0.15, h * 0.05)
    ctx.lineTo(-w * 0.05, h * 0.15)
    ctx.stroke()
  }
  if (phase > 0.55) {
    ctx.fillStyle = "rgba(168,212,232,0.5)"
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(w * 0.1 * (i - 2), h * 0.15)
      ctx.lineTo(w * 0.08 * (i - 2), h * 0.2)
      ctx.fill()
    }
  }
  if (tier === "heavy" || tier === "destroyed") {
    ctx.rotate(0.12)
  }
  cracks(ctx, w, h, tier)
}

function drawLaptop(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tier: DamageTier,
  phase: number
) {
  // Base
  rr(ctx, -w * 0.45, h * 0.05, w * 0.9, h * 0.28, 5)
  strokeFill(ctx, RR_COLORS.metal)
  // Screen
  const open = tier === "destroyed" ? 0.4 : 1
  ctx.save()
  ctx.translate(0, h * 0.05)
  ctx.rotate(-0.15 * (1 - open))
  rr(ctx, -w * 0.42, -h * 0.55, w * 0.84, h * 0.55, 5)
  strokeFill(ctx, "#334155")
  rr(ctx, -w * 0.36, -h * 0.48, w * 0.72, h * 0.42, 3)
  strokeFill(ctx, phase > 0.4 ? "#0F172A" : "#38BDF8", "#0F172A", 1)
  ctx.restore()
  cracks(ctx, w, h, tier)
}

function drawKeyboard(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tier: DamageTier,
  phase: number
) {
  rr(ctx, -w * 0.48, -h * 0.22, w * 0.96, h * 0.5, 6)
  strokeFill(ctx, "#27272A")
  const cols = 10
  const rows = 3
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (phase > 0.35 && (c + r) % 3 === 0) continue // keys flown off
      const kx = -w * 0.4 + c * (w * 0.08)
      const ky = -h * 0.1 + r * (h * 0.14)
      rr(ctx, kx, ky, w * 0.06, h * 0.1, 2)
      strokeFill(ctx, "#E4E4E7", "#52525B", 1)
    }
  }
  // Cable
  ctx.strokeStyle = "#52525B"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(w * 0.45, h * 0.05)
  ctx.quadraticCurveTo(w * 0.6, h * 0.3, w * 0.35, h * 0.4)
  if (phase > 0.5) {
    // disconnected
  } else {
    ctx.stroke()
  }
  if (tier === "heavy" || tier === "destroyed") ctx.rotate(0.2)
  cracks(ctx, w, h, tier)
}

function drawFilingCabinet(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tier: DamageTier,
  phase: number
) {
  rr(ctx, -w * 0.4, -h * 0.45, w * 0.8, h * 0.9, 4)
  strokeFill(ctx, RR_COLORS.metal)
  for (let i = 0; i < 3; i += 1) {
    const open = phase > 0.25 + i * 0.2 ? w * 0.18 * phase : 0
    rr(ctx, -w * 0.34 + open, -h * 0.35 + i * h * 0.26, w * 0.68, h * 0.22, 3)
    strokeFill(ctx, RR_COLORS.metalDark)
    // Handle
    rr(ctx, -w * 0.06 + open, -h * 0.28 + i * h * 0.26, w * 0.12, h * 0.04, 2)
    strokeFill(ctx, "#D6D3D1")
    // Papers
    if (open > 4) {
      ctx.fillStyle = RR_COLORS.paper
      ctx.fillRect(-w * 0.2 + open, -h * 0.32 + i * h * 0.26, w * 0.3, h * 0.12)
    }
  }
  if (tier === "heavy" || tier === "destroyed") ctx.rotate(0.1)
  cracks(ctx, w, h, tier)
}

function drawCoffeeMachine(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tier: DamageTier,
  phase: number
) {
  rr(ctx, -w * 0.35, -h * 0.4, w * 0.7, h * 0.75, 8)
  strokeFill(ctx, "#44403C")
  // Buttons
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath()
    ctx.arc(-w * 0.15 + i * w * 0.15, -h * 0.2, 5, 0, Math.PI * 2)
    ctx.fillStyle = phase > 0.3 && i === 1 ? "#F97316" : "#A8A29E"
    ctx.fill()
  }
  // Cup
  const cupY = phase > 0.35 ? h * 0.15 * phase : 0
  rr(ctx, -w * 0.12, h * 0.05 + cupY, w * 0.24, h * 0.22, 3)
  strokeFill(ctx, RR_COLORS.ceramic)
  // Steam
  if (phase > 0.2 && tier !== "destroyed") {
    ctx.strokeStyle = "rgba(226,232,240,0.5)"
    ctx.lineWidth = 2
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath()
      ctx.moveTo(-8 + i * 8, -h * 0.05)
      ctx.quadraticCurveTo(-4 + i * 8, -h * 0.2, -8 + i * 8, -h * 0.32)
      ctx.stroke()
    }
  }
  cracks(ctx, w, h, tier)
}

function drawAlarmClock(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tier: DamageTier,
  phase: number
) {
  ctx.beginPath()
  ctx.arc(0, 0, Math.min(w, h) * 0.38, 0, Math.PI * 2)
  strokeFill(ctx, RR_COLORS.accentGold)
  // Face
  ctx.beginPath()
  ctx.arc(0, 0, Math.min(w, h) * 0.28, 0, Math.PI * 2)
  strokeFill(ctx, "#FFFBEB")
  // Digits / glitch
  ctx.fillStyle = tier === "intact" ? "#DC2626" : "#7F1D1D"
  ctx.font = `bold ${Math.floor(w * 0.18)}px monospace`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(phase > 0.4 ? "88:88" : "9:00", 0, 2)
  // Bells
  if (phase < 0.6) {
    ctx.fillStyle = RR_COLORS.metal
    ctx.beginPath()
    ctx.arc(-w * 0.22, -h * 0.28, 8, 0, Math.PI * 2)
    ctx.arc(w * 0.22, -h * 0.28, 8, 0, Math.PI * 2)
    ctx.fill()
  }
  cracks(ctx, w, h, tier)
}

function drawDeskLamp(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tier: DamageTier,
  phase: number
) {
  // Base
  rr(ctx, -w * 0.2, h * 0.32, w * 0.4, h * 0.1, 4)
  strokeFill(ctx, RR_COLORS.metalDark)
  // Arm
  ctx.strokeStyle = RR_COLORS.metal
  ctx.lineWidth = 6
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(0, h * 0.32)
  ctx.quadraticCurveTo(-w * 0.1, 0, w * 0.15, -h * 0.25)
  ctx.stroke()
  // Shade
  ctx.save()
  ctx.translate(w * 0.15, -h * 0.28)
  ctx.rotate(phase > 0.5 ? 0.6 : 0.2)
  ctx.beginPath()
  ctx.moveTo(-w * 0.22, 0)
  ctx.lineTo(w * 0.22, 0)
  ctx.lineTo(w * 0.14, h * 0.18)
  ctx.lineTo(-w * 0.14, h * 0.18)
  ctx.closePath()
  strokeFill(ctx, tier === "destroyed" ? "#57534E" : "#F97316")
  // Glow
  if (tier === "intact" || tier === "light") {
    ctx.fillStyle = "rgba(251,191,36,0.25)"
    ctx.beginPath()
    ctx.ellipse(0, h * 0.25, w * 0.3, h * 0.12, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
  cracks(ctx, w, h, tier)
}

function drawMugStack(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tier: DamageTier,
  phase: number
) {
  const colors = ["#FB923C", "#38BDF8", "#A78BFA"]
  const count = tier === "destroyed" ? 1 : tier === "heavy" ? 2 : 3
  for (let i = 0; i < count; i += 1) {
    const y = h * 0.2 - i * h * 0.22
    const fall = phase > 0.4 && i === count - 1 ? phase * 20 : 0
    ctx.save()
    ctx.translate(fall, y)
    ctx.rotate(fall * 0.05)
    rr(ctx, -w * 0.22, -h * 0.12, w * 0.44, h * 0.28, 4)
    strokeFill(ctx, colors[i % colors.length])
    // Handle
    ctx.strokeStyle = colors[i % colors.length]
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(w * 0.22, 0, 8, -Math.PI / 2, Math.PI / 2)
    ctx.stroke()
    ctx.restore()
  }
  cracks(ctx, w, h, tier)
}

function drawMeetingSign(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tier: DamageTier,
  phase: number
) {
  rr(ctx, -w * 0.48, -h * 0.35, w * 0.96, h * 0.7, 6)
  strokeFill(ctx, "#FEF3C7")
  ctx.fillStyle = "#B45309"
  ctx.font = `bold ${Math.max(8, Math.floor(w * 0.09))}px sans-serif`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("This meeting could", 0, -h * 0.08)
  ctx.fillText("have been an email", 0, h * 0.1)
  // Pin
  ctx.fillStyle = "#DC2626"
  ctx.beginPath()
  ctx.arc(0, -h * 0.32, 5, 0, Math.PI * 2)
  ctx.fill()
  if (phase > 0.4) ctx.rotate(-0.25 * phase)
  cracks(ctx, w, h, tier)
}

function drawGeneric(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tier: DamageTier
) {
  rr(ctx, -w * 0.4, -h * 0.4, w * 0.8, h * 0.8, 10)
  strokeFill(ctx, RR_COLORS.plastic)
  cracks(ctx, w, h, tier)
}
