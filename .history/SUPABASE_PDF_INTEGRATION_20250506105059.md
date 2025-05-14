# Supabase PDF Upload Integration

## Overview

This document explains how the Supabase PDF upload functionality has been integrated with the form submission process. The integration allows transaction PDFs to be uploaded to Supabase storage, providing a secure and reliable way to store and access transaction documents.

## Implementation Details

### 1. Form Submission Flow

The form submission process now includes the following steps:

1. Submit transaction data to Airtable
2. Generate PDF from the transaction data
3. Upload the PDF to Supabase storage
4. Send email with the PDF
5. Update Airtable record with the PDF attachment

### 2. Key Components

#### Supabase Upload Utility

A new utility function has been created in `src/utils/supabaseUpload.ts` that handles uploading PDFs to Supabase storage. This function:

- Takes base64-encoded PDF data
- Uploads it to Supabase via the API endpoint
- Returns the public URL of the uploaded file

#### API Endpoint

A new API endpoint has been created at `pages/api/supabase-pdf-upload.js` that:

- Receives PDF data from the frontend
- Uploads it to Supabase storage
- Optionally updates the Airtable record with the PDF attachment
- Returns the public URL of the uploaded file

#### Modified PDF Generation Endpoint

The existing PDF generation endpoint at `api/generate-pdf.js` has been updated to:

- Support returning the generated PDF as base64 data
- Allow the frontend to upload the PDF to Supabase

#### Updated Form Submission Logic

The form submission logic in `src/hooks/useTransactionForm.ts` has been updated to:

- Generate the PDF and get it as base64 data
- Upload the PDF to Supabase storage
- Send email with the PDF
- Show appropriate toast notifications for each step

## Usage

No changes are required to the user interface or form submission process. The PDF upload to Supabase happens automatically when a transaction form is submitted.

## Benefits

1. **Secure Storage**: PDFs are stored in Supabase's secure storage bucket
2. **Reliable Access**: PDFs can be accessed via public URLs
3. **Backup**: PDFs are stored even if email delivery fails
4. **Integration**: PDFs can be attached to Airtable records

## Configuration

Make sure the following environment variables are set:

- `SUPABASE_URL`: URL of your Supabase project
- `SUPABASE_ANON_KEY`: Anonymous key for your Supabase project
- `AIRTABLE_API_KEY`: API key for Airtable (for attachment updates)
- `AIRTABLE_BASE_ID`: ID of your Airtable base

## Testing

You can test the PDF upload functionality using the `test-pdf-upload.js` script:

```bash
node test-pdf-upload.js
```

This script will:

1. Create a test PDF file
2. Upload it to Supabase
3. Format it for Airtable
4. Display the results

## Troubleshooting

If you encounter issues with the PDF upload functionality, check the following:

1. Verify that the Supabase storage bucket is properly configured (see `supabase-setup-guide.md`)
2. Check that the environment variables are correctly set
3. Look for error messages in the console logs
4. Verify that the PDF data is properly formatted as base64