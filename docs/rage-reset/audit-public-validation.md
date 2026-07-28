# Rage Reset — Public Validation audit (pre-launch)

Date: 2026-07-28  
Release: **Rage Reset Public Validation Release** (`pvr-1.0.0`)

## Confirmed present

- Route group `app/(rage-reset)` without directory Header/Footer; site layout retains both.
- Full state machine, Canvas stages, cool-down, check-ins (local only), progression, safety suppression.
- Analytics wrapper with sanitisation; abandonment single-fire; discovery placements.
- Scoped SW + manifest; error boundary; accelerated E2E; route regression; launch docs.

## Launch blockers (must clear before calling validation complete)

1. **Physical device runs** — matrix still outstanding; no agent-claimed device pass.
2. **True offline play** — not yet recorded on Android / iOS / desktop.
3. **Service-worker A→B** — strategy hardened in code; still needs a real deploy/sim test recorded.
4. **Production GA4 inspection** — DebugView/Realtime payload review after deploy.
5. **Production deploy** of this Public Validation build.

## Manual checks still required

See `deployment-checklist.md`, `device-test-matrix.md`, `pwa-offline.md`, `sw-update-protocol.md`.

## Analytics assumptions needing production verification

- `trackEvent` only fires when `NEXT_PUBLIC_GA_MEASUREMENT_ID` + `gtag` exist.
- E2E traffic tags `traffic=e2e` only when `?e2e=1` is allowed (blocked in public production unless `NEXT_PUBLIC_RAGE_RESET_E2E=1`).
- Allowlist now rejects gameplay counts (`objects_destroyed`, etc.) and emotional keys.
- `build_version=pvr-1.0.0` attached to all Rage Reset events.
- Cohort props (`visitor_cohort`, `player_cohort`) are local and non-emotional — confirm they appear only after consent/gtag load as for other events.

## Risky service-worker behaviour (addressed / residual)

| Risk | Status |
|---|---|
| Aggressive `skipWaiting` on install interrupting sessions | **Fixed** — waiting worker until safe activate |
| Soft reload mid-game | **Mitigated** — defer while play states / `rage-reset-defer-sw` |
| Stale hashed chunks after deploy | Soft reload when safe; network-first navigations |
| Directory page control | Scope remains `/rage-reset`; automated PWA tests |

## Gaps corrected without expanding product scope

- Central build / release identifiers.
- Allowlist analytics + cohort classification.
- Rebuild-room URL flag gated out of ordinary production.
- Optional mailto feedback on results/progress.
- Safer SW update activation.
- Deployment checklist, GA4 explorations, launch copy, UTM guidance, validation report template, sample-size guidance.
