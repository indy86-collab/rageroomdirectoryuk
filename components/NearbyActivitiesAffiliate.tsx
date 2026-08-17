"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  MapPin,
  RotateCcw,
  Sparkles,
} from "lucide-react"
import {
  trackAffiliateClick,
  trackAffiliateOfferView,
  trackAffiliatePlannerAnswer,
  trackAffiliatePlannerComplete,
  trackAffiliatePlannerStart,
} from "@/lib/analytics"
import {
  buildGetYourGuideUrl,
  getActivityRecommendations,
  PLANNER_GROUPS,
  PLANNER_LABELS,
  PLANNER_TIMINGS,
  PLANNER_VIBES,
  type PlannerGroup,
  type PlannerTiming,
  type PlannerVibe,
} from "@/lib/getyourguide"

type NearbyActivitiesAffiliateProps = {
  city: string
  placement: "listing" | "city"
  listingSlug?: string
  venueName?: string
}

type PlannerStep = "intro" | "group" | "vibe" | "timing" | "results"

type SavedPlan = {
  group: PlannerGroup
  vibe: PlannerVibe
  timing: PlannerTiming
}

const STORAGE_KEY = "rageroom:activity-planner:v1"

function isSavedPlan(value: unknown): value is SavedPlan {
  if (!value || typeof value !== "object") return false
  const plan = value as Partial<SavedPlan>
  return (
    PLANNER_GROUPS.some((group) => group === plan.group) &&
    PLANNER_VIBES.some((vibe) => vibe === plan.vibe) &&
    PLANNER_TIMINGS.some((timing) => timing === plan.timing)
  )
}

