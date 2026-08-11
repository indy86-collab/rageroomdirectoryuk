import { WORKFLOW_STEPS } from "@/lib/corporate-booking-system"

export default function WorkflowStrip({
  activeIndex = -1,
}: {
  activeIndex?: number
}) {
  return (
    <div className="overflow-x-auto pb-1">
      <ol className="flex min-w-max items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 sm:text-xs">
        {WORKFLOW_STEPS.map((step, index) => (
          <li key={step.id} className="flex items-center gap-1">
            <span
              className={
                index === activeIndex
                  ? "rounded bg-rage-500/20 px-2 py-1 text-rage-400"
                  : "px-2 py-1"
              }
            >
              {step.label}
            </span>
            {index < WORKFLOW_STEPS.length - 1 && (
              <span className="text-zinc-700" aria-hidden>
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
