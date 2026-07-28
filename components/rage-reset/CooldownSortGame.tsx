"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { COOLDOWN_DURATION_MS } from "@/lib/rage-reset/types"
import { getSessionDurations } from "@/lib/rage-reset/sessionTiming"
import { playSound } from "@/lib/rage-reset/audio"
import { triggerHaptic } from "@/lib/rage-reset/haptics"

type FragColor = "ember" | "slate" | "mint"

interface Fragment {
  id: string
  color: FragColor
  x: number
  y: number
  placed: boolean
  wrongFlash: number
}

const COLORS: { id: FragColor; label: string; fill: string; bin: string }[] = [
  { id: "ember", label: "Ember shards", fill: "#F97316", bin: "#7C2D12" },
  { id: "slate", label: "Slate shards", fill: "#94A3B8", bin: "#334155" },
  { id: "mint", label: "Mint shards", fill: "#34D399", bin: "#064E3B" },
]

function createFragments(count: number): Fragment[] {
  const list: Fragment[] = []
  let n = 0
  const perColor = Math.max(1, Math.ceil(count / COLORS.length))
  for (const c of COLORS) {
    for (let i = 0; i < perColor && list.length < count; i += 1) {
      list.push({
        id: `${c.id}-${i}`,
        color: c.id,
        x: 24 + (n % 4) * 22 + Math.random() * 8,
        y: 18 + Math.floor(n / 4) * 14 + Math.random() * 6,
        placed: false,
        wrongFlash: 0,
      })
      n += 1
    }
  }
  return list
}

