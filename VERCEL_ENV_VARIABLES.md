# Vercel Environment Variables Setup

## Required Environment Variables

### `NEXT_PUBLIC_SITE_URL`
- **Description**: Your production site URL (used for SEO, sitemap, canonical URLs)
- **Format**: `https://yourdomain.com`
- **Example**: `https://rageroomdirectory.co.uk`
- **Default**: Falls back to `https://rageroomdirectory.co.uk` if not set
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

## Data storage

Listings are stored in [`data/listings.json`](data/listings.json) in the repository — no database is required.

To add or edit listings:
1. Edit `data/listings.json` locally
2. Run `npm run validate-listings` to check for errors
3. Commit and push — Vercel redeploys automatically

## How to Add to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable for Production (and Preview if needed)
4. Remove legacy variables if still present: `DATABASE_URL`, `NEXTAUTH_SECRET`

## Quick Setup Checklist

- [ ] `NEXT_PUBLIC_SITE_URL` — Add your production URL
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — Add if using maps (optional)
- [ ] `GOOGLE_PLACES_API_KEY` — Add if using Google reviews (optional)
- [ ] `INDEXNOW_KEY` — Add for IndexNow pings after deploy (`npm run ping-indexnow`)
- [ ] Remove `DATABASE_URL` and `NEXTAUTH_SECRET` from Vercel (no longer used)

## Notes

- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env` files to git (already in `.gitignore`)
- After adding variables, redeploy your application
