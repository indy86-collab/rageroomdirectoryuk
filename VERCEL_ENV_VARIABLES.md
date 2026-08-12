# Vercel Environment Variables Setup

## Required Environment Variables

### `STRIPE_SECRET_KEY`
- **Description**: Stripe secret key used to create Checkout Sessions and verify orders
- **Format**: `sk_live_...` for production or `sk_test_...` for testing
- **Required**: Required for digital download checkout

### `STRIPE_WEBHOOK_SECRET`
- **Description**: Stripe webhook signing secret for `/api/webhooks/stripe`
- **Format**: `whsec_...`
- **Where to get it**: Stripe Dashboard → Developers → Webhooks, after adding the endpoint
- **Required events**: `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_failed`
- **Required**: Required for checkout completion and abandonment logs

### `DOWNLOAD_TOKEN_SECRET`
- **Description**: Secret used to sign private digital download links after payment
- **Format**: Long random string
- **Required**: Not for current launch — **intentionally deferred**
- **Current behaviour**: Falls back to `STRIPE_SECRET_KEY` when unset. Existing customer access/download links may depend on that signing secret; do **not** introduce or rotate `DOWNLOAD_TOKEN_SECRET` until a backward-compatible key migration is in place.
- **Technical debt**: Separate download-token signing secret should be introduced later using a backward-compatible key migration strategy.

### `RESEND_API_KEY`
- **Description**: Resend API key for purchase download emails and abandoned-checkout recovery emails
- **Format**: `re_...`
- **Where to get it**: [Resend Dashboard](https://resend.com/)
- **Required**: Recommended (emails are skipped if missing; success-page download still works)

### `EMAIL_FROM`
- **Description**: From address for transactional digital-download emails
- **Format**: `RageRoom Directory <orders@yourdomain.com>`
- **Default**: `RageRoom Directory <onboarding@resend.dev>` (Resend test sender)
- **Required**: Recommended in production with a verified domain

### `RESEND_AUDIENCE_ID`
- **Description**: Optional Resend Audience ID for free checklist / lead-magnet signups
- **Format**: `aud_...`
- **Required**: Optional (lead email still sends; contact is only added when set)

### `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **Description**: Google Analytics 4 measurement ID for ecommerce funnel events on digital downloads
- **Format**: `G-...`
- **Example / default in app**: `G-ZZCN6PNKYW`
- **Required**: Recommended (layout falls back to `G-ZZCN6PNKYW` when unset)

### `NEXT_PUBLIC_SITE_URL`
- **Description**: Your production site URL (used for SEO, sitemap, canonical URLs)
- **Format**: `https://yourdomain.com`
- **Example**: `https://www.rageroomdirectory.co.uk`
- **Default**: Falls back to `https://www.rageroomdirectory.co.uk` if not set
- **Required**: Recommended (for proper SEO)

## Optional Environment Variables

### `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- **Description**: Google Maps API key for embedded maps on listing pages
- **Format**: `AIzaSy...`
- **Where to get it**: [Google Cloud Console](https://console.cloud.google.com/)
- **Required APIs**: Maps Embed API
- **Required**: Optional (maps won't show without it)

### `GOOGLE_PLACES_API_KEY`
- **Description**: Google Places API key for fetching reviews
- **Format**: `AIzaSy...`
- **Where to get it**: [Google Cloud Console](https://console.cloud.google.com/)
- **Required APIs**: Places API (Details)
- **Required**: Optional (Google reviews won't fetch without it)

### `INDEXNOW_KEY`
- **Description**: IndexNow API key for notifying Bing/Yandex of URL updates
- **Format**: 32-character hex string (must match `public/indexnow-key.txt`)
- **Required**: Recommended for faster indexing after deploys

### `INDEXNOW_API_TOKEN`
- **Description**: Bearer token protecting the `/api/indexnow` manual ping endpoint
- **Required**: Optional (only needed if using the API route manually)

## Required for Corporate Booking System (venue-owner £79 product)

The venue-owner Corporate Booking System stores workspace data server-side.

### Local / single-node
Writes JSON files under `private/corporate-booking-workspaces/` (gitignored).

### Production on Vercel (required before public sale)
Add Upstash Redis REST credentials. Without both variables on Vercel:

- checkout for `rage-room-corporate-booking-system` returns **503**
- workspace create/read/write is refused

Do **not** offer this product publicly until both are set in Production (and Preview if you test purchases there).

### `UPSTASH_REDIS_REST_URL` / `KV_REST_API_URL`
- **Description**: Upstash Redis REST URL for Corporate Booking System workspaces
- **Required**: **Yes in production** before selling the Corporate Booking System
- **Vercel Marketplace**: Installing **Upstash for Redis** injects `KV_REST_API_URL` (accepted as an alias)

### `UPSTASH_REDIS_REST_TOKEN` / `KV_REST_API_TOKEN`
- **Description**: Upstash Redis REST token
- **Required**: **Yes in production** with the matching REST URL
- **Vercel Marketplace**: Installing **Upstash for Redis** injects `KV_REST_API_TOKEN` (accepted as an alias)

### Optional local override
- `CORPORATE_BOOKING_STORE=memory` — in-memory only (tests / ephemeral local)
- `CORPORATE_BOOKING_REQUIRE_REDIS=true` — force Redis even outside Vercel

Also ensure these digital-product env vars are present in Production for fulfilment emails:

- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM` (recommended)
- `DOWNLOAD_TOKEN_SECRET` (recommended; falls back to `STRIPE_SECRET_KEY` if unset)
- `NEXT_PUBLIC_SITE_URL` (recommended; defaults to the canonical live domain)

## Data storage

Listings are stored in [`data/listings.json`](data/listings.json) in the repository — no database is required.

To add or edit listings:
1. Check [`data/listings-blacklist.json`](data/listings-blacklist.json) — never re-add blacklisted venues
2. Edit `data/listings.json` locally
3. Run `npm run validate-listings` to check for errors (also rejects blacklisted venues)
4. Commit and push — Vercel redeploys automatically

When removing a closed venue, delete it from `listings.json` **and** add it to `listings-blacklist.json` so automation cannot re-import it.

## How to Add to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable for Production (and Preview if needed)
4. Remove legacy variables if still present: `DATABASE_URL`, `NEXTAUTH_SECRET`

## Quick Setup Checklist

- [ ] `STRIPE_SECRET_KEY` — Add for Stripe Checkout
- [ ] `STRIPE_WEBHOOK_SECRET` — Add after creating the Stripe webhook endpoint
- [ ] `RESEND_API_KEY` — Add for purchase + abandoned-checkout emails
- [ ] `EMAIL_FROM` — Add verified from address for transactional email
- [ ] `NEXT_PUBLIC_SITE_URL` — Add your production URL
- [ ] `UPSTASH_REDIS_REST_URL` — Required before selling Corporate Booking System
- [ ] `UPSTASH_REDIS_REST_TOKEN` — Required before selling Corporate Booking System
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — Add if using maps (optional)
- [ ] `GOOGLE_PLACES_API_KEY` — Add if using Google reviews (optional)
- [ ] `INDEXNOW_KEY` — Add for IndexNow pings after deploy (`npm run ping-indexnow`)
- [ ] Remove `DATABASE_URL` and `NEXTAUTH_SECRET` from Vercel (no longer used)
- [ ] `DOWNLOAD_TOKEN_SECRET` — **Deferred for this launch** (falls back to `STRIPE_SECRET_KEY`; migrate later with dual-key verification)

## Notes

- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env` files to git (already in `.gitignore`)
- After adding variables, redeploy your application
