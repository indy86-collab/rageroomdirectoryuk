# Design refresh and AdSense plan

Updated 9 September 2026. Changes are local; deployment and account settings are not confirmed.

## Design work

Implemented: shorter homepage; shared search and result filters; rage-room-first discovery; clearer venue pricing, duration and age; smaller city heroes; mobile navigation groups; guide topic links; earlier finder and owner forms; quieter promotions and privacy banner; consistent cards; clearly labelled AI activity illustrations where venue photography is unavailable. No AI illustration is represented as a real venue photo.

Validation completed locally:
- TypeScript and lint passed; 47 unit-test files / 272 tests passed.
- 60 selected Chromium desktop/mobile journey tests passed after updating stale expectations for the renamed website link and existing disabled affiliate module (58 passed in the combined run; the full 16-test consent suite then passed).
- Production build passed. Six additional design journey checks passed against the production build, including zero advertising requests on the local editorial guide.
- Visual checks covered desktop/mobile home, product preview, venue facts and sticky booking, activity illustrations, and city layout. No horizontal overflow in the tested mobile discovery journey.

Remaining: deploy and verify the live version, including account-controlled ads/CMP. These local checks do not certify every URL, third-party checkout, or account-side ad placement. Build emitted non-blocking warnings about stale browser compatibility data; dependencies were not changed for this design task.

## AdSense: confirmed invalid-traffic concern

The owner supplied Google's notification on 9 September 2026. It confirms **invalid traffic concerns** and an **account-level ad-serving limit**, with automatic review. This is not the routine account-assessment category. The notice does not identify the source, users, clicks or mechanism responsible. Its examples of prohibited behavior are not evidence that the owner performed any of them.

Owner-confirmed notification date: **9 September 2026 (today)**. The owner reports no paid promotion, SEO/traffic services, or automated tests on the live site. These are not current investigative leads without contradictory evidence. This does not establish whether unsolicited bots or other third-party activity reached the site.

Still unknown: exact enforcement start time, affected products/sites listed in Policy Center, referral sources and request patterns. No account settings have been changed here.

