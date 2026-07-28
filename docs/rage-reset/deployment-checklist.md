# Rage Reset — production deployment checklist

**Release:** Rage Reset Public Validation Release  
**Build:** `pvr-1.0.0` (see `lib/rage-reset/build.ts`)  
**Do not mark ready if any critical item fails.**

## Application

| Check | Critical? | Result | Notes |
|---|---|---|---|
| `/rage-reset` returns 200 | Yes | | |
| Rage Reset loads without directory Header/Footer | Yes | | |
| Directory pages retain Header/Footer | Yes | | |
| Metadata + canonical `/rage-reset` | Yes | | |
| Open Graph preview works | No | | |
| Sitemap contains `/rage-reset` | Yes | | |
| Robots allow indexing of `/rage-reset` | Yes | | |
| Nav + homepage links work | Yes | | |
| Contextual CTAs → `/rage-reset` | Yes | | |
| No diagnostics in public production | Yes | | Requires `NEXT_PUBLIC_RAGE_RESET_DIAGNOSTICS` unset |
| `?e2e=1` does not accelerate in public production | Yes | | Requires `NEXT_PUBLIC_RAGE_RESET_E2E` unset |
| `?cooldown=rebuild-room` ignored for ordinary prod visitors | Yes | | |

## Game

| Check | Critical? | Result | Notes |
|---|---|---|---|
| Full normal-duration session completes | Yes | | |
| Restart works | Yes | | |
| Resume after refresh works | Yes | | |
| Abandonment not double-counted | Yes | | |
| Local progression persists | Yes | | |
| Delete data clears Rage Reset state (+ visit flag) | Yes | | |
| High scores retain safety suppression | Yes | | |
| Share excludes emotional data | Yes | | |
| Directory promo frequency cap works | No | | |

## PWA

| Check | Critical? | Result | Notes |
|---|---|---|---|
| Manifest valid; icons load | Yes | | |
| `start_url` / `scope` = `/rage-reset` | Yes | | |
| Standalone display works where supported | No | | |
| SW scope limited to Rage Reset | Yes | | |
| Directory pages outside SW control | Yes | | |
| Installable where browser supports | No | | |

## Analytics

| Check | Critical? | Result | Notes |
|---|---|---|---|
| Production GA4 receives expected events | Yes | | |
| Dev/E2E distinguishable or excluded | Yes | | `traffic=e2e` |
| Consent / gtag behaviour correct | Yes | | |
| No score/trigger/emotional values in payloads | Yes | | |

## Sign-off

- Deployed by:  
- Date:  
- Build id observed:  
- Ready for controlled organic launch: Yes / No  
