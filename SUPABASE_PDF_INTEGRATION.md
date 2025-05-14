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
- Updates the Airtable record with the PDF attachment
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

## Testing and Troubleshooting the Integration

### Using the Integration Test Script

A comprehensive test script is available to verify all aspects of the PDF generation and storage flow:

```bash
node test-pdf-integration.js
```

This script tests:
1. PDF generation via the `/api/generate-pdf` endpoint
2. Supabase bucket availability and fallback mechanism
3. PDF upload to Supabase storage
4. Direct Airtable attachment
5. Verification of attachments in Airtable records

See `PDF_TESTING_GUIDE.md` for detailed instructions on running the tests.

### Common Issues and Solutions

#### Bucket Not Found Error

If you encounter a `Bucket not found` error:

```
Error uploading PDF to Supabase: {"success":false,"error":"Failed to upload PDF: Bucket not found"}
```

Solutions:
1. Verify that your Supabase project has at least one storage bucket created
2. Create a `transaction-documents` bucket in your Supabase dashboard:
   - Go to Storage in your Supabase dashboard
   - Click "New Bucket"
   - Name it `transaction-documents`
   - Set appropriate permissions (typically public read, authenticated write)
3. The application includes a fallback mechanism that will try to use any available bucket if `transaction-documents` doesn't exist

#### Checking Supabase Storage Buckets

You can verify your bucket configuration directly:

```javascript
// Simple bucket check script
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkBuckets() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Connected to Supabase successfully');
  
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return;
    }
    
    if (!buckets || buckets.length === 0) {
      console.log('No buckets found in your Supabase project.');
      console.log('Please create at least one bucket in your Supabase dashboard.');
      return;
    }
    
    console.log(`Found ${buckets.length} buckets:`);
    buckets.forEach(bucket => console.log(` - ${bucket.name}`));
    
    // Check for our target bucket
    const targetBucket = 'transaction-documents';
    const bucketExists = buckets.some(bucket => bucket.name === targetBucket);
    
    if (bucketExists) {
      console.log(`✅ Target bucket '${targetBucket}' exists`);
    } else {
      console.log(`⚠️ Target bucket '${targetBucket}' not found`);
      console.log('Consider creating this bucket for optimal performance.');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkBuckets();
```

Save this as `check-supabase-buckets.js` and run it with `node check-supabase-buckets.js` to see your current bucket configuration.

#### Vercel Environment Variables

Ensure your Vercel environment has the correct Supabase credentials:

1. In your Vercel dashboard, go to your project
2. Navigate to Settings > Environment Variables
3. Verify that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correctly set
4. If you update them, redeploy your application

#### Debugging the Upload Process

For advanced debugging, you can modify `api/supabase-pdf-upload.js` to include additional console logs and then check your Vercel logs:

```javascript
// Example debug log to add before upload
console.log(`Debug: Attempting to upload to bucket ${bucketToUse}`);
console.log(`Debug: File path ${filePath}`);
console.log(`Debug: PDF buffer size ${pdfBuffer.length} bytes`);
```

The Vercel deployment will show these logs in your project dashboard under the Logs section.