# Server-Side PDF Generation Setup

This document explains how the application has been restructured to separate server-side code (PDF generation and email sending) from the client-side code, solving the Vite build issues.

## Architecture Overview

The application is now split into two parts:

1. **Client-side React App** (built with Vite)
   - Handles the UI, forms, and user interactions
   - Makes API calls to the server for PDF generation and email sending

2. **Server-side Express App**
   - Handles PDF generation using Puppeteer
   - Sends emails using Nodemailer
   - Serves the built client app in production

## Directory Structure

- `/src` - Client-side React application
- `/server` - Server-side Express application
  - `/server/api` - API endpoints
  - `/server/index.js` - Main server entry point
- `/public` - Static assets and generated PDFs
- `/dist` - Built client application (created by Vite)

## Running the Application

### Development Mode

To run both the client and server in development mode:

```bash
npm run dev:full
```

This starts:
- Vite dev server for the client on port 5173 (default)
- Express server for the API on port 3001

### Production Mode

To prepare for production:

1. Build the client application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start:prod
   ```

The Express server will serve both the API and the built client files from `/dist`.

## API Endpoints

- **POST `/api/generateCoverSheet`**
  - Generates a PDF cover sheet and optionally sends it via email
  - Request body:
    ```json
    {
      "tableId": "tblHyCJCpQSgjn0md",
      "recordId": "recXXXXXXXXXXXXXX",
      "agentRole": "DUAL AGENT",
      "sendEmail": true,
      "data": {
        "propertyAddress": "123 Main St",
        "agentName": "John Doe",
        "clientNames": "Jane Smith"
      }
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "message": "Cover sheet generated successfully",
      "filename": "Cover_Sheet_2023-04-01T12-34-56-789Z.pdf",
      "path": "/generated-pdfs/Cover_Sheet_2023-04-01T12-34-56-789Z.pdf"
    }
    ```

## Environment Variables

Make sure your `.env` file includes:

```
# Airtable Configuration
AIRTABLE_API_KEY=your_api_key
AIRTABLE_BASE_ID=your_base_id

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@parealestatesupport.com
EMAIL_RECIPIENT=debbie@parealestatesupport.com

# Server Configuration
PORT=3001
```

## Vercel Deployment

For Vercel deployment, you'll need to:

1. Set up the Serverless Functions for the API endpoints
2. Configure environment variables in the Vercel dashboard
3. Use a build command that builds both client and server code

See Vercel documentation for more details on serverless function deployment.

## Notes on Implementation

- The client components now call the API endpoints instead of importing server-side code directly
- The Vite configuration has been updated to exclude server-only modules from the client bundle
- Server-side functionality has been consolidated into reusable modules
- Development setup includes proxying API requests from the Vite dev server to the Express server 