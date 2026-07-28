import type { ObjectDefinition } from "../types"
import { drawOfficeObject } from "../officeArt"

export interface SmashObject {
  id: string
  def: ObjectDefinition
  x: number
  y: number
  w: number
  h: number
  hp: number
  maxHp: number
  crack: number
  shake: number
  broken: boolean
  vx: number
  vy: number
  rotation: number
  dragOffsetX: number
  dragOffsetY: number
  dragging: boolean
}

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export interface DamagePopup {
  x: number
  y: number
  text: string
  life: number
  color: string
}

export interface FreeSmashState {
  objects: SmashObject[]
  particles: Particle[]
  popups: DamagePopup[]
  heat: number
  combo: number
  comboTimer: number
  smashScore: number
  objectsDestroyed: number
  bestCombo: number
  timeLeftMs: number
  screenShake: number
  slowMo: number
  lastStrikeAt: number
  paused: boolean
  weaponId: string
  reducedEffects: boolean
}

export function createSmashObjects(
  defs: ObjectDefinition[],
  width: number,
  height: number
): SmashObject[] {
  const cols = 3
  const rows = Math.ceil(defs.length / cols)
  const padX = width * 0.08
  const padY = height * 0.14
  const usableW = width - padX * 2
  const usableH = height - padY * 2 - 40

  return defs.map((def, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)
    const sizeMul = def.size === "large" ? 1.15 : def.size === "small" ? 0.75 : 1
    const w = Math.min(120, usableW / cols - 16) * sizeMul
    const h = Math.min(100, usableH / rows - 16) * sizeMul
    const cellW = usableW / cols
    const cellH = usableH / rows
    const x = padX + col * cellW + (cellW - w) / 2
    const y = padY + row * cellH + (cellH - h) / 2
    return {
      id: def.id,
      def,
      x,
      y,
      w,
      h,
      hp: def.durability,
      maxHp: def.durability,
      crack: 0,
      shake: 0,
      broken: false,
      vx: 0,
      vy: 0,
      rotation: (Math.random() - 0.5) * 0.1,
      dragOffsetX: 0,
      dragOffsetY: 0,
      dragging: false,
    }
  })
}

export function hitTest(
  objects: SmashObject[],
  x: number,
  y: number
): SmashObject | null {
  for (let i = objects.length - 1; i >= 0; i -= 1) {
    const o = objects[i]
    if (o.broken) continue
    if (x >= o.x && x <= o.x + o.w && y >= o.y && y <= o.y + o.h) {
      return o
    }
  }
  return null
}

export function spawnBreakParticles(
  obj: SmashObject,
  particles: Particle[],
  reduced: boolean
): void {
  const count = reduced ? 6 : 18
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2
    const speed = 40 + Math.random() * 160
    particles.push({
      x: obj.x + obj.w / 2,
      y: obj.y + obj.h / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 40,
      life: 0.4 + Math.random() * 0.5,
      maxLife: 0.9,
      color: Math.random() > 0.5 ? obj.def.color : obj.def.accent,
      size: 3 + Math.random() * 6,
    })
  }
}

export function drawCartoonObject(
  ctx: CanvasRenderingContext2D,
  obj: SmashObject,
  roomId?: string
): void {
  const shakeX = obj.shake > 0 ? (Math.random() - 0.5) * obj.shake * 6 : 0
  const shakeY = obj.shake > 0 ? (Math.random() - 0.5) * obj.shake * 6 : 0
  const cx = obj.x + obj.w / 2 + shakeX
  const cy = obj.y + obj.h / 2 + shakeY

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(obj.rotation)
  ctx.translate(-obj.w / 2, -obj.h / 2)

  if (roomId === "office-meltdown") {
    drawOfficeObject(
      ctx,
      obj.def.id,
      obj.w,
      obj.h,
      obj.crack,
      obj.broken,
      obj.def.name,
      obj.def.color,
      obj.def.accent
    )
    ctx.restore()
    return
  }

  // Body (fallback rooms)
  roundRect(ctx, 0, 0, obj.w, obj.h, 10)
  ctx.fillStyle = obj.def.color
  ctx.fill()
  ctx.strokeStyle = obj.def.accent
  ctx.lineWidth = 3
  ctx.stroke()

  // Accent panel
  ctx.fillStyle = obj.def.accent
  ctx.globalAlpha = 0.35
  roundRect(ctx, obj.w * 0.12, obj.h * 0.18, obj.w * 0.76, obj.h * 0.28, 6)
  ctx.fill()
  ctx.globalAlpha = 1

  // Crack lines
  if (obj.crack > 0) {
    ctx.strokeStyle = "rgba(15,15,15,0.75)"
    ctx.lineWidth = 2
    ctx.beginPath()
    const cracks = Math.ceil(obj.crack * 4)
    for (let i = 0; i < cracks; i += 1) {
      const sx = obj.w * (0.2 + i * 0.15)
      const sy = obj.h * 0.2
      ctx.moveTo(sx, sy)
      ctx.lineTo(sx + obj.w * 0.1, obj.h * 0.55)
      ctx.lineTo(sx - obj.w * 0.05, obj.h * 0.85)
    }
    ctx.stroke()
  }

  // Label
  ctx.fillStyle = "#0A0A0A"
  ctx.font = `bold ${Math.max(10, Math.floor(obj.w / 9))}px sans-serif`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  const label = obj.def.name.length > 18 ? `${obj.def.name.slice(0, 16)}…` : obj.def.name
  wrapText(ctx, label, obj.w / 2, obj.h * 0.72, obj.w * 0.9, 12)

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

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ")
  let line = ""
  let yy = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy)
      line = word
      yy += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, yy)
}
