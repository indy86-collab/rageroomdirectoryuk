"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Gift } from "lucide-react"
import { selectGiftVoucherOffers } from "@/lib/gift-vouchers"
import { THIRD_PARTY_AFFILIATE_LINKS_ENABLED } from "@/lib/monetization"
import { trackAffiliateClick, trackAffiliateOfferView } from "@/lib/analytics"

type Props = {
  placement: string
  venueSlug?: string | null
  venueName?: string
  city?: string | null
  region?: string | null
  /** The venue sells its own vouchers; say so rather than hide it. */
  venueSellsVouchers?: boolean | null
  limit?: number
  className?: string
}

const MATCH_LABEL = {
  venue: "This venue",
  city: "Nearby",
  region: "In the region",
  nationwide: "UK-wide",
  browse: "More gift ideas",
} as const

export default function GiftVoucherOffers({
  placement, venueSlug, venueName, city, region, venueSellsVouchers, limit = 3, className = "",
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const offers = THIRD_PARTY_AFFILIATE_LINKS_ENABLED
    ? selectGiftVoucherOffers({ venueSlug, city, region, placement }, limit)
    : []
  const offerKey = offers.map((o) => o.id).join(",")
  const analyticsCity = city || region || "UK"

  useEffect(() => {
    const element = ref.current
    if (!element || !offerKey) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      for (const id of offerKey.split(",")) {
        const offer = offers.find((o) => o.id === id)
        if (offer) trackAffiliateOfferView({ provider: offer.merchant, placement, city: analyticsCity, listingSlug: venueSlug || undefined, recommendationId: offer.id })
      }
      observer.disconnect()
    }, { threshold: 0.25 })
    observer.observe(element)
    return () => observer.disconnect()
    // offers is derived from offerKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerKey, placement, analyticsCity, venueSlug])

  if (!offers.length) return null
  const exact = offers.find((o) => o.match === "venue")
  const heading = exact && venueName ? `Give ${venueName} as a gift` : "Give a rage room as a gift"

  return (
    <section ref={ref} aria-label={heading} className={`rounded-lg border border-orange-500/30 bg-[#181818] p-5 sm:p-6 ${className}`}>
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
        <Gift className="h-4 w-4" aria-hidden="true" /> Experience vouchers
      </p>
      <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">{heading}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-300">
        Vouchers are delivered by email and usually valid for months, so the recipient picks their own date.
        {venueSellsVouchers ? " This venue may also sell its own vouchers — check its website too." : ""}
      </p>
      <p className="mt-3 text-xs text-zinc-400">
        Affiliate links · We may earn a commission at no extra cost to you. Price, locations and terms are set by the retailer.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <a
            key={offer.id}
            href={offer.href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={() => trackAffiliateClick({ provider: offer.merchant, placement, city: analyticsCity, listingSlug: venueSlug || undefined, recommendationId: offer.id })}
            className={`flex flex-col rounded-md border p-4 transition-colors hover:border-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400 ${offer.match === "venue" ? "border-orange-500/60 bg-orange-500/10" : "border-zinc-700"}`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{MATCH_LABEL[offer.match]}</span>
            <span className="mt-1 font-semibold text-white">{offer.title} ↗</span>
            <span className="mt-2 text-sm text-zinc-400">
              {offer.merchantName}
              {offer.location ? ` · ${offer.location}` : ""}
              {offer.people ? ` · for ${offer.people}` : ""}
            </span>
          </a>
        ))}
      </div>
      <p className="mt-4 text-sm text-zinc-400">
        Want to wrap it?{" "}
        <Link href="/digital-downloads/rage-room-gift-voucher-template-pack" className="font-semibold text-orange-400 hover:text-orange-300">
          Printable rage room gift card templates (£2.99)
        </Link>
      </p>
    </section>
  )
}
