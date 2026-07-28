/**
 * The Unbreakable Printer — boss encounter with controlled-strike timing.
 */

import { BOSS_PRINTER } from "../content"
import {
  applyStrikeHeat,
  breathPhase,
  coolHeat,
  computeStrikeDamage,
  consecutiveControlMultiplier,
  controlledStrikeFeedback,
  heatStatusLabel,
  timingQualityFromBreath,
} from "../scoring"
import {
  getControlledStrikeConfig,
  getSessionDurations,
} from "../sessionTiming"
import { CameraController } from "../engine/CameraController"
import { InputManager } from "../engine/InputManager"
import { ParticlePool } from "../engine/ParticlePool"
import type { ControlledSmashResult, EngineSettings, HudSnapshot } from "../engine/types"
import { WeaponEntity } from "../entities/Weapon"
import { drawOfficeRoom } from "../art/officeRoom"
import { drawIllustratedObject } from "../art/objectIllustrators"
import { RR_COLORS } from "../art/styleGuide"
import type { DamageTier } from "../engine/types"
import { playSound, playWeaponImpact } from "../audio"
import { triggerHaptic } from "../haptics"

export class PrinterBossScene {
  private camera = new CameraController()
  private particles = new ParticlePool()
  private input = new InputManager()
  private weapon: WeaponEntity
  private settings: EngineSettings
  private width = 390
  private height = 844
  private hp: number
  private maxHp: number
  private heat = 0
  private maxHeat = 0
  private consecutive = 0
  private multiplier = 1
  private strikes = 0
  private timeLeftMs: number
  private elapsed = 0
  private holding = false
  private heldExpand = false
  private feedback = ""
  private feedbackLife = 0
  private phase = 1
  private entrance = 0
  private bannerLife = 2.5
  private shakeHit = 0
  private paperAttack = 0
  private completed = false
  private paused = false
  private hidden = false
  private timeMs = 0
  private detachInput: (() => void) | null = null
  private onComplete: (r: ControlledSmashResult) => void
  private config = getControlledStrikeConfig()

  constructor(opts: {
    weaponId: string
    settings: EngineSettings
    onComplete: (r: ControlledSmashResult) => void
  }) {
    this.weapon = new WeaponEntity(opts.weaponId)
    this.settings = opts.settings
    this.onComplete = opts.onComplete
    const intensity = opts.settings.reducedEffects ? "reduced" : "full"
    this.settings.effectIntensity = intensity
    this.camera.setIntensity(intensity)
    this.particles.setIntensity(intensity)
    this.maxHp = this.config.bossDurability || BOSS_PRINTER.durability
    this.hp = this.maxHp
    this.timeLeftMs = getSessionDurations().controlledSmashMs
  }

  mount(canvas: HTMLCanvasElement) {
    this.detachInput = this.input.attach(canvas)
    this.camera.startReveal()
    this.resize(canvas.clientWidth, canvas.clientHeight)
    if (this.settings.soundEnabled) playSound("warn", 0.6)
  }

  unmount() {
    this.detachInput?.()
    this.particles.clear()
  }

  setHidden(h: boolean) {
    this.hidden = h
  }
  setPaused(p: boolean) {
    this.paused = p
  }

  resize(w: number, h: number) {
    this.width = w
    this.height = h
    this.weapon.resize(w, h)
  }

