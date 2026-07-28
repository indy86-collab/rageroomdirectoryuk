# Rage Reset — Next Renderer Rebuild Report

## 1. Audit of old visual / rendering problems

The legacy free-smash stage (`SmashGame` + `smashHelpers`) laid objects in a 3-column card grid on a near-black gradient. Objects were small rounded rectangles with permanent text labels — readable as UI tiles, not props in a room. There was no floor/wall/desk environment, no foreground weapon, minimal hit weight (generic particles + AABB), and HUD chrome that read as browser boxes. Cool-down jumped to an unrelated DOM sort UI.

**Rendering:** Custom Canvas 2D + React shell (no Phaser/Pixi/Three). Sufficient for 2.5D arcade if art, depth, camera, and feedback are rebuilt.

## 2. Selected architecture and justification

**Keep Canvas 2D** as a dedicated engine under `lib/rage-reset/engine|scenes|entities|art`, mounted by thin React wrappers.

| Requirement | Why Canvas 2D fits |
|-------------|--------------------|
| Sprite / illustrated objects | Path + gradient illustrators + future `drawImage` |
| Layered room | Explicit draw order (room → props → particles → weapon → HUD) |
| Particles / shake | `ParticlePool` + `CameraController` |
| Touch + hold/swipe | `InputManager` |
| Mobile perf / PWA | Zero new deps; precache-friendly; DPR capped at 2 |
| Reduced-motion | Intensity budgets already in camera/particles |

Avoided heavy 3D (Three.js) — unnecessary for a fixed 2.5D room and costly for mid-range Android.

**Feature flag:** `getGameRenderer()` → `legacy` \| `next`

- Default: **next** (rebuild live)
- Rollback: `NEXT_PUBLIC_RAGE_RESET_GAME_RENDERER=legacy` or `?renderer=legacy` when overrides are allowed

## 3. Before / after

**Before:** Empty stage, labelled floating cards (see product screenshot).

**After (`next`):** Full office room (walls, window, desk, chair, shelves, bin, cables), illustrated props with damage tiers, foreground bat/chicken, integrated HUD, boss spotlight + charge band, cool-down over the wrecked room.

> Capture fresh device screenshots during QA (`?renderer=next`) for the PR gallery — not checked in here to avoid binary churn.

## 4–8. Demonstrations (manual QA checklist)

Use `/rage-reset?renderer=next&debug=1`:

1. Complete smash sequence — room reveal → staggered unlocks → wrecked room
2. Weapon — idle bob, pullback/swing/impact, swipe force, heat glow
3. Damage states — intact → light → medium → heavy → destroy per object
4. Boss — entrance banner, phases 1–3, calm-band release, paper eject on rapid taps
5. Cool-down — debris sort over same office backdrop

## 9. Files created / changed

### Created
- `lib/rage-reset/engine/*` — Camera, Input, Particles, types
- `lib/rage-reset/art/*` — style guide, manifest, office room, object illustrators
- `lib/rage-reset/entities/*` — BreakableObject, Weapon
- `lib/rage-reset/scenes/*` — OfficeMeltdown, PrinterBoss (+ tests)
- `components/rage-reset/game/*` — Viewport, HUD, Pause, NextSmash/Boss/Cooldown
- `public/rage-reset/art/**` — asset folder scaffold + README

### Changed
- `lib/rage-reset/features.ts` — renderer flag
- `lib/rage-reset/content.ts` — Office Meltdown object set expanded
- `lib/rage-reset/audio.ts` — pitch jitter
- `components/rage-reset/RageResetShell.tsx` — mount next vs legacy
- `components/rage-reset/DiagnosticsPanel.tsx` — shows renderer

## 10. Asset sources / rights

Phase 1 art is **original procedural Canvas illustration** authored for Rage Reset (no third-party trademarks). Bitmap/SVG drop-ins go under `public/rage-reset/art/` per `assetManifest.ts`. Audio remains original procedural Web Audio (no copyrighted game SFX).

## 11. Performance (preliminary)

- DPR capped at 2; particle pool size 120 with intensity budgets
- Pause-on-`document.hidden`
- Desktop stage max width 480px (centred)
- Dev FPS readout when `?debug=1`

Physical mid-range Android profiling still required before production cutover.

## 12. Devices tested

- Automated: Vitest (47 tests)
- Manual browser verification: pending on implementer device list (iPhone Safari, mid Android Chrome, desktop)

## 13. Accessibility

- Reduced-effects → reduced camera/particles
- Heat meter + ARIA labels preserved
- Pause dialog, mute controls
- Keyboard 1–6 / Space / Enter still map to strikes
- Cool-down fragments keep accessible labels

## 14. PWA / offline

Unchanged SW scope (`/rage-reset`). Art remains code-drawn (no new precache weight). Offline smash still works without bitmap packs.

## 15. Automated tests

- Unit: existing suites + `art/engineExtras.test.ts` + `scenes/bossPhase.test.ts` — **passing**
- Playwright: existing flow/PWA suites remain; `?e2e=1` selects `next` when overrides allowed
- Screenshot regression suite: **not yet added** (recommended next polish)

## 16. Known limitations

- Procedural art is strong vs cards but not final commercial sprite polish
- Cool-down fragments are still DOM chips over a canvas room (not full physics debris drag inside canvas)
- Kitchen / tech rooms use layout fallbacks (flagship focus is Office Meltdown)
- No captured GIF/video artifacts in-repo yet
- Production still serves **legacy** until explicit env cutover

## 17. Remaining polish before replacing legacy

1. Bitmap/SVG pass for hero props + weapon frames  
2. Screenshot + visual regression pack (mobile + desktop)  
3. Real-device FPS/haptics pass  
4. Optional canvas-native cool-down drag  
5. Set `NEXT_PUBLIC_RAGE_RESET_GAME_RENDERER=next` on preview → prod after sign-off  
6. Remove legacy `SmashGame` / `ControlledSmashGame` draw paths after soak
