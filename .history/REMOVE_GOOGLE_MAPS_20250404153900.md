# Replacing Google Maps API with USPS Address Verification

## What Changed

We've replaced the Google Maps Places API autocomplete with a custom address input component that uses the USPS Address Verification API. This change resolves the "The page can't load Google Maps correctly" error and provides more reliable address validation.

## Key Changes

1. **Removed Google Maps Dependencies**
   - Removed Google Maps Places API integration
   - Eliminated the need for Google Maps API key
   - Removed the Google Maps script loading hook

2. **Added USPS Address Verification**
   - Created a new address verification utility using the USPS API
   - Implemented a more robust address input component
   - Added support for both single-line and detailed address entry
   - Included manual address validation for development

3. **Enhanced Address Input Experience**
   - Added toggle between single-line and detailed address entry modes
   - Implemented address verification functionality
   - Added standardization of address format
   - Improved error messaging and user guidance

## Benefits of the Change

- **No more Google Maps errors**: The application no longer depends on the Google Maps API, eliminating the "The page can't load Google Maps correctly" error
- **More accurate addresses**: USPS verification ensures addresses are valid and deliverable
- **Standardized format**: Addresses are formatted consistently according to USPS standards
- **Cost efficiency**: USPS Web Tools API is free for many use cases
- **Better error handling**: Clear feedback when addresses can't be verified
- **Works offline**: The manual validation mode allows the application to function without internet access during development

## Components Changed

1. `AddressInput.tsx` (new component)
   - Replaces `AddressAutocomplete.tsx`
   - Provides both single-line and detailed entry modes
   - Supports address verification through USPS API

2. `addressVerification.ts` (new utility)
   - Provides functions for address parsing, formatting, and validation
   - Includes USPS API integration for address verification
   - Falls back to local validation when needed

3. Updated Components
   - `PropertySection.tsx`
   - `PropertyInformation.tsx`
   - `ClientItem.tsx`
   - `ClientFormFields.tsx`

## Configuration

The USPS address verification requires configuration in the `.env` file:

```
# USPS Address Verification API
VITE_USPS_USER_ID=your_usps_user_id
VITE_USPS_API_URL=https://secure.shippingapis.com/ShippingAPI.dll

# Use manual validation for development/testing
VITE_USE_MANUAL_ADDRESS_VALIDATION=true
```

To configure the USPS API, use the provided setup script:

```bash
npm run setup:usps
```

See [USPS_API_SETUP.md](USPS_API_SETUP.md) for detailed setup instructions.

## Manual Validation Mode

For development or if you don't have a USPS Web Tools account:

1. Set `VITE_USE_MANUAL_ADDRESS_VALIDATION=true` in your `.env` file
2. The application will validate addresses locally without calling the USPS API
3. Basic format validation will still occur, but standardization features will be limited

## How to Test the Changes

1. Run the application and navigate to any form with an address field
2. Try entering an address in both single-line and detailed modes
3. Click the "Verify Address" button to test address verification
4. Observe how the address is standardized or errors are displayed
5. Test with both valid and invalid addresses

## File Cleanup

The following files are no longer needed and can be safely deleted:

- `src/hooks/useGoogleMapsScript.ts`
- `src/components/ui/AddressAutocomplete.tsx`
- `src/components/ui/address-autocomplete.tsx`
- `src/types/google-maps.d.ts`
- `GOOGLE_MAPS_SETUP.md` 