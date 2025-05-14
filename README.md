# PA Real Estate Support Services - Cover Sheet Generator

This project provides a solution for automatically generating real estate transaction cover sheets using data from Airtable.

## Overview

The Cover Sheet Generator maps Airtable form submissions to HTML cover sheet templates and converts them to PDF format. This allows agents to quickly generate standardized cover sheets for real estate transactions based on the role they play in the transaction (Buyer's Agent, Listing Agent, or Dual Agent).

## Features

- Maps Airtable form fields to cover sheet templates
- Supports three agent roles: Buyer's Agent, Listing Agent, and Dual Agent
- Generates print-ready PDF cover sheets
- Server-side PDF generation with Puppeteer
- Client-side generation with jsPDF and html2canvas
- Simple, easy-to-use address input
- React component for easy integration
- Integration with Make.com (formerly Integromat) for Airtable PDF attachments

## Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Set up your environment variables in `.env.local`:

```
NEXT_PUBLIC_AIRTABLE_API_KEY=your_airtable_api_key
NEXT_PUBLIC_AIRTABLE_BASE_ID=your_base_id
INTEGRATION_WEBHOOK_URL=your_make_webhook_url
```

## How It Works

The system follows these steps:

1. **Data Retrieval**: Fetches form submission data from Airtable using their API.
2. **Template Selection**: Selects the appropriate cover sheet template based on agent role.
3. **Data Mapping**: Maps Airtable field IDs to specific HTML elements in the template.
4. **PDF Generation**: Renders the populated template and converts it to a PDF.
5. **Integration**: Uses Make.com webhook to attach PDFs to Airtable records.

## Advanced Features (Reference Only)

Some advanced features like USPS address verification are available in the codebase as reference but are not currently active. The reference implementations can be found in `src/reference/usps-address-verification/`.

## Usage

### Using the GenerateCoverSheet Component

```jsx
import GenerateCoverSheet from '@/components/GenerateCoverSheet';

// Inside your component:
<GenerateCoverSheet 
  tableId="tblHyCJCpQSgjn0md" // Your Airtable table ID
  recordId="recABC123" // The specific record ID
  agentRole="DUAL AGENT" // Optional, defaults to form value
/>
```

### Server-Side API

You can also use the API endpoint directly:

```javascript
// Example fetch request
const response = await fetch('/api/generateCoverSheet', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    tableId: 'tblHyCJCpQSgjn0md',
    recordId: 'recABC123',
  }),
});

const data = await response.json();
// data.path contains the URL to the generated PDF
```

## Field Mapping

The system uses field mappings defined in the code to connect Airtable fields to cover sheet elements:

### Key Airtable Field IDs

| Field ID | Description |
|----------|-------------|
| fldOVyoxz38rWwAFy | Agent Role |
| fld6O2FgIXQU5G27o | MLS Number |
| fldypnfnHhplWYcCW | Property Address |
| fldSqxNOZ9B5PgSab | Client Name |
| flddP6a8EG6qTJdIi | Client Email |
| fldBnh8W6iGW014yY | Client Phone |
| fldz1IpeR1256LhuC | Client Address |
| fldSY6vbE1zAhJZqd | Client Type |
| fldhHjBZJISmnP8SK | Sale Price |
| flduuQQT7o6XAGlRe | Listing Agent % |
| fld5KRrToAAt5kOLd | Buyers Agent % |
| fldE8INzEorBtx2uN | Total Commission % |
| fldhrYdoFwtNfzdFY | PDF Attachment |

For a complete list of field mappings, review the `pdfGenerator.ts` and `serverPdfGenerator.ts` files.

## Make.com (formerly Integromat) Integration

The application uses Make.com to handle PDF attachments for Airtable. This is especially useful in serverless environments like Vercel where the filesystem is read-only.

### Setting Up Make.com Integration

1. **Create a Make.com account**:
   - Go to https://www.make.com and sign up or log in
   - Create a new workspace or use an existing one

2. **Create a new scenario**:
   - Click "Create a new scenario"
   - Search for "webhook" and select "Webhooks" as your trigger module
   - Add a "Custom webhook" trigger
   - Name your webhook (e.g., "PDF to Airtable")
   - Save and copy the webhook URL

3. **Configure the data structure**:
   - Create a new data structure (e.g., "PDF Data")
   - Add the following fields:
     - `pdfData` (Text)
     - `transactionId` (Text)
     - `filename` (Text)
     - `timestamp` (Date/Time)
     - `source` (Text)

4. **Add Airtable module**:
   - Add an Airtable "Update a record" action after the webhook
   - Connect your Airtable account
   - Select your base and table ("Transactions")
   - Set "Record ID" to map to the `transactionId` from the webhook
   - For the PDF attachment field (fldhrYdoFwtNfzdFY), configure it as:
     ```
     [{
       "url": "data:application/pdf;base64," + pdfData,
       "filename": filename
     }]
     ```

5. **Enable the scenario**:
   - Save and activate your scenario
   - Add the webhook URL to your `.env` file as `INTEGRATION_WEBHOOK_URL`

6. **Test the integration**:
   - Submit a transaction form
   - Check the Make.com execution log
   - Verify the PDF attachment in Airtable

## Development

### Helper Scripts

The project includes several helper scripts:

- `npm run setup:email` - Configure email settings
- `npm run check:env` - Check environment variables

### Adding New Fields

To add a new field mapping:

1. Find the field ID in Airtable
2. Determine the CSS selector for the target HTML element
3. Add a mapping entry in the appropriate mapping array in `pdfGenerator.ts` or `serverPdfGenerator.ts`

Example:

```javascript
{ 
  fieldId: 'fldXYZ123', 
  cssSelector: '.section .field-element', 
  valueType: 'text' 
}
```

### Modifying Templates

The HTML templates (`Buyer.html`, `Seller.html`, and `DualAgent.html`) can be modified directly. When making changes:

1. Keep the overall structure intact
2. Maintain element classes and IDs used in the mappings
3. Test PDFs thoroughly after making changes

## Serverless Environment Configuration

When deploying to a serverless environment like Vercel:

1. **Add Environment Variables**:
   - Add your Airtable API key and base ID
   - Add your Make.com webhook URL
   - Configure email settings if needed

2. **Vercel Build Settings**:
   - Ensure the Node.js version is set to at least 14.x
   - Set the build command to `npm run build`
   - Set the output directory to `.next`

3. **Important Notes for Serverless**:
   - The filesystem is read-only in serverless environments
   - All file operations must use the Make.com integration
   - Local file paths won't work in production

## License

This project is proprietary and confidential. All rights reserved.

## Automatic PDF Printing

The project includes a script to monitor an email inbox and automatically print PDF attachments when they arrive. This is especially useful for automatically printing cover sheets that are sent to the email address.

### Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Email Credentials**:
   Update your `.env` file with the required email credentials:
   ```
   EMAIL_USER=debbie@parealestatesupport.com
   EMAIL_PASSWORD=your_email_password
   EMAIL_HOST=smtp.gmail.com
   ```

   For Gmail accounts, you'll need to use an App Password instead of your regular password.
   [Learn how to create an App Password](https://support.google.com/accounts/answer/185833)

3. **Run the Auto-Printer Script**:
   ```bash
   node scripts/autoprint-email-pdfs.js
   ```

   The script will:
   - Connect to the email inbox
   - Monitor for new emails
   - Extract and print PDF attachments automatically
   - Continue running until manually stopped

### Using with Windows Task Scheduler

To have the script run automatically when your computer starts:

1. Create a batch file (e.g., `start-autoprinter.bat`) with the following content:
   ```bat
   @echo off
   cd /d C:\path\to\your\project
   node scripts/autoprint-email-pdfs.js
   ```

2. Open Task Scheduler and create a new task:
   - Set it to run at system startup
   - Action: Start a program
   - Program/script: Browse to your batch file
   - Start in: Your project directory

Now the auto-printer will start automatically when you boot your computer.