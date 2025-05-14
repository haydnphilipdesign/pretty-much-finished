import React from 'react';
import { TransactionFormProvider } from '@/context/TransactionFormContext';
import { StyledTransactionForm } from './StyledTransactionForm';
import { Card } from '../ui/card';

const TransactionForm: React.FC = () => {
  return (
    <TransactionFormProvider>
      <div className="min-h-screen bg-[#0A192F] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Logo/Header */}
          <div className="flex justify-center mb-8">
            <img 
              src="/logo.png" 
              alt="PA Real Estate Support Services" 
              className="h-16 object-contain"
            />
          </div>
          
          <StyledTransactionForm />
          
          {/* Footer */}
          <div className="mt-8 text-center text-white/70 text-sm">
            <p>© {new Date().getFullYear()} PA Real Estate Support Services, LLC. All rights reserved.</p>
          </div>
        </div>
      </div>
    </TransactionFormProvider>
  );
};

export default TransactionForm;