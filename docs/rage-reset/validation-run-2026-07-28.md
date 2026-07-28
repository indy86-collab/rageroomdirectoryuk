# Rage Reset — automated validation run (Public Validation prep)

Date: 2026-07-28  
Build: `pvr-1.0.0`

| Command | Result |
|---|---|
| `npm test` (Vitest) | Pass — 39 tests |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass |
| Playwright `mobile-chrome` (rage-reset + full + pwa + routes) | Pass — 45 tests |
| Playwright `mobile-safari` | Blocked — WebKit `PushAPIEnabled` protocol error on this macOS 14 Playwright build (environment), not an app assertion failure |

## Still required (manual / production)

* Physical iPhone + Android full sessions
* True offline protocol (`pwa-offline.md`)
* SW A→B (`sw-update-protocol.md`)
* Production GA4 DebugView / Realtime payload inspection
* Deploy Public Validation Release + activate social/tester channels
* Fill `public-validation-report.md` after evidence exists