  update(dt: number) {
    if (this.hidden || this.paused || this.completed) return
    const timeScale = this.camera.update(dt)
    const simDt = dt * timeScale
    this.timeMs += simDt * 1000
    this.input.update(simDt)
    this.elapsed += simDt * 1000
    this.heat = coolHeat(this.heat, simDt)
    this.weapon.setHeat(this.heat)

    if (this.entrance < 1) this.entrance = Math.min(1, this.entrance + simDt * 0.7)
    if (this.bannerLife > 0) this.bannerLife -= simDt
    if (this.feedbackLife > 0) this.feedbackLife -= simDt
    if (this.paperAttack > 0) this.paperAttack -= simDt
    if (this.shakeHit > 0) this.shakeHit -= simDt

    // Phase from HP
    const ratio = this.hp / this.maxHp
    if (ratio <= 0.33) this.phase = 3
    else if (ratio <= 0.66) this.phase = 2
    else this.phase = 1

    this.holding = this.input.isHolding()
    const { phase } = breathPhase(this.elapsed, this.config)
    if (this.holding && phase === "expand") this.heldExpand = true

    if (this.holding && this.weapon.anim !== "charge" && this.weapon.anim !== "swing") {
      this.weapon.startSwing(this.width * 0.5, this.height * 0.42, 1, true)
    }

    for (const strike of this.input.consumeStrikes()) {
      this.attemptStrike(strike.holdMs < 160 && strike.kind === "tap")
    }

    // Keyboard / hold release already emits strikes via InputManager
    if (!this.holding) this.heldExpand = false

    this.weapon.followPointer(
      this.input.getPrimaryPointer()?.x ?? null,
      this.input.getPrimaryPointer()?.y ?? null,
      this.width
    )
    this.weapon.update(simDt)
    this.particles.update(simDt, this.height * 0.88)

    this.timeLeftMs -= simDt * 1000
    if (this.timeLeftMs <= 0 || this.hp <= 0) this.finish()
  }

  private attemptStrike(rapid: boolean) {
    const quality = timingQualityFromBreath(this.elapsed, this.config)
    const { inCalmZone, phase } = breathPhase(this.elapsed, this.config)

    if (rapid) {
      this.consecutive = 0
      this.multiplier = 1
      // Phase 1: rapid barely chips
      const chip = this.phase === 1 ? 2 : 4
      this.hp = Math.max(0, this.hp - chip)
      this.heat = applyStrikeHeat(this.heat, 10)
      this.maxHeat = Math.max(this.maxHeat, this.heat)
      this.feedback = "TOO FAST"
      this.feedbackLife = 0.8
      this.paperAttack = 0.6
      this.particles.burst({
        x: this.width * 0.5,
        y: this.height * 0.4,
        count: 8,
        colors: [RR_COLORS.paper],
        kind: "paper",
        speed: 120,
      })
      triggerHaptic("warn", this.settings.hapticsEnabled)
      if (this.settings.soundEnabled) playSound("warn", 0.4)
      this.weapon.startSwing(this.width * 0.5, this.height * 0.42, 0.7)
      this.weapon.releaseCharge(0.7)
      return
    }

    const heldOk = this.heldExpand || phase === "expand" || inCalmZone
    if (!heldOk && quality < 0.35) {
      this.consecutive = 0
      this.multiplier = 1
      this.feedback = controlledStrikeFeedback(0.2, true)
      this.feedbackLife = 0.9
      this.heat = applyStrikeHeat(this.heat, 8)
      triggerHaptic("warn", this.settings.hapticsEnabled)
      if (this.settings.soundEnabled) playSound("warn", 0.45)
      this.weapon.startSwing(this.width * 0.5, this.height * 0.42, 0.9)
      this.weapon.releaseCharge(0.9)
      return
    }

    const perfect = inCalmZone && quality >= 0.7
    this.consecutive += 1
    this.multiplier = consecutiveControlMultiplier(
      this.consecutive,
      this.config.comboStep,
      this.config.comboCap
    )
    let damage = computeStrikeDamage({
      weaponId: this.weapon.id,
      heat: this.heat,
      isControlled: true,
      timingQuality: quality,
    })
    damage = Math.round(damage * this.multiplier)

    // Phase gates: armour resists until controlled timing
    if (this.phase === 1 && !perfect) damage = Math.round(damage * 0.45)
    if (this.phase === 2 && perfect) damage = Math.round(damage * 1.25)

    this.hp = Math.max(0, this.hp - damage)
    this.strikes += 1
    this.heat = Math.max(
      0,
      this.heat - (this.config.heatRelief ?? 22)
    )
    this.maxHeat = Math.max(this.maxHeat, this.heat)
    this.feedback = perfect
      ? "PERFECT CONTROL"
      : controlledStrikeFeedback(quality, false).toUpperCase()
    this.feedbackLife = 1
    this.shakeHit = 0.3
    this.camera.addShake(perfect ? 12 : 6)
    if (perfect) this.camera.punch(0.06, 70)

    this.weapon.startSwing(this.width * 0.5, this.height * 0.4, 1.4, true)
    this.weapon.releaseCharge(1.4)

    this.particles.burst({
      x: this.width * 0.5,
      y: this.height * 0.42,
      count: perfect ? 36 : 18,
      colors: [BOSS_PRINTER.color, BOSS_PRINTER.accent, RR_COLORS.paper],
      speed: 220,
      kind: "shard",
    })

    if (this.settings.soundEnabled) {
      playWeaponImpact(this.weapon.id, perfect ? 1 : 0.7)
      if (perfect) playSound("success", 0.8)
    }
    triggerHaptic(perfect ? "controlled" : "impact", this.settings.hapticsEnabled)

    if (this.hp <= 0) {
      this.feedback = "SMASH"
      this.camera.punch(0.1, 120)
      this.particles.burst({
        x: this.width * 0.5,
        y: this.height * 0.42,
        count: 48,
        colors: [RR_COLORS.plastic, RR_COLORS.paper, BOSS_PRINTER.accent],
        speed: 320,
        kind: "dust",
      })
      if (this.settings.soundEnabled) playSound("break", 1)
      triggerHaptic("break", this.settings.hapticsEnabled)
    }
  }

