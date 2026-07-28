# Rage Reset — launch metrics (decision gates)

Internal evaluation thresholds for the free product validation phase. **Not** industry benchmarks. **Do not hard-code these into product behaviour.**

## Funnel (GA4)

Configure exploration / funnel:

```text
rage_reset_view
→ rage_reset_start
→ rage_reset_free_smash_complete
→ rage_reset_controlled_smash_complete
→ rage_reset_cooldown_complete
→ rage_reset_session_complete
```

Retention / directory branches:

```text
rage_reset_session_complete → rage_reset_second_session_start
rage_reset_session_complete → rage_reset_directory_cta_clicked
```

Also monitor: `rage_reset_session_abandoned` (by `stage`), `rage_reset_install_prompt_shown`, `rage_reset_installed`, `rage_reset_share_*`, `rage_reset_discovery_clicked`.

## Allowed event properties

Room ID, weapon ID, new/returning local user, visitor/player cohort, browser/standalone mode, sound/haptics/reduced-effects flags, entry source category, session stage, duration bucket, completed flag, cool-down skipped, CTA destination category, `build_version`, traffic=`e2e` for test traffic.

## Never send

Initial/final scores, score deltas, triggers, history payloads, safety cause, score 9/10 flags, free text, calm energy as a profile identifier, any emotional identifiers, raw gameplay counts not on the allowlist.

## Acquisition / completion / retention / directory

- Start rate = `rage_reset_start` / `rage_reset_view`
- Stage completion via funnel events; abandonment via `rage_reset_session_abandoned.stage`
- Same-visit replay via `rage_reset_second_session_start`
- Approximate return via `visitor_cohort` / `returning_user` + seven-day review window
- Directory impact via `rage_reset_directory_cta_clicked` (`cta_destination`)

## Decision gates (guidelines only — not hard-coded)

| Gate | Threshold |
|---|---|
| Full-session completion among starters | > 50% |
| Controlled-smash completion among those who reach it | > 70% |
| Cool-down completion among those who reach it | > 70% |
| Completed users who start another session within 7 days | ≥ 15% |
| Eligible ordinary completed sessions with a directory interaction | ≥ 5% |
| Technical | No repeatable critical mobile defect; offline after first load; SW A→B safe; no emotional data in remote logs |

Use these only for go / iterate / pause decisions on the free product — not for monetisation assumptions.

See also: `ga4-explorations.md`, `sample-size-guidance.md`, `public-validation-report.md`.
