# Rage Reset — Public Validation audit (pre-launch + post-deploy)

Date: 2026-07-28  
Release: **Rage Reset Public Validation Release** (`pvr-1.0.0` → `pvr-1.0.1`)

## Confirmed present

- Route group `app/(rage-reset)` without directory Header/Footer; site layout retains both.
- Full state machine, Canvas stages, cool-down, check-ins (local only), progression, safety suppression.
- Analytics wrapper with sanitisation; abandonment single-fire; discovery placements.
- Scoped SW + manifest; error boundary; accelerated E2E; route regression; launch docs.
- Production deploy of Build A (`53eb148`) and SW A→B Build B (`1739d18`).

## Launch blockers (updated)

1. **Physical device runs** — matrix still outstanding for real iPhone + Android.
2. **True offline play on mobile / installed PWA** — desktop CDP offline Pass (partial); Android/iOS outstanding.
3. **Service-worker A→B** — **Done** on production (see `sw-update-protocol.md`); mid-session deferral observed via waiting worker, not re-proven during active free-smash.
4. **Production GA4 inspection** — **Blocked** by missing `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel.
5. **Production deploy** — **Done** (`pvr-1.0.0`, then `pvr-1.0.1`).

## Manual checks still required

Physical device matrix rows; Instagram/Facebook/tester activation; GA4 DebugView after env fix.

## Analytics assumptions needing production verification

- `trackEvent` only fires when `NEXT_PUBLIC_GA_MEASUREMENT_ID` + `gtag` exist — currently neither is present in production.
- E2E traffic tags `traffic=e2e` only when `?e2e=1` is allowed (blocked in public production unless `NEXT_PUBLIC_RAGE_RESET_E2E=1`) — confirmed blocked (timer ~35s).
- Allowlist rejects gameplay counts and emotional keys — unit tests Pass.
- `build_version` attached to all Rage Reset events when GA is active.
- Cohort props are local and non-emotional.

## Risky service-worker behaviour (addressed / residual)

| Risk | Status |
|---|---|
| Aggressive `skipWaiting` on install interrupting sessions | **Fixed** — waiting worker until safe activate; production A→B observed |
| Soft reload mid-game | **Mitigated** — defer while play states / `rage-reset-defer-sw` |
| Stale hashed chunks after deploy | Soft reload when safe; network-first navigations; A→B no crash |
| Directory page control | Scope remains `/rage-reset`; homepage controller null; offline directory fetch fails |

## Gaps corrected without expanding product scope

- Central build / release identifiers (now `pvr-1.0.1` / `rage-reset-pvr-2`).
- Allowlist analytics + cohort classification.
- Rebuild-room URL flag gated out of ordinary production.
- Optional mailto feedback on results/progress.
- Safer SW update activation.
- Deployment checklist, GA4 explorations, launch copy, UTM guidance, validation report template, sample-size guidance.
