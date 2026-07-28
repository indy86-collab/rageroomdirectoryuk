# Rage Reset — production deployment checklist

**Release:** Rage Reset Public Validation Release  
**Build A (initial):** `pvr-1.0.0` (commit `53eb148`)  
**Build B (SW A→B):** `pvr-1.0.1` / cache `rage-reset-pvr-2` (commit `1739d18`)  
**Do not mark ready if any critical item fails.**

## Deployment record (Build A — `pvr-1.0.0`)

| Field | Value |
|---|---|
| Git commit SHA | `53eb14818b79f76a6ece86fc02ac27246963c6d8` |
| Branch | `main` |
| Deployment provider | Vercel |
| Deployment ID | `dpl_8f96rd4GNDcgKGftRGaJVYq9NZCq` |
| Deployment URL | https://rageroomdirectoryuk-gjk5vn8gt-indy-singhs-projects.vercel.app |
| Production URL | https://www.rageroomdirectory.co.uk |
| Deployed (UTC) | 2026-07-28T21:21:15Z |
| Deployed (Europe/London) | 2026-07-28T22:21:15+01:00 |
| Build identifier | `pvr-1.0.0` |
| Service-worker cache | `rage-reset-pvr-1` |
| Deployed by | Auto-deploy from `main` (observed / validated by Cursor agent) |

## Pre-deploy automated validation (local, 2026-07-28)

| Command | Result |
|---|---|
| `npm test` (Vitest) | Pass — **39** tests |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass |
| `npx playwright test` | **45 passed** (`mobile-chrome`); **37 failed** (`mobile-safari`) — all WebKit `PushAPIEnabled` protocol errors (tooling), not app assertions. **Do not claim Safari Playwright coverage.** |

## Application

| Check | Critical? | Result | Notes |
|---|---|---|---|
| `/rage-reset` returns 200 | Yes | Pass | Production HTTP 200 |
| Rage Reset loads without directory Header/Footer | Yes | Pass | Desktop production smoke |
| Directory pages retain Header/Footer | Yes | Pass | Homepage, listings, guides |
| Metadata + canonical `/rage-reset` | Yes | Pass | `https://www.rageroomdirectory.co.uk/rage-reset` |
| Open Graph preview works | No | Pass | `og:image` → `/rage-reset/icons/icon-512.png` (200) |
| Sitemap contains `/rage-reset` | Yes | Pass | Present in sitemap.xml |
| Robots allow indexing of `/rage-reset` | Yes | Pass | `Allow: /` (API disallowed only) |
| Nav + homepage links work | Yes | Pass | Homepage feature + footer Explore → Rage Reset |
| Contextual CTAs → `/rage-reset` | Yes | Pass | Guide CTA includes `utm_campaign=rage_reset_pvr` |
| No diagnostics in public production | Yes | Pass | `NEXT_PUBLIC_RAGE_RESET_DIAGNOSTICS` unset in Vercel |
| `?e2e=1` does not accelerate in public production | Yes | Pass | Timer still ~32–35s with `?e2e=1`; `NEXT_PUBLIC_RAGE_RESET_E2E` unset |
| `?cooldown=rebuild-room` ignored for ordinary prod visitors | Yes | Pass | Param present; `rage-reset-cooldown-challenge` not stored; diagnostics flag unset |

## Game

| Check | Critical? | Result | Notes |
|---|---|---|---|
| Full normal-duration session completes | Yes | Pass | Desktop production: free → controlled → cool-down → results |
| Restart works | Yes | Pass | Results → Reset again available |
| Resume after refresh works | Yes | Pass | Resume prompt observed mid-session |
| Abandonment not double-counted | Yes | Outstanding | Requires GA4 event inspection |
| Local progression persists | Yes | Pass | Progress/unlocks after session |
| Delete data clears Rage Reset state (+ visit flag) | Yes | Pass | Returned to fresh welcome |
| High scores retain safety suppression | Yes | Partial | Initial score 10 shows safety dialog; full final-score commercial suppression covered by Playwright (not re-run full 3m high-final in prod) |
| Share excludes emotional data | Yes | Pass | Share card uses game stats / play URL only (code + results UI) |
| Directory promo frequency cap works | No | Partial | Promo not always shown; eligibility/cap expected |

## PWA

| Check | Critical? | Result | Notes |
|---|---|---|---|
| Manifest valid; icons load | Yes | Pass | Manifest + icons HTTP 200 |
| `start_url` / `scope` = `/rage-reset` | Yes | Pass | Manifest + SW `Service-Worker-Allowed: /rage-reset` |
| Standalone display works where supported | No | Outstanding | Needs physical Android/iOS |
| SW scope limited to Rage Reset | Yes | Pass | Homepage `controller === null` after game visit |
| Directory pages outside SW control | Yes | Pass | Offline: `/` fetch fails; `/rage-reset` cache 200 |
| Installable where browser supports | No | Outstanding | Needs physical device |

## Analytics

| Check | Critical? | Result | Notes |
|---|---|---|---|
| Production GA4 receives expected events | Yes | **Blocked** | `NEXT_PUBLIC_GA_MEASUREMENT_ID` **not set** in Vercel Production/Preview/Development — no `gtag` script in production HTML |
| Dev/E2E distinguishable or excluded | Yes | Pass (code) | E2E blocked in prod; would tag `traffic=e2e` only if unlocked |
| Consent / gtag behaviour correct | Yes | Blocked | No GA measurement ID configured |
| No score/trigger/emotional values in payloads | Yes | Partial | Unit allowlist tests pass; live GA4 payload inspection blocked until GA ID is configured |

## Sign-off

- Deployed by: Vercel auto-deploy from `main` (validated by Cursor agent)
- Date: 2026-07-28
- Build id observed: `pvr-1.0.0` (SW `BUILD` / cache `rage-reset-pvr-1`); follow-up `pvr-1.0.1` for A→B
- Ready for controlled organic launch: **Conditional Yes** for product surfaces — **No** for analytics-backed validation until GA4 ID is set
