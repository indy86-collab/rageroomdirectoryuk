/**
 * Expected public route inventory after (site)/(rage-reset) migration.
 * Used by regression tests — URLs must never contain route-group segments.
 */

export type ExpectedRoute = {
  path: string
  expectStatus: number
  group: string
  requireHeaderFooter?: boolean
  requireNoHeaderFooter?: boolean
}

export const ROUTE_INVENTORY: ExpectedRoute[] = [
  { path: "/", expectStatus: 200, group: "home", requireHeaderFooter: true },
  { path: "/listings", expectStatus: 200, group: "directory", requireHeaderFooter: true },
  { path: "/near-me", expectStatus: 200, group: "directory", requireHeaderFooter: true },
  {
    path: "/activities/rage-rooms/birmingham",
    expectStatus: 200,
    group: "discovery",
    requireHeaderFooter: true,
  },
  {
    path: "/activities/rage-rooms/london",
    expectStatus: 200,
    group: "discovery",
    requireHeaderFooter: true,
  },
  {
    path: "/occasions/birthdays/birmingham",
    expectStatus: 200,
    group: "discovery",
    requireHeaderFooter: true,
  },
  { path: "/guides", expectStatus: 200, group: "guides", requireHeaderFooter: true },
  {
    path: "/guides/what-happens-in-a-rage-room",
    expectStatus: 200,
    group: "article",
    requireHeaderFooter: true,
  },
  {
    path: "/guides/cheapest-rage-rooms-uk",
    expectStatus: 200,
    group: "article",
    requireHeaderFooter: true,
  },
  {
    path: "/guides/rage-room-vs-paint-splatter",
    expectStatus: 200,
    group: "article",
    requireHeaderFooter: true,
  },
  {
    path: "/activities/paint-splatter",
    expectStatus: 200,
    group: "discovery",
    requireHeaderFooter: true,
  },
  {
    path: "/activities/paint-splatter/london",
    expectStatus: 200,
    group: "discovery",
    requireHeaderFooter: true,
  },
  {
    path: "/guides/best-rage-rooms-northampton",
    expectStatus: 200,
    group: "article",
    requireHeaderFooter: true,
  },
  {
    path: "/occasions/hen-parties/london",
    expectStatus: 200,
    group: "discovery",
    requireHeaderFooter: true,
  },
  {
    path: "/guides/rage-rooms-for-stress-relief",
    expectStatus: 200,
    group: "article",
    requireHeaderFooter: true,
  },
  { path: "/blog", expectStatus: 200, group: "blog", requireHeaderFooter: true },
  { path: "/contact", expectStatus: 200, group: "legal", requireHeaderFooter: true },
  { path: "/privacy", expectStatus: 200, group: "legal", requireHeaderFooter: true },
  { path: "/terms", expectStatus: 200, group: "legal", requireHeaderFooter: true },
  { path: "/about", expectStatus: 200, group: "legal", requireHeaderFooter: true },
  {
    path: "/digital-downloads",
    expectStatus: 200,
    group: "downloads",
    requireHeaderFooter: true,
  },
  {
    path: "/digital-downloads/rage-room-first-visit-prep-pack",
    expectStatus: 200,
    group: "downloads",
    requireHeaderFooter: true,
  },
  { path: "/uk-map", expectStatus: 200, group: "directory", requireHeaderFooter: true },
  { path: "/search", expectStatus: 200, group: "directory", requireHeaderFooter: true },
  { path: "/list-your-rage-room", expectStatus: 200, group: "directory", requireHeaderFooter: true },
  { path: "/insights", expectStatus: 200, group: "editorial", requireHeaderFooter: true },
  { path: "/for-venues/badge", expectStatus: 200, group: "directory", requireHeaderFooter: true },
  { path: "/for-publishers", expectStatus: 200, group: "directory", requireHeaderFooter: true },
  {
    path: "/embed/rage-room-finder",
    expectStatus: 200,
    group: "embed",
    requireNoHeaderFooter: true,
  },
  {
    path: "/rage-reset",
    expectStatus: 200,
    group: "game",
    requireNoHeaderFooter: true,
  },
  { path: "/sitemap.xml", expectStatus: 200, group: "meta" },
  { path: "/robots.txt", expectStatus: 200, group: "meta" },
]

export function assertPublicPath(path: string): void {
  if (path.includes("(site)") || path.includes("(rage-reset)")) {
    throw new Error(`Public URL must not contain route-group segments: ${path}`)
  }
}

export function pathsNeverExposeRouteGroups(paths: string[]): string[] {
  return paths.filter((p) => p.includes("(site)") || p.includes("(rage-reset)"))
}
