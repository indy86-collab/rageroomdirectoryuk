/**
 * Lightweight canvas illustrations for Office Meltdown.
 * Cartoon / non-realistic — damage states via crack overlays.
 */

export type DamageState = "intact" | "light" | "heavy" | "destroyed"

export function damageStateFromCrack(crack: number, broken: boolean): DamageState {
  if (broken || crack >= 1) return "destroyed"
  if (crack >= 0.66) return "heavy"
  if (crack >= 0.33) return "light"
  return "intact"
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

function drawCracks(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  crack: number
) {
  if (crack <= 0) return
  ctx.strokeStyle = "rgba(15,15,15,0.8)"
  ctx.lineWidth = 2
  ctx.beginPath()
  const cracks = Math.ceil(crack * 5)
  for (let i = 0; i < cracks; i += 1) {
    const sx = w * (0.15 + i * 0.14)
    ctx.moveTo(sx, h * 0.15)
    ctx.lineTo(sx + w * 0.08, h * 0.5)
    ctx.lineTo(sx - w * 0.04, h * 0.88)
  }
  ctx.stroke()
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string, w: number, h: number) {
  ctx.fillStyle = "#0A0A0A"
  ctx.font = `bold ${Math.max(9, Math.floor(w / 10))}px sans-serif`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  const label = text.length > 16 ? `${text.slice(0, 14)}…` : text
  ctx.fillText(label, w / 2, h * 0.88)
}

/** Printer */
function drawPrinter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  crack: number,
  broken: boolean
) {
  // Body
  roundRect(ctx, w * 0.08, h * 0.22, w * 0.84, h * 0.55, 8)
  ctx.fillStyle = broken ? "#64748B" : "#CBD5E1"
  ctx.fill()
  ctx.strokeStyle = "#EF4444"
  ctx.lineWidth = 3
  ctx.stroke()
  // Paper tray
  roundRect(ctx, w * 0.2, h * 0.12, w * 0.6, h * 0.14, 4)
  ctx.fillStyle = broken ? "#94A3B8" : "#F8FAFC"
  ctx.fill()
  ctx.strokeStyle = "#94A3B8"
  ctx.stroke()
  // Screen
  roundRect(ctx, w * 0.35, h * 0.35, w * 0.3, h * 0.14, 3)
  ctx.fillStyle = crack > 0.3 ? "#F97316" : "#22C55E"
  ctx.fill()
  // Legs
  ctx.fillStyle = "#475569"
  ctx.fillRect(w * 0.18, h * 0.76, w * 0.12, h * 0.1)
  ctx.fillRect(w * 0.7, h * 0.76, w * 0.12, h * 0.1)
  drawCracks(ctx, w, h, crack)
  drawLabel(ctx, "Printer", w, h)
}

function drawLaptop(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  crack: number,
  broken: boolean
) {
  // Screen
  roundRect(ctx, w * 0.12, h * 0.08, w * 0.76, h * 0.52, 6)
  ctx.fillStyle = broken ? "#1E293B" : "#1E3A5F"
  ctx.fill()
  ctx.strokeStyle = "#38BDF8"
  ctx.lineWidth = 3
  ctx.stroke()
  // Screen glow
  roundRect(ctx, w * 0.18, h * 0.14, w * 0.64, h * 0.38, 4)
  ctx.fillStyle = crack > 0.4 ? "#F97316" : "#7DD3FC"
  ctx.globalAlpha = 0.5
  ctx.fill()
  ctx.globalAlpha = 1
  // Base
  roundRect(ctx, w * 0.06, h * 0.58, w * 0.88, h * 0.22, 5)
  ctx.fillStyle = "#64748B"
  ctx.fill()
  ctx.strokeStyle = "#94A3B8"
  ctx.stroke()
  drawCracks(ctx, w, h, crack)
  drawLabel(ctx, "Laptop", w, h)
}

function drawFilingCabinet(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  crack: number,
  broken: boolean
) {
  roundRect(ctx, w * 0.15, h * 0.08, w * 0.7, h * 0.78, 6)
  ctx.fillStyle = broken ? "#78716C" : "#A8A29E"
  ctx.fill()
  ctx.strokeStyle = "#57534E"
  ctx.lineWidth = 3
  ctx.stroke()
  // Drawers
  for (let i = 0; i < 3; i += 1) {
    const dy = h * (0.14 + i * 0.22)
    roundRect(ctx, w * 0.22, dy, w * 0.56, h * 0.16, 3)
    ctx.fillStyle = "#D6D3D1"
    ctx.fill()
    ctx.fillStyle = "#44403C"
    ctx.beginPath()
    ctx.arc(w * 0.5, dy + h * 0.08, 4, 0, Math.PI * 2)
    ctx.fill()
  }
  drawCracks(ctx, w, h, crack)
  drawLabel(ctx, "Filing cabinet", w, h)
}

