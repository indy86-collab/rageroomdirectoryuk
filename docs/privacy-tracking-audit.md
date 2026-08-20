# Privacy and tracking audit

Audited 20 August 2026. This is an engineering implementation review, not legal advice.

## Implemented interpretation

RageRoom Directory uses one optional purpose: **Analytics**. Essential browser storage is feature-led and is not presented as an optional category. The site takes a deliberately conservative approach: GA4, Vercel Web Analytics and Cloudflare Web Analytics are all disabled until the visitor opts in, even though the latter two may be capable of meeting the UK's statistical-purpose storage/access exception when configured and used within its limits.

The relevant ICO guidance is the current *Guidance on the use of storage and access technologies*. Its statistical-purpose exception has strict limits: aggregate statistics must be the sole purpose, information must be clear, objection must be simple and free, and the information must not be used to identify/profile people or track across services. Online advertising and related purposes still require consent.

- ICO guidance: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/
- ICO exceptions: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/

## Technology inventory

| Technology | Provider / initialisation | Purpose and browser access | Pre-interaction behaviour before this change | Essential? | Treatment |
| --- | --- | --- | --- | --- | --- |
| GA4 / Google tag | Google; formerly global in `app/layout.tsx`, now in `ConsentControlledProviders` | Page/product/directory events. GA4 normally uses first-party identifiers including `_ga`; requests can include online identifiers and request/device context. | Tag loaded and configured on every page before a choice. | No | Prior opt-in required. Basic consent implementation: no Google tag or cookieless ping loads before opt-in. Ad signals remain denied. |
| Vercel Web Analytics 1.5.0 | Vercel; `@vercel/analytics/next` | Page-view analytics. Vercel says it uses no cookies, produces anonymised/aggregated data, does not store IP addresses and derives a daily-changing visitor hash from request data. | Component loaded globally and sent page views immediately. | No | Gated behind Analytics as the conservative implementation, notwithstanding the possible statistical-purpose exception. |
| Cloudflare Web Analytics | Cloudflare; explicit beacon token in the root layout | Performance/page-load measurement via the Performance API. Cloudflare says the beacon uses no cookies, local storage, fingerprinting or cross-site tracking. | External beacon loaded globally on every page. | No | Gated behind Analytics as the conservative implementation, notwithstanding the possible statistical-purpose exception. |
| Cloudflare edge/security | Cloudflare deployment/network layer, if enabled outside this repository | Delivery, DDoS protection and security request processing. This is distinct from the Web Analytics beacon and cannot be controlled by React. | Applies to normal page requests when the deployment uses Cloudflare. | Yes where deployed | Disclosed, not controlled by the analytics toggle. Exact edge configuration must be verified in hosting dashboards. |
| AdSense Auto ads | Google; formerly global script in `app/layout.tsx` | Advertising, capable of cookies/storage and ad-personalisation processing. | Script loaded on every page. | No | Disabled. Analytics consent never enables advertising. UK/EEA launch requires a Google-certified TCF CMP and a separate policy/design decision. |
| Consent preference | RageRoom Directory; `lib/consent.ts` | First-party `localStorage`: version, boolean Analytics choice, and decision timestamp. No ID. | Not present. | Yes | Stored for 180 days; stale version/expiry prompts a fresh choice. |
| Purchase analytics dedupe | RageRoom Directory; `PurchaseTracker.tsx` | `purchase_tracked_<checkout-session>` in `localStorage`. | Read/written on a success page even without a consent model. | No | Read/written only after Analytics is allowed and an event is actually sent; removed on withdrawal. |
| Digital checkout email | RageRoom Directory; `lib/digital-checkout-email.ts` | `rr_digital_checkout_email` in `localStorage`, containing the email a user entered so checkout/access forms can be resumed. | Only used during the requested checkout flow. | Feature-led | Not controlled by Analytics and not deleted on analytics withdrawal. The presence of an email makes this personal data and it must remain disclosed/protected. |
| Activity planner state | RageRoom Directory; `NearbyActivitiesAffiliate.tsx` | `rageroom:activity-planner:v1` in `sessionStorage`; user-selected group/vibe/timing and results. | Only after using the planner. | Feature-led | Not controlled by Analytics. Cleared by the feature or when the browser session ends. |
| Corporate Event Builder state | RageRoom Directory; `lib/corporate-event-builder/storage.ts` | Purchase-scoped workspace in `localStorage`, including user-entered plan content. | Only after using the purchased tool. | Feature-led / contract | Not controlled by Analytics. |
| Rage Reset state | RageRoom Directory; `lib/rage-reset/*`, `components/rage-reset/*` | `localStorage` for progress/history/cohort/renderer settings; `sessionStorage` for PWA update state. | Only on the game routes and according to feature use. | Feature-led | Not controlled by Analytics. |
| Browser geolocation | Browser Geolocation API; `ListingFilters.tsx`, `NearMeMap.tsx` | Precise position is held in component memory to sort venues. The browser asks for permission separately. | Filters request on button press; `/near-me` requests browser permission on mount. | Feature-led | Separate from Analytics. Coordinates are not put in consent storage or analytics payloads. |
| Google Maps iframe | Google; `LazyMapEmbed.tsx`, `NearMeMap.tsx` | On load Google receives normal iframe requests and may access device/browser state under its policy. | Listing embed auto-loaded near the viewport; near-me embed mounted immediately when configured. | No; optional feature | Click-to-load placeholder. No map request is made before a user presses the map button. This choice is not reused as analytics consent. |
| Google Places enrichment | Google Places API; `lib/google-places.ts` server-side | Server-side listing enrichment rather than a browser embed/storage technology. | No browser-side provider request. | Operational | Not part of browser consent; protect API keys and review server-side data terms separately. |
| Normal application requests | RageRoom Directory APIs plus Stripe, Resend and Upstash in relevant server flows | Search, contact, checkout, transactional email and paid workspace operations initiated by users. | Only as required by requested pages/actions. | Operational / contractual | Not analytics; documented in the privacy policy. |

