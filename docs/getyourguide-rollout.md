# GetYourGuide conversion rollout

Implementation prepared 20 October 2026. Venue booking remains the primary action. No booking widgets are installed.

## Baseline and interpretation

Account general performance, 20 September–19 October: 195 referred visitors, one booking, 0.51% conversion, £3.12 potential commission. Traffic increased 52.34%. These are visitors sent to GetYourGuide, not directory page views. The activity report uses a different reporting window; do not add its counts to this baseline. FunnyBoyz produced the reported booking, but one booking does not establish a winning product or placement.

## Review page

`/preview/getyourguide` displays the curated modules for all five pilot cities even while the curated rollout flag is off. It is marked noindex/nofollow and uses a separate `preview` campaign placement so review clicks can be excluded from production conversion comparisons. Analytics consent and the global affiliate switch still apply.

## Deployment sequence and rollback

Both options are public Next.js build-time settings; changing them requires a new build/deployment. They also respect `NEXT_PUBLIC_AFFILIATE_LINKS_ENABLED=false`.

1. **Measurement release:** set `NEXT_PUBLIC_GYG_ANALYZER_ENABLED=true`, `NEXT_PUBLIC_GYG_CURATED_ENABLED=false`. Existing recommendation presentation remains available, with module/card visibility tracking and city-aware campaigns. Verify consent behaviour in the deployed browser. Check the account Integrations report after up to 24 hours of real consented visits. No artificial affiliate test clicks are necessary.
2. **Recommendation release:** set `NEXT_PUBLIC_GYG_CURATED_ENABLED=true`. The verified product catalogue applies in London, Manchester, Birmingham, Edinburgh and Liverpool. Other cities keep one labelled local-browse route. The default is the measurement release (`curated=false`, `analyzer=true`). Enable the product presentation explicitly only after confirming measurement.
3. To revert product presentation, set curated=false and rebuild. To stop the Analyzer independently, set analyzer=false and rebuild. Outbound links remain functional when analytics is rejected. Do not compare old `rageroom_*` campaigns directly with new `rr2_*` campaigns without accounting for this change.

No deployment or account setting has been changed by preparing this implementation.

## Editorial operation

`lib/getyourguide-catalogue.ts` is the shared catalogue for normal and commercial modules. Each product records its ID, canonical destination, city, audience, timings, source URL and verification date. All six launch products were read on their public GetYourGuide product pages on 20 October 2026. Inventory was selected from the existing city picks and account activity evidence; no claim is made that these are bestsellers. FunnyBoyz admission details must be checked for the selected ticket; we restrict its editorial eligibility to adult groups and only after physical activity. Edinburgh’s terror tour is explicitly 18+.

Review the source pages weekly and before significant promotion. If a product closes, disappears or loses appropriate inventory, mark its `status` unavailable immediately. Date-specific stock is checked on GetYourGuide; `active` means editorially eligible, not a claim of bookable dates. Record a fresh verification date only after reading the source again. The maximum is two products, not a requirement to fill two slots. A missing match produces an honest empty state and a city-browse link, without silently broadening the planner search. Family context excludes adult nightlife; alcohol-related products require an explicit after-session timing.

No approved affiliate image assets were available at implementation. Complete text cards are the deliberate fallback. Add an `image` only with an approved `src`, accurate `alt` and the authorising `approvedSource`; do not copy arbitrary provider photos. Do not introduce static price, rating, availability, saving or cancellation claims unless a maintained, approved feed supports them.

## Measurement contract

- `affiliate_module_view`: the module itself becomes at least 25% visible.
- `affiliate_offer_view`: an individual linked card becomes at least 25% visible; module visibility does not count all its cards.
- `affiliate_click`: outbound intent; never a completed booking.
- Existing planner start/answer/complete events remain consent-controlled.
- `campaign_id` exactly matches the link’s `cmp`; `product_id` identifies a specific product. Browse routes have a recommendation ID but no product ID. Campaign format is `rr2_{placement}_{city}_{occasion-or-general}_{recommendation-id}`. Planner changes retain the originating placement. Only bounded editorial identifiers and the pathname are sent, never query strings or form data.
- Dedupe is per module, route and campaign. Filtering a card away and back does not create another impression in that module. Views occurring before consent are not marked recorded; a visible card can be measured after consent or analytics initialization. No impressions are replayed for cards that have already left view.
- GetYourGuide Analyzer is separate from GA4 events and attribution. It initializes once, with partner IZRRCJT, after analytics consent and only if the current DOM contains an eligible sponsored affiliate link. Its script URL is the official `https://widget.getyourguide.com/dist/pa.umd.production.min.js`.
- Consent withdrawal uses the existing reload boundary to stop third-party execution. There is no documented Analyzer unload API. Navigating from an offer page to a page without offers also reloads the destination after the DOM settles, ensuring the Analyzer execution context does not persist there. Removing a script tag alone would not stop its listeners.

