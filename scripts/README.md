# Transaction Testing Scripts

This directory contains scripts to test the transaction form submission process, including PDF generation, Airtable submission with attachments, and email functionality.

## Available Scripts

### test-transaction-flow.js

The main testing script that validates the entire transaction workflow:

1. PDF Generation - Tests creating a PDF from the transaction form data
2. Airtable Submission - Tests submitting to Airtable with the PDF attachment
3. Email Sending - Tests sending an email with the PDF attachment

### run-test.bat / run-test.sh

Helper scripts to run the test on Windows (.bat) or macOS/Linux (.sh).

## How to Run the Tests

### Windows

```
cd scripts
run-test.bat
```

### macOS/Linux

```
cd scripts
chmod +x run-test.sh
./run-test.sh
```

## Test Outputs

The test scripts create a `test-output` directory containing:

- `test-blank.pdf` - A blank template test to verify PDF loading
- `test-filled.pdf` (or similar named file) - The generated PDF with form data
- `test-report.json` - A JSON report with the test results

## Required Environment Variables

The test script checks for these environment variables:

### PDF Generation
No special environment variables required.

### Airtable Submission
- `VITE_AIRTABLE_API_KEY` - Airtable API key
- `VITE_AIRTABLE_BASE_ID` - Airtable base ID
- `VITE_AIRTABLE_CLIENTS_TABLE_ID` - Airtable clients table ID

### Email Sending
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - SMTP username
- `EMAIL_PASSWORD` - SMTP password
- `EMAIL_FROM` - From email address
- `EMAIL_RECIPIENT` - Recipient email address

If any required variables are missing, the test will use mock data for those steps.

## Troubleshooting

If you encounter errors:

1. Check that all required dependencies are installed
2. Ensure the PDF template file exists at `public/mergedTC.pdf`
3. Verify environment variables are set correctly
4. Check the console output for specific error messages

## Adding More Tests

You can extend the test script by adding new test cases to `test-transaction-flow.js`.
