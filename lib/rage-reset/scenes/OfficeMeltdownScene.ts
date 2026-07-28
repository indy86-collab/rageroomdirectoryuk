/**
 * Office Meltdown free-smash scene — room, targets, weapon, feedback.
 */

import { getRoom } from "../content"
import {
  applyStrikeHeat,
  coolHeat,
  computeStrikeDamage,
  damageMultiplierFromHeat,
  heatStatusLabel,
  WEAPON_BALANCE,
} from "../scoring"
import { getSessionDurations } from "../sessionTiming"
import { FREE_SMASH_DURATION_MS } from "../types"
import type { RoomId } from "../types"
import { CameraController } from "../engine/CameraController"
import { InputManager, type StrikeIntent } from "../engine/InputManager"
import { ParticlePool } from "../engine/ParticlePool"
import type { EngineSettings, FreeSmashResult, HudSnapshot, Rect } from "../engine/types"
import { BreakableObject, OFFICE_LAYOUT } from "../entities/BreakableObject"
import { WeaponEntity } from "../entities/Weapon"
import { drawOfficeRoom } from "../art/officeRoom"
import { RR_COLORS, RR_LAYOUT } from "../art/styleGuide"
import { playSound, playWeaponImpact } from "../audio"
import { triggerHaptic } from "../haptics"

export interface FeedbackWord {
  text: string
  x: number
  y: number
  life: number
  color: string
  scale: number
}

export class OfficeMeltdownScene {
  private objects: BreakableObject[] = []
  private weapon: WeaponEntity
  private camera = new CameraController()
  private particles = new ParticlePool()
  private input = new InputManager()
  private feedback: FeedbackWord[] = []
  private settings: EngineSettings
  private roomId: RoomId
  private width = 390
  private height = 844
  private play: Rect = { x: 0, y: 0, w: 390, h: 844 }
  private timeLeftMs: number
  private heat = 0
  private maxHeat = 0
  private combo = 0
  private comboTimer = 0
  private bestCombo = 0
  private smashScore = 0
  private objectsDestroyed = 0
  private lastStrikeAt = 0
  private paused = false
  private completed = false
  private selectedId: string | null = null
  private timeMs = 0
  private unlockWave = 0
  private detachInput: (() => void) | null = null
  private onComplete: (r: FreeSmashResult) => void
  private hidden = false

  constructor(opts: {
    roomId: RoomId
    weaponId: string
    settings: EngineSettings
    onComplete: (r: FreeSmashResult) => void
  }) {
    this.roomId = opts.roomId
    this.settings = opts.settings
    this.onComplete = opts.onComplete
    this.weapon = new WeaponEntity(opts.weaponId)
    const durations = getSessionDurations()
    this.timeLeftMs = durations.freeSmashMs || FREE_SMASH_DURATION_MS
    const intensity = opts.settings.reducedEffects ? "reduced" : "full"
    this.settings.effectIntensity = intensity
    this.camera.setIntensity(intensity)
    this.particles.setIntensity(intensity)
  }

  mount(canvas: HTMLCanvasElement) {
    this.detachInput = this.input.attach(canvas)
    this.camera.startReveal()
    this.buildObjects()
    this.resize(canvas.clientWidth, canvas.clientHeight)
  }

  unmount() {
    this.detachInput?.()
    this.detachInput = null
    this.particles.clear()
  }

  setHidden(hidden: boolean) {
    this.hidden = hidden
  }

  setPaused(paused: boolean) {
    this.paused = paused
  }

  resize(w: number, h: number) {
    this.width = w
    this.height = h
    const top = h * RR_LAYOUT.hudTopReserve
    const bottom = h * RR_LAYOUT.hudBottomReserve
    this.play = {
      x: w * 0.04,
      y: top,
      w: w * 0.92,
      h: h - top - bottom,
    }
    for (const o of this.objects) o.place(this.play)
    this.weapon.resize(w, h)
  }

  private buildObjects() {
    const room = getRoom(this.roomId)
    if (!room) return
    // Prefer office layout; fall back to grid for other rooms
    const defs = room.objects
    this.objects = defs.map((def, i) => {
      const layout = OFFICE_LAYOUT[def.id] ?? {
        nx: 0.2 + (i % 3) * 0.3,
        ny: 0.35 + Math.floor(i / 3) * 0.25,
        scale: 1,
        depth: i,
        material: "plastic" as const,
        weight: 1,
      }
      const obj = new BreakableObject(def, layout)
      obj.setNormalized(layout.nx, layout.ny)
      // Stagger unlock: small + medium first, large props after early smashes
      if (this.roomId === "office-meltdown") {
        const wave = def.size === "large" ? 1 : 0
        obj.unlockAt = wave
        obj.unlocked = wave === 0
      }
      return obj
    })
    this.objects.sort((a, b) => a.depth - b.depth)
  }

