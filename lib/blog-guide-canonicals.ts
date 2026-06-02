/** Blog posts that overlap with guide pages — guides are the canonical SEO URLs. */
export const BLOG_TO_GUIDE_CANONICAL: Record<string, string> = {
  "rage-rooms-cost-guide-pricing-explained": "/guides/how-much-do-rage-rooms-cost-uk",
  "rage-room-prices-uk-complete-guide": "/guides/how-much-do-rage-rooms-cost-uk",
  "rage-room-safety-guide-everything-you-need-to-know": "/guides/are-rage-rooms-safe-uk",
  "rage-room-safety-tips-complete-guide": "/guides/are-rage-rooms-safe-uk",
  "are-rage-rooms-safe-for-kids": "/guides/are-rage-rooms-safe-uk",
  "rage-rooms-for-couples-ultimate-date-night-guide": "/guides/best-rage-rooms-for-couples",
  "rage-room-for-couples-complete-guide": "/guides/best-rage-rooms-for-couples",
  "corporate-rage-rooms-team-building-events": "/guides/best-rage-rooms-for-team-building",
  "rage-rooms-gift-ideas-perfect-presents": "/guides/rage-room-gift-vouchers-uk",
  "benefits-of-rage-rooms-for-stress-relief": "/guides/rage-rooms-for-stress-relief",
  "what-to-wear-to-a-rage-room": "/guides/what-to-wear-to-a-rage-room",
  "best-rage-rooms-near-me-complete-guide": "/guides/rage-room-near-me",
  "rage-room-near-me-how-to-find": "/guides/rage-room-near-me",
}

export function getBlogGuideCanonical(slug: string): string | undefined {
  return BLOG_TO_GUIDE_CANONICAL[slug]
}

export function getBlogGuideLink(slug: string): { href: string; label: string } | undefined {
  const href = BLOG_TO_GUIDE_CANONICAL[slug]
  if (!href) return undefined
  const labels: Record<string, string> = {
    "/guides/how-much-do-rage-rooms-cost-uk": "Read the full UK pricing guide",
    "/guides/are-rage-rooms-safe-uk": "Read the full UK safety guide",
    "/guides/best-rage-rooms-for-couples": "Read the full couples guide",
    "/guides/best-rage-rooms-for-team-building": "Read the full team building guide",
    "/guides/rage-room-gift-vouchers-uk": "Read the full gift vouchers guide",
    "/guides/rage-rooms-for-stress-relief": "Read the full stress relief guide",
    "/guides/what-to-wear-to-a-rage-room": "Read the full what-to-wear guide",
    "/guides/rage-room-near-me": "Read the full near-me guide",
  }
  return { href, label: labels[href] ?? "Read the full guide" }
}
