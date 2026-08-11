"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import {
  BUILDER_STEPS,
  createEmptyCorporateEvent,
  defaultSchedule,
  loadCorporateEvent,
  saveCorporateEvent,
  touchUpdatedAt,
  type BuilderStepId,
  type CorporateEvent,
} from "@/lib/corporate-event-builder"
import {
  trackCorporateBuilderApprovalGenerated,
  trackCorporateBuilderBudgetCompleted,
  trackCorporateBuilderExport,
  trackCorporateBuilderInvitationGenerated,
  trackCorporateBuilderPlanCompleted,
  trackCorporateBuilderStarted,
  trackCorporateBuilderVenueAdded,
} from "@/lib/analytics"
import EventSummaryCard from "./EventSummaryCard"
import StepApproval from "./StepApproval"
import StepBudget from "./StepBudget"
import StepEvent from "./StepEvent"
import StepInvite from "./StepInvite"
import StepPlan from "./StepPlan"
import StepVenues from "./StepVenues"

type CorporateEventBuilderProps = {
  sessionId: string
  productName: string
}

export default function CorporateEventBuilder({
  sessionId,
  productName,
}: CorporateEventBuilderProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [event, setEvent] = useState<CorporateEvent>(() =>
    createEmptyCorporateEvent(sessionId)
  )
  const [hydrated, setHydrated] = useState(false)
  const [, startTransition] = useTransition()
  const startedTracked = useRef(false)
  const budgetTracked = useRef(false)

  useEffect(() => {
    const saved = loadCorporateEvent(sessionId)
    if (saved) {
      setEvent(saved)
    } else {
      setEvent(createEmptyCorporateEvent(sessionId))
    }
    setHydrated(true)
    if (!startedTracked.current) {
      startedTracked.current = true
      trackCorporateBuilderStarted()
    }
  }, [sessionId])

  useEffect(() => {
    if (!hydrated) return
    saveCorporateEvent(event)
  }, [event, hydrated])

  function patchEvent(patch: Partial<CorporateEvent>) {
    startTransition(() => {
      setEvent((prev) => {
        const next = touchUpdatedAt({ ...prev, ...patch })
        if (
          patch.startTime &&
          patch.startTime !== prev.startTime &&
          !patch.schedule
        ) {
          next.schedule = defaultSchedule(patch.startTime)
        }
        return next
      })
    })
  }

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(BUILDER_STEPS.length - 1, index))
    if (BUILDER_STEPS[stepIndex]?.id === "budget" && clamped > stepIndex) {
      if (!budgetTracked.current) {
        budgetTracked.current = true
        trackCorporateBuilderBudgetCompleted()
      }
    }
    setStepIndex(clamped)
  }

  const step = BUILDER_STEPS[stepIndex]
  const stepId = step.id as BuilderStepId

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-rage-500">
          {productName}
        </p>
        <h1 className="mt-2 text-3xl font-black uppercase tracking-wide text-white sm:text-4xl">
          Build your team event
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
          Progress saves in this browser for your purchase. You can move between
          steps without losing data.
        </p>
      </header>

      <nav aria-label="Builder steps" className="mb-6">
        <ol className="flex gap-2 overflow-x-auto pb-1">
          {BUILDER_STEPS.map((item, index) => {
            const active = index === stepIndex
            const done = index < stepIndex
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  className={`inline-flex min-h-[40px] whitespace-nowrap rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-wide sm:text-sm ${
                    active
                      ? "border-rage-500 bg-rage-500/15 text-white"
                      : done
                        ? "border-zinc-600 text-zinc-200"
                        : "border-zinc-800 text-zinc-500"
                  }`}
                >
                  <span className="mr-1.5 text-rage-500">{index + 1}.</span>
                  {item.label}
                </button>
              </li>
            )
          })}
        </ol>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full bg-rage-500 transition-all"
            style={{
              width: `${((stepIndex + 1) / BUILDER_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div>
          {!hydrated ? (
            <p className="text-sm text-zinc-500">Loading your event plan…</p>
          ) : (
            <>
              {stepId === "event" && (
                <StepEvent event={event} onChange={patchEvent} />
              )}
              {stepId === "budget" && (
                <StepBudget event={event} onChange={patchEvent} />
              )}
              {stepId === "venues" && (
                <StepVenues
                  event={event}
                  sessionId={sessionId}
                  onChange={patchEvent}
                  onVenueAdded={() => trackCorporateBuilderVenueAdded()}
                />
              )}
              {stepId === "approval" && (
                <StepApproval
                  event={event}
                  onGenerated={() => trackCorporateBuilderApprovalGenerated()}
                />
              )}
              {stepId === "invite" && (
                <StepInvite
                  event={event}
                  onChange={patchEvent}
                  onGenerated={() =>
                    trackCorporateBuilderInvitationGenerated()
                  }
                />
              )}
              {stepId === "plan" && (
                <StepPlan
                  event={event}
                  onChange={patchEvent}
                  onExport={() => trackCorporateBuilderExport()}
                  onPlanCompleted={() => trackCorporateBuilderPlanCompleted()}
                />
              )}
            </>
          )}

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => goTo(stepIndex - 1)}
              className="inline-flex min-h-[44px] items-center rounded-md border border-zinc-700 px-4 text-sm font-semibold text-zinc-100 disabled:opacity-40"
            >
              Back
            </button>
            {stepIndex < BUILDER_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => goTo(stepIndex + 1)}
                className="btn-rage inline-flex min-h-[44px] items-center px-4 text-sm"
              >
                Continue to {BUILDER_STEPS[stepIndex + 1].label}
              </button>
            ) : (
              <p className="text-sm text-zinc-500">
                Plan saved in this browser. Bookmark this page with your order
                link to return later.
              </p>
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <EventSummaryCard event={event} />
        </div>
      </div>
    </div>
  )
}
