# Rage Reset — service worker A→B update protocol

Build identifiers: `pvr-1.0.0` / cache `rage-reset-pvr-1` (see `lib/rage-reset/build.ts` and `public/rage-reset-sw.js`).

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
| Build A loads | Outstanding | | | | |
| Build B deploys | Outstanding | | | | |
| No stale-chunk crash | Outstanding | | | | |
| Waiting → activate safe | Outstanding | | | | |
| Soft reload | Outstanding | | | | |
| Mid-session preserved | Outstanding | | | | |
| Directory unaffected | Outstanding | | | | |
