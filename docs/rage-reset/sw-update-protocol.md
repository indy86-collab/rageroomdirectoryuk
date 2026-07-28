# Rage Reset — service worker A→B update protocol

Build identifiers: `pvr-1.0.0` / cache `rage-reset-pvr-1` → `pvr-1.0.1` / cache `rage-reset-pvr-2`  
(see `lib/rage-reset/build.ts` and `public/rage-reset-sw.js`).

## Designed behaviour

1. New SW **installs without** automatic `skipWaiting`.
2. Client activates a waiting worker only when the player is **not** mid-session (`rage-reset-defer-sw` / active play states).
3. On `controllerchange`, soft-reload once when safe; otherwise set `rage-reset-sw-pending-reload` and reload later.
4. Directory pages remain outside `/rage-reset` scope.

## Build A

1. Deploy or run current build.
2. Load `/rage-reset` online; confirm SW active and cache name.
3. Optionally install / leave SW controlling the game.
4. Record build id from diagnostics (`?debug=1` in non-prod) or `build_version` in analytics.

## Build B (harmless visible change)

Bump `RAGE_RESET_BUILD_VERSION` / `RAGE_RESET_SW_CACHE` together with the `CACHE` / `BUILD` constants in `rage-reset-sw.js`, **or** change diagnostics-only copy, then deploy.

Build B used for this validation:

* Commit `1739d18`
* Vercel deployment `dpl_CqXUESUZeuWFpAHMZNGyD4nJ1rM1`
* Created 2026-07-28T21:35:40Z / 2026-07-28T22:35:40+01:00
* Privacy panel shows `Build pvr-1.0.1`

## Verification steps

1. Reopen previously loaded / installed Rage Reset.
2. Confirm no crash from stale hashed chunks.
3. Confirm new SW installs (Application → Service Workers).
4. Confirm activation occurs when leaving play (welcome/results) if deferred.
5. Confirm soft reload applies the new build.
6. Confirm an active free-smash / controlled / cool-down session is not force-reloaded mid-round.
7. Confirm directory homepage is unaffected.
8. Record results below.

## Results log

| Step | Pass / Fail / Partial | Notes | Date | Tester | Build |
|---|---|---|---|---|---|
| Build A loads | Pass | Production `/rage-reset` with SW controller; cache `rage-reset-pvr-1`; GET_BUILD → `pvr-1.0.0` | 2026-07-28 | Cursor agent (desktop Chromium) | A `pvr-1.0.0` / `53eb148` |
| Build B deploys | Pass | Production SW file served `CACHE=rage-reset-pvr-2` / `BUILD=pvr-1.0.1`; deploy `dpl_CqXUESUZeuWFpAHMZNGyD4nJ1rM1` | 2026-07-28 | Cursor agent | B `pvr-1.0.1` / `1739d18` |
| No stale-chunk crash | Pass | After A→B, game welcome + Privacy panel loaded; resume prompt for unfinished A session did not crash | 2026-07-28 | Cursor agent | A→B |
| Waiting → activate safe | Pass | Observed `waiting: true` while active GET_BUILD still `pvr-1.0.0`; on welcome (safe), waiting cleared and GET_BUILD → `pvr-1.0.1` | 2026-07-28 | Cursor agent | A→B |
| Soft reload | Pass | New Privacy label `Build pvr-1.0.1` visible after activation | 2026-07-28 | Cursor agent | B |
| Mid-session preserved | Partial | Confirmed install-without-skipWaiting (`waiting` while old controller active). Full mid-play deferral with live free-smash not re-run in this pass; strategy covered by code + waiting observation | 2026-07-28 | Cursor agent | A→B |
| Directory unaffected | Pass | Homepage `navigator.serviceWorker.controller === null` after Rage Reset SW use; offline `/` fetch fails while `/rage-reset` cache-hits | 2026-07-28 | Cursor agent | A/B |
| Old caches removed | Pass | After activation, `caches.keys()` = `["rage-reset-pvr-2"]` only | 2026-07-28 | Cursor agent | B |
