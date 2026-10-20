"use client"

import GetYourGuideIntroduction from "./GetYourGuideIntroduction"
import AffiliateProductImage from "./AffiliateProductImage"
import { useState } from "react"
import type { NearbyActivitiesAffiliateProps } from "./NearbyActivitiesAffiliate"
import { AffiliateLink, AffiliateModule } from "./AffiliateTracking"
import { cityBrowseOffer, curatedProductUrl, eligibleRecommendations, getYourGuideCampaign, type ActivityPlan } from "@/lib/getyourguide-catalogue"
import { AFFILIATE_CHIP_CITIES, PLANNER_GROUPS, PLANNER_VIBES, PLANNER_TIMINGS, PLANNER_LABELS } from "@/lib/getyourguide"
import { THIRD_PARTY_AFFILIATE_LINKS_ENABLED } from "@/lib/monetization"
import { trackAffiliatePlannerAnswer, trackAffiliatePlannerComplete, trackAffiliatePlannerStart } from "@/lib/analytics"

export default function CuratedActivitiesAffiliate({ city, placement, occasionSlug, initialGroup, listingSlug, variant, cities }: NearbyActivitiesAffiliateProps) {
  const [open, setOpen] = useState(false)
  // Page audience always wins: no saved adult plan can leak into a family page.
  const [plan, setPlan] = useState<ActivityPlan>({ group: initialGroup })
  if (!THIRD_PARTY_AFFILIATE_LINKS_ENABLED) return null
  const group = initialGroup === "family" ? "family" : plan.group || initialGroup
  const effectivePlan = { ...plan, group }
  const campaign = getYourGuideCampaign({ placement, city: city || "UK", occasion: occasionSlug, recommendationId: "module" })
  const analytics = { provider: "getyourguide", placement, city: city || "UK", occasion: occasionSlug, listingSlug, campaign,
    plannerGroup: group, plannerVibe: plan.vibe, plannerTiming: plan.timing }
  const choices = city ? eligibleRecommendations(city, effectivePlan) : []
  const title = city ? `More to do in ${city}` : "Plan the rest of your day"
  return <AffiliateModule analytics={analytics} label={title} className="my-8 rounded-lg border border-zinc-700 bg-[#181818] p-5 text-left sm:p-6">
    <p className="text-xs font-bold uppercase tracking-wider text-orange-400">Optional extras for your outing</p>
    <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-zinc-300">Book your venue first, then leave time for travel between separate activities. Check age, access and group requirements before booking.</p>
    <p className="mt-3 text-xs text-zinc-400">Sponsored links · We may earn a commission at no extra cost to you.</p>
    <GetYourGuideIntroduction />
    {city && variant !== "chips" && <>
      <button type="button" aria-expanded={open} className="mt-4 min-h-11 rounded border border-zinc-600 px-3 text-sm text-orange-300"
        onClick={() => { if (!open) trackAffiliatePlannerStart(analytics); setOpen(!open) }}>Personalise these picks</button>
      {open && <fieldset className="mt-4 grid gap-3 sm:grid-cols-3"><legend className="mb-2 text-sm text-zinc-300">Filter experiences for your outing</legend>
        {([ ["group", PLANNER_GROUPS, PLANNER_LABELS.groups, "Who is coming?"], ["vibe", PLANNER_VIBES, PLANNER_LABELS.vibes, "What would you enjoy?"], ["timing", PLANNER_TIMINGS, PLANNER_LABELS.timings, "When would you go?"] ] as const).map(([key, values, labels, label]) =>
          <label key={key} className="text-sm text-zinc-300">{label}<select className="mt-1 block min-h-11 w-full rounded border border-zinc-600 bg-zinc-900 p-2 text-white"
            value={effectivePlan[key] || ""} disabled={key === "group" && initialGroup === "family"}
            onChange={event => {
              const value = event.target.value
              const next = { ...effectivePlan, [key]: value || undefined }
              setPlan(next)
              trackAffiliatePlannerAnswer({ ...analytics, step: key, choice: value || "any" })
              if (next.group && next.vibe && next.timing) trackAffiliatePlannerComplete({ ...analytics, plannerGroup: next.group, plannerVibe: next.vibe, plannerTiming: next.timing })
            }}><option value="">Any suitable option</option>{values.map(value => <option value={value} key={value}>{(labels as Record<string, string>)[value]}</option>)}</select></label>)}
      </fieldset>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {choices.map(product => {
          const productCampaign = getYourGuideCampaign({ placement, city, occasion: occasionSlug, recommendationId: product.id })
          return <AffiliateLink key={product.id} href={curatedProductUrl(product, productCampaign)} analytics={{ ...analytics, campaign: productCampaign, productId: product.productId, recommendationId: product.id }}
            className="flex flex-col rounded-lg border border-zinc-700 p-4 hover:border-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400">
            {/* No unlicensed product photos: the card remains complete when no approved image exists. */}
            <AffiliateProductImage key={product.image?.src} image={product.image} />
            <h3 className="font-semibold text-white">{product.title}</h3>
            <p className="mt-2 text-sm text-zinc-300">{product.location} · {product.duration}</p>
            <p className="mt-2 text-sm text-zinc-400">{product.audience}</p>
            <p className="my-3 text-sm leading-6 text-zinc-300">{product.description}</p>
            <span className="mt-auto inline-flex min-h-11 items-center text-sm font-semibold text-orange-300">View dates &amp; prices on GetYourGuide <span aria-hidden="true" className="ml-1">↗</span></span>
          </AffiliateLink>
        })}
      </div>
      {!choices.length && <p role="status" className="mt-4 text-sm text-zinc-300">We have no verified product matching these preferences here. You can browse local alternatives below.</p>}
    </>}
    <div className="mt-4 flex flex-wrap gap-3">
      {(city ? [city] : (cities?.length ? cities : [...AFFILIATE_CHIP_CITIES])).map(destination => {
        const browse = cityBrowseOffer(destination, placement, occasionSlug)
        return <AffiliateLink key={destination} href={browse.href} analytics={{ ...analytics, city: destination, campaign: browse.campaign, recommendationId: "browse-all" }}
          className="inline-flex min-h-11 items-center rounded border border-zinc-600 px-3 text-sm font-semibold text-orange-300 hover:border-orange-400">Browse local experiences in {destination} ↗</AffiliateLink>
      })}
    </div>
  </AffiliateModule>
}
