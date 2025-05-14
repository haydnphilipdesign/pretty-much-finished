# Airtable Integration Documentation

This document provides details on how the application integrates with Airtable for storing transaction data.

## Overview

The application uses Airtable as its backend database to store transaction and client information. The integration is handled through the Airtable API, with field mappings defined in the `airtable.final.ts` file.

## Key Files

- `airtable.final.ts`: The main integration file that handles submitting data to Airtable
- `airtable.node.ts`: A Node.js compatible version for testing outside of the Vite environment
- `airtable.testTransaction.ts`: Contains test transaction data for the Vite environment
- `airtable.testTransaction.debug.ts`: Debug version of the test transaction utility

## Environment Variables

The following environment variables are required for the Airtable integration:

```
VITE_AIRTABLE_API_KEY=your_api_key
VITE_AIRTABLE_BASE_ID=your_base_id
VITE_AIRTABLE_TRANSACTIONS_TABLE_ID=tblHyCJCpQSgjn0md
VITE_AIRTABLE_CLIENTS_TABLE_ID=tblvdy7T9Hv4SasdI
```

## Field Mappings

The application maps form data to Airtable fields based on the Fields.csv file. Only fields specified in this file are submitted to Airtable, even if the form contains additional elements for user experience purposes.

### Transaction Fields

| Form Field | Airtable Field ID | Description |
|------------|-------------------|-------------|
| mlsNumber | fld6O2FgIXQU5G27o | MLS Number |
| address | fldypnfnHhplWYcCW | Property Address |
| propertyStatus | fldV2eLxz6w0TpLFU | Property Status (OCCUPIED, VACANT) |
| salePrice | fldhHjBZJISmnP8SK | Sale Price |
| isWinterized | fldExdgBDgdB1i9jy | Winterized (YES, NO) |
| updateMls | fldw3GlfvKtyNfIAW | Update MLS (YES, NO) |
| sellersAssist | fldTvXx96Na0zRh6W | Sellers Assist |
| totalCommission | fldsOqVJDGYKUjD8L | Total Commission |
| totalCommissionPercentage | fldE8INzEorBtx2uN | Total Commission Percentage |
| fixedCommissionAmount | fldNXNV9Yx2LwJPhN | Fixed Commission Amount |
| listingAgentPercentage | flduuQQT7o6XAGlRe | Listing Agent Percentage |
| buyersAgentPercentage | fld5KRrToAAt5kOLd | Buyer's Agent Percentage |
| buyerPaidPercentage | flddRltdGj05Clzpa | Buyer Paid Percentage |
| isReferral | fldLVyXkhqppQ7WpC | Referral (YES, NO) |
| referralParty | fldzVtmn8uylVxuTF | Referral Party |
| referralFee | fldewmjoaJVwiMF46 | Referral Fee |
| brokerEin | fld20VbKbWzdR4Sp7 | Broker EIN |
| specialInstructions | fldDWN8jU4kdCffzu | Special Instructions |
| urgentIssues | fldgW16aPdFMdspO6 | Urgent Issues |
| notes | fld30htJ7euVerCLW | Additional Information |
| requiresFollowUp | fldIG7LFmo1Sro6Oz | Requires Follow Up (YES, NO) |
| agentName | fldFD4xHD0vxnSOHJ | Agent Name |
| agentRole | fldOVyoxz38rWwAFy | Agent Role (BUYERS AGENT, LISITNG AGENT, DUAL AGENT) |
| clients | fldi0fN0dFhllMEp1 | Linked Clients (relationship field) |

### Client Fields

| Form Field | Airtable Field ID | Description |
|------------|-------------------|-------------|
| name | fldSqxNOZ9B5PgSab | Client Name |
| email | flddP6a8EG6qTJdIi | Client Email |
| phone | fldBnh8W6iGW014yY | Client Phone |
| address | fldz1IpeR1256LhuC | Client Address |
| type | fldSY6vbE1zAhJZqd | Client Type (BUYER, SELLER) |
| maritalStatus | fldeK6mjSfxELU0MD | Marital Status (SINGLE, MARRIED, DIVORCED, DIVORCE IN PROGRESS, WIDOWED) |

## Data Submission Approaches

### Client-First Approach (Original)

1. When a transaction form is submitted, the application creates client records first
2. Each client and their respective information is submitted as a separate record
3. After creating client records, a transaction record is created with links to the client records
4. The property address is used to link client records to the transaction

### Transaction-First Approach (Recommended)

1. When a transaction form is submitted, the application creates the transaction record first
2. Client records are then created with links to the transaction record
3. The transaction record is updated with links to the client records
4. This approach simplifies relationship management in Airtable

#### Relationship Field IDs

- "Linked Clients" (In Transactions Table): `fldi0fN0dFhllMEp1`
- "Related Transactions" (In Clients Table): `fldYsIpMRHmvRjpUd`

## Testing the Integration

Several test scripts are available to verify the Airtable integration:

```bash
# Run in Vite environment
npm run test-transaction
npm run test-transaction-debug

# Run with Node.js (using dotenv)
node scripts/test-transaction-simple.js
node scripts/test-transaction-complete.js
node scripts/test-airtable-connection.js
```

## Troubleshooting

If you encounter issues with the Airtable integration:

1. Check that all environment variables are set correctly
2. Verify that the field IDs match those in your Airtable base
3. Ensure that the field types match (e.g., YES/NO fields should be sent as strings, not booleans)
4. Use the test scripts to debug specific issues
5. Check the Airtable API documentation for any changes or limitations