No application cookie writer existed in the audited source. No video embeds, social widgets, CAPTCHA, session replay, fingerprinting, Meta Pixel, affiliate redirect tracker or remarketing tag was found. Providers or the deployment edge can still set cookies independently of repository code; production browser audits and provider dashboards remain necessary.

## Provider evidence

- GA4 cookie behaviour: https://support.google.com/analytics/answer/11593727?hl=en
- Google basic versus advanced Consent Mode: https://developers.google.com/tag-platform/security/concepts/consent-mode
- Google consent setup and withdrawal: https://developers.google.com/tag-platform/security/guides/consent
- Vercel Analytics overview/privacy: https://vercel.com/docs/analytics and https://vercel.com/docs/analytics/privacy-policy
- Cloudflare Web Analytics: https://developers.cloudflare.com/web-analytics/about/ and https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/
- Google AdSense certified CMP requirement: https://support.google.com/adsense/answer/13554116?hl=en-GB

## Consent mechanics

- Key: `rageroom:privacy-consent`
- Version: `CONSENT_VERSION = 1`
- Shape: `{ version, analytics, decidedAt }`
- Refresh: after 180 days, invalid data, future timestamps or a version mismatch
- SSR: all storage reads occur after client mount or inside guarded utility functions
- Provider race prevention: the server layout contains no analytics/preconnect/ad script; providers are rendered only after the client has read a valid accepted decision
- Typed events: all existing helpers reach `trackEvent`, which checks the central Analytics preference before calling GA4
- Withdrawal: send Google's supported consent update to denied, remove accessible `_ga`/`_gid`/`_gat`/`_gac_` cookies and purchase-event dedupe keys, persist rejection, then reload to stop already-loaded scripts
- Limits: JavaScript cannot erase provider-side historical records, inaccessible partitioned/HTTP-only state or requests already transmitted before withdrawal. Vercel/Cloudflare do not expose an unload API, so reloading is the reliable stop boundary.

## Verification procedure

1. Run unit, lint, type and build checks.
2. Run `e2e/consent.spec.ts` in Chromium with third-party script responses mocked locally.
3. Record page requests for a fresh visitor, rejection, acceptance and post-withdrawal reload.
4. Confirm no URL matches `googletagmanager.com`, `google-analytics.com`, `cloudflareinsights.com`, `/_vercel/insights`, `googlesyndication.com` or `doubleclick.net` before choice/rejection.
5. After acceptance, confirm the GA4 tag, Cloudflare beacon and Vercel script initialization requests occur (provider beacons may vary in local development).
6. Confirm Google Maps is absent until its explicit load button is pressed.

Provider network behavior and policies can change. Repeat this audit after provider/version/configuration changes and before enabling advertising.