export function CooldownSortGame({
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
    calmEnergyBonus: number
    hadIncorrect: boolean
  }) => void
  onMuteToggle: () => void
}) {
  const durations = getSessionDurations()
  const fragmentCount = durations.cooldownFragmentCount
  const durationMs = durations.cooldownMs || COOLDOWN_DURATION_MS
  const [fragments, setFragments] = useState(() => createFragments(fragmentCount))
  const [timeLeft, setTimeLeft] = useState(durationMs)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const completedRef = useRef(false)
  const incorrectRef = useRef(0)
  const steadyRef = useRef(true)
  const dragOrigin = useRef<{ id: string; x: number; y: number } | null>(null)
  const binRefs = useRef<Record<FragColor, HTMLDivElement | null>>({
    ember: null,
    slate: null,
    mint: null,
  })
  const areaRef = useRef<HTMLDivElement>(null)
  const franticRef = useRef(0)

  const remaining = useMemo(() => fragments.filter((f) => !f.placed).length, [fragments])

  useEffect(() => {
    const started = performance.now()
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return
      const left = Math.max(0, durationMs - (performance.now() - started))
      setTimeLeft(left)
      if (left <= 0 && !completedRef.current) {
        completedRef.current = true
        finish(false)
      }
    }, 100)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMs])

  useEffect(() => {
    if (remaining === 0 && !completedRef.current) {
      completedRef.current = true
      finish(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining])

  const finish = (skipped: boolean) => {
    const hadIncorrect = incorrectRef.current > 0
    let bonus = 0
    if (!skipped) {
      bonus += 20
      if (!hadIncorrect) bonus += 10
      if (steadyRef.current) bonus += 5
    }
    onComplete({ skipped, calmEnergyBonus: bonus, hadIncorrect })
  }

  const toPercent = (clientX: number, clientY: number) => {
    const area = areaRef.current
    if (!area) return { x: 50, y: 40 }
    const rect = area.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    }
  }

  const onPointerDown = (e: React.PointerEvent, id: string) => {
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    const frag = fragments.find((f) => f.id === id)
    if (!frag || frag.placed) return
    setDraggingId(id)
    dragOrigin.current = { id, x: frag.x, y: frag.y }
    franticRef.current += 1
    if (franticRef.current > 18) {
      steadyRef.current = false
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingId) return
    e.preventDefault()
    const { x, y } = toPercent(e.clientX, e.clientY)
    setFragments((prev) =>
      prev.map((f) => (f.id === draggingId ? { ...f, x, y } : f))
    )
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!draggingId) return
    e.preventDefault()
    const { x, y } = toPercent(e.clientX, e.clientY)
    const frag = fragments.find((f) => f.id === draggingId)
    setDraggingId(null)

    if (!frag) return

    let dropped: FragColor | null = null
    for (const c of COLORS) {
      const el = binRefs.current[c.id]
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (
        e.clientX >= rect.left - 12 &&
        e.clientX <= rect.right + 12 &&
        e.clientY >= rect.top - 12 &&
        e.clientY <= rect.bottom + 12
      ) {
        dropped = c.id
        break
      }
    }

    if (!dropped) {
      setFragments((prev) =>
        prev.map((f) =>
          f.id === frag.id
            ? { ...f, x: dragOrigin.current?.x ?? f.x, y: dragOrigin.current?.y ?? f.y }
            : f
        )
      )
      return
    }

    if (dropped === frag.color) {
      setFragments((prev) =>
        prev.map((f) => (f.id === frag.id ? { ...f, placed: true, x, y } : f))
      )
      if (soundEnabled) playSound("cooldown", 0.7)
      triggerHaptic("success", hapticsEnabled)
    } else {
      incorrectRef.current += 1
      steadyRef.current = false
      setFragments((prev) =>
        prev.map((f) =>
          f.id === frag.id
            ? {
                ...f,
                x: dragOrigin.current?.x ?? f.x,
                y: dragOrigin.current?.y ?? f.y,
                wrongFlash: 1,
              }
            : f
        )
      )
      if (soundEnabled) playSound("warn", 0.45)
      triggerHaptic("warn", hapticsEnabled)
      window.setTimeout(() => {
        setFragments((prev) =>
          prev.map((f) => (f.id === frag.id ? { ...f, wrongFlash: 0 } : f))
        )
      }, 250)
    }
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col touch-none overflow-hidden bg-dark-950 select-none">
      <div className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-display text-3xl text-white">Sort the fragments</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Drag shards into matching containers. Slow and steady.
            </p>
          </div>
          <div className="rounded-xl bg-dark-800 px-3 py-2 text-right">
            <div className="font-display text-2xl text-white">{Math.ceil(timeLeft / 1000)}s</div>
            <div className="text-xs text-zinc-400">{remaining} left</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onMuteToggle}
          className="mt-3 min-h-[40px] rounded-lg border border-zinc-700 px-3 text-xs font-semibold"
        >
          {soundEnabled ? "Sound on" : "Sound off"}
        </button>
      </div>

      <div
        ref={areaRef}
        className="relative mx-3 mt-4 min-h-0 flex-1 rounded-2xl border border-zinc-800 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.08),_transparent_45%),#111]"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {fragments
          .filter((f) => !f.placed)
          .map((f) => {
            const color = COLORS.find((c) => c.id === f.color)!
            return (
              <button
                key={f.id}
                type="button"
                aria-label={`${color.label} fragment`}
                className={`absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 shadow-md ${
                  f.wrongFlash ? "border-red-400" : "border-white/20"
                } ${draggingId === f.id ? "z-20 scale-110" : "z-10"}`}
                style={{
                  left: `${f.x}%`,
                  top: `${f.y}%`,
                  backgroundColor: color.fill,
                }}
                onPointerDown={(e) => onPointerDown(e, f.id)}
              />
            )
          })}
      </div>

      <div className="grid grid-cols-3 gap-2 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {COLORS.map((c) => (
          <div
            key={c.id}
            ref={(el) => {
              binRefs.current[c.id] = el
            }}
            className="flex min-h-[88px] flex-col items-center justify-center rounded-2xl border-2 border-dashed px-2 text-center"
            style={{ borderColor: c.fill, backgroundColor: `${c.bin}CC` }}
          >
            <span className="text-xs font-semibold text-white">{c.label}</span>
            <span className="mt-1 text-[10px] text-zinc-300">
              {fragments.filter((f) => f.placed && f.color === c.id).length}/
              {Math.max(1, fragments.filter((f) => f.color === c.id).length)}
            </span>
          </div>
        ))}
      </div>

      {canSkip && (
        <button
          type="button"
          className="mx-auto mb-3 text-xs text-zinc-500 underline-offset-2 hover:underline"
          onClick={() => {
            if (completedRef.current) return
            completedRef.current = true
            finish(true)
          }}
        >
          Skip cool-down
        </button>
      )}
    </div>
  )
}
