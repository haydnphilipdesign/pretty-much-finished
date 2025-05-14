
# Transaction Form

This is a multi-step form for real estate transaction intake.

## Setup

1. Copy the `.env.example` file to `.env` and fill in your Airtable API details:
   ```
   cp .env.example .env
   ```

2. Install dependencies if not already installed:
   ```
   npm install @tanstack/react-query framer-motion airtable
   ```

## Usage

### Basic Usage

Import and use the form in your React application:

```jsx
import TransactionForm from './components/TransactionForm/TransactionForm';

function MyApp() {
  return (
    <div>
      <h1>My Application</h1>
      <TransactionForm 
        onComplete={(data) => console.log('Form submitted:', data)}
        logo="/path/to/your/logo.png"
      />
    </div>
  );
}
```

### Agent Portal Integration

For use within an agent portal with additional context:

```jsx
import PortalTransactionForm from './components/TransactionForm/PortalTransactionForm';

function AgentPortal() {
  const agentId = "agent-123"; // Get from your authentication system
  
  const handleSubmit = (formData) => {
    // Handle the form submission in your application
    console.log('Transaction submitted:', formData);
  };

  return (
    <div className="agent-portal">
      <h1>Agent Portal</h1>
      <PortalTransactionForm 
        onFormSubmit={handleSubmit}
        agentId={agentId}
        logo="/path/to/your/logo.png"
      />
    </div>
  );
}
```

## Props

### TransactionForm

- `onComplete`: Callback function that receives the form data after successful submission
- `logo`: Path to your logo image (defaults to the PA Real Estate Support Services logo)
- `className`: Additional CSS classes to apply to the form container

### PortalTransactionForm

- `onFormSubmit`: Callback function that receives the enriched form data
- `agentId`: ID of the current agent (for tracking submissions)
- `logo`: Path to your logo image
- `className`: Additional CSS classes to apply to the form container

## Form Structure

The form is divided into 9 steps:

1. Role Selection
2. Property Information
3. Client Information
4. Commission Details
5. Property & Title Details
6. Warranty Information
7. Required Documents
8. Additional Information
9. Signature & Submission

## Customization

To customize the form styling or behavior, you can modify the individual component files in the `src/components/` directory.