  private finish() {
    if (this.completed) return
    this.completed = true
    const bonus = this.strikes * 8 + (this.maxHeat < 85 ? 5 : 0)
    this.onComplete({
      controlledStrikes: this.strikes,
      calmEnergyBonus: bonus,
      maxHeat: this.maxHeat,
    })
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    this.camera.apply(ctx, this.width, this.height)

    drawOfficeRoom(
      ctx,
      this.width,
      this.height,
      {
        wreck: 0.55 + (1 - this.hp / this.maxHp) * 0.4,
        papersLoose: 0.6 + this.paperAttack,
        lightsFlicker: this.phase >= 2 ? 0.7 : 0.3,
      },
      this.timeMs
    )

    // Dim room focus
    ctx.fillStyle = "rgba(5,10,20,0.28)"
    ctx.fillRect(0, 0, this.width, this.height)

    // Boss spotlight
    const bx = this.width * 0.5
    const by = this.height * 0.42
    const enterY = (1 - this.entrance) * 80
    const spot = ctx.createRadialGradient(bx, by, 20, bx, by, this.width * 0.4)
    spot.addColorStop(0, "rgba(45,212,191,0.18)")
    spot.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = spot
    ctx.fillRect(0, 0, this.width, this.height)

    // Boss body (large)
    const bw = Math.min(220, this.width * 0.55)
    const bh = bw * 0.95
    const tier: DamageTier =
      this.hp <= 0
        ? "destroyed"
        : this.hp / this.maxHp > 0.66
          ? "intact"
          : this.hp / this.maxHp > 0.4
            ? "light"
            : this.hp / this.maxHp > 0.2
              ? "medium"
              : "heavy"

    ctx.save()
    ctx.translate(bx, by + enterY + (this.shakeHit > 0 ? (Math.random() - 0.5) * 8 : 0))
    // Contact shadow
    ctx.fillStyle = "rgba(0,0,0,0.4)"
    ctx.beginPath()
    ctx.ellipse(0, bh * 0.52, bw * 0.45, 14, 0, 0, Math.PI * 2)
    ctx.fill()
    drawIllustratedObject(
      ctx,
      "printer",
      bw,
      bh,
      tier,
      1 - this.hp / this.maxHp
    )
    // Phase armour plates
    if (this.phase === 1 && this.hp > 0) {
      ctx.strokeStyle = "rgba(45,212,191,0.5)"
      ctx.lineWidth = 3
      ctx.strokeRect(-bw * 0.45, -bh * 0.4, bw * 0.9, bh * 0.75)
    }
    ctx.restore()

    // Paper attack
    if (this.paperAttack > 0) {
      ctx.fillStyle = RR_COLORS.paper
      for (let i = 0; i < 10; i += 1) {
        const t = this.paperAttack + i * 0.1
        ctx.save()
        ctx.translate(
          bx + Math.sin(t * 8 + i) * 80,
          by - 40 - (0.6 - this.paperAttack) * 100 - i * 8
        )
        ctx.rotate(i * 0.4)
        ctx.fillRect(-10, -3, 20, 6)
        ctx.restore()
      }
    }

    this.particles.draw(ctx)

    // Breath / charge power band integrated with weapon charge
    const { phase, inCalmZone, progress } = breathPhase(this.elapsed, this.config)
    const bandProgress = phase === "expand" ? progress : 1 - progress
    const bandY = this.height * 0.72
    const bandW = this.width * 0.7
    const bandX = this.width * 0.15

    ctx.fillStyle = "rgba(11,18,32,0.7)"
    roundRect(ctx, bandX, bandY, bandW, 18, 9)
    ctx.fill()
    ctx.fillStyle = inCalmZone ? RR_COLORS.controlled : RR_COLORS.accentOrange
    roundRect(ctx, bandX, bandY, bandW * Math.min(1, Math.max(0, bandProgress)), 18, 9)
    ctx.fill()
    // Calm zone markers
    const calmStart = bandX + bandW * 0.78
    ctx.fillStyle = "rgba(94,234,212,0.85)"
    ctx.fillRect(calmStart, bandY - 4, bandW * 0.18, 26)
    ctx.fillStyle = "#F8FAFC"
    ctx.font = "bold 10px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(inCalmZone ? "CALM — RELEASE" : "HOLD TO CHARGE", this.width / 2, bandY + 36)

    // Room lighting pulse with breath
    if (!this.settings.reducedEffects) {
      const pulse = phase === "expand" ? progress : 1 - progress
      ctx.fillStyle = `rgba(45,212,191,${0.04 + pulse * 0.06})`
      ctx.fillRect(0, 0, this.width, this.height)
    }

    this.weapon.draw(ctx)

    // Boss banner
    if (this.bannerLife > 0) {
      ctx.globalAlpha = Math.min(1, this.bannerLife)
      ctx.fillStyle = "rgba(11,18,32,0.88)"
      roundRect(ctx, this.width * 0.1, this.height * 0.2, this.width * 0.8, 48, 10)
      ctx.fill()
      ctx.fillStyle = RR_COLORS.accentOrange
      ctx.font = "900 18px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(BOSS_PRINTER.name.toUpperCase(), this.width / 2, this.height * 0.2 + 30)
      ctx.globalAlpha = 1
    }

    // Feedback
    if (this.feedbackLife > 0) {
      ctx.globalAlpha = Math.min(1, this.feedbackLife)
      ctx.font = "900 26px sans-serif"
      ctx.textAlign = "center"
      ctx.strokeStyle = RR_COLORS.outline
      ctx.lineWidth = 4
      ctx.strokeText(this.feedback, this.width / 2, this.height * 0.3)
      ctx.fillStyle = RR_COLORS.feedbackPerfect
      ctx.fillText(this.feedback, this.width / 2, this.height * 0.3)
      ctx.globalAlpha = 1
    }

    ctx.restore()
  }

  getHud(): HudSnapshot {
    const { phase, inCalmZone } = breathPhase(this.elapsed, this.config)
    return {
      timeLeftMs: Math.max(0, this.timeLeftMs),
      score: this.strikes * 50,
      combo: this.consecutive,
      heat: this.heat,
      heatLabel: heatStatusLabel(this.heat),
      targetName: BOSS_PRINTER.name,
      targetHpRatio: this.hp / this.maxHp,
      weaponId: this.weapon.id,
      paused: this.paused,
      charge: this.input.getHoldCharge(),
      inCalmZone,
      feedback: this.feedbackLife > 0 ? this.feedback : "",
      bossHpRatio: this.hp / this.maxHp,
      bossPhase: this.phase,
      instruction:
        phase === "expand"
          ? "Hold while the charge builds — release in the teal calm band."
          : "Release in the calm band for a controlled strike.",
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
