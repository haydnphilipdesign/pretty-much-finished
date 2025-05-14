# Setting Up Google Maps API Key

This guide will help you set up a Google Maps API key for your application, which is required for the address autocomplete functionality to work correctly.

## Current Issue

You're seeing the error message "The page can't load Google Maps correctly" because:

1. The API key in the `.env` file might be invalid, expired, or restricted
2. The Places API might not be enabled for the API key
3. The API key might have domain restrictions that don't include your domain or localhost

## Solution

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for the project (required for Google Maps API)

### 2. Enable the Required APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API

### 3. Create an API Key

1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the newly created API key

### 4. Configure API Key Restrictions (Recommended)

For security, it's recommended to restrict your API key:

1. In the "API Keys" page, find your key and click "Edit"
2. Under "Application restrictions", select "HTTP referrers (websites)"
3. Add your domains (e.g., `localhost/*`, `*.your-domain.com/*`, etc.)
4. Under "API restrictions", select "Restrict key"
5. Select the APIs you enabled (Maps JavaScript API, Places API, Geocoding API)
6. Click "Save"

### 5. Update Your `.env` File

1. Open your `.env` file
2. Replace the placeholder with your new API key:

```
VITE_GOOGLE_PLACES_API_KEY=your_new_api_key_here
```

## Costs and Quotas

The Google Maps Platform operates on a pay-as-you-go pricing model:

- Maps JavaScript API: $7 per 1,000 loads (monthly free tier: 28,000 loads)
- Places API: $17 per 1,000 calls (monthly free tier: 11,500 calls)
- Geocoding API: $5 per 1,000 calls (monthly free tier: 40,000 calls)

For most small to medium-sized applications, the free tier should be sufficient.

## Troubleshooting

If you continue to experience issues:

1. Verify the API key is correctly added to the `.env` file
2. Ensure all required APIs are enabled in the Google Cloud Console
3. Check if you've properly configured domain restrictions
4. Verify the billing is enabled for your Google Cloud project
5. Check the browser console for more specific error messages

## Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Google Maps JavaScript API Guide](https://developers.google.com/maps/documentation/javascript/overview)
- [Places API Guide](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Google Cloud Console](https://console.cloud.google.com/)

## Need Help?

If you need additional assistance, contact the development team at debbie@parealestatesupport.com. 