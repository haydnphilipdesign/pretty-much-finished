
import React from "react";
import { TransactionForm } from "./TransactionForm";

// This component is designed to be used within an existing AgentPortal component
export function AgentPortalTransactionForm() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Transaction Intake Form</h1>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <TransactionForm />
      </div>
    </div>
  );
}
