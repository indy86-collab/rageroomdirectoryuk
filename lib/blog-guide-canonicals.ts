/** Blog posts that overlap with guide pages — guides are the canonical SEO URLs. */
export const BLOG_TO_GUIDE_CANONICAL: Record<string, string> = {
  "rage-rooms-cost-guide-pricing-explained": "/rage-room-prices-uk",
  "rage-room-prices-uk-complete-guide": "/rage-room-prices-uk",
  "rage-room-safety-guide-everything-you-need-to-know": "/guides/are-rage-rooms-safe-uk",
  "rage-room-safety-tips-complete-guide": "/guides/are-rage-rooms-safe-uk",
  "are-rage-rooms-safe-for-kids": "/guides/are-rage-rooms-safe-uk",
  "rage-rooms-for-couples-ultimate-date-night-guide": "/guides/best-rage-rooms-for-couples",
  "rage-room-for-couples-complete-guide": "/guides/best-rage-rooms-for-couples",
  "corporate-rage-rooms-team-building-events": "/guides/best-rage-rooms-for-team-building",
  "rage-rooms-gift-ideas-perfect-presents": "/guides/rage-room-gift-vouchers-uk",
  "benefits-of-rage-rooms-for-stress-relief": "/guides/rage-rooms-for-stress-relief",
  "what-to-wear-to-a-rage-room": "/guides/what-to-wear-to-a-rage-room",
  "best-rage-rooms-near-me-complete-guide": "/near-me",
  "rage-room-near-me-how-to-find": "/near-me",
  "how-to-prepare-for-your-first-rage-room-session": "/guides/what-happens-in-a-rage-room",
  "why-rage-rooms-are-becoming-popular-in-the-uk": "/uk-rage-room-report-2026",
  "rage-room-etiquette-dos-and-donts": "/blog/rage-room-etiquette-tips-for-first-timers",
  "best-activities-like-rage-rooms": "/guides/rage-room-vs-axe-throwing",
}

export function getBlogGuideCanonical(slug: string): string | undefined {
  return BLOG_TO_GUIDE_CANONICAL[slug]
}

export function getBlogGuideLink(slug: string): { href: string; label: string } | undefined {
  const href = BLOG_TO_GUIDE_CANONICAL[slug]
  if (!href) return undefined
  const labels: Record<string, string> = {
    "/rage-room-prices-uk": "See the full UK pricing hub",
    "/guides/how-much-do-rage-rooms-cost-uk": "Read the full UK pricing guide",
    "/guides/are-rage-rooms-safe-uk": "Read the full UK safety guide",
    "/guides/best-rage-rooms-for-couples": "Read the full couples guide",
    "/guides/best-rage-rooms-for-team-building": "Read the full team building guide",
    "/guides/rage-room-gift-vouchers-uk": "Read the full gift vouchers guide",
    "/guides/rage-rooms-for-stress-relief": "Read the full stress relief guide",
    "/guides/what-to-wear-to-a-rage-room": "Read the full what-to-wear guide",
    "/near-me": "Find rage rooms near you on the map",
    "/guides/rage-room-near-me": "Browse rage rooms by UK city",
    "/guides/what-happens-in-a-rage-room": "Read the first-visit walkthrough",
    "/uk-rage-room-report-2026": "See the UK Rage Room Report 2026",
    "/blog/rage-room-etiquette-tips-for-first-timers": "Read the etiquette guide",
    "/guides/rage-room-vs-axe-throwing": "Compare rage rooms with axe throwing and other activities",
  }
  return { href, label: labels[href] ?? "Read the full guide" }
}
