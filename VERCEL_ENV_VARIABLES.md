# Vercel Environment Variables Setup

## Required Environment Variables

These are **essential** for your application to work:

### 1. `DATABASE_URL`
- **Description**: PostgreSQL database connection string
- **Format**: `postgresql://user:password@host:port/database?sslmode=require`
- **Example**: `postgresql://user:pass@ep-calm-math-abfybhzm-pooler.eu-west-2.aws.neon.tech:5432/neondb?sslmode=require`
- **Where to get it**: Your database provider (Neon, Supabase, etc.)
- **Required**: ✅ Yes

### 2. `NEXTAUTH_SECRET`
- **Description**: Secret key for NextAuth.js session encryption
- **Format**: Random string (at least 32 characters)
- **How to generate**: Run `openssl rand -base64 32` in terminal
- **Required**: ✅ Yes

## Optional but Recommended Environment Variables

### 3. `NEXT_PUBLIC_SITE_URL`
- **Description**: Your production site URL (used for SEO, sitemap, canonical URLs)
- **Format**: `https://yourdomain.com`
- **Example**: `https://rageroomdirectory.co.uk`
- **Default**: Falls back to `https://rageroomdirectory.co.uk` if not set
- **Required**: ⚠️ Recommended (for proper SEO)

### 4. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- **Description**: Google Maps API key for embedded maps on listing pages
- **Format**: `AIzaSy...`
- **Where to get it**: [Google Cloud Console](https://console.cloud.google.com/)
- **Required APIs**: Maps Embed API
- **Required**: ⚠️ Optional (maps won't show without it)

### 5. `GOOGLE_PLACES_API_KEY`
- **Description**: Google Places API key for fetching reviews
- **Format**: `AIzaSy...`
- **Where to get it**: [Google Cloud Console](https://console.cloud.google.com/)
- **Required APIs**: Places API (Details)
- **Required**: ⚠️ Optional (Google reviews won't fetch without it)

## How to Add to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: The variable name (e.g., `DATABASE_URL`)
   - **Value**: The actual value
   - **Environment**: Select which environments to apply to:
     - ✅ **Production** (for live site)
     - ✅ **Preview** (for PR previews)
     - ✅ **Development** (optional, for local dev)

## Quick Setup Checklist

- [ ] `DATABASE_URL` - Add your PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - Generate and add secret key
- [ ] `NEXT_PUBLIC_SITE_URL` - Add your production URL
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Add if using maps (optional)
- [ ] `GOOGLE_PLACES_API_KEY` - Add if using Google reviews (optional)

## Notes

- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env` files to git (already in `.gitignore`)
- After adding variables, redeploy your application
- You can use the same `NEXTAUTH_SECRET` for all environments, but it's recommended to use different ones for production vs development

