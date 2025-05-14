# Address Input Simplification

## Changes Made

We've simplified the address input functionality by:

1. **Removing USPS Address Verification**: The address verification API integration has been removed from the active codebase.

2. **Creating a Simple Address Input Component**: The `AddressInput` component now provides a simple text field without verification or detailed address entry.

3. **Preserving Code for Future Reference**: All USPS-related code has been preserved in the `src/reference/usps-address-verification/` directory for future use if needed.

4. **Updating Environment Configuration**: USPS API settings have been commented out in the `.env` file.

5. **Updating Documentation**: README has been updated to reflect these changes.

## Files Modified

- `src/components/ui/AddressInput.tsx` - Simplified to a basic input field
- `src/components/TransactionForm/ClientItem.tsx` - Updated to use simplified address input
- `src/components/TransactionForm/client/ClientFormFields.tsx` - Updated to use simplified address input
- `src/components/TransactionForm/PropertySection.tsx` - Updated to use simplified address input
- `src/components/TransactionForm/PropertyInformation.tsx` - Updated to use simplified address input
- `.env` - USPS API settings commented out
- `README.md` - Updated to reflect changes
- `package.json` - Removed USPS setup script

## Files Preserved for Reference

The following files have been moved to `src/reference/usps-address-verification/`:

- `AddressInput.tsx` - Original enhanced component with verification
- `addressVerification.ts` - Address utilities for parsing, formatting, and validation
- `USPS_API_SETUP.md` - Setup documentation
- `REMOVE_GOOGLE_MAPS.md` - Documentation about replacing Google Maps
- `setup-usps-api.js` - Setup script

## Restoring USPS Functionality (If Needed)

If you need to restore the USPS address verification functionality in the future:

1. Copy the files from `src/reference/usps-address-verification/` back to their original locations
2. Uncomment the USPS settings in the `.env` file
3. Restore the `setup:usps` script in `package.json`
4. Update components to use the enhanced address input functionality 