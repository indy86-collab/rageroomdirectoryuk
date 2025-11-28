# Google Reviews Integration Setup

This guide explains how to set up Google Reviews integration for your rage room listings.

## Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account
2. **Billing Enabled**: Google Places API requires billing (but has a free tier)
3. **API Key**: You'll need to create a Google Places API key

## Step 1: Get Google Place IDs

For each rage room listing, you need to find its Google Place ID:

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for the rage room business
3. Click on the business listing
4. Scroll down to find the "Place ID" (or use the URL which contains it)
5. Alternatively, use the [Place ID Finder tool](https://developers.google.com/maps/documentation/places/web-service/place-id)

## Step 2: Add Place IDs to Listings

You can add Google Place IDs to listings through:
- The admin dashboard (if you have one)
- Directly in the database
- Through a migration script

Example SQL:
```sql
UPDATE listings 
SET "googlePlaceId" = 'ChIJ...' 
WHERE name = 'Your Rage Room Name';
```

## Step 3: Set Up Google Places API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"

4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

5. Restrict the API Key (Recommended):
   - Click on the API key to edit it
   - Under "API restrictions", select "Restrict key"
   - Choose "Places API"
   - Save

## Step 4: Add Environment Variable

Add your Google Places API key to your `.env` file:

```env
GOOGLE_PLACES_API_KEY=your_api_key_here
```

## Step 5: Run Database Migration

Run the Prisma migration to add the `googlePlaceId` field:

```bash
npx prisma migrate dev --name add_google_place_id
```

Or if you prefer to generate the migration first:

```bash
npx prisma migrate dev --create-only --name add_google_place_id
npx prisma migrate deploy
```

## Step 6: Test the Integration

1. Add a Google Place ID to a test listing
2. Visit the listing page
3. You should see Google Reviews displayed (if the place has reviews)

## Features

- **Automatic Review Fetching**: Reviews are fetched from Google Places API
- **Caching**: Reviews are cached for 1 hour to reduce API calls
- **Combined Display**: Shows both Google Reviews and site reviews
- **Profile Photos**: Displays reviewer profile photos from Google
- **Rating Display**: Shows star ratings for all reviews

## API Costs

Google Places API pricing (as of 2024):
- **Free Tier**: $200 credit per month
- **Places Details (with reviews)**: $17 per 1000 requests
- Reviews are cached for 1 hour to minimize API calls

## Troubleshooting

### No reviews showing up?

1. Check that the `googlePlaceId` is correctly set in the database
2. Verify your API key is valid and has Places API enabled
3. Check the browser console for any API errors
4. Ensure the place has reviews on Google Maps

### API errors?

1. Check your API key is correct in `.env`
2. Verify billing is enabled in Google Cloud
3. Check API quotas in Google Cloud Console
4. Ensure Places API is enabled for your project

## Notes

- Reviews are fetched server-side and cached for 1 hour
- The integration gracefully handles missing API keys (shows site reviews only)
- Google reviews are displayed separately from site reviews for clarity


