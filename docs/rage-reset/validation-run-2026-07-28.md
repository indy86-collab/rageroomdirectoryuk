# Rage Reset — automated + production validation run

Date: 2026-07-28  
Builds: `pvr-1.0.0` (A) → `pvr-1.0.1` (B)

## Local automated

| Command | Result |
|---|---|
| `npm test` (Vitest) | Pass — 39 tests |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass |
| Playwright `mobile-chrome` | Pass — 45 tests |
| Playwright `mobile-safari` | Blocked — WebKit `PushAPIEnabled` protocol error on this macOS Playwright build (environment), not an app assertion failure |

## Production evidence collected

* Deploy A `53eb148` / `dpl_8f96rd4GNDcgKGftRGaJVYq9NZCq` live at https://www.rageroomdirectory.co.uk/rage-reset
* Desktop full online session (check-in 5 → Office Meltdown → bat → free → controlled → cool-down → results → progress → delete)
* High-intensity initial safety dialog (score 10)
* `?e2e=1` does not accelerate (timer ~32–35s)
* `?cooldown=rebuild-room` does not store override
* Directory isolation + SW A→B (see sibling docs)
* Desktop offline shell + free smash
* Feedback mailto verified

## Still required

* Physical iPhone + Android full sessions (and preferred installed-PWA offline)
* Configure `NEXT_PUBLIC_GA_MEASUREMENT_ID` + production GA4 DebugView/Realtime payload inspection
* Human activation of Instagram / Facebook / tester channels
* Behavioural sample (≥100 starts) before gameplay/monetisation decisions
