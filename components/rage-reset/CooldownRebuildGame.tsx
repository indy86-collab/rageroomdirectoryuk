"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { getSessionDurations } from "@/lib/rage-reset/sessionTiming"
import { playSound } from "@/lib/rage-reset/audio"
import { triggerHaptic } from "@/lib/rage-reset/haptics"

type PieceId = "printer" | "laptop" | "sign" | "cabinet"

interface Piece {
  id: PieceId
  label: string
  x: number
  y: number
  placed: boolean
  targetX: number
  targetY: number
}

const PIECES: Omit<Piece, "x" | "y" | "placed">[] = [
  { id: "printer", label: "Printer", targetX: 20, targetY: 28 },
  { id: "laptop", label: "Laptop", targetX: 55, targetY: 30 },
  { id: "sign", label: "Sign", targetX: 35, targetY: 58 },
  { id: "cabinet", label: "Cabinet", targetX: 68, targetY: 55 },
]

function createPieces(count: number): Piece[] {
  return PIECES.slice(0, Math.max(1, Math.min(count, PIECES.length))).map((p, i) => ({
    ...p,
    x: 10 + (i % 2) * 40 + Math.random() * 8,
    y: 72 + Math.floor(i / 2) * 12,
    placed: false,
  }))
}

/**
 * Rebuild the Room — second cool-down prototype (feature-flagged).
 * Drag fragments into silhouettes; forgiving snap distance.
 */
export function CooldownRebuildGame({
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
  const pieceCount = durations.e2e ? 2 : 4
  const [pieces, setPieces] = useState(() => createPieces(pieceCount))
  const [timeLeft, setTimeLeft] = useState(durations.e2e ? 8_000 : 40_000)
  const [draggingId, setDraggingId] = useState<PieceId | null>(null)
  const completedRef = useRef(false)
  const incorrectRef = useRef(0)
  const areaRef = useRef<HTMLDivElement>(null)
  const durationMs = durations.e2e ? 8_000 : 40_000

  const remaining = useMemo(() => pieces.filter((p) => !p.placed).length, [pieces])
  const orderliness = 1 - remaining / pieces.length

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
      if (orderliness >= 1) bonus += 5
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

  const onPointerDown = (id: PieceId, e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDraggingId(id)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingId) return
    const { x, y } = toPercent(e.clientX, e.clientY)
    setPieces((prev) =>
      prev.map((p) => (p.id === draggingId && !p.placed ? { ...p, x, y } : p))
    )
  }

  const onPointerUp = () => {
    if (!draggingId) return
    setPieces((prev) => {
      const piece = prev.find((p) => p.id === draggingId)
      if (!piece || piece.placed) return prev
      const dx = piece.x - piece.targetX
      const dy = piece.y - piece.targetY
      const dist = Math.hypot(dx, dy)
      // Forgiving snap (~18% of playfield)
      if (dist < 18) {
        if (soundEnabled) playSound("success", 0.5)
        triggerHaptic("tap", hapticsEnabled)
        return prev.map((p) =>
          p.id === draggingId
            ? { ...p, placed: true, x: p.targetX, y: p.targetY }
            : p
        )
      }
      incorrectRef.current += 1
      if (soundEnabled) playSound("warn", 0.35)
      return prev
    })
    setDraggingId(null)
  }

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-dark-950 select-none">
      <div className="px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-start justify-between gap-2">
          <div className="rounded-xl bg-black/55 px-3 py-2 backdrop-blur-sm">
            <div className="font-display text-2xl text-white">{Math.ceil(timeLeft / 1000)}s</div>
            <div className="text-xs text-zinc-300">Rebuild the room</div>
          </div>
          <button
            type="button"
            onClick={onMuteToggle}
            className="min-h-[44px] rounded-xl border border-zinc-700 bg-black/60 px-3 text-xs font-semibold"
          >
            {soundEnabled ? "Sound on" : "Sound off"}
          </button>
        </div>
        <h2 className="mt-3 font-display text-3xl text-white">Rebuild the Room</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Drag fragments onto matching silhouettes. Precision is forgiving.
        </p>
      </div>

      <div
        ref={areaRef}
        className="relative mx-3 mt-4 min-h-0 flex-1 overflow-hidden rounded-2xl border border-zinc-800"
        style={{
          background: `linear-gradient(180deg, rgba(24,24,27,${0.95 - orderliness * 0.35}) 0%, rgba(10,10,10,1) 100%)`,
        }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Silhouettes */}
        {pieces.map((p) => (
          <div
            key={`sil-${p.id}`}
            className="pointer-events-none absolute rounded-xl border-2 border-dashed border-zinc-600/70"
            style={{
              left: `${p.targetX}%`,
              top: `${p.targetY}%`,
              width: "22%",
              height: "18%",
              transform: "translate(-50%, -50%)",
              opacity: p.placed ? 0.15 : 0.55,
            }}
            aria-hidden
          />
        ))}

        {pieces.map((p) =>
          p.placed ? (
            <div
              key={p.id}
              className="absolute flex items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-950/50 text-xs font-semibold text-emerald-200"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: "22%",
                height: "18%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {p.label}
            </div>
          ) : (
            <button
              key={p.id}
              type="button"
              className="absolute flex touch-none items-center justify-center rounded-xl border border-rage-500/50 bg-rage-950/80 text-xs font-semibold text-white"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: "22%",
                height: "18%",
                transform: "translate(-50%, -50%)",
                zIndex: draggingId === p.id ? 5 : 2,
              }}
              aria-label={`${p.label} fragment`}
              onPointerDown={(e) => onPointerDown(p.id, e)}
            >
              {p.label}
            </button>
          )
        )}
      </div>

      <div className="px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        {canSkip && (
          <button
            type="button"
            className="btn-secondary w-full min-h-[44px] rounded-xl text-sm"
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
    </div>
  )
}