function drawCoffeeMachine(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  crack: number,
  broken: boolean
) {
  roundRect(ctx, w * 0.22, h * 0.1, w * 0.56, h * 0.7, 8)
  ctx.fillStyle = broken ? "#44403C" : "#292524"
  ctx.fill()
  ctx.strokeStyle = "#D97706"
  ctx.lineWidth = 3
  ctx.stroke()
  // Carafe
  roundRect(ctx, w * 0.32, h * 0.35, w * 0.36, h * 0.35, 6)
  ctx.fillStyle = crack > 0.3 ? "#78350F" : "#92400E"
  ctx.fill()
  // Cup
  roundRect(ctx, w * 0.38, h * 0.72, w * 0.24, h * 0.12, 3)
  ctx.fillStyle = "#F5F5F4"
  ctx.fill()
  drawCracks(ctx, w, h, crack)
  drawLabel(ctx, "Coffee machine", w, h)
}

function drawAlarmClock(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  crack: number,
  broken: boolean
) {
  ctx.beginPath()
  ctx.arc(w / 2, h * 0.42, Math.min(w, h) * 0.32, 0, Math.PI * 2)
  ctx.fillStyle = broken ? "#B91C1C" : "#FECACA"
  ctx.fill()
  ctx.strokeStyle = "#DC2626"
  ctx.lineWidth = 3
  ctx.stroke()
  // Hands
  ctx.strokeStyle = "#7F1D1D"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(w / 2, h * 0.42)
  ctx.lineTo(w / 2, h * 0.22)
  ctx.moveTo(w / 2, h * 0.42)
  ctx.lineTo(w * 0.68, h * 0.42)
  ctx.stroke()
  // Bells
  ctx.fillStyle = "#F87171"
  ctx.beginPath()
  ctx.arc(w * 0.32, h * 0.18, 8, 0, Math.PI * 2)
  ctx.arc(w * 0.68, h * 0.18, 8, 0, Math.PI * 2)
  ctx.fill()
  drawCracks(ctx, w, h, crack)
  drawLabel(ctx, "Alarm clock", w, h)
}

function drawMeetingSign(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  crack: number,
  broken: boolean
) {
  // Pole
  ctx.fillStyle = "#57534E"
  ctx.fillRect(w * 0.46, h * 0.55, w * 0.08, h * 0.3)
  // Sign
  roundRect(ctx, w * 0.1, h * 0.12, w * 0.8, h * 0.45, 6)
  ctx.fillStyle = broken ? "#78350F" : "#F59E0B"
  ctx.fill()
  ctx.strokeStyle = "#92400E"
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.fillStyle = "#0A0A0A"
  ctx.font = `bold ${Math.max(8, Math.floor(w / 12))}px sans-serif`
  ctx.textAlign = "center"
  ctx.fillText("MEETING", w / 2, h * 0.32)
  ctx.fillText("IN 5", w / 2, h * 0.45)
  drawCracks(ctx, w, h, crack)
  drawLabel(ctx, "Meeting sign", w, h)
}

export function drawOfficeObject(
  ctx: CanvasRenderingContext2D,
  objectId: string,
  w: number,
  h: number,
  crack: number,
  broken: boolean,
  fallbackName: string,
  color: string,
  accent: string
): void {
  switch (objectId) {
    case "printer":
      drawPrinter(ctx, w, h, crack, broken)
      return
    case "laptop":
      drawLaptop(ctx, w, h, crack, broken)
      return
    case "filing-cabinet":
      drawFilingCabinet(ctx, w, h, crack, broken)
      return
    case "coffee-machine":
      drawCoffeeMachine(ctx, w, h, crack, broken)
      return
    case "alarm-clock":
      drawAlarmClock(ctx, w, h, crack, broken)
      return
    case "meeting-sign":
      drawMeetingSign(ctx, w, h, crack, broken)
      return
    default:
      roundRect(ctx, 0, 0, w, h, 10)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = accent
      ctx.lineWidth = 3
      ctx.stroke()
      drawCracks(ctx, w, h, crack)
      drawLabel(ctx, fallbackName, w, h)
  }
}

export type BossReaction = "idle" | "hit" | "stunned" | "phase2" | "defeated"

