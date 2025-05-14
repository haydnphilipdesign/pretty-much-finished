# USPS Address Verification Reference

This directory contains code and documentation for USPS address verification functionality that has been temporarily removed from the application. These files are kept here for reference in case we need to re-implement this feature in the future.

## Files

- `AddressInput.tsx`: Enhanced address input component with USPS verification
- `addressVerification.ts`: Utilities for address parsing, formatting, and validation
- `USPS_API_SETUP.md`: Documentation for setting up the USPS API
- `REMOVE_GOOGLE_MAPS.md`: Documentation on how Google Maps was replaced with USPS
- `setup-usps-api.js`: Script to help configure USPS API credentials

## Implementation Notes

If you want to re-implement USPS address verification:

1. Copy these files back to their original locations
2. Install any necessary dependencies
3. Configure USPS API credentials in `.env`
4. Update components to use the address verification functionality

## Original Locations

- `AddressInput.tsx` → `src/components/ui/AddressInput.tsx`
- `addressVerification.ts` → `src/utils/addressVerification.ts`
- `setup-usps-api.js` → `scripts/setup-usps-api.js`

The current implementation uses a simplified address input without verification. 