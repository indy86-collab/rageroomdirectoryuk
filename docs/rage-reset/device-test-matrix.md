# Rage Reset — physical device test matrix

Internal checklist for launch validation. **Do not claim physical-device validation is complete until each row is marked with a date and tester.**

Product build for Public Validation: `pvr-1.0.0`

## Devices / environments

| Environment | Status | Device model | OS | Browser | Mode | Tester | Date | Build | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Recent iPhone Safari | Outstanding | | | | browser | | | | |
| Older supported iPhone Safari | Outstanding | | | | browser | | | | |
| Recent Android Chrome | Outstanding | | | | browser | | | | |
| Mid-range Android Chrome | Outstanding | | | | browser | | | | |
| Installed iOS home-screen | Outstanding | | | | standalone | | | | Where Add to Home Screen is supported |
| Installed Android PWA | Outstanding | | | | standalone | | | | |
| Desktop Chrome | Outstanding | | | | browser | | | | |
| Desktop Safari | Outstanding | | | | browser | | | | |
| Reduced-motion OS setting | Outstanding | | | | | | | | |
| Sound disabled | Outstanding | | | | | | | | Covered partially by Playwright |
| Vibration unsupported | Outstanding | | | | | | | | |
| Battery-saving mode | Outstanding | | | | | | | | |
| Poor network | Outstanding | | | | | | | | |
| Fully offline after first load | Outstanding | | | | | | | | See `pwa-offline.md` |

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
| SW A→B | Docs + code strategy | Real deploy simulation |

Last updated: 2026-07-28 — Public Validation Release prepared; physical runs still outstanding.
