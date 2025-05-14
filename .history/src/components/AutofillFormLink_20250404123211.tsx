import React from 'react';
import { Link } from 'react-router-dom';
import { Database } from 'lucide-react';

/**
 * A simple button component that links to the transaction form with autofill functionality
 */
const AutofillFormLink: React.FC = () => {
  return (
    <Link 
      to="/agent-portal/transaction-with-autofill"
      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
    >
      <Database className="h-5 w-5 mr-2" />
      Open Form with Autofill
    </Link>
  );
};

export default AutofillFormLink; 