  update(dt: number) {
    if (this.hidden || this.paused || this.completed) return

    const timeScale = this.camera.update(dt)
    const simDt = dt * timeScale
    this.timeMs += simDt * 1000
    this.input.update(simDt)

    this.heat = coolHeat(this.heat, simDt)
    this.weapon.setHeat(this.heat)
    if (this.comboTimer > 0) {
      this.comboTimer -= simDt
      if (this.comboTimer <= 0) this.combo = 0
    }

    // Progressive unlock as objects break
    const destroyed = this.objectsDestroyed
    if (destroyed >= 2) this.unlockWave = Math.max(this.unlockWave, 1)
    for (const o of this.objects) {
      if (!o.unlocked && o.unlockAt <= this.unlockWave) o.unlocked = true
    }

    const ptr = this.input.getPrimaryPointer()
    this.weapon.followPointer(ptr?.x ?? null, ptr?.y ?? null, this.width)

    // Selection outline while holding
    const hold = this.input.getHoldOrigin()
    this.selectedId = null
    for (const o of this.objects) {
      o.selected = false
      if (!o.unlocked || o.broken) continue
      if (hold && o.contains(hold.x, hold.y)) {
        o.selected = true
        this.selectedId = o.id
      }
    }

    for (const strike of this.input.consumeStrikes()) {
      this.handleStrike(strike)
    }

    const floorY = this.height * 0.88
    for (const o of this.objects) o.update(simDt, floorY)
    this.weapon.update(simDt)
    this.particles.update(simDt, floorY)

    for (const f of this.feedback) {
      f.life -= simDt
      f.y -= 30 * simDt
      f.scale += simDt * 0.4
    }
    this.feedback = this.feedback.filter((f) => f.life > 0)

    this.timeLeftMs -= simDt * 1000
    if (this.timeLeftMs <= 0) this.finish()
  }

  private handleStrike(strike: StrikeIntent) {
    const now = performance.now()
    const target =
      this.objects
        .filter((o) => o.unlocked && !o.broken)
        .reverse()
        .find((o) => o.contains(strike.x, strike.y)) ?? null

    const isSwipe = strike.kind === "swipe"
    const isHold = strike.kind === "hold"

    this.weapon.startSwing(
      strike.x,
      Math.min(strike.y, this.height * 0.7),
      strike.force,
      isHold
    )
    if (isHold) this.weapon.releaseCharge(strike.force)

    if (this.settings.soundEnabled) playSound("whoosh", 0.35 + strike.force * 0.2)

    if (!target) {
      this.heat = applyStrikeHeat(
        this.heat,
        (WEAPON_BALANCE[this.weapon.id]?.strikeHeat ?? 8) * 0.4
      )
      return
    }

    const mult = damageMultiplierFromHeat(this.heat)
    // Overheat miss chance
    if (mult < 0.5 && Math.random() < 0.2) {
      this.pushFeedback("OVERHEATED", strike.x, strike.y - 20, RR_COLORS.heatHot)
      this.heat = applyStrikeHeat(this.heat, 6)
      triggerHaptic("warn", this.settings.hapticsEnabled)
      if (this.settings.soundEnabled) playSound("warn", 0.5)
      return
    }

    const damage = Math.round(
      computeStrikeDamage({
        weaponId: this.weapon.id,
        heat: this.heat,
        isSwipe,
        isControlled: isHold && strike.holdMs > 280,
        timingQuality: isHold ? Math.min(1, strike.holdMs / 700) : 0,
      }) * strike.force
    )

    const result = target.applyHit(damage, strike.dx, strike.dy, strike.force)
    this.heat = applyStrikeHeat(
      this.heat,
      WEAPON_BALANCE[this.weapon.id]?.strikeHeat ?? 8
    )
    this.maxHeat = Math.max(this.maxHeat, this.heat)
    this.weapon.setHeat(this.heat)

    const rapid = now - this.lastStrikeAt < 160
    this.lastStrikeAt = now
    if (!rapid) {
      this.combo += 1
      this.comboTimer = 1.6
      this.bestCombo = Math.max(this.bestCombo, this.combo)
    }

    this.smashScore += Math.round(damage * (1 + this.combo * 0.05))
    this.camera.lookAt(target.x - this.width / 2, target.y - this.height / 2, 0.08)
    this.camera.addShake(result.destroyed ? 10 : 3 + strike.force * 2)

    const colors = [target.def.color, target.def.accent, RR_COLORS.paper]
    this.particles.burst({
      x: target.x + target.w / 2,
      y: target.y + target.h / 2,
      count: result.destroyed ? 28 : 10,
      colors,
      speed: result.destroyed ? 260 : 140,
      kind:
        target.material === "paper"
          ? "paper"
          : target.material === "glass"
            ? "shard"
            : "dust",
      upwardBias: 90,
    })

    if (result.destroyed) {
      this.objectsDestroyed += 1
      this.smashScore += target.def.scoreValue
      this.camera.punch(0.05, 55)
      this.pushFeedback("SMASH", target.x + target.w / 2, target.y, RR_COLORS.feedbackSmash)
      if (this.settings.soundEnabled) playSound("break", 0.8)
      triggerHaptic("break", this.settings.hapticsEnabled)
      // Extra object-specific debris
      if (target.id === "printer" || target.id === "filing-cabinet") {
        this.particles.burst({
          x: target.x + target.w / 2,
          y: target.y,
          count: 12,
          colors: [RR_COLORS.paper, "#FFF"],
          kind: "paper",
          speed: 160,
        })
      }
    } else {
      const word =
        strike.force > 1.3
          ? "HEAVY HIT"
          : result.tier === "heavy"
            ? "CRACK"
            : isHold
              ? "CONTROLLED"
              : "CRACK"
      this.pushFeedback(
        word,
        target.x + target.w / 2,
        target.y,
        strike.force > 1.3 ? RR_COLORS.feedbackHeavy : RR_COLORS.feedbackCrack
      )
      if (this.settings.soundEnabled) {
        playWeaponImpact(this.weapon.id)
        playMaterialImpact(target.material)
      }
      triggerHaptic(
        strike.force > 1.25 ? "impact" : "tap",
        this.settings.hapticsEnabled
      )
    }

    // Soft recenter after a beat
    setTimeout(() => this.camera.recenter(), 280)
  }