## Weekly review

Register event-scoped GA4 dimensions `campaign_id`, `product_id`, `recommendation_id`, `affiliate_placement`, `city`, `occasion` if needed for reports (avoid treating registration as retroactive). Use existing directory page/booking events to count eligible page views and direct venue booking clicks. Consent coverage means GA4 page views are a measured subset, not all traffic. Segment by route/city/placement and consented session, rather than dividing account-wide referrals by unrelated site page views.

Record each week:

| Week / city / placement | Eligible measured page views | Module views | Product card views | Affiliate clicks | GYG referred visitors | Bookings | Potential commission | Confirmed commission | Direct venue booking clicks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Baseline: 20 Sep–19 Oct, all | Not measured | Not measured | Not measured | Not measured | 195 | 1 | £3.12 | Check account | Check GA4 |

Compare click/card-view rate, referral conversion, commission and direct venue booking clicks per eligible measured page view. Match windows and campaign IDs; click counts and unique referred visitors are different measures. Check unassigned campaigns, broken destinations and consented Integrations coverage. Review initially after 30 days from the recommendation deployment and again after the 31-day attribution window has matured; refunds and commission confirmation can take longer. The initial target is 1% referral conversion (around two bookings at this traffic level), not a forecast or statistically proven uplift. Falling venue booking engagement is a guardrail signal, not a reason to push more affiliate offers.

## Authoritative sources

- [Publisher best practice](https://partner.getyourguide.support/hc/en-us/articles/13981143885085-Best-Practice-for-online-publishers): relevant, contextual recommendations. Do not apply its general integration-count advice wholesale to this venue directory.
- [Deep links and attribution](https://partner.getyourguide.support/hc/en-us/articles/13981115676061-Deep-links-101): partner ID, campaign parameter and 31-day attribution subject to retained/unoverwritten cookies.
- [Integration Analyzer installation](https://partner.getyourguide.support/hc/en-us/articles/13980983394333-How-to-install-the-Integration-Analyzer): script, partner attribute and processing delay. Its absence previously did not prevent affiliate attribution.

Product sources are recorded beside each recommendation in the catalogue. Product details can change; this is a dated editorial verification, not live inventory synchronization.

## Local validation

The curated pilot was built and exercised with desktop and mobile Chrome. Lint, TypeScript and production builds passed; all 50 focused unit tests, 34 pilot browser journeys and 24 measurement-first browser journeys passed. The full unit suite has six existing failures in city/listing image coverage and digital product/email/token expectations, unrelated to this integration. Safari tests could not initialize a page with the installed Playwright 1.62.0 on macOS 14: `Unknown setting: PushAPIEnabled`. The installed source sends that setting and pins this OS to WebKit build 2251, matching [the upstream report](https://github.com/microsoft/playwright/issues/42964). This is a validation limitation; Safari still needs a run on a supported host. No Playwright dependency or OS changes were made.

To reproduce the pilot browser suite, build with `NEXT_PUBLIC_GYG_CURATED_ENABLED=true npm run build`, start that build on the test port, and set `NEXT_PUBLIC_GYG_CURATED_ENABLED=true` when running `e2e/getyourguide.spec.ts`, `e2e/consent.spec.ts` and `e2e/monetization-journeys.spec.ts` in the Chromium/mobile Chrome projects. Browser providers are mocked so tests send no affiliate referral traffic. The final default build exercises the measurement-first presentation. Production account reporting must still be confirmed after deployment and real consented visits.

## Conversion-guidance review — 20 October 2026

Reviewed [Improve your conversion rate](https://partner.getyourguide.support/hc/en-us/articles/13981116525469-Improve-your-conversion-rate). Native cards, comparisons, CTAs and monitoring already align. Added provider context and report-backed picks. Reviews remain on GetYourGuide; avoid stale figures, fabricated testimonials and unsupported urgency. Widgets remain deferred. The article’s 6% example is not a forecast.

Checked the account Bestseller coverage report with “Is In My Top 5 Destination” set to Yes. Its Britain rows included London Eye (country rank 1), Edinburgh Castle tour 156135 (9), and our existing Anfield product 144276 (33). These are country ranks, not city ranks or our own conversion results. The report marked all three “Already promoting: No”; because Analyzer coverage was previously absent, that label alone is not proof that a product has never been linked.

Added London Eye and Edinburgh Castle after reading their untracked product pages and confirming duration, location and restrictions. The catalogue now has eight products. Their selection evidence records the dated report source; neither prices nor rating/review counts are published. Edinburgh now has a non-nightlife option for family/sightseeing filters. Long Highlands excursions and out-of-city studio trips were not selected for a short outing module. Keep the two-product limit and local browse route.

Weekly: filter the report by city and promotion status; verify review depth, audience, duration and travel fit before selecting products.
