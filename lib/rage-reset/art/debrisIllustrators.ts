/**
 * Illustrated cool-down debris — office smash leftovers, not word chips.
 */

export type DebrisKind =
  | "keycap"
  | "printer-tray"
  | "mug-shard"
  | "cable"
  | "screw"
  | "hinge"
  | "drawer-handle"
  | "paper-sheet"
  | "sticky-note"
  | "torn-memo"

export type DebrisBin = "plastic" | "metal" | "paper"

export interface DebrisDef {
  kind: DebrisKind
  bin: DebrisBin
  label: string
  w: number
  h: number
}

export const DEBRIS_CATALOG: DebrisDef[] = [
  { kind: "keycap", bin: "plastic", label: "Keyboard key", w: 56, h: 56 },
  { kind: "printer-tray", bin: "plastic", label: "Printer tray", w: 72, h: 48 },
  { kind: "mug-shard", bin: "plastic", label: "Mug piece", w: 58, h: 54 },
  { kind: "cable", bin: "plastic", label: "Cable", w: 64, h: 48 },
  { kind: "screw", bin: "metal", label: "Screw", w: 48, h: 56 },
  { kind: "hinge", bin: "metal", label: "Hinge", w: 60, h: 48 },
  { kind: "drawer-handle", bin: "metal", label: "Drawer handle", w: 68, h: 44 },
  { kind: "paper-sheet", bin: "paper", label: "Loose page", w: 52, h: 64 },
  { kind: "sticky-note", bin: "paper", label: "Sticky note", w: 56, h: 56 },
  { kind: "torn-memo", bin: "paper", label: "Torn memo", w: 60, h: 52 },
]

export function drawDebris(
  ctx: CanvasRenderingContext2D,
  kind: DebrisKind,
  w: number,
  h: number,
  highlight = false
) {
  ctx.save()
  ctx.translate(w / 2, h / 2)
  if (highlight) {
    ctx.shadowColor = "rgba(45,212,191,0.65)"
    ctx.shadowBlur = 12
  }

  switch (kind) {
    case "keycap":
      drawKeycap(ctx, w, h)
      break
    case "printer-tray":
      drawPrinterTray(ctx, w, h)
      break
    case "mug-shard":
      drawMugShard(ctx, w, h)
      break
    case "cable":
      drawCable(ctx, w, h)
      break
    case "screw":
      drawScrew(ctx, w, h)
      break
    case "hinge":
      drawHinge(ctx, w, h)
      break
    case "drawer-handle":
      drawDrawerHandle(ctx, w, h)
      break
    case "paper-sheet":
      drawPaperSheet(ctx, w, h)
      break
    case "sticky-note":
      drawStickyNote(ctx, w, h)
      break
    case "torn-memo":
      drawTornMemo(ctx, w, h)
      break
  }
  ctx.restore()
}

function strokeFill(ctx: CanvasRenderingContext2D, fill: string, line = "#0A0F18", lw = 2) {
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = line
  ctx.lineWidth = lw
  ctx.stroke()
}

function drawKeycap(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const s = Math.min(w, h) * 0.38
  roundRect(ctx, -s, -s, s * 2, s * 2, 6)
  strokeFill(ctx, "#E4E4E7")
  roundRect(ctx, -s * 0.7, -s * 0.7, s * 1.4, s * 1.15, 4)
  strokeFill(ctx, "#F8FAFC", "#A1A1AA", 1)
  ctx.fillStyle = "#52525B"
  ctx.font = `bold ${Math.floor(s * 0.7)}px sans-serif`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("A", 0, -s * 0.05)
}

