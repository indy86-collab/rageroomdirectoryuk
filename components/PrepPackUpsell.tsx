"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, RotateCcw } from "lucide-react"
import TrackedProductLink from "@/components/TrackedProductLink"
import {
  type AnalyticsProduct,
  type PrepPackIntent,
  type PrepPackUpsellOffer,
  trackAffiliateClick,
  trackFirstVisitChecklistFindVenueClick,
  trackFirstVisitChecklistIntent,
  trackFirstVisitChecklistUpsellClick,
} from "@/lib/analytics"
import {
  AFFILIATE_CHIP_CITIES,
  buildAffiliateCampaign,
  buildGetYourGuideBrowseUrl,
} from "@/lib/getyourguide"

const LIST_NAME = "Prep Pack Upsell"
const GYG_CAMPAIGN = buildAffiliateCampaign({ placement: "lead_magnet" })

const INTENTS: Array<{ value: PrepPackIntent; label: string; hint: string }> = [
  {
    value: "group",
    label: "Group night",
    hint: "Birthday, stag, hen or friends",
  },
  { value: "gift", label: "It's a gift", hint: "Printable voucher" },
  {
    value: "couple",
    label: "Just us / couple",
    hint: "Make a day of it",
  },
  { value: "work", label: "Work / team", hint: "Plan the event" },
]

const partyProduct = {
  href: "/digital-downloads/rage-room-party-planner-pack",
  priceLabel: "£5.60",
  analytics: {
    item_id: "rage_party_planner_pack",
    item_name: "Rage Room Party Planner Pack",
    item_category: "Digital Product",
    price: 5.6,
    currency: "GBP",
  } satisfies AnalyticsProduct,
}

const giftProduct = {
  href: "/digital-downloads/rage-room-gift-voucher-template-pack",
  priceLabel: "£4",
  analytics: {
    item_id: "rage_gift_voucher_pack",
    item_name: "Rage Room Gift Voucher Template Pack",
    item_category: "Digital Product",
    price: 4,
    currency: "GBP",
  } satisfies AnalyticsProduct,
}

const bundleProduct = {
  href: "/digital-downloads/party-planner-gift-voucher-bundle",
  priceLabel: "£7.20",
  analytics: {
    item_id: "party_gift_bundle",
    item_name: "Party Planner + Gift Voucher Bundle",
    item_category: "Digital Product",
    price: 7.2,
    currency: "GBP",
  } satisfies AnalyticsProduct,
}

const corporateProduct = {
  href: "/digital-downloads/corporate-rage-room-team-building-toolkit",
  analytics: {
    item_id: "corporate_team_building_pack",
    item_name: "Corporate Rage Room Event Builder",
    item_category: "Digital Product",
    price: 15.2,
    currency: "GBP",
  } satisfies AnalyticsProduct,
}

type PrepPackUpsellProps = {
  source?: string
  city?: string
  compact?: boolean
}

function gygBrowseUrl(city: string) {
  return buildGetYourGuideBrowseUrl(city, GYG_CAMPAIGN)
}

function trackOffer(offer: PrepPackUpsellOffer, source?: string) {
  trackFirstVisitChecklistUpsellClick(offer, source)
}

