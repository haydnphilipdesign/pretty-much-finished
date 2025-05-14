# Setting Up USPS Address Verification API

This guide will help you set up the USPS Address Verification API to validate and standardize addresses in your application. This replaces the Google Maps Places API for address entry.

## Getting USPS Web Tools API Credentials

1. **Register for a USPS Web Tools Account**
   - Visit the [USPS Web Tools API portal](https://www.usps.com/business/web-tools-apis/)
   - Click on "Get Access to USPS Web Tools API"
   - Complete the registration form with your company information
   - Accept the terms and conditions

2. **Request the Address Validation API**
   - After registration, request access to the "Address Information API" 
   - You'll need to specify which APIs you need (select "Address Validation/Standardization")
   - USPS will review your application and provide you with credentials

3. **Receive Your User ID**
   - USPS will email you with your User ID and instructions
   - This process typically takes 2-5 business days

## Configuring Your Application

Once you have your USPS Web Tools User ID, update your `.env` file:

```
# USPS Address Verification API
VITE_USPS_USER_ID=YOUR_USPS_USER_ID_HERE
VITE_USPS_API_URL=https://secure.shippingapis.com/ShippingAPI.dll
```

## Testing without USPS API (Development Mode)

If you want to test the address functionality without having USPS credentials, set the following in your `.env` file:

```
# Use manual validation instead of API calls
VITE_USE_MANUAL_ADDRESS_VALIDATION=true
```

When this setting is enabled, the application will use local validation to check address format without making calls to the USPS API.

## How It Works

1. **User enters an address** - Either in single-line format (123 Main St, Philadelphia, PA 12345) or using the detailed form fields

2. **User clicks "Verify Address"** - This triggers validation:
   - If `VITE_USE_MANUAL_ADDRESS_VALIDATION` is true, basic format validation is performed locally
   - Otherwise, the address is sent to the USPS API for verification

3. **Address is standardized** - The API returns a standardized version of the address that follows USPS formatting standards

4. **Result is displayed to user** - The form updates with the standardized address and displays a success message

## Benefits of USPS Address Verification

- **Accuracy**: Confirms addresses are deliverable
- **Standardization**: Formats addresses according to USPS standards
- **Completeness**: Adds ZIP+4 when available
- **Reliability**: Direct verification against USPS database
- **No external dependencies**: No need for Google Maps API or other third-party services

## USPS API Response Codes

The USPS API may return various error codes if an address cannot be verified:

| Error Code | Description |
|------------|-------------|
| -2147219400 | Invalid City/State/ZIP |
| -2147219401 | Invalid State Code |
| -2147219402 | Invalid City |
| -2147219403 | Invalid ZIP Code |
| -2147219404 | Address Not Found |
| -2147219405 | Multiple Addresses Found |

Our implementation handles these errors and provides user-friendly error messages.

## Troubleshooting

1. **API calls failing**: Ensure your USPS User ID is correctly entered in the `.env` file

2. **Addresses not being standardized**: Some addresses may not be recognized by USPS, especially if they are:
   - Very new addresses
   - Not yet in the USPS database
   - Non-standard addresses (P.O. Boxes, military addresses)

3. **Testing in development**: Use `VITE_USE_MANUAL_ADDRESS_VALIDATION=true` for local testing

4. **Network errors**: Ensure your server can make outbound HTTP requests to the USPS API endpoint

## Questions or Issues?

If you encounter problems with the USPS address verification, contact the development team at debbie@parealestatesupport.com. 