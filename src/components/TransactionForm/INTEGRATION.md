
# Integration Guide for Transaction Form

This guide explains how to integrate the PA Real Estate Transaction Form into your existing React project.

## Automated Installation

We've provided an installation script to automate the process. Run:

```bash
node src/components/TransactionForm/install.js
```

This script will:
1. Copy all necessary files to the appropriate directories
2. Check for required dependencies
3. Provide setup instructions

## Manual Installation

If you prefer to install manually, follow these steps:

### 1. Copy Required Files

Copy the following directories from `src/components/TransactionForm/src/` to your project:

- `components/*` → `src/components/TransactionForm/`
- `hooks/*` → `src/hooks/`
- `utils/*` → `src/utils/`
- `types/*` → `src/types/`

Also copy:
- `TransactionForm.tsx` → `src/components/TransactionForm.tsx`
- `PortalTransactionForm.tsx` → `src/components/PortalTransactionForm.tsx`
- `.env.example` → root directory

### 2. Install Dependencies

Ensure you have these dependencies installed:

```bash
npm install @tanstack/react-query airtable framer-motion lucide-react
```

### 3. Configure Environment Variables

Copy the environment variables from `.env.example` to your project's `.env` file and fill in your Airtable credentials.

```
VITE_AIRTABLE_API_KEY=your_airtable_api_key_here
VITE_AIRTABLE_BASE_ID=your_airtable_base_id_here
VITE_AIRTABLE_TRANSACTIONS_TABLE_ID=your_transactions_table_id_here
VITE_AIRTABLE_CLIENTS_TABLE_ID=your_clients_table_id_here
```

### 4. Import and Use the Form

#### As a standalone form:

```jsx
import { TransactionForm } from './components/TransactionForm';

function YourComponent() {
  return <TransactionForm />;
}
```

#### Within an agent portal:

```jsx
import { PortalTransactionForm } from './components/PortalTransactionForm';

function AgentPortalPage() {
  return <PortalTransactionForm />;
}
```

#### If you already have an AgentPortal component:

Update your existing AgentPortal.tsx:

```jsx
import { PortalTransactionForm } from './components/PortalTransactionForm';

function AgentPortal() {
  // ... your existing code

  return (
    <div>
      {/* ... your existing UI */}
      <PortalTransactionForm />
    </div>
  );
}
```

## Airtable Configuration

Ensure your Airtable base has:
- A table for Transactions
- A table for Clients

The field mappings in `src/utils/airtable.ts` may need to be updated if your Airtable field IDs differ from the default configuration.

### Airtable Integration Approaches

We provide two different approaches for integrating with Airtable:

#### 1. Client-First Approach (Default)

In this approach, implemented in `src/utils/airtable.final.ts`:
- Client records are created first
- Each client includes the property address
- A transaction record is then created with links to the client records

This is the default approach used by the form.

#### 2. Transaction-First Approach (Recommended)

In this approach, implemented in `src/utils/airtable.transaction-first.ts`:
- The transaction record is created first
- Client records are then created with links to the transaction
- The transaction is updated with links to the clients (may be optional depending on Airtable's handling of reciprocal relationships)

This approach simplifies relationship management and is recommended for new implementations.

To use the transaction-first approach:

```jsx
// In your component
import { submitTransactionToAirtable, initializeAirtable } from './utils/airtable.transaction-first';
import Airtable from 'airtable';

// Initialize Airtable
const airtableBase = initializeAirtable(Airtable);

// Submit form data
const handleSubmit = async (formData) => {
  try {
    const result = await submitTransactionToAirtable(formData, airtableBase);
    console.log('Submission successful:', result);
  } catch (error) {
    console.error('Submission failed:', error);
  }
};
```

## Customization

You can customize:
- UI appearance by modifying the components in `src/components/TransactionForm/`
- Form validation logic in `src/utils/validation.ts`
- Data handling in `src/hooks/useTransactionForm.ts`

## Troubleshooting

If you encounter import errors:
- Ensure all path references are correct for your project structure
- Make sure all dependencies are installed
- Check that component names match their file names
