"use client"

import { useEffect, useRef, useState } from "react"
import { BOSS_PRINTER } from "@/lib/rage-reset/content"
import {
  applyStrikeHeat,
  breathPhase,
  coolHeat,
  computeStrikeDamage,
  consecutiveControlMultiplier,
  controlledStrikeFeedback,
  clampHeat,
  heatStatusLabel,
  timingQualityFromBreath,
  WEAPON_BALANCE,
} from "@/lib/rage-reset/scoring"
import {
  getControlledStrikeConfig,
  getSessionDurations,
} from "@/lib/rage-reset/sessionTiming"
import { drawBossPrinter, type BossReaction } from "@/lib/rage-reset/officeArt"
import { playSound, playWeaponImpact } from "@/lib/rage-reset/audio"
import { triggerHaptic } from "@/lib/rage-reset/haptics"

export function ControlledSmashGame({
  weaponId,
  soundEnabled,
  hapticsEnabled,
  reducedEffects,
  onComplete,
  onMuteToggle,
}: {
  weaponId: string
  soundEnabled: boolean
  hapticsEnabled: boolean
  reducedEffects: boolean
  onComplete: (result: {
    controlledStrikes: number
    calmEnergyBonus: number
    maxHeat: number
  }) => void
  onMuteToggle: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const holdingRef = useRef(false)
  const heldExpandRef = useRef(false)
  const elapsedRef = useRef(0)
  const heatRef = useRef(0)
  const maxHeatRef = useRef(0)
  const consecutiveRef = useRef(0)
  const multiplierRef = useRef(1)
  const feedbackRef = useRef<{ text: string; life: number } | null>(null)
  const reactionRef = useRef<BossReaction>("idle")
  const reactionTimerRef = useRef(0)
  const hitStopRef = useRef(0)
  const config = getControlledStrikeConfig()
  const durations = getSessionDurations()
  const bossHp = config.bossDurability || BOSS_PRINTER.durability
  const hpRef = useRef(bossHp)
  const strikesRef = useRef(0)
  const timeLeftRef = useRef(durations.controlledSmashMs)
  const completedRef = useRef(false)
  const shakeRef = useRef(0)
  const flashRef = useRef(0)
  const rafRef = useRef(0)

  const [hud, setHud] = useState({
    timeLeft: durations.controlledSmashMs,
    hp: bossHp,
    heat: 0,
    heatLabel: "Cool",
    phase: "expand" as "expand" | "contract",
    inCalmZone: false,
    strikes: 0,
    multiplier: 1,
    feedback: "",
    instruction: "Hold while the circle expands — slower timing hits harder.",
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const parent = canvas.parentElement
      const w = parent?.clientWidth ?? window.innerWidth
      const h = parent?.clientHeight ?? window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    let last = performance.now()
    let hudAccum = 0

    const finish = () => {
      if (completedRef.current) return
      completedRef.current = true
      const bonus = strikesRef.current * 8 + (maxHeatRef.current < 85 ? 5 : 0)
      onComplete({
        controlledStrikes: strikesRef.current,
        calmEnergyBonus: bonus,
        maxHeat: maxHeatRef.current,
      })
    }

    const attemptStrike = (rapid: boolean) => {
      const heat = heatRef.current
      const quality = timingQualityFromBreath(elapsedRef.current, config)
      const { inCalmZone, phase } = breathPhase(elapsedRef.current, config)

      if (rapid) {
        consecutiveRef.current = 0
        multiplierRef.current = 1
        heatRef.current = applyStrikeHeat(
          heat,
          (WEAPON_BALANCE[weaponId]?.strikeHeat ?? 8) * 1.6
        )
        maxHeatRef.current = Math.max(maxHeatRef.current, heatRef.current)
        const chip = Math.max(
          1,
          Math.round(computeStrikeDamage({ weaponId, heat: heatRef.current }) * 0.12)
        )
        hpRef.current = Math.max(0, hpRef.current - chip)
        shakeRef.current = reducedEffects ? 0.2 : 0.8
        feedbackRef.current = { text: "Too early", life: 0.7 }
        if (soundEnabled) playWeaponImpact(weaponId, 0.4)
        triggerHaptic("warn", hapticsEnabled)
        flashRef.current = 0.15
        reactionRef.current = "hit"
        reactionTimerRef.current = 0.25
        return
      }

      const heldOk = heldExpandRef.current
      const releasedOnContract = phase === "contract" || inCalmZone
      const tooEarly = phase === "expand" && !inCalmZone
      if (!inCalmZone || !heldOk || !releasedOnContract) {
        consecutiveRef.current = 0
        multiplierRef.current = 1
        heatRef.current = applyStrikeHeat(heat, 5)
        maxHeatRef.current = Math.max(maxHeatRef.current, heatRef.current)
        feedbackRef.current = {
          text: controlledStrikeFeedback(0, tooEarly),
          life: 0.8,
        }
        if (soundEnabled) playSound("warn", 0.5)
        triggerHaptic("warn", hapticsEnabled)
        return
      }

      consecutiveRef.current += 1
      const mult = consecutiveControlMultiplier(
        consecutiveRef.current - 1,
        config.comboStep,
        config.comboCap
      )
      multiplierRef.current = mult

      const baseDamage = computeStrikeDamage({
        weaponId,
        heat,
        isControlled: true,
        timingQuality: quality,
      })
      const damage = Math.round(baseDamage * mult)
      hpRef.current = Math.max(0, hpRef.current - damage)
      strikesRef.current += 1
      heatRef.current = clampHeat(heat - config.heatRelief)
      shakeRef.current = reducedEffects ? 0.3 : 2.8
      flashRef.current = 0.5
      hitStopRef.current = reducedEffects ? 0 : 0.09
      feedbackRef.current = {
        text: controlledStrikeFeedback(quality, false),
        life: 0.9,
      }
      reactionRef.current =
        hpRef.current <= 0 ? "defeated" : quality >= 0.92 ? "stunned" : "hit"
      reactionTimerRef.current = 0.45
      if (soundEnabled) {
        playWeaponImpact(weaponId, 1)
        playSound("success", 0.85)
      }
      triggerHaptic("controlled", hapticsEnabled)
      heldExpandRef.current = false
    }

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault()
      holdingRef.current = true
      const { phase } = breathPhase(elapsedRef.current, config)
      if (phase === "expand") heldExpandRef.current = true
      ;(canvas as HTMLCanvasElement & { _downAt?: number })._downAt = performance.now()
    }

    const onPointerUp = (e: PointerEvent) => {
      e.preventDefault()
      const downAt = (canvas as HTMLCanvasElement & { _downAt?: number })._downAt ?? 0
      const pressMs = performance.now() - downAt
      holdingRef.current = false

      if (pressMs < 160) {
        attemptStrike(true)
      } else {
        attemptStrike(false)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        if (!holdingRef.current) {
          holdingRef.current = true
          if (breathPhase(elapsedRef.current, config).phase === "expand") {
            heldExpandRef.current = true
          }
          ;(canvas as HTMLCanvasElement & { _downAt?: number })._downAt = performance.now()
        }
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        onPointerUp(new PointerEvent("pointerup"))
      }
    }

    canvas.addEventListener("pointerdown", onPointerDown)
    canvas.addEventListener("pointerup", onPointerUp)
    canvas.addEventListener("pointercancel", onPointerUp)
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)

    const tick = (now: number) => {
      if (document.visibilityState !== "visible") {
        last = now
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      let dt = Math.min(0.05, (now - last) / 1000)
      last = now

      if (hitStopRef.current > 0) {
        hitStopRef.current = Math.max(0, hitStopRef.current - dt)
        dt *= 0.15
      }

      elapsedRef.current += dt * 1000
      timeLeftRef.current = Math.max(0, timeLeftRef.current - dt * 1000)
      heatRef.current = coolHeat(heatRef.current, dt)
      shakeRef.current = Math.max(0, shakeRef.current - dt * 4)
      flashRef.current = Math.max(0, flashRef.current - dt)
      if (feedbackRef.current) {
        feedbackRef.current.life -= dt
        if (feedbackRef.current.life <= 0) feedbackRef.current = null
      }
      if (reactionTimerRef.current > 0) {
        reactionTimerRef.current -= dt
        if (reactionTimerRef.current <= 0 && reactionRef.current !== "defeated") {
          const ratio = hpRef.current / bossHp
          reactionRef.current = ratio < 0.35 ? "phase2" : "idle"
        }
      }

      const { phase, progress, inCalmZone } = breathPhase(elapsedRef.current, config)
      if (holdingRef.current && phase === "expand") heldExpandRef.current = true

      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const sx = reducedEffects ? 0 : (Math.random() - 0.5) * shakeRef.current * 3
      const sy = reducedEffects ? 0 : (Math.random() - 0.5) * shakeRef.current * 3

      ctx.save()
      ctx.translate(sx, sy)
      ctx.fillStyle = "#070707"
      ctx.fillRect(-8, -8, w + 16, h + 16)

      const bw = Math.min(240, w * 0.6)
      const bh = Math.min(180, h * 0.32)
      const bx = (w - bw) / 2
      const by = h * 0.16
      const hpPct = hpRef.current / bossHp

      // HP bar
      ctx.fillStyle = "#27272A"
      roundRect(ctx, w * 0.18, by - 28, w * 0.64, 12, 6)
      ctx.fill()
      ctx.fillStyle = hpPct > 0.4 ? "#F97316" : "#EF4444"
      roundRect(ctx, w * 0.18, by - 28, w * 0.64 * hpPct, 12, 6)
      ctx.fill()

      let reaction = reactionRef.current
      if (reaction === "idle" && hpPct < 0.35) reaction = "phase2"
      if (hpPct <= 0) reaction = "defeated"

      ctx.save()
      ctx.translate(bx, by)
      drawBossPrinter(ctx, bw, bh, hpPct, reaction, reducedEffects)
      ctx.restore()

      // Timing window ring
      const cx = w / 2
      const cy = h * 0.64
      const minR = 36
      const maxR = Math.min(120, w * 0.28)
      const radius =
        phase === "expand"
          ? minR + (maxR - minR) * progress
          : maxR - (maxR - minR) * progress

      ctx.beginPath()
      ctx.arc(cx, cy, maxR + 8, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(255,255,255,0.12)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Clear timing window highlight
      ctx.beginPath()
      ctx.arc(cx, cy, maxR * 0.92, 0, Math.PI * 2)
      ctx.strokeStyle = inCalmZone ? "rgba(52,211,153,0.95)" : "rgba(52,211,153,0.35)"
      ctx.lineWidth = inCalmZone ? 6 : 3
      ctx.stroke()
      if (inCalmZone && !reducedEffects) {
        ctx.beginPath()
        ctx.arc(cx, cy, maxR * 0.92, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(52,211,153,0.25)"
        ctx.lineWidth = 14
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fillStyle = holdingRef.current
        ? "rgba(249,115,22,0.4)"
        : "rgba(249,115,22,0.18)"
      ctx.fill()
      ctx.strokeStyle = "#F97316"
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.fillStyle = "#FAFAFA"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(phase === "expand" ? "EXPAND" : "CONTRACT", cx, cy + 4)

      if (feedbackRef.current) {
        ctx.globalAlpha = Math.min(1, feedbackRef.current.life * 2)
        ctx.fillStyle =
          feedbackRef.current.text === "Perfect control"
            ? "#34D399"
            : feedbackRef.current.text === "Strong hit"
              ? "#FBBF24"
              : "#F87171"
        ctx.font = "bold 22px sans-serif"
        ctx.fillText(feedbackRef.current.text, cx, cy - maxR - 24)
        ctx.globalAlpha = 1
      }

      if (flashRef.current > 0) {
        ctx.fillStyle = `rgba(253,186,116,${flashRef.current * 0.35})`
        ctx.fillRect(0, 0, w, h)
      }
      ctx.restore()

      hudAccum += dt
      if (hudAccum > 0.08) {
        hudAccum = 0
        setHud({
          timeLeft: timeLeftRef.current,
          hp: hpRef.current,
          heat: heatRef.current,
          heatLabel: heatStatusLabel(heatRef.current),
          phase,
          inCalmZone,
          strikes: strikesRef.current,
          multiplier: multiplierRef.current,
          feedback: feedbackRef.current?.text ?? "",
          instruction:
            phase === "expand"
              ? "Hold while the circle expands."
              : inCalmZone
                ? "Release now for a strong controlled strike."
                : "Release in the green timing window.",
        })
      }

      if (timeLeftRef.current <= 0 || hpRef.current <= 0) {
        finish()
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("pointerdown", onPointerDown)
      canvas.removeEventListener("pointerup", onPointerUp)
      canvas.removeEventListener("pointercancel", onPointerUp)
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [weaponId, soundEnabled, hapticsEnabled, reducedEffects, onComplete, config, bossHp])

  return (
    <div className="relative h-[100dvh] w-full touch-none overflow-hidden bg-dark-950 select-none">
      <div className="absolute inset-x-0 top-0 z-10 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-start justify-between gap-2">
          <div className="rounded-xl bg-black/55 px-3 py-2 backdrop-blur-sm">
            <div className="font-display text-2xl text-white">
              {Math.ceil(hud.timeLeft / 1000)}s
            </div>
            <div className="text-xs text-zinc-300">
              Controlled strikes {hud.strikes}
              {hud.multiplier > 1 ? ` · ×${hud.multiplier.toFixed(1)}` : ""}
            </div>
          </div>
          <div className="rounded-xl bg-black/55 px-3 py-2 text-right backdrop-blur-sm">
            <div className="font-display text-xl text-emerald-400">Slower. Stronger.</div>
            <div
              className={`text-xs ${hud.heat >= 85 ? "font-semibold text-red-400" : "text-zinc-300"}`}
            >
              {hud.heatLabel}
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-sm font-semibold text-zinc-100" aria-live="polite">
          {hud.instruction}
        </p>
        <p className="mt-1 text-center text-xs text-zinc-500">
          Green ring = timing window · consecutive control builds a multiplier · rapid taps barely
          scratch it
        </p>
      </div>

      <button
        type="button"
        onClick={onMuteToggle}
        className="absolute right-3 top-28 z-20 min-h-[44px] rounded-xl border border-zinc-700 bg-black/60 px-3 text-xs font-semibold"
      >
        {soundEnabled ? "Sound on" : "Sound off"}
      </button>

      <div className="absolute inset-x-0 bottom-0 z-10 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div
          className="h-3 overflow-hidden rounded-full bg-zinc-800"
          role="meter"
          aria-valuenow={Math.round(hud.heat)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Weapon heat"
        >
          <div
            className={`h-full transition-[width] duration-150 ${
              hud.heat >= 85 ? "bg-red-500" : hud.heat >= 60 ? "bg-amber-400" : "bg-emerald-400"
            }`}
            style={{ width: `${Math.min(100, hud.heat)}%` }}
          />
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        aria-label="Controlled smash. Hold during expand and release in the calm zone."
        data-testid="controlled-smash-arena"
      />
    </div>
  )
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
