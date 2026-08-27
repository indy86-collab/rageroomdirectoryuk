# Directory analytics event contract

All events in this contract obey the central Analytics consent preference. On a fresh or rejected visit, `trackDirectoryEvent()` and the underlying `trackEvent()` no-op; components must not add their own consent checks. See `docs/privacy-tracking-audit.md` for provider loading, withdrawal and network verification.

This document defines the anonymous conversion-attribution events for RageRoom Directory. It is the contract for future reporting and venue attribution work; it is not a venue dashboard or billing system.

## Provider and delivery

- GA4 is the existing custom-event provider. `trackDirectoryEvent` in `lib/analytics.ts` is the only provider bridge for the events below.
- Events fire client-side through the existing non-blocking `gtag("event", ...)` mechanism immediately before an interaction continues.
- Vercel Analytics continues to provide page analytics. Cloudflare Web Analytics also remains initialized globally. Neither is duplicated by this event layer.
- Direct booking, website and telephone destinations are unchanged. There are no redirect, proxy, interstitial or affiliate parameters in this layer.
- If GA4 is unavailable or blocked, the interaction still proceeds and no fallback network request is made by application code.

## Conversion hierarchy

### Primary conversion

`booking_click` is the strongest current indicator that RageRoom Directory generated booking intent. It is emitted only for audited venue `bookingUrl` actions.

### Secondary commercial intent

- `phone_click`
- `website_click`
- `claim_listing_click`

### Discovery and engagement

- `venue_view`
- `compare_add`
- `compare_remove`
- `compare_open`
- `filter_apply`
- `filter_clear`
- `activity_discovery_click`
- `occasion_discovery_click`
- `location_discovery_click`

## Event catalogue

| Event | Meaning | Required properties | Optional properties |
| --- | --- | --- | --- |
| `venue_view` | An individual venue detail route was viewed | `venueSlug`, `venueCity` | `sourcePath` (same-origin referrer path only) |
| `booking_click` | User opens a verified venue booking destination | `venueSlug`, `pageType`, `sourcePath`, `ctaPlacement` | `venueCity`, `activity`, `occasion`, `discoveryLocation`, `comparisonContext` |
| `website_click` | User opens a venue's generic website, not a verified booking destination | `venueSlug`, `pageType`, `sourcePath`, `ctaPlacement` | `venueCity`, `activity`, `occasion`, `discoveryLocation`, `comparisonContext` |
| `phone_click` | User activates a venue `tel:` link | `venueSlug`, `pageType`, `sourcePath`, `ctaPlacement` | `venueCity`, `activity`, `occasion`, `discoveryLocation`, `comparisonContext` |
| `claim_listing_click` | Venue owner enters an existing claim-listing flow | `venueSlug`, `pageType`, `sourcePath`, `ctaPlacement` | `venueCity`, `activity`, `occasion`, `discoveryLocation`, `comparisonContext` |
| `compare_add` | Venue is added to the comparison shortlist | `venueSlug`, `sourcePageType`, `sourcePath` | — |
| `compare_remove` | Venue is removed from the comparison shortlist, including clear-all | `venueSlug`, `sourcePageType`, `sourcePath` | — |
| `compare_open` | The comparison table becomes visible with at least two venues | `venueCount`, `sourcePageType`, `sourcePath` | — |
| `filter_apply` | A deliberate structured filter change is made | `filterType`, `filterValue`, `filterAction`, `pageType`, `sourcePath` | `distanceFilterUsed` |
| `filter_clear` | Active directory filters are reset | `pageType`, `sourcePath`, `filterCount` | — |
| `activity_discovery_click` | User follows a curated activity discovery link | `sourcePageType`, `sourcePath`, `destinationIdentifier`, `destinationPath` | — |
| `occasion_discovery_click` | User follows a curated occasion discovery link | `sourcePageType`, `sourcePath`, `destinationIdentifier`, `destinationPath` | — |
| `location_discovery_click` | User follows an inventory-backed location discovery link | `sourcePageType`, `sourcePath`, `destinationIdentifier`, `destinationPath` | — |

