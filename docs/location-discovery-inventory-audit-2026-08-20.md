# Activity and occasion location inventory audit

Audit date: 20 August 2026  
Source: the 43 verified records in `data/listings.json`

## Method

- City counts use the venue's exact structured `city` value.
- Region counts use the venue's exact non-empty structured `region` value. Eleven records with no region are excluded from the region matrix, not inferred.
- The raw audit covers nine activity values and seven occasion values across 40 cities and 27 populated regions: 1,072 inventory cells (640 city cells and 432 region cells).
- Zero- and one-venue cells were calculated but are suppressed below because they cannot qualify. There are 1,060 such cells.
- Route evaluation follows the existing six occasion landing definitions, where `kids` and `families` share one parent intent, across the 40 canonical city slugs: 600 route candidates.
- London retains the existing explicit canonical city rule: listings whose structured city or region is London are included. This gives three unique London rage-room listings. No distance-based or nearby-town matching is used.

## City combinations with at least two verified venues

| Type | Activity / occasion | City | Verified venues | Decision |
| --- | --- | --- | ---: | --- |
| Activity | Rage Room | Birmingham | 3 | Create; strong inventory |
| Activity | Rage Room | Leicester | 2 | Hold; duplicates existing city intent without enough extra choice |
| Occasion | Birthday | Birmingham | 2 | Create; commercially meaningful and the two verified birthday matches differ |

## Region combinations with at least two verified venues

| Type | Activity / occasion | Region | Verified venues | Decision |
| --- | --- | --- | ---: | --- |
| Activity | Rage Room | Bedfordshire | 2 | Hold; no region discovery route at this inventory level |
| Activity | Rage Room | County Durham | 2 | Hold; no region discovery route at this inventory level |
| Activity | Rage Room | Leicestershire | 2 | Hold; no region discovery route at this inventory level |
| Activity | Rage Room | Lincolnshire | 2 | Hold; no region discovery route at this inventory level |
| Activity | Rage Room | London | 2 | Combined only through the documented London canonical city rule |
| Occasion | Birthday | Bedfordshire | 2 | Monitor; region intent is weaker than a city page |
| Occasion | Stag Party | Bedfordshire | 2 | Monitor; region intent is weaker than a city page |
| Occasion | Hen Party | Bedfordshire | 2 | Monitor; region intent is weaker than a city page |
| Occasion | Corporate | Bedfordshire | 2 | Monitor; region intent is weaker than a city page |

## Canonical route decisions

| Type | Activity / occasion | Canonical location | Verified venues | Page created? |
| --- | --- | --- | ---: | --- |
| Activity | Rage Room | Birmingham | 3 | Yes |
| Activity | Rage Room | London | 3 | Yes; structured city-or-region rule |
| Occasion | Birthday | Birmingham | 2 | Yes; explicit two-venue editorial approval |
| Activity | Rage Room | Leicester | 2 | No |

No adjacent activity (axe throwing, paint splatter, car smash, escape room, archery, VR, target activity or mobile rage room) has two verified matches in one canonical city location. No other occasion has two verified matches in one canonical city location.

## Eligibility policy

- Three or more matching verified venues: eligible.
- Two matching verified venues: ineligible by default; requires an explicit entry in the central editorial approval set.
- Zero or one matching venue: ineligible.
- Category slug, location slug, exact matching, threshold and two-venue approvals are resolved by the same central functions used by page rendering, metadata, static params, sitemap generation and internal links.
- Price, age, distance, sorting, group-size, multi-activity and multi-occasion states remain filters and never become permanent landing routes.