function drawPrinterTray(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const tw = w * 0.42
  const th = h * 0.28
  roundRect(ctx, -tw, -th * 0.2, tw * 2, th * 1.4, 4)
  strokeFill(ctx, "#CBD5E1")
  // Paper peeking out
  ctx.fillStyle = "#F8FAFC"
  ctx.fillRect(-tw * 0.7, -th * 0.9, tw * 1.4, th * 0.7)
  ctx.strokeStyle = "#94A3B8"
  ctx.strokeRect(-tw * 0.7, -th * 0.9, tw * 1.4, th * 0.7)
  // Slot
  ctx.fillStyle = "#64748B"
  ctx.fillRect(-tw * 0.85, th * 0.35, tw * 1.7, 4)
}

function drawMugShard(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.beginPath()
  ctx.moveTo(-w * 0.28, -h * 0.3)
  ctx.lineTo(w * 0.2, -h * 0.35)
  ctx.lineTo(w * 0.32, h * 0.15)
  ctx.lineTo(0, h * 0.35)
  ctx.lineTo(-w * 0.3, h * 0.1)
  ctx.closePath()
  strokeFill(ctx, "#FB923C")
  // Ceramic shine
  ctx.strokeStyle = "rgba(255,255,255,0.45)"
  ctx.beginPath()
  ctx.moveTo(-w * 0.12, -h * 0.2)
  ctx.lineTo(w * 0.05, h * 0.05)
  ctx.stroke()
  // Handle stub
  ctx.strokeStyle = "#FB923C"
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.arc(w * 0.28, -h * 0.05, 10, -0.8, 0.9)
  ctx.stroke()
}

function drawCable(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = "#334155"
  ctx.lineWidth = 6
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(-w * 0.35, h * 0.15)
  ctx.quadraticCurveTo(0, -h * 0.35, w * 0.35, h * 0.1)
  ctx.stroke()
  // USB tip
  roundRect(ctx, w * 0.28, -h * 0.05, w * 0.16, h * 0.28, 2)
  strokeFill(ctx, "#94A3B8")
  roundRect(ctx, -w * 0.44, h * 0.02, w * 0.14, h * 0.22, 2)
  strokeFill(ctx, "#64748B")
}

function drawScrew(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Head
  ctx.beginPath()
  ctx.arc(0, -h * 0.22, Math.min(w, h) * 0.22, 0, Math.PI * 2)
  strokeFill(ctx, "#A8A29E")
  // Slot
  ctx.strokeStyle = "#44403C"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-w * 0.12, -h * 0.22)
  ctx.lineTo(w * 0.12, -h * 0.22)
  ctx.stroke()
  // Shaft
  roundRect(ctx, -w * 0.08, -h * 0.05, w * 0.16, h * 0.45, 2)
  strokeFill(ctx, "#78716C")
  // Tip
  ctx.beginPath()
  ctx.moveTo(-w * 0.08, h * 0.4)
  ctx.lineTo(0, h * 0.48)
  ctx.lineTo(w * 0.08, h * 0.4)
  ctx.closePath()
  strokeFill(ctx, "#57534E")
}

function drawHinge(ctx: CanvasRenderingContext2D, w: number, h: number) {
  roundRect(ctx, -w * 0.38, -h * 0.22, w * 0.32, h * 0.44, 3)
  strokeFill(ctx, "#94A3B8")
  roundRect(ctx, w * 0.06, -h * 0.22, w * 0.32, h * 0.44, 3)
  strokeFill(ctx, "#94A3B8")
  // Barrel
  roundRect(ctx, -w * 0.1, -h * 0.32, w * 0.2, h * 0.64, 6)
  strokeFill(ctx, "#64748B")
  // Screw holes
  ctx.fillStyle = "#334155"
  ctx.beginPath()
  ctx.arc(-w * 0.22, 0, 3, 0, Math.PI * 2)
  ctx.arc(w * 0.22, 0, 3, 0, Math.PI * 2)
  ctx.fill()
}