export default function NearbyActivitiesAffiliate({
  city,
  placement,
  listingSlug,
  venueName,
}: NearbyActivitiesAffiliateProps) {
  const containerRef = useRef<HTMLElement>(null)
  const hasTrackedView = useRef(false)
  const [step, setStep] = useState<PlannerStep>("intro")
  const [group, setGroup] = useState<PlannerGroup | null>(null)
  const [vibe, setVibe] = useState<PlannerVibe | null>(null)
  const [timing, setTiming] = useState<PlannerTiming | null>(null)
  const provider = "getyourguide"

  const baseAnalytics = {
    provider,
    placement,
    city,
    listingSlug,
  }

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY)
      if (!stored) return
      const saved: unknown = JSON.parse(stored)
      if (!isSavedPlan(saved)) return

      setGroup(saved.group)
      setVibe(saved.vibe)
      setTiming(saved.timing)
    } catch {
      // Safari private browsing or malformed storage must not block the planner.
    }
  }, [])

  useEffect(() => {
    const element = containerRef.current
    if (!element || hasTrackedView.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasTrackedView.current) return

        hasTrackedView.current = true
        trackAffiliateOfferView(baseAnalytics)
        observer.disconnect()
      },
      { threshold: 0.25 }
    )

    observer.observe(element)
    return () => observer.disconnect()
    // The page context is stable for the lifetime of this mounted component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, listingSlug, placement])

  const planComplete = group !== null && vibe !== null && timing !== null
  const recommendations = planComplete
    ? getActivityRecommendations({ group, vibe, timing })
    : []

  function startPlanner() {
    trackAffiliatePlannerStart(baseAnalytics)
    setStep(planComplete ? "results" : "group")
  }

  function chooseGroup(choice: PlannerGroup) {
    setGroup(choice)
    trackAffiliatePlannerAnswer({
      ...baseAnalytics,
      step: "group",
      choice,
      plannerGroup: choice,
    })
    setStep("vibe")
  }

  function chooseVibe(choice: PlannerVibe) {
    setVibe(choice)
    trackAffiliatePlannerAnswer({
      ...baseAnalytics,
      step: "vibe",
      choice,
      ...(group ? { plannerGroup: group } : {}),
      plannerVibe: choice,
    })
    setStep("timing")
  }

  function chooseTiming(choice: PlannerTiming) {
    if (!group || !vibe) return

    const completedPlan: SavedPlan = { group, vibe, timing: choice }
    setTiming(choice)
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(completedPlan))
    } catch {
      // The plan still works when browser storage is unavailable.
    }

    trackAffiliatePlannerAnswer({
      ...baseAnalytics,
      step: "timing",
      choice,
      plannerGroup: group,
      plannerVibe: vibe,
      plannerTiming: choice,
    })
    trackAffiliatePlannerComplete({
      ...baseAnalytics,
      plannerGroup: group,
      plannerVibe: vibe,
      plannerTiming: choice,
    })
    setStep("results")
  }

  function resetPlanner() {
    setGroup(null)
    setVibe(null)
    setTiming(null)
    try {
      window.sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore unavailable browser storage.
    }
    setStep("group")
  }

  function goBack() {
    if (step === "vibe") setStep("group")
    if (step === "timing") setStep("vibe")
  }

  const venueLabel = venueName || "your rage room"
  const suggestedOrder =
    timing === "before"
      ? `Suggested order: activity → ${venueLabel}`
      : timing === "after"
        ? `Suggested order: ${venueLabel} → activity`
        : `Suggested order: activity → ${venueLabel} → evening experience`

  return (
    <section
      ref={containerRef}
      aria-labelledby={`nearby-activities-${placement}`}
      className="relative overflow-hidden rounded-lg border border-orange-500/30 bg-gradient-to-br from-[#21160f] via-[#181818] to-[#181818] p-4 sm:p-6"
    >
      <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl" />

      <div className="relative">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-400">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          Personalised day planner
        </div>
        <h2
          id={`nearby-activities-${placement}`}
          className="text-xl font-bold text-white sm:text-2xl"
        >
          Build your smash day in {city}
        </h2>

        {step === "intro" && (
          <div className="mt-3 max-w-3xl">
            <p className="text-sm leading-6 text-zinc-300 sm:text-base">
              Tell us who is coming, the mood you want and when you have time.
              We&apos;ll create three activity ideas to fit around your rage room
              visit.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={startPlanner}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-orange-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-[#181818]"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {planComplete ? "Show my saved plan" : "Plan my day"}
              </button>
              <a
                href={buildGetYourGuideUrl(city)}
                target="_blank"
                rel="sponsored noopener noreferrer"
                onClick={() =>
                  trackAffiliateClick({
                    ...baseAnalytics,
                    recommendationId: "browse_all",
                  })
                }
                className="inline-flex min-h-[44px] items-center justify-center gap-1 px-2 text-sm font-semibold text-zinc-300 underline decoration-zinc-600 underline-offset-4 hover:text-orange-400"
              >
                Skip and browse everything
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}

        {(step === "group" || step === "vibe" || step === "timing") && (
          <div className="mt-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                Step {step === "group" ? "1" : step === "vibe" ? "2" : "3"}
                {" of 3"}
              </p>
              {step !== "group" && (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex min-h-[44px] items-center gap-1 px-2 text-sm text-zinc-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back
                </button>
              )}
            </div>

            {step === "group" && (
              <PlannerQuestion
                question="Who are you going with?"
                options={PLANNER_GROUPS.map((value) => ({
                  value,
                  label: PLANNER_LABELS.groups[value],
                }))}
                selected={group}
                onChoose={(value) => chooseGroup(value as PlannerGroup)}
              />
            )}
            {step === "vibe" && (
              <PlannerQuestion
                question="What kind of day do you want?"
                options={PLANNER_VIBES.map((value) => ({
                  value,
                  label: PLANNER_LABELS.vibes[value],
                }))}
                selected={vibe}
                onChoose={(value) => chooseVibe(value as PlannerVibe)}
              />
            )}
            {step === "timing" && (
              <PlannerQuestion
                question="When should the extra activity happen?"
                options={PLANNER_TIMINGS.map((value) => ({
                  value,
                  label: PLANNER_LABELS.timings[value],
                }))}
                selected={timing}
                onChoose={(value) => chooseTiming(value as PlannerTiming)}
              />
            )}
          </div>
        )}

        {step === "results" && planComplete && (
          <div className="mt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  {[
                    PLANNER_LABELS.groups[group],
                    PLANNER_LABELS.vibes[vibe],
                    PLANNER_LABELS.timings[timing],
                  ].map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-300"
                    >
                      <Check className="h-3 w-3" aria-hidden="true" />
                      {label}
                    </span>
                  ))}
                </div>
                <h3 className="mt-3 text-lg font-bold text-white sm:text-xl">
                  Your personalised {city} picks
                </h3>
                <p className="mt-1 text-sm text-zinc-400">{suggestedOrder}</p>
              </div>
              <button
                type="button"
                onClick={resetPlanner}
                className="inline-flex min-h-[44px] items-center gap-1 self-start px-2 text-sm text-zinc-400 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Change answers
              </button>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              {recommendations.map((recommendation) => (
                <article
                  key={recommendation.id}
                  className="flex h-full flex-col rounded-lg border border-zinc-700 bg-black/20 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                    {recommendation.eyebrow}
                  </p>
                  <h4 className="mt-2 font-bold text-white">
                    {recommendation.title}
                  </h4>
                  <p className="mt-2 flex-1 text-sm leading-6 text-zinc-400">
                    {recommendation.description}
                  </p>
                  <a
                    href={buildGetYourGuideUrl(city, recommendation.query)}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    onClick={() =>
                      trackAffiliateClick({
                        ...baseAnalytics,
                        recommendationId: recommendation.id,
                        plannerGroup: group,
                        plannerVibe: vibe,
                        plannerTiming: timing,
                      })
                    }
                    className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    See activities
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="relative mt-5 border-t border-zinc-700/70 pt-3 text-xs leading-5 text-zinc-500">
        Affiliate links: if you make a booking, RageRoom Directory may earn a
        commission at no extra cost to you. Recommendations are based on your
        answers; availability and prices are set by GetYourGuide and its
        activity providers.
      </p>
    </section>
  )
}

function PlannerQuestion({
  question,
  options,
  selected,
  onChoose,
}: {
  question: string
  options: Array<{ value: string; label: string }>
  selected: string | null
  onChoose: (value: string) => void
}) {
  return (
    <fieldset>
      <legend className="text-lg font-bold text-white sm:text-xl">
        {question}
      </legend>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => {
          const isSelected = selected === option.value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChoose(option.value)}
              className={`min-h-[52px] rounded-md border px-4 py-3 text-left text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                isSelected
                  ? "border-orange-500 bg-orange-500/15 text-orange-300"
                  : "border-zinc-700 bg-black/20 text-white hover:border-orange-500/60 hover:bg-orange-500/10"
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
