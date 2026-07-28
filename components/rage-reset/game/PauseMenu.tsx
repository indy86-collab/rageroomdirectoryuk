"use client"

export function PauseMenu({
  onResume,
  soundEnabled,
  onMuteToggle,
}: {
  onResume: () => void
  soundEnabled: boolean
  onMuteToggle: () => void
}) {
  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
    >
      <div className="w-full max-w-xs rounded-2xl border border-teal-500/30 bg-[rgba(11,18,32,0.95)] p-6 shadow-2xl">
        <h2 id="pause-title" className="font-display text-2xl text-teal-300">
          Paused
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Take a breath. The room will wait.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onResume}
            className="min-h-[48px] rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 font-bold text-white"
          >
            Resume
          </button>
          <button
            type="button"
            onClick={onMuteToggle}
            className="min-h-[44px] rounded-xl border border-zinc-600 text-sm font-semibold text-zinc-200"
          >
            {soundEnabled ? "Mute sound" : "Unmute sound"}
          </button>
        </div>
      </div>
    </div>
  )
}
