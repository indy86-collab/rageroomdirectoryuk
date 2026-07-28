"use client"

import { useEffect, useRef, useState } from "react"
import { getRoom } from "@/lib/rage-reset/content"
import {
  applyStrikeHeat,
  coolHeat,
  computeStrikeDamage,
  damageMultiplierFromHeat,
  heatStatusLabel,
  WEAPON_BALANCE,
} from "@/lib/rage-reset/scoring"
import { FREE_SMASH_DURATION_MS } from "@/lib/rage-reset/types"
import type { RoomId } from "@/lib/rage-reset/types"
import { getSessionDurations } from "@/lib/rage-reset/sessionTiming"
import {
  createSmashObjects,
  drawCartoonObject,
  hitTest,
  spawnBreakParticles,
  type DamagePopup,
  type FreeSmashState,
  type Particle,
  type SmashObject,
} from "@/lib/rage-reset/gameEngine/smashHelpers"
import { playSound, playWeaponImpact } from "@/lib/rage-reset/audio"
import { triggerHaptic } from "@/lib/rage-reset/haptics"

export function SmashGame({
  roomId,
  weaponId,
  soundEnabled,
  hapticsEnabled,
  reducedEffects,
  onComplete,
  onMuteToggle,
}: {
  roomId: RoomId
  weaponId: string
  soundEnabled: boolean
  hapticsEnabled: boolean
  reducedEffects: boolean
  onComplete: (result: {
    objectsDestroyed: number
    bestCombo: number
    smashScore: number
    maxHeat: number
    calmEnergyBonus: number
  }) => void
  onMuteToggle: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<FreeSmashState | null>(null)
  const rafRef = useRef<number>(0)
  const pointersRef = useRef<Map<number, { x: number; y: number; t: number; objId?: string }>>(
    new Map()
  )
  const completedRef = useRef(false)
  const maxHeatRef = useRef(0)
  const durations = getSessionDurations()
  const freeSmashMs = durations.freeSmashMs || FREE_SMASH_DURATION_MS

  const [hud, setHud] = useState({
    timeLeft: freeSmashMs,
    score: 0,
    combo: 0,
    heat: 0,
    heatLabel: "Cool",
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const room = getRoom(roomId)
    if (!room) return
    maxHeatRef.current = 0

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

      if (!stateRef.current) {
        stateRef.current = {
          objects: createSmashObjects(room.objects, w, h),
          particles: [],
          popups: [],
          heat: 0,
          combo: 0,
          comboTimer: 0,
          smashScore: 0,
          objectsDestroyed: 0,
          bestCombo: 0,
          timeLeftMs: freeSmashMs,
          screenShake: 0,
          slowMo: 1,
          lastStrikeAt: 0,
          paused: false,
          weaponId,
          reducedEffects,
        }
      }
    }

    resize()
    window.addEventListener("resize", resize)

    let last = performance.now()
    let hudAccum = 0

    const tick = (now: number) => {
      const state = stateRef.current
      if (!state) return

      const visible = document.visibilityState === "visible"
      let dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!visible) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      dt *= state.slowMo
      if (state.slowMo < 1) {
        state.slowMo = Math.min(1, state.slowMo + dt * 0.8)
      }

      state.heat = coolHeat(state.heat, dt)
      state.comboTimer = Math.max(0, state.comboTimer - dt)
      if (state.comboTimer <= 0) state.combo = 0
      state.screenShake = Math.max(0, state.screenShake - dt * 8)
      state.timeLeftMs = Math.max(0, state.timeLeftMs - dt * 1000)

      for (const obj of state.objects) {
        if (obj.broken || obj.dragging) continue
        obj.shake = Math.max(0, obj.shake - dt * 4)
        obj.x += obj.vx * dt
        obj.y += obj.vy * dt
        obj.vx *= 0.9
        obj.vy *= 0.9
      }

      const particles: Particle[] = []
      for (const p of state.particles) {
        p.life -= dt
        if (p.life <= 0) continue
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vy += 220 * dt
        particles.push(p)
      }
      state.particles = particles

      const popups: DamagePopup[] = []
      for (const pop of state.popups) {
        pop.life -= dt
        if (pop.life <= 0) continue
        pop.y -= 30 * dt
        popups.push(pop)
      }
      state.popups = popups

      if (state.objects.every((o) => o.broken) && state.timeLeftMs > 2000) {
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        state.objects = createSmashObjects(room.objects, w, h)
      }

      drawFrame(ctx, canvas.clientWidth, canvas.clientHeight, state, roomId)

      hudAccum += dt
      if (hudAccum > 0.1) {
        hudAccum = 0
        setHud({
          timeLeft: state.timeLeftMs,
          score: state.smashScore,
          combo: state.combo,
          heat: state.heat,
          heatLabel: heatStatusLabel(state.heat),
        })
      }

      if (state.timeLeftMs <= 0 && !completedRef.current) {
        completedRef.current = true
        const maxHeat = maxHeatRef.current
        onComplete({
          objectsDestroyed: state.objectsDestroyed,
          bestCombo: state.bestCombo,
          smashScore: state.smashScore,
          maxHeat,
          calmEnergyBonus: maxHeat < 85 ? 5 : 0,
        })
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const trackHeat = (heat: number) => {
      maxHeatRef.current = Math.max(maxHeatRef.current, heat)
    }

    const applyHit = (
      obj: SmashObject,
      clientX: number,
      clientY: number,
      isSwipe: boolean
    ) => {
      const state = stateRef.current
      if (!state || obj.broken) return

      const strikeHeat = WEAPON_BALANCE[weaponId]?.strikeHeat ?? 8
      state.heat = applyStrikeHeat(state.heat, strikeHeat)
      trackHeat(state.heat)

      const damage = computeStrikeDamage({
        weaponId,
        heat: state.heat,
        isSwipe,
      })

      // Accuracy jitter at high heat
      const missChance = damageMultiplierFromHeat(state.heat) < 0.5 ? 0.2 : 0
      if (Math.random() < missChance) {
        state.popups.push({
          x: clientX,
          y: clientY,
          text: "Miss",
          life: 0.5,
          color: "#A1A1AA",
        })
        if (soundEnabled) playSound("warn", 0.5)
        return
      }

      obj.hp -= damage
      obj.crack = 1 - obj.hp / obj.maxHp
      obj.shake = reducedEffects ? 0.4 : 1
      obj.rotation += (Math.random() - 0.5) * 0.15
      obj.vx += (Math.random() - 0.5) * 40
      obj.vy += (Math.random() - 0.5) * 40

      state.combo += 1
      state.comboTimer = 1.4
      state.bestCombo = Math.max(state.bestCombo, state.combo)
      state.smashScore += damage + state.combo * 2
      state.popups.push({
        x: clientX,
        y: clientY,
        text: `-${damage}`,
        life: 0.7,
        color: "#FDBA74",
      })
      // Stronger hit-stop for Office Meltdown impact feel
      if (!reducedEffects && roomId === "office-meltdown") {
        state.slowMo = Math.min(state.slowMo, 0.22)
        obj.shake = Math.max(obj.shake, 1.4)
      }

      state.screenShake = reducedEffects ? 0 : Math.min(4, 1.2 + damage / 40)
      state.lastStrikeAt = performance.now()

      if (soundEnabled) playWeaponImpact(weaponId, isSwipe ? 1 : 0.75)
      triggerHaptic(isSwipe ? "impact" : "tap", hapticsEnabled)

      if (obj.hp <= 0) {
        obj.broken = true
        state.objectsDestroyed += 1
        state.smashScore += obj.def.scoreValue
        spawnBreakParticles(obj, state.particles, reducedEffects)
        if (soundEnabled) playSound("break", 1)
        triggerHaptic("break", hapticsEnabled)
        if (obj.def.size === "large" && !reducedEffects) {
          state.slowMo = 0.35
          state.screenShake = 5
        }
      }
    }

    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault()
      canvas.setPointerCapture(e.pointerId)
      const { x, y } = toLocal(e)
      const obj = hitTest(stateRef.current?.objects ?? [], x, y)
      pointersRef.current.set(e.pointerId, {
        x,
        y,
        t: performance.now(),
        objId: obj?.id,
      })
      if (obj) {
        obj.dragging = true
        obj.dragOffsetX = x - obj.x
        obj.dragOffsetY = y - obj.y
        applyHit(obj, x, y, false)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      e.preventDefault()
      const prev = pointersRef.current.get(e.pointerId)
      if (!prev || !stateRef.current) return
      const { x, y } = toLocal(e)
      const dx = x - prev.x
      const dy = y - prev.y
      const dist = Math.hypot(dx, dy)
      const obj = stateRef.current.objects.find((o) => o.id === prev.objId)

      if (obj && obj.dragging && !obj.broken) {
        obj.x = x - obj.dragOffsetX
        obj.y = y - obj.dragOffsetY
      }

      if (dist > 28) {
        const target = obj && !obj.broken ? obj : hitTest(stateRef.current.objects, x, y)
        if (target) applyHit(target, x, y, true)
        pointersRef.current.set(e.pointerId, { ...prev, x, y, t: performance.now() })
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      e.preventDefault()
      const prev = pointersRef.current.get(e.pointerId)
      const obj = stateRef.current?.objects.find((o) => o.id === prev?.objId)
      if (obj) {
        obj.dragging = false
        obj.vx = 0
        obj.vy = 0
      }
      pointersRef.current.delete(e.pointerId)
    }

    canvas.addEventListener("pointerdown", onPointerDown)
    canvas.addEventListener("pointermove", onPointerMove)
    canvas.addEventListener("pointerup", onPointerUp)
    canvas.addEventListener("pointercancel", onPointerUp)

    // Keyboard: number keys strike objects in order
    const onKey = (e: KeyboardEvent) => {
      const state = stateRef.current
      if (!state) return
      const idx = Number(e.key) - 1
      if (idx >= 0 && idx < state.objects.length) {
        const obj = state.objects[idx]
        if (!obj.broken) applyHit(obj, obj.x + obj.w / 2, obj.y + obj.h / 2, false)
      }
      if (e.key === " " || e.key === "Enter") {
        const alive = state.objects.find((o) => !o.broken)
        if (alive) applyHit(alive, alive.x + alive.w / 2, alive.y + alive.h / 2, false)
      }
    }
    window.addEventListener("keydown", onKey)

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("keydown", onKey)
      canvas.removeEventListener("pointerdown", onPointerDown)
      canvas.removeEventListener("pointermove", onPointerMove)
      canvas.removeEventListener("pointerup", onPointerUp)
      canvas.removeEventListener("pointercancel", onPointerUp)
    }
  }, [
    roomId,
    weaponId,
    soundEnabled,
    hapticsEnabled,
    reducedEffects,
    onComplete,
    freeSmashMs,
  ])

  const seconds = Math.ceil(hud.timeLeft / 1000)
  const heatPct = Math.min(100, hud.heat)

  return (
    <div className="relative h-[100dvh] w-full touch-none overflow-hidden bg-dark-950 select-none">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="rounded-xl bg-black/55 px-3 py-2 text-sm backdrop-blur-sm">
          <div className="font-display text-2xl text-white">{seconds}s</div>
          <div className="text-xs text-zinc-300">Smash Score {hud.score}</div>
        </div>
        <div className="rounded-xl bg-black/55 px-3 py-2 text-right text-sm backdrop-blur-sm">
          <div className="font-display text-2xl text-rage-400">
            {hud.combo > 1 ? `x${hud.combo}` : "—"}
          </div>
          <div className="text-xs text-zinc-300">Combo</div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-300">
          <span>Weapon heat</span>
          <span>{hud.heatLabel}</span>
        </div>
        <div
          className="h-3 overflow-hidden rounded-full bg-zinc-800"
          role="meter"
          aria-valuenow={Math.round(heatPct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Weapon heat"
        >
          <div
            className={`h-full transition-[width] duration-100 ${
              heatPct >= 85 ? "bg-red-500" : heatPct >= 60 ? "bg-amber-400" : "bg-emerald-400"
            }`}
            style={{ width: `${heatPct}%` }}
          />
        </div>
        <p className="mt-2 text-center text-[11px] text-zinc-500">
          Tap, swipe or drag objects. Pause to cool the weapon. Keys 1–6 on desktop.
        </p>
      </div>

      <button
        type="button"
        onClick={onMuteToggle}
        className="absolute right-3 top-20 z-20 min-h-[44px] rounded-xl border border-zinc-700 bg-black/60 px-3 text-xs font-semibold backdrop-blur-sm"
        aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
      >
        {soundEnabled ? "Sound on" : "Sound off"}
      </button>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        aria-label="Free smash arena. Tap objects to strike them."
      />
    </div>
  )
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: FreeSmashState,
  roomId: RoomId
) {
  const sx = state.reducedEffects
    ? 0
    : (Math.random() - 0.5) * state.screenShake * 2
  const sy = state.reducedEffects
    ? 0
    : (Math.random() - 0.5) * state.screenShake * 2

  ctx.save()
  ctx.translate(sx, sy)
  ctx.fillStyle = "#0A0A0A"
  ctx.fillRect(-10, -10, w + 20, h + 20)

  // Room vibe
  const grd = ctx.createLinearGradient(0, 0, w, h)
  grd.addColorStop(0, "rgba(249,115,22,0.12)")
  grd.addColorStop(1, "rgba(220,38,38,0.08)")
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, w, h)

  for (const obj of state.objects) {
    if (obj.broken) continue
    drawCartoonObject(ctx, obj, roomId)
  }

  for (const p of state.particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife)
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  for (const pop of state.popups) {
    ctx.globalAlpha = Math.max(0, pop.life)
    ctx.fillStyle = pop.color
    ctx.font = "bold 18px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(pop.text, pop.x, pop.y)
  }
  ctx.globalAlpha = 1
  ctx.restore()
}
