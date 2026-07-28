# Rage Reset — controlled organic launch

No paid ads in this phase. Keep existing discovery placements live.

## Channels

1. RageRoom Directory homepage (`Rage Reset is live` feature)
2. Main navigation + footer
3. Existing guide CTAs (`RageResetCTA`)
4. Venue / listing CTAs
5. One or two social posts (see `launch-copy.md`)
6. Direct share with a small tester group
7. Existing organic visitors

## UTM / src conventions

Campaign: `rage_reset_pvr`  
Medium: `organic`  
Only campaign-level source information — **never** scores, triggers, or personal data in URLs.

| Channel | Example URL |
|---|---|
| Homepage | `/rage-reset?src=homepage&utm_source=homepage&utm_medium=organic&utm_campaign=rage_reset_pvr` |
| Navigation | `/rage-reset?src=nav&utm_source=nav&utm_medium=organic&utm_campaign=rage_reset_pvr` |
| Guide CTA | `/rage-reset?src=guide&utm_source=guide&utm_medium=organic&utm_campaign=rage_reset_pvr` |
| Venue listing | `/rage-reset?src=listing&utm_source=listing&utm_medium=organic&utm_campaign=rage_reset_pvr` |
| Instagram | `/rage-reset?src=instagram&utm_source=instagram&utm_medium=organic&utm_campaign=rage_reset_pvr` |
| Facebook | `/rage-reset?src=facebook&utm_source=facebook&utm_medium=organic&utm_campaign=rage_reset_pvr` |
| Direct tester | `/rage-reset?src=tester&utm_source=tester&utm_medium=organic&utm_campaign=rage_reset_pvr` |
| Share card | `/rage-reset?src=share&utm_source=share&utm_medium=organic&utm_campaign=rage_reset_pvr` |

`entry_source` in analytics is derived from `src` / `utm_source` / referrer (see `lib/rage-reset/displayMode.ts`).

## Activation log

| Channel | Activated? | Date | Owner | Notes |
|---|---|---|---|---|
| Homepage | Live in code | | | Confirm after deploy |
| Nav / footer | Live in code | | | |
| Guides / listings | Live in code | | | |
| Instagram post | Pending | | | |
| Facebook post | Pending | | | |
| Tester group | Pending | | | |
