# Organic growth outreach runbook

This runbook supports the venue-verification and research-outreach parts of the 90-day plan. It does not authorise bulk or unsolicited sending. Review each recipient and message before contact.

## Venue verification

1. Run `npm run export-venue-outreach > venue-outreach.csv` and work through priority rows first.
2. Use the venue's published business contact channel. Do not scrape personal addresses.
3. Ask the operator to use the reviewed form at `/list-your-rage-room?listing=SLUG&type=claim`.
4. Request direct booking URL, current starting price, age limit, opening hours, session lengths, group limits, packages, source URLs, and authorised media with credit.
5. Verify every response before editing `data/listings.json`; record `lastVerified` and `sourceUrl`.
6. Offer the optional featured-venue badge after publication. Make clear that the badge and backlink do not affect inclusion or ranking.

Suggested subject: `Please verify [Venue] on RageRoom Directory`

Suggested opening:

> We list [Venue] in the independent UK RageRoom Directory. We are checking prices, booking details and media permissions so visitors receive accurate information. Nothing changes automatically: please review your listing and submit corrections through [claim URL]. The optional directory badge is available after review but is not required and does not affect placement.

## Research and press

Use `/uk-rage-room-report-2026` as the single source URL. The page provides aggregate CSV data, reusable charts, methodology and suggested attribution.

Prioritise relevant local newspapers, tourism/activity editors, student publications and experience-industry writers. Tailor every pitch to the outlet's area; do not promise exclusivity or traffic. Lead with a local statistic, link to the methodology, and offer a regional extract or factual correction.

## Tracking

Track: recipient, organisation, contact channel, date, status, response, listing updated, authorised media received, badge used, and referring-domain URL. Do not store sensitive personal information in the public repository.
