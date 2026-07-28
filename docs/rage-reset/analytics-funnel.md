# Rage Reset — analytics funnel reference

## Core completion funnel

1. `rage_reset_view`
2. `rage_reset_start`
3. `rage_reset_room_selected`
4. `rage_reset_weapon_selected`
5. `rage_reset_free_smash_complete`
6. `rage_reset_controlled_smash_complete`
7. `rage_reset_cooldown_complete`
8. `rage_reset_session_complete`

## Secondary

- `rage_reset_session_abandoned` — last stage, duration bucket, room/weapon if known, display mode
- `rage_reset_second_session_start`
- `rage_reset_directory_cta_clicked`
- `rage_reset_discovery_clicked` — nav / homepage / listing / guide
- `rage_reset_share_started` / `rage_reset_share_completed`
- `rage_reset_install_prompt_shown` / `rage_reset_installed`

## Privacy

Implemented in `lib/rage-reset/analytics.ts` with an **allowlist** plus sensitive-key denylist. Emotional check-in scores and triggers never leave the device.

E2E traffic tags params with `traffic=e2e` when `?e2e=1` is active in non-production (or when `NEXT_PUBLIC_RAGE_RESET_E2E=1`).

Every event includes non-identifying `build_version` (e.g. `pvr-1.0.0`).

Cohort props: `visitor_cohort`, `player_cohort`, `returning_user`, `display_mode`.

GA4 exploration setup: `ga4-explorations.md`.
