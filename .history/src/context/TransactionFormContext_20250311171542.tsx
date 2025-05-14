import React, { createContext, ReactNode, useContext, useReducer } from 'react';
import { AgentRole } from '@/types/transaction';

// Define types

interface FormData {
  // Will be populated with form data
  [key: string]: any;
}

interface FormDataWithRole extends FormData {
  selectedRole: AgentRole | undefined;
}
interface TransactionFormState {
  selectedRole: AgentRole | undefined;
  currentStep: number;
  isSubmitting: boolean;
  formData: FormDataWithRole;
}

// Define action types
type TransactionFormAction =
  | { type: 'SET_ROLE'; payload: AgentRole }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'UPDATE_FORM_DATA'; payload: { section: string; data: any } };

// Create context
interface TransactionFormContextType {
  state: TransactionFormState;
  dispatch: React.Dispatch<TransactionFormAction>;
}

const TransactionFormContext = createContext<TransactionFormContextType | undefined>(undefined);

// Initial state
const initialState: TransactionFormState = {
  selectedRole: undefined,
  currentStep: 1,
  isSubmitting: false,
  formData: { selectedRole: undefined },
};

// Reducer
function transactionFormReducer(state: TransactionFormState, action: TransactionFormAction): TransactionFormState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, selectedRole: action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.section]: action.payload.data,
        },
      };
    default:
      return state;
  }
}

// Provider component
export function TransactionFormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(transactionFormReducer, initialState);

  return (
    <TransactionFormContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionFormContext.Provider>
  );
}

// Hook to use the context
export function useTransactionForm() {
  const context = useContext(TransactionFormContext);
  if (!context) {
    throw new Error('useTransactionForm must be used within a TransactionFormProvider');
  }
  return context;
}
