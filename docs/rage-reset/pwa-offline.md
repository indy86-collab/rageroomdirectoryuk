# Rage Reset — PWA / offline notes

## Scope

- Manifest `scope` / `start_url`: `/rage-reset`
- SW registration scope: `/rage-reset`
- Next header `Service-Worker-Allowed: /rage-reset`
- Cache name: `rage-reset-pvr-2` on current production (`pvr-1.0.1`); was `rage-reset-pvr-1` for Build A (`pvr-1.0.0`)

The service worker must **not** control directory pages. Automated check: `e2e/rage-reset-pwa.spec.ts`.

## Caching strategy

- Game navigations: **network-first**, cache fallback for offline
- `/_next/static/*` hashed assets: cache-first / stale-while-revalidate inside the Rage Reset cache only
- Precache: shell URL, manifest, icons
- Directory HTML is never intentionally cached by this SW

## Updates

1. New SW installs **without** automatic `skipWaiting`
2. Client activates waiting worker when the player is not mid-session
3. `activate` claims clients and deletes old caches
4. Soft reload once when safe (guarded) so stale hashed chunks are not trapped forever
5. See `sw-update-protocol.md` for A→B test log

## Offline expectations (after one successful online load)

Playable offline:

- Application shell (`/rage-reset`)
- Cached Next chunks visited during first load
- Manifest + icons
- Canvas game code already loaded
- Audio logic (Web Audio generated; no remote samples required)
- Local progression / results / history (`localStorage`)

Graceful degradation:

- Missing non-essential assets should not blank the UI
- Directory links from results need network; SW does not serve directory offline pages from this scope
- Opening a directory URL offline should show the browser’s normal offline page (or a non-blank failure), not a Rage Reset shell hijack

## Manual offline test protocol

On each of: Android browser or installed PWA; iPhone/iOS home-screen where supported; one desktop browser:

1. Clear Rage Reset application data
2. Load `/rage-reset` online
3. Navigate enough to fetch required assets (welcome → start path assets)
4. Close browser/PWA
5. Disable network completely
6. Reopen Rage Reset
7. Complete a full session
8. Confirm local progression/results
9. Attempt a directory link
10. Confirm graceful offline response (not blank Rage Reset control of directory)
11. Restore connectivity
12. Confirm directory navigation works

### Results (fill after real runs)

| Platform | Pass / Fail / Partial | Failed assets/stages | Date | Tester | Build |
|---|---|---|---|---|---|
| Android | Outstanding | Physical device still required | | | |
| iOS | Outstanding | Physical device still required | | | |
| Desktop | Pass (partial) | Full offline 3-minute completion not required for this evidence set; offline reload of shell + start through free smash succeeded. Cache held 24 entries including shell, manifest, icons, fonts, CSS, and game JS chunks. Offline `fetch('/')` → network error; offline `fetch('/rage-reset')` → 200 from cache. `navigator.onLine === false`. | 2026-07-28 | Cursor agent (Chromium CDP offline) | `pvr-1.0.0` / cache `rage-reset-pvr-1` |

See also `device-test-matrix.md`.
