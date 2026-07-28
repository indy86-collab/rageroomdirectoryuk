# Rage Reset — GA4 exploration setup

Configure these in GA4 Explorations (or equivalent). Filter out `traffic=e2e` where present.  
Dimension: `build_version` ≈ `pvr-1.0.0` for this release.  
**Do not report on check-in scores or trigger categories.**

## Main completion funnel

```text
rage_reset_view
→ rage_reset_start
→ rage_reset_free_smash_complete
→ rage_reset_controlled_smash_complete
→ rage_reset_cooldown_complete
→ rage_reset_session_complete
```

Report:

* Total users / sessions
* Step completion and abandonment
* By device category
* By `display_mode` (browser / standalone)
* By `room_id` / `weapon_id`
* By `entry_source`
* By `visitor_cohort` / `player_cohort` where useful

Also monitor `rage_reset_session_abandoned` broken down by `stage` and `duration_bucket`.

## Replay funnel

```text
rage_reset_session_complete
→ rage_reset_second_session_start
```

Report:

* Same-visit replay rate
* Replay by room / device / entry source

## Directory-impact funnel

```text
rage_reset_session_complete
→ rage_reset_directory_cta_clicked
```

Breakdown `cta_destination`: `near_me` | `listings` | `group_planner` | `directory`.

Report eligible completed sessions, CTA clicks, and downstream directory page views if available via site analytics (not emotional data).

## Sharing funnel

```text
rage_reset_session_complete
→ rage_reset_share_started
→ rage_reset_share_completed
```

Use `method` (`native_file` / `native_text` / `download` / `clipboard`) to separate browser support from intent.

## Install funnel

```text
rage_reset_install_prompt_shown
→ rage_reset_installed
```

## Allowed event properties

`room_id`, `weapon_id`, `returning_user`, `visitor_cohort`, `player_cohort`, `display_mode`, `sound_enabled`, `haptics_enabled`, `reduced_effects`, `entry_source`, `stage`, `duration_bucket`, `completed`, `skipped`, `cooldown_skipped`, `cooldown_variant`, `cta_destination`, `surface`, `method`, `build_version`, `traffic`, `daily_challenge_completed`, `reason`.

## Never send / never build reports around

Initial/final scores, deltas, triggers, history payloads, safety cause, free text, calm energy as identity, emotional profiles.
