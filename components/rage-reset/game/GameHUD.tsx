"use client"

/**
 * Cohesive in-game HUD — integrated panels, not browser chrome boxes.
 */

import type { HudSnapshot } from "@/lib/rage-reset/engine/types"

export function GameHUD({
  hud,
  soundEnabled,
  onMuteToggle,
  onPause,
  mode,
}: {
  hud: HudSnapshot
  soundEnabled: boolean
  onMuteToggle: () => void
  onPause?: () => void
  mode: "free-smash" | "boss" | "cooldown"
}) {
  const secs = Math.ceil(hud.timeLeftMs / 1000)
  const heatPct = Math.min(100, Math.max(0, hud.heat))
  const heatColor =
    heatPct >= 85 ? "bg-red-500" : heatPct >= 60 ? "bg-amber-400" : "bg-emerald-400"

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-2">
        <HudChip label="TIME" value={`${secs}s`} accent="teal" />
        <div className="min-w-0 flex-1 text-center">
          {mode === "boss" && hud.bossHpRatio != null ? (
            <div className="mx-auto max-w-[220px]">
              <div className="mb-1 text-[10px] font-bold tracking-wide text-teal-300/90">
                {hud.targetName || "BOSS"} · PHASE {hud.bossPhase ?? 1}
              </div>
              <div className="h-2.5 overflow-hidden rounded-full border border-teal-500/40 bg-black/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-teal-400 transition-[width] duration-150"
                  style={{ width: `${Math.max(0, hud.bossHpRatio) * 100}%` }}
                />
              </div>
            </div>
          ) : hud.targetName ? (
            <div className="mx-auto max-w-[200px]">
              <div className="truncate text-[10px] font-semibold text-zinc-300">
                {hud.targetName}
              </div>
              <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-black/50">
                <div
                  className="h-full bg-orange-400"
                  style={{ width: `${hud.targetHpRatio * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="font-display text-lg text-orange-400">{hud.score}</div>
          )}
        </div>
        <HudChip
          label="COMBO"
          value={hud.combo > 1 ? `x${hud.combo}` : "—"}
          accent="orange"
        />
      </div>

      {mode !== "cooldown" && (
        <div className="pointer-events-auto absolute right-3 top-20 flex flex-col gap-2">
          <IconButton
            label={soundEnabled ? "Mute sound" : "Unmute sound"}
            onClick={onMuteToggle}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </IconButton>
          {onPause && (
            <IconButton label="Pause" onClick={onPause}>
              ⏸
            </IconButton>
          )}
        </div>
      )}

      {/* Bottom heat / weapon */}
      {mode !== "cooldown" && (
        <div className="pointer-events-none">
          {hud.instruction && (
            <p
              className="mb-2 text-center text-xs font-semibold text-zinc-100"
              aria-live="polite"
            >
              {hud.instruction}
            </p>
          )}
          <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
            <span>Weapon heat</span>
            <span className={heatPct >= 85 ? "text-red-400" : ""}>{hud.heatLabel}</span>
          </div>
          <div
            className="h-3 overflow-hidden rounded-full border border-white/10 bg-black/55"
            role="meter"
            aria-valuenow={Math.round(heatPct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Weapon heat"
          >
            <div
              className={`h-full transition-[width] duration-100 ${heatColor}`}
              style={{ width: `${heatPct}%` }}
            />
          </div>
          {hud.charge > 0.05 && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/40">
              <div
                className={`h-full ${hud.inCalmZone ? "bg-teal-300" : "bg-orange-400/80"}`}
                style={{ width: `${hud.charge * 100}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function HudChip({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: "teal" | "orange"
}) {
  const border = accent === "teal" ? "border-teal-500/40" : "border-orange-500/40"
  const text = accent === "teal" ? "text-teal-300" : "text-orange-300"
  return (
    <div
      className={`min-w-[68px] rounded-xl border ${border} bg-[rgba(11,18,32,0.82)] px-2.5 py-1.5 shadow-lg backdrop-blur-sm`}
    >
      <div className={`font-display text-xl leading-none ${text}`}>{value}</div>
      <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
        {label}
      </div>
    </div>
  )
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-xl border border-teal-500/30 bg-[rgba(11,18,32,0.85)] text-base shadow-md backdrop-blur-sm"
    >
      {children}
    </button>
  )
}
