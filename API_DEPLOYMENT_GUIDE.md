# API Deployment Guide for Real Estate Support Services

This guide documents how to properly deploy the API endpoints for the real estate support services application.

## API Endpoints

The application uses the following critical API endpoints:

1. `/api/generate-pdf` - Generates transaction PDFs
2. `/api/supabase-pdf-upload` - Uploads PDFs to Supabase storage
3. `/api/update-airtable-attachment` - Attaches PDFs to Airtable records

## Deployment Steps

### 1. Ensure correct files are present in `/api` directory

The following files must be present in the `api/` directory:
- `generate-pdf.js`
- `supabase-pdf-upload.js`
- `update-airtable-attachment.js`

### 2. Verify `.vercelignore` configuration

Make sure none of the critical API files are listed in `.vercelignore`. 
Lines containing these files should be commented out or removed:

```
# Keep these critical functions (don't add to .vercelignore)
# api/generate-pdf.js
# api/supabase-pdf-upload.js
# api/update-airtable-attachment.js
```

### 3. Configure `vercel.json`

The `vercel.json` file should include:

1. Functions section with memory/duration settings
2. Routes for each API endpoint
3. CORS headers for API routes

Example:
```json
{
    "version": 2,
    "buildCommand": "npm run vercel-build",
    "functions": {
        "api/generate-pdf.js": {
            "memory": 1024,
            "maxDuration": 60
        },
        "api/supabase-pdf-upload.js": {
            "memory": 1024,
            "maxDuration": 60
        },
        "api/update-airtable-attachment.js": {
            "memory": 1024,
            "maxDuration": 60
        }
    },
    "routes": [
        { 
            "src": "/api/(.*)",
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "continue": true
        },
        { "src": "/api/generate-pdf", "dest": "/api/generate-pdf.js" },
        { "src": "/api/supabase-pdf-upload", "dest": "/api/supabase-pdf-upload.js" },
        { "src": "/api/update-airtable-attachment", "dest": "/api/update-airtable-attachment.js" },
        { "handle": "filesystem" },
        { "src": "/(.*)", "dest": "/index.html" }
    ]
}
```

### 4. Set Environment Variables

Make sure these environment variables are set in Vercel:

- `SUPABASE_URL` - Supabase instance URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `AIRTABLE_API_KEY` - Airtable API key
- `AIRTABLE_BASE_ID` - Airtable base ID
- `NEXT_PUBLIC_HOST_URL` - Root URL of the deployed app

### 5. Deploy

Run the deployment process:

```bash
vercel --prod
```

## Troubleshooting

### API returns HTML instead of JSON

If the API endpoints return HTML content instead of JSON responses, check:

1. Authentication settings - APIs might be protected by default
2. CORS headers - Ensure proper headers are set in vercel.json
3. Routing configuration - Verify routes in vercel.json are correct

### PDF Upload and Airtable Attachment Issues

If PDFs aren't uploading to Supabase or attaching to Airtable:

1. Check Supabase bucket exists (`transaction-documents`)
2. Verify Airtable credentials and permissions
3. Look for errors in the function logs in Vercel dashboard
4. Test individual components using the test scripts:
   - `test-supabase-integration.js`
   - `check-production-config.js`

### Memory Errors

If functions fail with memory errors:

1. Increase the memory allocation in vercel.json (max 3008MB for Pro plan)
2. Consider code optimization to reduce memory usage

## Testing Deployed APIs

Run the check-production-config.js script to test the deployed API endpoints:

```bash
node check-production-config.js
```

This will show if the endpoints are properly configured and accepting requests. 