Google distinguishes account assessment from invalid-traffic concerns and automatically reviews serving limits. There is no guaranteed recovery date. A redesign, fewer ads or an ads.txt change cannot guarantee removal. [Google: ad serving limits](https://support.google.com/adsense/answer/9437976?hl=en).

Relevant affiliate and digital-product modules are now visible by default on planning journeys, while each remains explicitly disableable with its environment flag. They are separate from AdSense ad requests and are labelled as sponsored or commercial content.

### Immediate actions

1. **Owner: record remaining Policy Center details.** Notification date is confirmed as 9 September 2026; invalid-traffic enforcement is confirmed. Prioritise acquisition and request-pattern investigation, and follow any account-specific action Google supplies. Include all monetized sites/products affected by this account-level limit, rather than assuming this domain is the only source.
2. **Owner/analytics audit: compare the period before and after the limit.** Segment traffic by source/medium, campaign, landing page, country and device. Compare AdSense impressions, clicks and CTR against analytics engagement and server/CDN requests. Investigate abrupt unexplained changes; CTR or country alone is not proof of abuse. Pause demonstrably low-quality paid/referral sources, traffic exchanges and incentivised traffic. Do not click your own ads or ask others to click them. Do not use automated traffic to test ads. [Google prevention guidance](https://support.google.com/adsense/answer/1112983?hl=en), [traffic segmentation](https://support.google.com/adsense/answer/2583698?hl=en).
3. **Code: isolate QA from live ads — implemented locally.** The loader now requires a production build on the exact public root/www hostname. Localhost, test, preview and lookalike hosts cannot mount it. Unit coverage checks those boundaries. This reduces avoidable exposure; it does not prove QA caused the current limit. Automated tests of a live public deployment must also block advertising requests. New production domains require updating the allowlist deliberately.
4. **Owner: inspect Auto ads settings.** Source code mounts manual ads only on eligible guide/blog pages. A script loaded on an article may remain during client navigation, so source exclusions alone do not establish that Auto ads never appear elsewhere. Mirror the exclusions in `lib/adsense.ts` in AdSense (home, directory/search, venue, city/activity/occasion, checkout, downloads, game and legal sections). Use exact-page versus whole-section exclusions deliberately. Review the account preview for placements near navigation, search, booking, compare and consent controls. Consider disabling overlays that conflict with the mobile booking bar. [Page exclusions](https://support.google.com/adsense/answer/9262311?hl=en), [Auto ads settings](https://support.google.com/adsense/answer/9305577?hl=en).
5. **Owner: verify advertising consent separately.** The site's custom analytics toggle does not certify advertising consent. Check that the Google-certified Privacy & messaging CMP described in the site copy is actually published for this domain and works for relevant visitors. Verify accept/reject/manage paths with ad providers blocked during automated tests. This is a separate compliance check, not a diagnosed cause of this limit. [Google CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en).

### Evidence needed for the traffic investigation

Use **10 August–9 September 2026** for the initial investigation, extending through subsequent available dates and comparing equivalent weekdays where useful. This is an investigation window, not a Google recovery deadline.

- Owner has ruled out paid promotion, SEO/traffic services and live-site automated testing. Prioritise organic/direct/referral patterns, unsolicited automated requests, and placements that could cause accidental clicks. These remain hypotheses; the notice provides no attribution. The local QA safeguard is preventative and is not presented as a fix for a proven cause.
- Collect aggregate analytics by day, source/medium, campaign, landing page, device and country, including sessions and engagement. Collect available AdSense daily impressions, clicks and CTR by site/ad unit. Collect aggregate CDN/server request counts and bot findings. Do not share credentials, raw visitor identifiers or personal data.
- Compare sources around the onset. Analytics consent and bot filtering mean GA4 may not capture every request; triangulate with CDN/server records rather than treating low GA4 traffic as proof there is no problem.
- Keep an incident log with: date, observation, supporting report, suspected explanation, action, and subsequent result. Label each explanation as unconfirmed until evidence supports it. Stop a confirmed harmful source and document the result; do not impose blanket blocks based solely on CTR, location or a guessed threshold.

### Prevention and release acceptance

- Preserve clearly labelled, spaced editorial ad placements. On mobile, verify no ad overlaps or mimics a navigation, booking or game control. Account-level Auto ads can add placements beyond the manual component.
- Review traffic quality weekly and after campaigns: record anomalous source changes, investigations and corrective actions. No scheduled monitor has been created. Avoid arbitrary blanket country blocks; use evidence before introducing bot controls, and preserve legitimate visitors and search crawlers.
- Keep useful original content and supported venue facts; retain visible artwork labels and editorial/image provenance. These support trust but are not claimed as a cure for traffic enforcement.
- Record the Policy Center status and changes until Google updates the limit. If suspicious activity persists, use Google's reporting/support route with evidence. Do not repeatedly submit speculative changes or promise a removal date.

Acceptance: QA sends no live ad requests; core booking/search paths remain usable; owner confirms account exclusions and CMP configuration; traffic review and exact enforcement reason are documented. **Only Google can confirm the serving limit has been lifted.**

## Implementation references

Images use the existing Next.js image component and responsive sizing: [Next.js 14 image optimisation](https://nextjs.org/docs/14/app/building-your-application/optimizing/images). Search/filter URLs preserve the search query while updating filter keys: [Next.js 14 search parameters](https://nextjs.org/docs/14/app/api-reference/functions/use-search-params).

## Analytics inspection — 9 September 2026

Read-only access to the Rageroom GA4 property now works. No account configuration was changed; the reporting date range was restored to its original 28-day selection after inspection.

### Observed in the interface

Traffic acquisition, All Users, 12 August–8 September 2026, reporting 100% of available data:

| Channel | Sessions | Share | Engagement rate | Average engagement per session |
| --- | ---: | ---: | ---: | ---: |
| Organic Search | 3,472 | 89.58% | 67.6% | 26s |
| Direct | 356 | 9.18% | 24.72% | 8s |
| AI Assistant | 35 | 0.90% | 65.71% | 27s |
| Referral | 13 | 0.34% | 69.23% | 1m 36s |
| Organic Social | 9 | 0.23% | 33.33% | 5s |
| Unassigned | 6 | 0.15% | 50% | 2m 27s |
| Organic Shopping | 1 | 0.03% | 100% | 0s |

Total: 3,876 sessions, 2,473 engaged sessions, 63.8% engagement, 25s average engagement per session. No paid channel appears in this table. This does not certify traffic validity or rule out requests absent from GA4.

For **2–8 September 2026**, the same acquisition report shows **2 sessions, both Organic Search, 0 engaged sessions and 4 events**. This is the most material finding: recent GA4 measurement is extremely sparse. It does not establish that the site had only two actual visits.

A GA4 beta insight reports an organic-search drop on 26 August to one session and a Safari decline. That is an automated interpretation, not an independently confirmed browser-level cause. The snapshot's popular pages include Edinburgh venue, near-me and Manchester guide pages, consistent with discovery activity; these page counts do not attribute ad clicks.

### Interpretation and next checks

The measured mix is predominantly organic; there is no large Referral channel in this period. Direct traffic has weaker engagement, but that alone is not evidence of bots. GA4 cannot currently establish what caused the AdSense enforcement, especially given the recent reporting collapse. Its zero revenue field must not be interpreted as an AdSense earnings report.

Repository history includes consent-aware analytics changes on 20 August and subsequent ad/CMP changes on 21 and 25 August. These local history dates do not establish production deployment dates or prove why GA4 dropped. Investigate consent acceptance, production measurement ID, tag loading and deployed changes while preserving consent choices; do not bypass consent to inflate measurement.

Next: obtain Cloudflare analytics/security request totals and AdSense daily impressions/clicks/CTR for the same period, particularly 20 August onward and 2–9 September. Compare whether requests/ad impressions persisted while GA4 fell. If they did, prioritise measurement diagnosis alongside the invalid-traffic investigation. If all fell together, investigate availability and actual acquisition loss. No traffic blocks, ad account changes or deployment were made during this inspection.