function drawDrawerHandle(ctx: CanvasRenderingContext2D, w: number, h: number) {
  roundRect(ctx, -w * 0.38, -h * 0.12, w * 0.76, h * 0.24, 8)
  strokeFill(ctx, "#D6D3D1")
  // Mount posts
  ctx.fillStyle = "#78716C"
  ctx.beginPath()
  ctx.arc(-w * 0.28, 0, 4, 0, Math.PI * 2)
  ctx.arc(w * 0.28, 0, 4, 0, Math.PI * 2)
  ctx.fill()
  // Shadow under bar
  ctx.fillStyle = "rgba(0,0,0,0.2)"
  ctx.fillRect(-w * 0.3, h * 0.14, w * 0.6, 3)
}

function drawPaperSheet(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save()
  ctx.rotate(-0.12)
  roundRect(ctx, -w * 0.32, -h * 0.38, w * 0.64, h * 0.76, 2)
  strokeFill(ctx, "#F8FAFC")
  ctx.strokeStyle = "#CBD5E1"
  ctx.lineWidth = 1
  for (let i = 0; i < 4; i += 1) {
    const y = -h * 0.22 + i * h * 0.14
    ctx.beginPath()
    ctx.moveTo(-w * 0.22, y)
    ctx.lineTo(w * 0.22, y)
    ctx.stroke()
  }
  ctx.restore()
}

function drawStickyNote(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const s = Math.min(w, h) * 0.4
  ctx.save()
  ctx.rotate(0.08)
  ctx.beginPath()
  ctx.moveTo(-s, -s)
  ctx.lineTo(s, -s)
  ctx.lineTo(s, s * 0.7)
  ctx.lineTo(s * 0.55, s)
  ctx.lineTo(-s, s)
  ctx.closePath()
  strokeFill(ctx, "#FEF08A")
  ctx.fillStyle = "#CA8A04"
  ctx.font = `${Math.floor(s * 0.35)}px sans-serif`
  ctx.textAlign = "center"
  ctx.fillText("ASAP", 0, -s * 0.1)
  ctx.restore()
}

function drawTornMemo(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save()
  ctx.rotate(0.15)
  ctx.beginPath()
  ctx.moveTo(-w * 0.3, -h * 0.3)
  ctx.lineTo(w * 0.28, -h * 0.32)
  ctx.lineTo(w * 0.32, h * 0.05)
  ctx.lineTo(w * 0.1, h * 0.28)
  ctx.lineTo(-w * 0.15, h * 0.18)
  ctx.lineTo(-w * 0.32, h * 0.3)
  ctx.closePath()
  strokeFill(ctx, "#FEF3C7")
  ctx.fillStyle = "#B45309"
  ctx.font = `bold ${Math.max(8, Math.floor(w * 0.14))}px sans-serif`
  ctx.textAlign = "center"
  ctx.fillText("mtg?", 0, 0)
  ctx.restore()
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

/** Bin icons for the cool-down containers */
export function drawBinIcon(
  ctx: CanvasRenderingContext2D,
  bin: DebrisBin,
  size: number
) {
  ctx.save()
  ctx.translate(size / 2, size / 2)
  if (bin === "plastic") {
    // Recycle-ish bottle silhouette
    roundRect(ctx, -size * 0.16, -size * 0.28, size * 0.32, size * 0.5, 4)
    strokeFill(ctx, "#7DD3FC")
    roundRect(ctx, -size * 0.08, -size * 0.38, size * 0.16, size * 0.12, 2)
    strokeFill(ctx, "#38BDF8")
  } else if (bin === "metal") {
    // Gear-ish disc
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2)
    strokeFill(ctx, "#94A3B8")
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2)
    strokeFill(ctx, "#334155")
  } else {
    // Stacked pages
    roundRect(ctx, -size * 0.22, -size * 0.2, size * 0.4, size * 0.48, 2)
    strokeFill(ctx, "#FEF3C7")
    roundRect(ctx, -size * 0.18, -size * 0.28, size * 0.4, size * 0.48, 2)
    strokeFill(ctx, "#FDE68A")
  }
  ctx.restore()
}
