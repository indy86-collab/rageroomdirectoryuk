"use client"

const SAFETY_COPY =
  "Pause before acting. Step away from the situation if you can. If you may hurt yourself or someone else, stop using the game and contact emergency services or someone you trust."

export function SafetyMessage({
  onContinue,
}: {
  onContinue: () => void
}) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="safety-title"
      aria-describedby="safety-body"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-4"
    >
      <div className="w-full max-w-md rounded-2xl border border-rage-500/40 bg-dark-800 p-5 shadow-rage-lg">
        <h2 id="safety-title" className="font-display text-2xl tracking-wide text-rage-400">
          Take a moment
        </h2>
        <p id="safety-body" className="mt-3 text-sm leading-relaxed text-zinc-200">
          {SAFETY_COPY}
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="btn-rage mt-5 w-full min-h-[48px] rounded-xl"
        >
          I understand — continue
        </button>
      </div>
    </div>
  )
}

export { SAFETY_COPY }
