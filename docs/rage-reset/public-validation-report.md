# Rage Reset — public validation report

Fill this after the Public Validation Release is live and evidence is collected.  
**Do not invent device or GA4 results.**

## Release information

* Release name: Rage Reset Public Validation Release
* Build version: `pvr-1.0.0` (initial production) → `pvr-1.0.1` (SW A→B follow-up; current production)
* Production deployment date: 2026-07-28
  * Build A: commit `53eb148`, deploy `dpl_8f96rd4GNDcgKGftRGaJVYq9NZCq`, 2026-07-28T21:21:15Z / 22:21:15 Europe/London
  * Build B: commit `1739d18`, deploy `dpl_CqXUESUZeuWFpAHMZNGyD4nJ1rM1`, 2026-07-28T21:35:40Z / 22:35:40 Europe/London
* Production URL: https://www.rageroomdirectory.co.uk/rage-reset
* Validation period: started 2026-07-28 — ongoing
* Traffic sources used: homepage / nav / footer / guides (code live); Instagram / Facebook / tester group **pending human activation**

## Technical validation

* Devices tested:
  * Desktop Chromium (Cursor IDE browser) — Pass for full online session + offline shell/free-smash + SW A→B
  * Physical iPhone — Outstanding
  * Physical Android — Outstanding
* Browsers tested: Desktop Chromium production smoke; Playwright `mobile-chrome` (45 pass); Playwright WebKit blocked by `PushAPIEnabled` tooling issue (not claimed as Safari coverage)
* PWA installation results: Outstanding on physical devices; manifest/icons/SW scope verified in production
* Offline results: Desktop Pass (partial) — see `pwa-offline.md`
* Service-worker update results: Pass (with mid-session deferral Partial) — see `sw-update-protocol.md`
* Critical defects:
  * **Blocked analytics:** `NEXT_PUBLIC_GA_MEASUREMENT_ID` is not configured in Vercel env — production HTML has no `gtag` config; Rage Reset events cannot reach GA4 until this is set and redeployed
* Non-critical defects:
  * Homepage “Play free” click via automation did not navigate once (direct `/rage-reset?...` URL works; link href present with correct UTMs)
  * Playwright `mobile-safari` project cannot start pages in this environment (`PushAPIEnabled`)

## Acquisition

* Page views (`rage_reset_view`): Awaiting GA4 (blocked)
* Starts (`rage_reset_start`): Awaiting GA4 (blocked)
* Start rate: Awaiting sample
* Entry-source breakdown: Awaiting GA4 (blocked)

## Completion

* Free-smash completion: Awaiting GA4 (blocked)
* Controlled-smash completion: Awaiting GA4 (blocked)
* Cool-down completion: Awaiting GA4 (blocked)
* Full-session completion: Awaiting GA4 (blocked); technical smoke completed one full production session on desktop
* Abandonment by stage: Awaiting GA4 (blocked)

## Retention

* Same-visit replay (`rage_reset_second_session_start`): Awaiting GA4 (blocked)
* Seven-day return: Too early
* Daily challenge participation: Local “Completed today” observed in smoke; remote count awaiting GA4
* Progress-screen usage: Smoke Pass (UI)
* PWA install rate: Outstanding / awaiting events

## Engagement

* Rooms selected: Smoke used Office Meltdown
* Weapons selected: Smoke used Baseball bat
* Share-start rate: Awaiting GA4 (blocked); Share button present on ordinary results
* Share-completion rate: Awaiting GA4 (blocked)
* Feedback themes: None yet — mailto feedback link verified on results/progress

## Directory impact

* Eligible sessions: Awaiting GA4 (blocked)
* Directory CTA clicks: Awaiting GA4 (blocked)
* Venue-finder visits: Awaiting GA4 (blocked)
* Venue-listing visits: Awaiting GA4 (blocked)
* Group-planner visits: Awaiting GA4 (blocked)

## Privacy audit

* Analytics payload inspection: **Blocked** — no production GA measurement ID / gtag
* Emotional-data exclusion: Unit allowlist tests Pass; live payload inspection pending GA config
* Trigger-data exclusion: Unit allowlist tests Pass; live payload inspection pending GA config
* Safety-state exclusion: Unit allowlist tests Pass; live payload inspection pending GA config
* Error-telemetry review: Error boundary uses build id only; no emotional fields observed in smoke UI
* Feedback mailto body explicitly asks not to include private/medical/sensitive details

## Controlled launch activation

| Channel | Status | Date |
|---|---|---|
| Homepage feature | Live in production | 2026-07-28 |
| Nav / footer | Live in production | 2026-07-28 |
| Guides / listings CTAs | Live in production | 2026-07-28 |
| Instagram post | Pending human post | |
| Facebook post | Pending human post | |
| Tester group / WhatsApp | Pending human share | |

Suggested copy remains in `launch-copy.md`. Do not begin paid ads. Do not claim therapy/medical benefit.

## Decision

Choose one (cite data or repeated feedback):

* Continue free validation — **current recommendation** (technical deploy live; behavioural sample blocked without GA4)
* Improve free-smash gameplay
* Improve controlled-smash stage
* Replace or shorten cool-down
* Improve replay and progression
* Improve PWA installation
* Expand directory integration
* Begin visual polish of another room
* Prepare lifetime paid upgrade
* Pause further investment

### Decision rationale

(Observed data / feedback:)

Technical surfaces for Rage Reset are live on production. No monetisation or major feature expansion was added. Behavioural gates cannot be evaluated until GA4 is configured and ≥100 real starts accumulate. Physical iPhone/Android validation remains outstanding.

## Sample-size reminder

See `sample-size-guidance.md`. Do not make large product changes on fewer than 100 starts unless there is a technical failure, severe drop-off, consistent feedback, or a safety/privacy defect.

Current estimated real starts available for reporting: **unknown / effectively 0 in GA4** until measurement ID is configured.
