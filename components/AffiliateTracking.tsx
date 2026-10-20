"use client"

import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react"
import { usePathname } from "next/navigation"
import { ANALYTICS_READY_EVENT, CONSENT_CHANGE_EVENT } from "@/lib/consent"
import { trackAffiliateClick, trackAffiliateModuleView, trackAffiliateOfferView, type AffiliateEventParams } from "@/lib/analytics"

const Impressions = createContext<Set<string> | null>(null)
function useVisibleImpression(ref: RefObject<HTMLElement>, kind: "module" | "card", params: AffiliateEventParams, seen: Set<string>) {
  const pathname = usePathname()
  const latest = useRef(params)
  latest.current = params
  const key = `${pathname}:${kind}:${params.provider}:${params.placement}:${params.city}:${params.campaign || params.recommendationId || "module"}`
  useEffect(() => {
    const element = ref.current
    if (!element || seen.has(key) || typeof IntersectionObserver === "undefined") return
    let visible = false
    const record = () => {
      if (!visible || seen.has(key)) return
      const event = kind === "module" ? trackAffiliateModuleView : trackAffiliateOfferView
      if (event({ ...latest.current, sourcePath: pathname })) seen.add(key)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting && entry.intersectionRatio >= 0.25
      record()
    }, { threshold: 0.25 })
    observer.observe(element)
    window.addEventListener(CONSENT_CHANGE_EVENT, record)
    window.addEventListener(ANALYTICS_READY_EVENT, record)
    return () => {
      observer.disconnect()
      window.removeEventListener(CONSENT_CHANGE_EVENT, record)
      window.removeEventListener(ANALYTICS_READY_EVENT, record)
    }
  // A card keeps its campaign through planner changes; latest captures the visible context.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, seen, pathname])
}
export function AffiliateModule({ analytics, children, className, label }: {
  analytics: AffiliateEventParams; children: ReactNode; className?: string; label: string
}) {
  const pathname = usePathname()
  const { seen } = useMemo(() => ({
    scope: `${pathname}:${analytics.placement}:${analytics.city}:${analytics.occasion || "general"}`,
    seen: new Set<string>(),
  }), [pathname, analytics.placement, analytics.city, analytics.occasion])
  const ref = useRef<HTMLElement>(null)
  useVisibleImpression(ref, "module", analytics, seen)
  return <Impressions.Provider value={seen}><section ref={ref} aria-label={label} data-affiliate-module className={className}>{children}</section></Impressions.Provider>
}
export function AffiliateLink({ analytics, children, href, className }: {
  analytics: AffiliateEventParams; children: ReactNode; href: string; className?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const local = useRef(new Set<string>())
  const seen = useContext(Impressions) || local.current
  const pathname = usePathname()
  const url = new URL(href)
  const campaign = url.searchParams.get("cmp") || analytics.campaign
  const productId = url.hostname === "www.getyourguide.com" ? url.pathname.match(/-t(\d+)\//)?.[1] : undefined
  const measured = { ...analytics, campaign, productId: analytics.productId || productId }
  useVisibleImpression(ref, "card", measured, seen)
  return <a ref={ref} href={href} target="_blank" rel="sponsored noopener noreferrer" data-affiliate-card
    onClick={() => trackAffiliateClick({ ...measured, sourcePath: pathname })} className={className}>{children}</a>
}
