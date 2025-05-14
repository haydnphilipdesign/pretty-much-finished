# PDF Generation and Upload Integration Testing Guide

This guide explains how to use the PDF integration test script to verify that all PDF-related functionality works correctly after deployment or code changes.

## Overview

The `test-pdf-integration.js` script verifies the following functionality:

1. PDF generation using the `/api/generate-pdf` endpoint
2. Supabase storage bucket access and fallback mechanism
3. PDF upload to Supabase storage
4. Direct PDF attachment to Airtable records
5. Verification of Airtable attachments

## Prerequisites

Before running the tests, you need:

- Node.js installed (v14 or later recommended)
- Your project dependencies installed via `npm install`
- Access to your Supabase project
- Access to your Airtable base
- A valid Airtable record ID for attachment testing (optional but recommended)

## Installation

1. Make sure the test-pdf-integration.js file exists in your project root
2. Install the required dependencies if not already present:

   ```bash
npm install dotenv node-fetch @supabase/supabase-js airtable
```

## Configuration

Create a `.env` file in your project root with the following variables:

   ```
# API URL - use localhost for local testing or your deployed URL
API_BASE_URL=http://localhost:3000

# Supabase credentials (same as in your main .env file)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Airtable credentials (same as in your main .env file)
AIRTABLE_API_KEY=your-airtable-api-key
AIRTABLE_BASE_ID=your-airtable-base-id

# Test-specific configuration
# An existing Airtable transaction record ID to test attachments with
# Leave blank to skip Airtable attachment tests
TEST_RECORD_ID=rec123456789
```

## Running the Tests

1. Start your development server if testing locally:
   ```bash
   npm run dev
   ```

2. In a separate terminal, run the test script:
   ```bash
   node test-pdf-integration.js
   ```

   **Note**: If you get an error about "require is not defined", this is because your project is using ES modules.
   This is already handled in the updated test scripts, which use ES module syntax.

3. Review the test output in the console, which will show:
   - PDF generation status
   - Supabase bucket availability
   - Upload success or failure
   - Airtable attachment status
   - Verification of attachments on the Airtable record

## Checking Your Supabase Buckets

If you're experiencing issues with Supabase storage, you can run the bucket check script:

   ```bash
node check-supabase-buckets.js
```

This script will:
- Check your Supabase credentials
- List all available storage buckets
- Verify if the target bucket exists
- Show detailed information about your storage configuration

To create missing buckets automatically, add the `--create` flag:

```bash
node check-supabase-buckets.js --create
```

## Interpreting Results

The test script uses emojis to indicate success (✅), warnings (⚠️), and errors (❌):

- ✅ - Test passed successfully
- ⚠️ - Potential issue or skipped test (with reason)
- ❌ - Test failed (with error details)

## Troubleshooting

If tests fail, check the following:

### PDF Generation Issues
- Ensure your API server is running
- Check that the API_BASE_URL is correct
- Verify that the `/api/generate-pdf` endpoint is accessible

### Supabase Issues
- Confirm your Supabase credentials are correct
- Verify that the project has at least one storage bucket
- Check permissions on the bucket (should allow uploads)

### Airtable Issues
- Verify your Airtable API key and base ID
- Ensure the TEST_RECORD_ID exists in your Transactions table
- Check that the field ID for PDF attachments matches your schema

## Production Testing

To test against your production environment:

1. Update the `API_BASE_URL` in your `.env` file to point to your production URL:
   ```
   API_BASE_URL=https://your-production-url.vercel.app
   ```

2. Run the test script as usual:
```bash
   node test-pdf-integration.js
   ```

## Advanced Usage

### Testing Specific Components

You can modify the script to test only specific parts of the integration:

```javascript
async function runSpecificTests() {
  // Test only PDF generation
  const pdfData = await testPdfGeneration();
  
  // Or test only Supabase buckets
  await testSupabaseBuckets();
}

// Replace runTests() with your custom function
runSpecificTests();
```

### Adding Custom Tests

You can extend the test script to cover additional functionality by adding new test functions and including them in the `runTests()` function. 