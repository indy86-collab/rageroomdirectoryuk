"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { commercialOffers, type CommercialIntent } from "@/lib/commercial-offers"
import { THIRD_PARTY_AFFILIATE_LINKS_ENABLED } from "@/lib/monetization"
import { trackAffiliateClick, trackAffiliateOfferView, trackEvent } from "@/lib/analytics"

export default function CommercialOffers({ intent, city, placement }: {
  intent: CommercialIntent; city?: string; placement: string
}) {
  const ref = useRef<HTMLElement>(null)
  const offers = THIRD_PARTY_AFFILIATE_LINKS_ENABLED ? commercialOffers(intent, city) : []
  const offerKey = offers.map(offer => offer.id).join(",")
  useEffect(() => {
    const element = ref.current
    if (!element || !THIRD_PARTY_AFFILIATE_LINKS_ENABLED) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      for (const offer of commercialOffers(intent, city)) {
        trackAffiliateOfferView({ provider: offer.provider, placement, city: city || "UK", recommendationId: offer.id })
      }
      observer.disconnect()
    }, { threshold: 0.25 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [intent, city, placement, offerKey])

  if (!offers.length && intent !== "alternatives") return null
  const title = intent === "group" ? "Make a day of your group outing"
    : intent === "gift" ? "Give an experience they can book"
    : "A different experience could fit your plan"

  return (
    <section ref={ref} aria-label={title} className="my-8 rounded-lg border border-orange-500/30 bg-[#181818] p-5 text-left sm:p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
        {intent === "alternatives" ? "Open to alternatives?" : intent === "gift" ? "Experience gifts" : "Plan the whole occasion"}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-300">
        {intent === "alternatives" ? "If the distance, budget or group size does not work, compare another activity. These options do not replace your rage room results."
          : intent === "gift" ? "Choose a real experience voucher first, then add a printable gift template if you want a personal presentation."
          : "Add a shared activity or food experience around your session. Confirm timings and group capacity before making separate bookings."}
      </p>
      {offers.length > 0 && <>
        <p className="mt-3 text-xs text-zinc-400">Sponsored links · We may earn a commission at no extra cost to you. Prices and availability are set by the provider.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {offers.map(offer => <a key={offer.id} href={offer.href} target="_blank" rel="sponsored noopener noreferrer"
            onClick={() => trackAffiliateClick({ provider: offer.provider, placement, city: city || "UK", recommendationId: offer.id })}
            className="rounded-md border border-zinc-700 p-4 transition-colors hover:border-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400">
            <h3 className="font-semibold text-white">{offer.title} ↗</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{offer.description}</p>
          </a>)}
        </div>
      </>}
      {intent === "alternatives" && <div className="mt-4 flex flex-wrap gap-3">
        {[{ slug: "axe-throwing", label: "Compare axe throwing" }, { slug: "paint-splatter", label: "Compare paint experiences" }, { slug: "escape-rooms", label: "Compare escape rooms" }].map(activity =>
          <Link key={activity.slug} href={`/activities/${activity.slug}`}
            onClick={() => trackEvent("alternative_activity_click", { placement, activity: activity.slug })}
            className="inline-flex min-h-11 items-center rounded-md border border-zinc-700 px-3 text-sm font-semibold text-orange-300 hover:border-orange-400">
            {activity.label}
          </Link>)}
        <p className="w-full text-xs text-zinc-500">Directory links show UK options; narrow by location and check each venue&apos;s requirements.</p>
      </div>}
    </section>
  )
}