export default function PrepPackUpsell({
  source,
  city,
  compact = false,
}: PrepPackUpsellProps) {
  const [intent, setIntent] = useState<PrepPackIntent | null>(null)

  function chooseIntent(next: PrepPackIntent) {
    setIntent(next)
    trackFirstVisitChecklistIntent(next, source)
  }

  function handleGygClick(targetCity: string) {
    trackOffer("getyourguide", source)
    trackAffiliateClick({
      provider: "getyourguide",
      placement: "lead_magnet",
      city: targetCity,
      recommendationId: "prep_pack_day_out",
    })
  }

  function handleListingsClick() {
    trackOffer("listings", source)
    trackFirstVisitChecklistFindVenueClick(source)
  }

  return (
    <div className="mt-6 border-t border-zinc-800 pt-5">
      {intent ? (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-white">
              {INTENTS.find((item) => item.value === intent)?.label}
            </p>
            <button
              type="button"
              onClick={() => setIntent(null)}
              className="inline-flex min-h-[40px] items-center gap-1 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Change
            </button>
          </div>
          {intent === "group" ? (
            <GroupOffer source={source} compact={compact} />
          ) : null}
          {intent === "gift" ? <GiftOffer source={source} compact={compact} /> : null}
          {intent === "couple" ? (
            <CoupleOffer
              city={city}
              compact={compact}
              onGygClick={handleGygClick}
            />
          ) : null}
          {intent === "work" ? <WorkOffer source={source} compact={compact} /> : null}
          <Link
            href="/listings"
            onClick={handleListingsClick}
            className="inline-flex min-h-[40px] items-center text-sm text-zinc-400 underline-offset-2 hover:text-rage-400 hover:underline"
          >
            Or find a rage room near you
          </Link>
        </div>
      ) : (
        <fieldset>
          <legend className="text-sm font-bold uppercase tracking-wider text-zinc-300">
            What are you planning?
          </legend>
          <div
            className={
              compact
                ? "mt-3 grid gap-2"
                : "mt-3 grid gap-2 sm:grid-cols-2"
            }
          >
            {INTENTS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => chooseIntent(item.value)}
                className="min-h-[48px] rounded-md border border-zinc-700 bg-black/20 px-4 py-3 text-left transition-colors hover:border-rage-500/60 hover:bg-rage-500/10 focus:outline-none focus:ring-2 focus:ring-rage-500"
              >
                <span className="block text-sm font-semibold text-white">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-xs text-zinc-400">
                  {item.hint}
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  )
}

function GroupOffer({
  source,
  compact,
}: {
  source?: string
  compact: boolean
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-zinc-300">
        Use the Party Planner Pack for budget, RSVPs and invites.
      </p>
      <TrackedProductLink
        href={partyProduct.href}
        product={partyProduct.analytics}
        listName={LIST_NAME}
        onClick={() => trackOffer("party_planner", source)}
        className={`btn-rage inline-flex min-h-[48px] items-center justify-center px-5 text-sm uppercase tracking-wider ${compact ? "w-full" : ""}`}
      >
        Party Planner — {partyProduct.priceLabel}
      </TrackedProductLink>
      <TrackedProductLink
        href={bundleProduct.href}
        product={bundleProduct.analytics}
        listName={LIST_NAME}
        onClick={() => trackOffer("bundle", source)}
        className="inline-flex min-h-[40px] items-center text-sm font-semibold text-rage-500 hover:text-rage-400"
      >
        Or get the bundle — {bundleProduct.priceLabel}
      </TrackedProductLink>
    </div>
  )
}

function GiftOffer({
  source,
  compact,
}: {
  source?: string
  compact: boolean
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-zinc-300">
        Printable and digital gift voucher templates — not a venue booking.
      </p>
      <TrackedProductLink
        href={giftProduct.href}
        product={giftProduct.analytics}
        listName={LIST_NAME}
        onClick={() => trackOffer("gift_voucher", source)}
        className={`btn-rage inline-flex min-h-[48px] items-center justify-center px-5 text-sm uppercase tracking-wider ${compact ? "w-full" : ""}`}
      >
        Gift vouchers — {giftProduct.priceLabel}
      </TrackedProductLink>
    </div>
  )
}

function CoupleOffer({
  city,
  compact,
  onGygClick,
}: {
  city?: string
  compact: boolean
  onGygClick: (city: string) => void
}) {
  if (city?.trim()) {
    const targetCity = city.trim()
    return (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-zinc-300">
          Make a day of it in {targetCity} — tours and experiences around your
          smash session.
        </p>
        <a
          href={gygBrowseUrl(targetCity)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => onGygClick(targetCity)}
          className={`btn-rage inline-flex min-h-[48px] items-center justify-center gap-2 px-5 text-sm uppercase tracking-wider ${compact ? "w-full" : ""}`}
        >
          Browse {targetCity} activities
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <p className="text-xs leading-5 text-zinc-500">
          Affiliate links: if you book, RageRoom Directory may earn a commission
          at no extra cost to you.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-zinc-300">
        Make a day of it — pick a city for complementary tours and experiences.
      </p>
      <div className="flex flex-wrap gap-2">
        {AFFILIATE_CHIP_CITIES.map((chipCity) => (
          <a
            key={chipCity}
            href={gygBrowseUrl(chipCity)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => onGygClick(chipCity)}
            className="inline-flex min-h-[40px] items-center rounded-md border border-zinc-700 px-3 text-sm font-semibold text-white hover:border-rage-500 hover:text-rage-400"
          >
            {chipCity}
          </a>
        ))}
      </div>
      <p className="text-xs leading-5 text-zinc-500">
        Affiliate links: if you book, RageRoom Directory may earn a commission at
        no extra cost to you.
      </p>
    </div>
  )
}

function WorkOffer({
  source,
  compact,
}: {
  source?: string
  compact: boolean
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-zinc-300">
        Plan budget, venues and invites for free. Pay only if you want a clean
        PDF of the finished plan.
      </p>
      <TrackedProductLink
        href={corporateProduct.href}
        product={corporateProduct.analytics}
        listName={LIST_NAME}
        onClick={() => trackOffer("corporate_builder", source)}
        className={`btn-rage inline-flex min-h-[48px] items-center justify-center px-5 text-sm uppercase tracking-wider ${compact ? "w-full" : ""}`}
      >
        Start planning — free
      </TrackedProductLink>
    </div>
  )
}