export function drawBossPrinter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  hpRatio: number,
  reaction: BossReaction,
  reducedEffects: boolean
): void {
  const shake =
    reaction === "hit" && !reducedEffects ? (Math.random() - 0.5) * 10 : 0
  ctx.save()
  ctx.translate(shake, shake)

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.35)"
  ctx.beginPath()
  ctx.ellipse(w / 2, h * 0.92, w * 0.35, h * 0.06, 0, 0, Math.PI * 2)
  ctx.fill()

  const bodyColor =
    reaction === "defeated"
      ? "#475569"
      : hpRatio < 0.35
        ? "#F87171"
        : hpRatio < 0.65
          ? "#FBBF24"
          : "#CBD5E1"

  // Main body
  roundRect(ctx, w * 0.15, h * 0.2, w * 0.7, h * 0.55, 14)
  ctx.fillStyle = bodyColor
  ctx.fill()
  ctx.strokeStyle = "#EF4444"
  ctx.lineWidth = 4
  ctx.stroke()

  // Paper stack
  roundRect(ctx, w * 0.28, h * 0.08, w * 0.44, h * 0.16, 4)
  ctx.fillStyle = reaction === "defeated" ? "#94A3B8" : "#F8FAFC"
  ctx.fill()
  ctx.strokeStyle = "#94A3B8"
  ctx.stroke()

  // Angry screen
  roundRect(ctx, w * 0.32, h * 0.32, w * 0.36, h * 0.18, 4)
  ctx.fillStyle =
    reaction === "stunned" ? "#FACC15" : reaction === "hit" ? "#EF4444" : "#22C55E"
  ctx.fill()

  // Eyes / face
  ctx.fillStyle = "#0A0A0A"
  const eyeY = h * 0.38
  if (reaction === "defeated") {
    ctx.font = `bold ${Math.floor(w / 14)}px sans-serif`
    ctx.textAlign = "center"
    ctx.fillText("X  X", w / 2, eyeY)
  } else {
    ctx.beginPath()
    ctx.arc(w * 0.4, eyeY, 5, 0, Math.PI * 2)
    ctx.arc(w * 0.6, eyeY, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    if (reaction === "hit" || hpRatio < 0.35) {
      ctx.moveTo(w * 0.42, h * 0.46)
      ctx.lineTo(w * 0.5, h * 0.43)
      ctx.lineTo(w * 0.58, h * 0.46)
    } else {
      ctx.arc(w / 2, h * 0.45, 8, 0.1 * Math.PI, 0.9 * Math.PI)
    }
    ctx.stroke()
  }

  // Legs
  ctx.fillStyle = "#334155"
  ctx.fillRect(w * 0.22, h * 0.74, w * 0.14, h * 0.12)
  ctx.fillRect(w * 0.64, h * 0.74, w * 0.14, h * 0.12)

  if (hpRatio < 0.65) {
    drawCracks(ctx, w, h, 1 - hpRatio)
  }

  ctx.fillStyle = "#fff"
  ctx.font = `bold ${Math.max(11, Math.floor(w / 16))}px sans-serif`
  ctx.textAlign = "center"
  ctx.fillText("The Unbreakable Printer", w / 2, h * 0.98)

  ctx.restore()
}

export function drawWeaponPreview(
  ctx: CanvasRenderingContext2D,
  weaponId: string,
  w: number,
  h: number
): void {
  ctx.save()
  if (weaponId === "rubber-chicken") {
    // Body
    ctx.fillStyle = "#FACC15"
    ctx.beginPath()
    ctx.ellipse(w * 0.45, h * 0.5, w * 0.28, h * 0.22, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = "#CA8A04"
    ctx.lineWidth = 2
    ctx.stroke()
    // Head
    ctx.beginPath()
    ctx.arc(w * 0.72, h * 0.35, Math.min(w, h) * 0.14, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#EF4444"
    ctx.beginPath()
    ctx.moveTo(w * 0.82, h * 0.35)
    ctx.lineTo(w * 0.95, h * 0.32)
    ctx.lineTo(w * 0.82, h * 0.42)
    ctx.fill()
  } else {
    // Baseball bat
    ctx.strokeStyle = "#A16207"
    ctx.fillStyle = "#D97706"
    ctx.lineWidth = 2
    ctx.beginPath()
    roundRect(ctx, w * 0.42, h * 0.08, w * 0.16, h * 0.55, 8)
    ctx.fill()
    ctx.stroke()
    roundRect(ctx, w * 0.46, h * 0.6, w * 0.08, h * 0.28, 4)
    ctx.fillStyle = "#78350F"
    ctx.fill()
    ctx.stroke()
  }
  ctx.restore()
}
