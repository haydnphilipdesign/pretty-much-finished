import React from "react";
import { motion } from "framer-motion";
import { TransactionFormWithAutofill } from "./TransactionFormWithAutofill";

interface PortalTransactionFormWithAutofillProps {
}

export const PortalTransactionFormWithAutofill: React.FC<PortalTransactionFormWithAutofillProps> = () => {
  return (
    <motion.div 
      className="min-h-screen bg-brand-blue"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Transaction Submission Form (with Autofill)</h1>
          <p className="text-white/80 mt-2">Complete the form to submit your transaction. You can use the autofill button for testing.</p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TransactionFormWithAutofill />
        </motion.div>
      </div>
    </motion.div>
  );
}; 