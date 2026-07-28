# Rage Reset — physical device test matrix

Internal checklist for launch validation. **Do not claim physical-device validation is complete until each row is marked with a date and tester.**

Product build for Public Validation: `pvr-1.0.0` initially; current production after SW A→B is `pvr-1.0.1`.

## Devices / environments

| Environment | Status | Device model | OS | Browser | Mode | Tester | Date | Build | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Recent iPhone Safari | Outstanding | | | | browser | | | | Required for acceptance |
| Older supported iPhone Safari | Outstanding | | | | browser | | | | |
| Recent Android Chrome | Outstanding | | | | browser | | | | Required for acceptance |
| Mid-range Android Chrome | Outstanding | | | | browser | | | | |
| Installed iOS home-screen | Outstanding | | | | standalone | | | | Where Add to Home Screen is supported |
| Installed Android PWA | Outstanding | | | | standalone | | | | Preferred offline target |
| Desktop Chrome | Pass | Cursor IDE Chromium | macOS | Chromium | browser | Cursor agent | 2026-07-28 | `pvr-1.0.0`→`1.0.1` | Full online session; offline shell+free smash; SW A→B |
| Desktop Safari | Outstanding | | | | browser | | | | Playwright WebKit blocked (`PushAPIEnabled`) — not claimed |
| Reduced-motion OS setting | Outstanding | | | | | | | | Covered partially by Playwright |
| Sound disabled | Outstanding | | | | | | | | Covered partially by Playwright |
| Vibration unsupported | Outstanding | | | | | | | | |
| Battery-saving mode | Outstanding | | | | | | | | |
| Poor network | Outstanding | | | | | | | | |
| Fully offline after first load | Partial | Desktop Chromium CDP offline | macOS | Chromium | browser | Cursor agent | 2026-07-28 | `pvr-1.0.0` | See `pwa-offline.md`; Android/iOS still outstanding |

## Per-device behaviours

For every device, record Pass / Fail / Partial and attach screenshot/recording refs for failures:

- First load / repeat load
- Touch responsiveness / accidental page scrolling
- Canvas size and sharpness
- Address-bar collapse/expansion / safe-area insets
- Sound init / audio interruption recovery
- Haptics / haptic fallback
- Reduced-motion / screen shake off
- Free smash / heat / controlled timing / cool-down drag
- Final check-in / results / replay / share
- Local progress / refresh recovery / data deletion
- Repeated sessions (memory after ≥5 consecutive)

## Automating vs manual

| Area | Automated today | Still manual |
|---|---|---|
| Full accelerated session | Playwright `rage-reset-full.spec.ts` | Feel of timing / haptics |
| Refresh restore | Playwright | iOS swipe-back quirks |
| SW scope / manifest | Playwright `rage-reset-pwa.spec.ts` | True offline after install |
| Route migration | Playwright `routes-regression.spec.ts` | Visual header/footer QA |
| Reduced motion / mute | Playwright | Battery saver / call interrupt |
| SW A→B | Production deploy evidence in `sw-update-protocol.md` | Physical installed-PWA update |

Last updated: 2026-07-28 — Production deployed; desktop evidence recorded; physical iPhone/Android still outstanding.
