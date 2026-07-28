"use client"

/**
 * Cool-down: drag illustrated office debris into material bins.
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { getSessionDurations } from "@/lib/rage-reset/sessionTiming"
import { COOLDOWN_DURATION_MS } from "@/lib/rage-reset/types"
import { playSound } from "@/lib/rage-reset/audio"
import { triggerHaptic } from "@/lib/rage-reset/haptics"
import { drawOfficeRoom } from "@/lib/rage-reset/art/officeRoom"
import {
  DEBRIS_CATALOG,
  drawBinIcon,
  drawDebris,
  type DebrisBin,
  type DebrisDef,
  type DebrisKind,
} from "@/lib/rage-reset/art/debrisIllustrators"
import { GameViewport } from "./GameViewport"

interface Fragment {
  id: string
  def: DebrisDef
  x: number
  y: number
  rot: number
  placed: boolean
}

const BINS: { id: DebrisBin; label: string; color: string; hint: string }[] = [
  { id: "plastic", label: "Plastic", color: "#38BDF8", hint: "Keys · trays · cables" },
  { id: "metal", label: "Metal", color: "#94A3B8", hint: "Screws · hinges" },
  { id: "paper", label: "Paper", color: "#FDE68A", hint: "Pages · notes" },
]

function makeFragments(count: number): Fragment[] {
  const list: Fragment[] = []
  for (let i = 0; i < count; i += 1) {
    const def = DEBRIS_CATALOG[i % DEBRIS_CATALOG.length]
    list.push({
      id: `debris-${i}`,
      def,
      x: 0.14 + (i % 4) * 0.22 + (Math.random() - 0.5) * 0.04,
      y: 0.32 + Math.floor(i / 4) * 0.14 + (Math.random() - 0.5) * 0.03,
      rot: (Math.random() - 0.5) * 0.5,
      placed: false,
    })
  }
  return list
}

function DebrisThumb({
  kind,
  width,
  height,
  highlight,
  className,
}: {
  kind: DebrisKind
  width: number
  height: number
  highlight?: boolean
  className?: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)
    drawDebris(ctx, kind, width, height, highlight)
  }, [kind, width, height, highlight])

  return (
    <canvas
      ref={ref}
      className={className}
      width={width}
      height={height}
      aria-hidden
    />
  )
}

function BinIcon({ bin, color }: { bin: DebrisBin; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const size = 36
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(size * dpr)
    canvas.height = Math.floor(size * dpr)
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, size, size)
    // Soft plate behind icon
    ctx.fillStyle = `${color}22`
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2)
    ctx.fill()
    drawBinIcon(ctx, bin, size)
  }, [bin, color])
  return <canvas ref={ref} aria-hidden className="mx-auto" />
}

export function NextCooldownGame({
  soundEnabled,
  hapticsEnabled,
  canSkip,
  onComplete,
  onMuteToggle,
}: {
  soundEnabled: boolean
  hapticsEnabled: boolean
  canSkip: boolean
  onComplete: (result: {
    skipped: boolean
    hadIncorrect: boolean
    calmEnergyBonus: number
  }) => void
  onMuteToggle: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const durations = getSessionDurations()
  const durationMs = durations.cooldownMs || COOLDOWN_DURATION_MS
  const count = durations.cooldownFragmentCount
  const [fragments, setFragments] = useState(() => makeFragments(count))
  const [timeLeft, setTimeLeft] = useState(durationMs)
  const [incorrect, setIncorrect] = useState(false)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const [hoverBin, setHoverBin] = useState<DebrisBin | null>(null)
  const doneRef = useRef(false)
  const sizeRef = useRef({ w: 390, h: 844 })
  const placedCounts = useMemo(() => {
    const c: Record<DebrisBin, number> = { plastic: 0, metal: 0, paper: 0 }
    for (const f of fragments) {
      if (f.placed) c[f.def.bin] += 1
    }
    return c
  }, [fragments])

  const remaining = useMemo(
    () => fragments.filter((f) => !f.placed).length,
    [fragments]
  )

  useEffect(() => {
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1000) {
          window.clearInterval(id)
          finish(false)
          return 0
        }
        return t - 1000
      })
    }, 1000)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (remaining === 0 && !doneRef.current) finish(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining])

  const finish = (skipped: boolean) => {
    if (doneRef.current) return
    doneRef.current = true
    if (soundEnabled) playSound("cooldown", 0.7)
    if (!skipped) triggerHaptic("success", hapticsEnabled)
    onComplete({ skipped, hadIncorrect: incorrect, calmEnergyBonus: skipped ? 0 : 12 })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      const parent = canvas.parentElement
      const w = parent?.clientWidth ?? 390
      const h = parent?.clientHeight ?? 844
      sizeRef.current = { w, h }
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      drawOfficeRoom(
        ctx,
        w,
        h,
        { wreck: 0.75, papersLoose: 0.25, lightsFlicker: 0.1 },
        performance.now()
      )
      ctx.fillStyle = "rgba(15, 23, 42, 0.4)"
      ctx.fillRect(0, 0, w, h)

      const g = ctx.createRadialGradient(w / 2, h * 0.42, 30, w / 2, h * 0.45, w * 0.65)
      g.addColorStop(0, "rgba(45,212,191,0.07)")
      g.addColorStop(1, "rgba(0,0,0,0.25)")
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    }

    draw()
    window.addEventListener("resize", draw)
    return () => window.removeEventListener("resize", draw)
  }, [])

  const binHit = (x: number, y: number): DebrisBin | null => {
    const { w, h } = sizeRef.current
    const by = h * 0.76
    if (y < by || y > h - 8) return null
    const idx = Math.floor((x / w) * 3)
    return BINS[Math.max(0, Math.min(2, idx))]?.id ?? null
  }

  return (
    <GameViewport>
      <div className="absolute inset-0 select-none">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="rounded-xl border border-teal-500/30 bg-[rgba(11,18,32,0.85)] px-3 py-2 text-center backdrop-blur-sm">
            <p className="text-sm font-bold text-teal-300">Cool-down · Clear the debris</p>
            <p className="text-xs text-zinc-400">
              Drag each piece into the matching bin · {Math.ceil(timeLeft / 1000)}s ·{" "}
              {remaining} left
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onMuteToggle}
          className="absolute right-3 top-20 z-20 flex h-11 w-11 items-center justify-center rounded-xl border border-teal-500/30 bg-[rgba(11,18,32,0.85)] text-base"
          aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
        >
          {soundEnabled ? "🔊" : "🔇"}
        </button>

        {/* Illustrated debris pieces */}
        {fragments.map((f) =>
          f.placed ? null : (
            <button
              key={f.id}
              type="button"
              aria-label={`${f.def.label}. Sort into ${f.def.bin}.`}
              className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 touch-none rounded-xl border border-white/10 bg-[rgba(11,18,32,0.55)] p-1 shadow-lg backdrop-blur-[2px] transition-shadow ${
                dragging === f.id ? "z-30 scale-110 shadow-teal-500/30" : ""
              }`}
              style={{
                left:
                  dragging === f.id && dragPos ? dragPos.x : `${f.x * 100}%`,
                top:
                  dragging === f.id && dragPos ? dragPos.y : `${f.y * 100}%`,
                width: f.def.w + 8,
                height: f.def.h + 8,
                transform:
                  dragging === f.id
                    ? "translate(-50%, -50%) scale(1.12)"
                    : `translate(-50%, -50%) rotate(${f.rot}rad)`,
              }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
                setDragging(f.id)
                const rect = e.currentTarget.parentElement!.getBoundingClientRect()
                setDragPos({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                })
              }}
              onPointerMove={(e) => {
                if (dragging !== f.id) return
                const rect = e.currentTarget.parentElement!.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                setDragPos({ x, y })
                setHoverBin(binHit(x, y))
              }}
              onPointerUp={(e) => {
                if (dragging !== f.id || !dragPos) return
                const bin = binHit(dragPos.x, dragPos.y)
                if (bin === f.def.bin) {
                  setFragments((prev) =>
                    prev.map((p) => (p.id === f.id ? { ...p, placed: true } : p))
                  )
                  if (soundEnabled) playSound("success", 0.5)
                  triggerHaptic("tap", hapticsEnabled)
                } else if (bin) {
                  setIncorrect(true)
                  if (soundEnabled) playSound("warn", 0.4)
                  triggerHaptic("warn", hapticsEnabled)
                }
                setDragging(null)
                setDragPos(null)
                setHoverBin(null)
                try {
                  e.currentTarget.releasePointerCapture(e.pointerId)
                } catch {
                  /* ignore */
                }
              }}
            >
              <DebrisThumb
                kind={f.def.kind}
                width={f.def.w}
                height={f.def.h}
                highlight={dragging === f.id}
              />
            </button>
          )
        )}

        {/* Material bins with icons */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex gap-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {BINS.map((b) => {
            const active = hoverBin === b.id
            return (
              <div
                key={b.id}
                className={`flex h-[88px] flex-1 flex-col items-center justify-center rounded-2xl border-2 bg-black/55 px-1 transition-all ${
                  active ? "scale-[1.03] border-solid shadow-lg" : "border-dashed"
                }`}
                style={{
                  borderColor: b.color,
                  boxShadow: active ? `0 0 18px ${b.color}55` : undefined,
                }}
              >
                <BinIcon bin={b.id} color={b.color} />
                <div
                  className="mt-0.5 text-[11px] font-bold uppercase tracking-wide"
                  style={{ color: b.color }}
                >
                  {b.label}
                </div>
                <div className="text-[9px] text-zinc-500">{b.hint}</div>
                {placedCounts[b.id] > 0 && (
                  <div className="text-[9px] font-semibold text-zinc-300">
                    ×{placedCounts[b.id]}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {canSkip && (
          <button
            type="button"
            className="absolute bottom-[108px] left-1/2 z-20 -translate-x-1/2 rounded-xl border border-zinc-600 bg-black/60 px-4 py-2 text-xs font-semibold text-zinc-300"
            onClick={() => finish(true)}
          >
            Skip cool-down
          </button>
        )}
      </div>
    </GameViewport>
  )
}
