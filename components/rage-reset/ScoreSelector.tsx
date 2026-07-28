"use client"

const ANCHORS: Record<number, string> = {
  1: "Slightly annoyed",
  5: "Properly angry",
  10: "About to explode",
}

export function ScoreSelector({
  value,
  onChange,
  label,
  id = "fired-up-score",
}: {
  value: number
  onChange: (n: number) => void
  label: string
  id?: string
}) {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-end justify-between gap-3">
        <label htmlFor={id} className="font-display text-3xl tracking-wide text-white sm:text-4xl">
          {label}
        </label>
        <div className="text-right" aria-live="polite">
          <div className="font-display text-5xl leading-none text-rage-400">{value}</div>
          {ANCHORS[value] && (
            <div className="mt-1 text-xs text-zinc-400">{ANCHORS[value]}</div>
          )}
        </div>
      </div>

      <div
        id={id}
        role="slider"
        aria-valuemin={1}
        aria-valuemax={10}
        aria-valuenow={value}
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault()
            onChange(Math.min(10, value + 1))
          }
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault()
            onChange(Math.max(1, value - 1))
          }
        }}
        className="grid grid-cols-5 gap-2 sm:grid-cols-10"
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const selected = n === value
          return (
            <button
              key={n}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(n)}
              className={`min-h-[52px] rounded-xl border text-lg font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rage-400 ${
                selected
                  ? "border-rage-400 bg-gradient-rage text-white shadow-glow"
                  : "border-zinc-700 bg-dark-700 text-zinc-200 hover:border-rage-500/50"
              }`}
            >
              {n}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex justify-between text-[11px] text-zinc-500">
        <span>1 — Slightly annoyed</span>
        <span className="hidden sm:inline">5 — Properly angry</span>
        <span>10 — About to explode</span>
      </div>
    </div>
  )
}
