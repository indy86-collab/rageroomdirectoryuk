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
  AFFILIATE_CHIP_CITIES,
  buildAffiliateCampaign,
  buildGetYourGuideBrowseUrl,
  buildGetYourGuideUrl,
  getThemedActivityCards,
  PLANNER_GROUPS,
  PLANNER_LABELS,
  PLANNER_TIMINGS,
  PLANNER_VIBES,
  type AffiliatePlacement,
  type PlannerGroup,
  type PlannerTiming,
  type PlannerVibe,
} from "@/lib/getyourguide"

type NearbyActivitiesAffiliateProps = {
  city?: string
  placement: AffiliatePlacement
  listingSlug?: string
  venueName?: string
  occasionSlug?: string
  initialGroup?: PlannerGroup
  variant?: "full" | "chips"
  cities?: string[]
}

type PlannerStep = "idle" | "group" | "vibe" | "timing"

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
  occasionSlug,
  initialGroup,
  variant = "full",
  cities,
}: NearbyActivitiesAffiliateProps) {
  const containerRef = useRef<HTMLElement>(null)
  const hasTrackedView = useRef(false)
  const [step, setStep] = useState<PlannerStep>("idle")
  const [group, setGroup] = useState<PlannerGroup | null>(initialGroup ?? null)
  const [vibe, setVibe] = useState<PlannerVibe | null>(null)
  const [timing, setTiming] = useState<PlannerTiming | null>(null)
  const provider = "getyourguide"
  const chipCities = cities?.length ? cities : [...AFFILIATE_CHIP_CITIES]
  const analyticsCity = city || "UK"

  const baseAnalytics = {
    provider,
    placement,
    city: analyticsCity,
    listingSlug,
  }

  useEffect(() => {
    if (variant === "chips") return

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
  }, [variant])

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
  }, [city, listingSlug, placement, variant])

  const planComplete = group !== null && vibe !== null && timing !== null
  const plan = planComplete ? { group, vibe, timing } : undefined
  const placementCampaign = buildAffiliateCampaign({
    placement,
    occasionSlug,
  })
  const cardCampaign = buildAffiliateCampaign({
    placement,
    occasionSlug,
    personalised: planComplete,
  })
  const themedCards = getThemedActivityCards(plan)
  const headingId = `nearby-activities-${placement}`

  function startPlanner() {
    trackAffiliatePlannerStart(baseAnalytics)
    setStep(group ? "vibe" : "group")
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
    setStep("idle")
  }

  function resetPlanner() {
    setGroup(initialGroup ?? null)
    setVibe(null)
    setTiming(null)
    try {
      window.sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore unavailable browser storage.
    }
    setStep(initialGroup ? "vibe" : "group")
  }

  function goBack() {
    if (step === "vibe") setStep(initialGroup ? "idle" : "group")
    if (step === "timing") setStep("vibe")
  }

  function trackClick(recommendationId: string, clickCity = analyticsCity) {
    trackAffiliateClick({
      ...baseAnalytics,
      city: clickCity,
      recommendationId,
      ...(group ? { plannerGroup: group } : {}),
      ...(vibe ? { plannerVibe: vibe } : {}),
      ...(timing ? { plannerTiming: timing } : {}),
    })
  }

  const venueLabel = venueName || "your rage room"
  const suggestedOrder =
    timing === "before"
      ? `Suggested order: activity → ${venueLabel}`
      : timing === "after"
        ? `Suggested order: ${venueLabel} → activity`
        : planComplete
          ? `Suggested order: activity → ${venueLabel} → evening experience`
          : null

  return (
    <section
      ref={containerRef}
      aria-labelledby={headingId}
      className="relative overflow-hidden rounded-lg border border-orange-500/30 bg-gradient-to-br from-[#21160f] via-[#181818] to-[#181818] p-4 sm:p-6"
    >
      <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl" />

      <div className="relative">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-400">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          Add something around your smash
        </div>
        <h2
          id={headingId}
          className="text-xl font-bold text-white sm:text-2xl"
        >
          {variant === "chips" || !city
            ? "Build the rest of your smash day"
            : `Build the rest of your smash day in ${city}`}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
          {variant === "chips"
            ? "Rage rooms last about an hour. Pick a city to browse bookable tours, tastings and walks that fit around your session — availability and prices come from GetYourGuide."
            : "Rage rooms last about an hour. Browse bookable tours, tastings and city walks that fit around your session — availability and prices come from GetYourGuide."}
        </p>

        {variant === "chips" ? (
          <div className="mt-5 flex flex-wrap gap-3">
            {chipCities.map((chipCity) => (
              <a
                key={chipCity}
                href={buildGetYourGuideBrowseUrl(chipCity, placementCampaign)}
                target="_blank"
                rel="sponsored noopener noreferrer"
                onClick={() => trackClick("city_chip", chipCity)}
                className="inline-flex min-h-[44px] items-center justify-center gap-1 rounded-md border border-orange-500/50 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-200 transition-colors hover:border-orange-400 hover:bg-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-[#181818]"
              >
                Browse tours in {chipCity}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        ) : city ? (
          <>
            <div className="mt-5">
              <a
                href={buildGetYourGuideBrowseUrl(city, placementCampaign)}
                target="_blank"
                rel="sponsored noopener noreferrer"
                onClick={() => trackClick("browse_all")}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-orange-500/60 bg-orange-500/15 px-5 py-3 text-sm font-semibold text-orange-100 transition-colors hover:border-orange-400 hover:bg-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-[#181818] sm:w-auto"
              >
                Browse tours in {city}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              {themedCards.map((card) => (
                <a
                  key={card.id}
                  href={buildGetYourGuideUrl(city, {
                    query: card.query,
                    campaign: cardCampaign,
                  })}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  onClick={() => trackClick(card.id)}
                  className="flex h-full flex-col rounded-lg border border-zinc-700 bg-black/20 p-4 transition-colors hover:border-orange-500/60 hover:bg-orange-500/5 focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <h3 className="text-base font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-5 text-zinc-400">
                    {card.description}
                  </p>
                  <span className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-orange-300">
                    Browse on GetYourGuide
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </a>
              ))}
            </div>

            {step === "idle" && (
              <div className="mt-5">
                {planComplete ? (
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
                      {suggestedOrder && (
                        <p className="mt-2 text-sm text-zinc-400">
                          {suggestedOrder}
                        </p>
                      )}
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
                ) : (
                  <button
                    type="button"
                    onClick={startPlanner}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-zinc-700 bg-black/20 px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-orange-500/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-[#181818]"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Personalise these picks
                  </button>
                )}
              </div>
            )}

            {(step === "group" || step === "vibe" || step === "timing") && (
              <div className="mt-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                    Step {step === "group" ? "1" : step === "vibe" ? "2" : "3"}
                    {" of 3"}
                  </p>
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex min-h-[44px] items-center gap-1 px-2 text-sm text-zinc-400 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back
                  </button>
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
          </>
        ) : null}
      </div>

      <p className="relative mt-5 border-t border-zinc-700/70 pt-3 text-xs leading-5 text-zinc-500">
        Affiliate links: if you make a booking, RageRoom Directory may earn a
        commission at no extra cost to you. Availability and prices are set by
        GetYourGuide and its activity providers.
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
