import { Check } from "lucide-react"
import {
  FIRST_TIMER_CHECKLIST_NOTE,
  FIRST_TIMER_CHECKLIST_SECTIONS,
  FIRST_TIMER_CHECKLIST_TAGLINE,
} from "@/lib/first-timer-checklist"

type FirstTimerChecklistPreviewProps = {
  className?: string
  /** Show full checklist (post-unlock) vs compact preview. */
  variant?: "preview" | "full"
}

export default function FirstTimerChecklistPreview({
  className = "",
  variant = "preview",
}: FirstTimerChecklistPreviewProps) {
  const sections =
    variant === "preview"
      ? FIRST_TIMER_CHECKLIST_SECTIONS.map((section) => ({
          ...section,
          items: section.items.slice(0, 4),
        }))
      : FIRST_TIMER_CHECKLIST_SECTIONS

  return (
    <div className={className}>
      <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
        {FIRST_TIMER_CHECKLIST_TAGLINE}
      </p>
      <p className="mt-2 text-xs text-zinc-500 sm:text-sm">{FIRST_TIMER_CHECKLIST_NOTE}</p>

      <div className="mt-6 space-y-5">
        {sections.map((section) => (
          <section
            key={section.id}
            className="rounded-lg border border-zinc-800 bg-[#141414] p-4 sm:p-5"
          >
            <h3 className="text-sm font-bold uppercase tracking-wide text-white sm:text-base">
              {section.title}
            </h3>
            {section.intro && (
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                {section.intro}
              </p>
            )}
            <ul className="mt-3 space-y-2">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-snug text-zinc-300"
                >
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-rage-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {variant === "preview" &&
              (FIRST_TIMER_CHECKLIST_SECTIONS.find((s) => s.id === section.id)
                ?.items.length ?? 0) > section.items.length && (
                <p className="mt-2 text-xs font-semibold text-zinc-500">
                  + more in the free download
                </p>
              )}
          </section>
        ))}
      </div>
    </div>
  )
}