`filterAction` is one of `add`, `remove` or `set`. `comparisonContext`, when present, is `active`; venue lists add it to booking events while a comparison table is open.

## Organic authority events

These reuse `trackEvent()` / consent. They are not conversion events and never include search text, postcodes, names or email addresses.

| Event | Meaning | Properties |
| --- | --- | --- |
| `badge_code_copied` | Venue-owner copies listing badge HTML | `variant` (`compact` or `standard`), `venueSlug` |
| `venue_profile_link_copied` | Venue-owner copies the canonical profile URL | `venueSlug` |
| `widget_loaded` | Finder widget mounted | `source` (`embed` or `preview`) |
| `widget_search` | Finder search submitted | `queryKind` (`postcode`, `city` or `invalid`), `resultCount` |
| `widget_result_click` | Finder result opened | `resultType` (`city`, `region` or `venue`) |
| `widget_embed_code_copied` | Publisher copies iframe snippet | `customisation` (`default` or `custom`) |
| `report_citation_copied` | Visitor copies the flagship report citation | `surface` (`flagship_report`) |
| `report_dataset_downloaded` | Visitor downloads the aggregate report CSV | `format` (`csv`) |
| `insight_directory_click` | Visitor follows a research page link into the directory | `destinationKind` (`city`, `region`, `activity`, `occasion`, `listings` or `prices`), `destinationPath` |

## Central values

### Page types

`homepage`, `venue`, `city`, `activity`, `occasion`, `activity_location`, `occasion_location`, `comparison`, `search_results`, `guide`

### CTA placements

`venue_card`, `venue_hero`, `venue_booking_section`, `venue_pricing`, `venue_contact`, `comparison_table`, `activity_results`, `occasion_results`, `location_results`, `homepage_featured`, `near_me_results`, `listing_owner_panel`

### Filter types

`activity`, `occasion`, `city`, `price`, `age`, `group_size`, `rating`, `online_booking`, `corporate`, `verified`, `distance`, `sort`

CTA placement identifiers are independent of visible copy. Copy can change without fragmenting attribution.

## Booking attribution coverage

- Directory, city, activity, occasion and activity/occasion-location venue cards
- Near-me results
- Venue hero
- Venue pricing section
- Venue booking/visit section

There is currently no outbound booking action in the homepage featured cards or comparison table, so those surfaces do not emit a fake booking conversion. Booking actions on result cards include activity, occasion, normalized discovery location and active-comparison context when those values genuinely apply.

## Privacy and sanitisation

The event map and per-event runtime allow-lists reject unsupported properties. Path sanitisation removes query strings and fragments. The layer does not accept or send:

- names or email addresses
- telephone numbers (venue slug is used for `phone_click`)
- form or claim content
- arbitrary search or postcode text
- IP addresses from application code
- latitude, longitude or exact coordinates
- user or cross-site identifiers

Geolocation filtering records `distanceFilterUsed: true` and a normalized distance band such as `25_miles`; it never records coordinates.

## Consent status

GA4, Vercel Web Analytics and Cloudflare Web Analytics are initialized only after a valid, current Analytics opt-in. `trackEvent()` is the central enforcement point, so the typed directory API safely no-ops for fresh and rejected visitors. Components must never bypass this layer or infer consent from scrolling, navigation, geolocation permission or map interaction. Withdrawal stops subsequent events, updates Google consent state, clears removable first-party analytics state and reloads to unload active providers.

## Reporting readiness

The contract supports future analysis by venue, venue city, discovery category, location page, source route, CTA placement and active comparison context. CTR, low-converting venues, claimed/unclaimed joins and commercial reporting should be calculated in the analytics/reporting layer later; they are not calculated or stored by the directory application.