  private pushFeedback(text: string, x: number, y: number, color: string) {
    this.feedback.push({ text, x, y, life: 0.7, color, scale: 1 })
  }

  private finish() {
    if (this.completed) return
    this.completed = true
    const bonus =
      this.objectsDestroyed * 3 +
      this.bestCombo * 2 +
      (this.maxHeat < 85 ? 5 : 0)
    this.onComplete({
      objectsDestroyed: this.objectsDestroyed,
      bestCombo: this.bestCombo,
      smashScore: this.smashScore,
      maxHeat: this.maxHeat,
      calmEnergyBonus: bonus,
    })
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    this.camera.apply(ctx, this.width, this.height)

    const wreck = Math.min(1, this.objectsDestroyed / Math.max(1, this.objects.length))
    drawOfficeRoom(
      ctx,
      this.width,
      this.height,
      {
        wreck,
        papersLoose: wreck,
        lightsFlicker: wreck > 0.5 ? wreck : 0,
      },
      this.timeMs
    )

    // Room stays visually dense — locked large props still render, just not hittable yet
    for (const o of this.objects) {
      if (!o.broken || o.shake > 0 || o.flash > 0) {
        o.draw(ctx)
      }
    }

    this.particles.draw(ctx)

    // Feedback words — game typography
    for (const f of this.feedback) {
      ctx.save()
      ctx.globalAlpha = Math.max(0, f.life)
      ctx.translate(f.x, f.y)
      ctx.scale(f.scale, f.scale)
      ctx.font = "900 22px 'Segoe UI', system-ui, sans-serif"
      ctx.textAlign = "center"
      ctx.lineWidth = 4
      ctx.strokeStyle = RR_COLORS.outline
      ctx.strokeText(f.text, 0, 0)
      ctx.fillStyle = f.color
      ctx.fillText(f.text, 0, 0)
      ctx.restore()
    }

    this.weapon.draw(ctx)
    ctx.restore()
  }

  getHud(): HudSnapshot {
    const target = this.objects.find((o) => o.id === this.selectedId && !o.broken)
    return {
      timeLeftMs: Math.max(0, this.timeLeftMs),
      score: this.smashScore,
      combo: this.combo,
      heat: this.heat,
      heatLabel: heatStatusLabel(this.heat),
      targetName: target?.def.name ?? "",
      targetHpRatio: target ? target.hp / target.maxHp : 0,
      weaponId: this.weapon.id,
      paused: this.paused,
      charge: this.input.getHoldCharge(),
      inCalmZone: false,
      feedback: this.feedback[0]?.text ?? "",
    }
  }
}

function playMaterialImpact(material: string) {
  // Layered procedural material character on top of weapon impact
  switch (material) {
    case "metal":
      playSound("impact-bat", 0.35)
      break
    case "glass":
      playSound("break", 0.25)
      break
    case "ceramic":
      playSound("impact-chicken", 0.3)
      break
    case "paper":
      playSound("whoosh", 0.25)
      break
    default:
      playSound("impact-bat", 0.2)
  }
}
