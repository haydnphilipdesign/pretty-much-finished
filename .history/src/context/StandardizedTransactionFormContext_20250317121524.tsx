import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FormData, AgentRole, TransactionFormState } from '../types/transaction';
import { v4 as uuidv4 } from 'uuid';
import { formValidationService, ValidationResult } from '../services/formValidation';

// Define all possible action types for the form
export type TransactionFormAction =
  | { type: 'SET_ROLE'; payload: AgentRole }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<FormData> }
  | { type: 'UPDATE_FIELD'; payload: { section: string; field: string; value: any } }
  | { type: 'ADD_CLIENT' }
  | { type: 'REMOVE_CLIENT'; payload: string }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; field: string; value: any } }
  | { type: 'VALIDATE_SECTION'; payload: string }
  | { type: 'VALIDATE_FORM' }
  | { type: 'MARK_DIRTY'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_SAVED_DATA'; payload: FormData };

// Define the context interface with enhanced functionality
export interface TransactionFormContextType {
  state: TransactionFormState;
  dispatch: React.Dispatch<TransactionFormAction>;
  // Helper functions for common operations
  updateField: (section: string, field: string, value: any) => void;
  validateSection: (section: string) => ValidationResult;
  validateForm: () => ValidationResult;
  setStep: (step: number) => void;
  setRole: (role: AgentRole) => void;
  addClient: () => void;
  removeClient: (id: string) => void;
  updateClient: (id: string, field: string, value: any) => void;
  resetForm: () => void;
  saveProgress: () => Promise<void>;
  loadSavedData: (data: FormData) => void;
}

// Initial state with proper typing and complete initialization
const initialState: TransactionFormState = {
  selectedRole: undefined,
  currentStep: 0,
  isSubmitting: false,
  formData: {
    propertyData: {
      mlsNumber: "",
      address: "",
      salePrice: "",
      status: "vacant", // Default value
      isWinterized: false,
      updateMls: false,
      county: "",
      isBuiltBefore1978: false,
      propertyType: "",
      price: "",
      closingDate: ""
    },
    clients: [{
      id: uuidv4(),
      name: "",
      email: "",
      phone: "",
      address: "",
      maritalStatus: "single", // Default value
      type: "buyer", // Default value
    }],
    commissionData: {
      sellersAssist: "",
      totalCommission: "",
      listingAgentCommission: "",
      buyersAgentCommission: "",
      brokerFee: "",
      isReferral: false,
      referralParty: "",
      brokerEin: "",
      referralFee: "",
      brokerSplit: "",
      coordinatorFeePaidBy: "client",
    },
    propertyDetailsData: {
      propertyType: "",
      yearBuilt: "",
      squareFootage: "",
      lotSize: "",
      bedrooms: "",
      bathrooms: "",
      garageSpaces: "",
      parkingSpaces: "",
      resaleCertRequired: false,
      hoaName: "",
      coRequired: false,
      municipality: "",
      firstRightOfRefusal: false,
      firstRightName: "",
      attorneyRepresentation: false,
      attorneyName: "",
    },
    warrantyData: {
      hasWarranty: false,
      warrantyCompany: "",
      warrantyCost: "",
    },
    titleData: {
      titleCompany: "",
    },
    additionalInfo: {
      specialInstructions: "",
      urgentIssues: "",
      notes: "",
      additionalNotes: "",
      requiresFollowUp: false,
    },
    signatureData: {
      agentName: "",
      termsAccepted: false,
      infoConfirmed: false,
      signature: "",
      dateSubmitted: "",
      date: "",
      listingAgent: "",
      listingLicense: "",
      listingBroker: "",
      listingCoAgent: "",
      listingCoLicense: "",
      buyersAgent: "",
      buyersLicense: "",
      buyersBroker: "",
      buyersCoAgent: "",
      buyersCoLicense: "",
    }
  }
};

// Create the context
const TransactionFormContext = createContext<TransactionFormContextType | undefined>(undefined);

// Reducer function with improved type safety and handling
function transactionFormReducer(
  state: TransactionFormState,
  action: TransactionFormAction
): TransactionFormState {
  switch (action.type) {
    case 'SET_ROLE':
      return {
        ...state,
        selectedRole: action.payload,
      };
      
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };
      
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
      
    case 'UPDATE_FIELD':
      const { section, field, value } = action.payload;
      return {
        ...state,
        formData: {
          ...state.formData,
          [section]: {
            ...state.formData[section as keyof FormData],
            [field]: value
          }
        }
      };
      
    case 'ADD_CLIENT':
      return {
        ...state,
        formData: {
          ...state.formData,
          clients: [
            ...state.formData.clients,
            {
              id: uuidv4(),
              name: "",
              email: "",
              phone: "",
              address: "",
              maritalStatus: "single", // Default value
              type: "buyer", // Default value
            },
          ],
        },
      };
      
    case 'REMOVE_CLIENT':
      // Prevent removing the last client
      if (state.formData.clients.length <= 1) {
        return state;
      }
      return {
        ...state,
        formData: {
          ...state.formData,
          clients: state.formData.clients.filter(
            (client) => client.id !== action.payload
          ),
        },
      };
      
    case 'UPDATE_CLIENT':
      return {
        ...state,
        formData: {
          ...state.formData,
          clients: state.formData.clients.map((client) =>
            client.id === action.payload.id
              ? { ...client, [action.payload.field]: action.payload.value }
              : client
          ),
        },
      };
      
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload
      };
      
    case 'LOAD_SAVED_DATA':
      return {
        ...state,
        formData: action.payload
      };
      
    case 'RESET_FORM':
      return initialState;
      
    default:
      return state;
  }
}

// Provider component with enhanced functionality
export function TransactionFormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(transactionFormReducer, initialState);

  // Helper functions for common operations
  const updateField = (section: string, field: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { section, field, value } });
  };

  const validateSection = (section: string): ValidationResult => {
    const sectionData = state.formData[section as keyof FormData];
    return formValidationService.validateSection(section, sectionData, state.formData, state.selectedRole || undefined);
  };

  const validateForm = (): ValidationResult => {
    return formValidationService.validateForm(state.formData, state.selectedRole || undefined);
  };

  const setStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const setRole = (role: AgentRole) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  };

  const addClient = () => {
    dispatch({ type: 'ADD_CLIENT' });
  };

  const removeClient = (id: string) => {
    dispatch({ type: 'REMOVE_CLIENT', payload: id });
  };

  const updateClient = (id: string, field: string, value: any) => {
    dispatch({ type: 'UPDATE_CLIENT', payload: { id, field, value } });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  // Mock implementation - replace with actual API call
  const saveProgress = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_SUBMITTING', payload: true });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Save to localStorage as a fallback
      localStorage.setItem('transactionFormData', JSON.stringify(state.formData));
      console.log('Form data saved successfully');
    } catch (error) {
      console.error('Error saving form data:', error);
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  const loadSavedData = (data: FormData) => {
    dispatch({ type: 'LOAD_SAVED_DATA', payload: data });
  };

  const contextValue: TransactionFormContextType = {
    state,
    dispatch,
    updateField,
    validateSection,
    validateForm,
    setStep,
    setRole,
    addClient,
    removeClient,
    updateClient,
    resetForm,
    saveProgress,
    loadSavedData
  };

  return (
    <TransactionFormContext.Provider value={contextValue}>
      {children}
    </TransactionFormContext.Provider>
  );
}

// Custom hook for accessing the context
export function useTransactionForm() {
  const context = useContext(TransactionFormContext);
  if (!context) {
    throw new Error('useTransactionForm must be used within a TransactionFormProvider');
  }
  return context;
}