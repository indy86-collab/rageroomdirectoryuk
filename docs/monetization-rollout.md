# Monetization rollout — 17 September 2026

## Implemented locally

- Birthday, hen and stag affiliate modules now use group-oriented offers rather than generic sightseeing. Existing GetYourGuide attribution is preserved. National group pages offer city searches; local pages offer location-specific searches. These are clearly described as searches, not verified inventory or live availability.
- Cities without local venues (or without rage-room inventory), empty filtered listings and zero-result planner searches offer explicit alternatives while preserving directory results. UK category links remain usable when commercial modules are disabled.
- Corporate occasion pages, corporate guide, contact page and the final event-builder step offer a reviewable planning enquiry. The draft includes only location, headcount, date, budget and standard purpose. Attendees, organiser details, access tokens and booking references are excluded. Visitors send it themselves through their email app, or copy it to webmail. Opening a draft is not a submitted lead.
- Gift offers are placed on the gift-ideas page, and new partner offers activate only when complete approved URLs are configured.
- No paid concierge checkout, promised agency partnership, invented stock/availability or new revenue claim was added. Enquiries ask the directory to confirm scope, availability and any fee before work begins.

## Owner activation

Existing GetYourGuide links can work after deployment using the existing public partner ID. Account approval, payout eligibility and actual sales still need checking in its dashboard.

Apply for or confirm approved publisher accounts, then paste complete approved tracking URLs into the deployment environment:

- `NEXT_PUBLIC_BOOKAPARTY_AFFILIATE_URL`: Book a Party group activities landing page.
- `NEXT_PUBLIC_VIRGIN_EXPERIENCES_AFFILIATE_URL`: suitable Virgin Experience Days gift/activity page.
- `NEXT_PUBLIC_BUYAGIFT_AFFILIATE_URL`: suitable Buyagift gift/activity page.

Blank or malformed URLs hide that partner. URLs are used intact to preserve tracking signatures. Use approved links whose destination matches the card; do not paste affiliate registration URLs, account tokens, or an ordinary merchant homepage and assume attribution. Verify the destination and attribution in the partner dashboard. Global `NEXT_PUBLIC_AFFILIATE_LINKS_ENABLED=false` hides commercial links while retaining internal directory alternatives.

Rebuild and deploy after changing NEXT_PUBLIC settings. No deployment or partner application has been performed in this task. No messages have been sent to partners.

The directory inbox is `ukrageroom@gmail.com`, matching the existing contact page. Review incoming planning enquiries manually. Confirm what can be delivered and any fee; agree any named third-party introduction with the organiser before sharing their information. This is a validation channel, not an automated agency lead sale.

## Measure

Existing consent-aware `affiliate_offer_view` and `affiliate_click` events carry provider, placement and recommendation ID. New commercial offer impressions fire once after the module becomes visible per mounted context. Campaigns distinguish group and alternative searches. No email draft text is sent to analytics.

New consent-aware events:

- `alternative_activity_click`: placement and fixed activity slug.
- `planning_enquiry_start`: placement only; draft prepared, not submitted.
- `planning_enquiry_email_click`: placement only; email app opened, not submitted.
- `planning_enquiry_copy`: placement only; copy succeeded, not submitted.

Reconcile actual received enquiries manually and affiliate approved sales in provider reports. Track revenue per 1,000 relevant sessions, paid/cancelled bookings and time spent per enquiry. Do not count outbound clicks or email drafts as revenue. Validate current traffic measurement before comparing conversion rates; the earlier GA4 and AdSense observations are historical.

## Sources and limitations

- Next.js 14 public variables are inlined at build time: https://nextjs.org/docs/14/app/building-your-application/configuring/environment-variables . Developer Index was searched first; official versioned documentation confirmed the behaviour.
- Book a Party supplies publisher tracking URLs after registration: https://bookaparty.com/affiliates . No network URL format or publisher ID has been invented.
- Virgin Experience Days: https://www.virginexperiencedays.co.uk/affiliate-info
- Buyagift: https://www.buyagift.co.uk/affiliateinfo

These changes improve monetization journeys; they do not establish conversion uplift or guarantee earnings. New partners remain inactive until approved links are supplied. Corporate enquiries require manual fulfilment and commercial agreement.

## Validation

- TypeScript check and lint passed.
- 36 focused tests passed (new commercial URL/configuration and enquiry tests, existing affiliate and consent-aware analytics tests).
- Six new desktop/mobile Chromium journey checks passed: attributed group offers, editable enquiry/email draft, and alternatives on a city without local inventory. No horizontal overflow on the tested group/enquiry journeys.
- Full unit suite: 276 passed, four failed. An isolated checkout of the original HEAD reproduced all four failures (270 passed): two legacy digital-product amount expectations, the free-checklist download-token test, and the lead-email price expectation. These failures predate this change; pricing, payment entitlements and token logic were not modified.
- Production build passed, including lint/type validation and generation of 345 pages. All six new desktop/mobile journey checks also passed against the final production build. Mobile screenshots were inspected for the local group offer and editable enquiry. Existing browser-data and edge-runtime build warnings remain non-blocking.
