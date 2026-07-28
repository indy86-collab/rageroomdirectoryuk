"use client"

/**
 * Optional privacy-safe feedback for Public Validation.
 * Uses mailto — no new backend. Does not ask about anger causes or mental health.
 */

const FEEDBACK_EMAIL = "ukrageroom@gmail.com"

const SUBJECT = "Rage Reset feedback"

const BODY = `Rage Reset feedback (optional)

Please do not include private, medical, relationship, or other sensitive details.

1. What worked well?


2. What felt confusing or frustrating?


3. Would you play again? (Yes / Maybe / No)


Optional ratings (1–5):
- Smashing satisfaction:
- Controlled-strike clarity:
- Cool-down enjoyment:
- Likelihood to replay:
`

function feedbackMailto(): string {
  return `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`
}

export function FeedbackPrompt({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-zinc-800 bg-dark-800/80 p-4 ${className}`}>
      <p className="text-sm font-semibold text-white">Give feedback</p>
      <p className="mt-1 text-xs leading-relaxed text-zinc-400">
        Optional and short. Tell us what worked, what felt confusing, and whether you would play
        again. Please do not submit private or sensitive information.
      </p>
      <a
        href={feedbackMailto()}
        className="btn-secondary mt-3 flex min-h-[44px] w-full items-center justify-center rounded-xl text-sm"
      >
        Give feedback
      </a>
    </div>
  )
}
