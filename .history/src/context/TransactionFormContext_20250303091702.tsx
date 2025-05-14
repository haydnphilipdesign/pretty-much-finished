import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FormData, AgentRole, TransactionFormState } from '../types/transaction';
import { v4 as uuidv4 } from 'uuid';

type TransactionFormAction =
  | { type: 'SET_ROLE'; payload: AgentRole }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<FormData> }
  | { type: 'ADD_CLIENT' }
  | { type: 'REMOVE_CLIENT'; payload: string }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; field: string; value: string } }
  | { type: 'RESET_FORM' };

const initialState: TransactionFormState = {
  selectedRole: null,
  currentStep: 0,
  isSubmitting: false,
  formData: {
    propertyData: {
      mlsNumber: "",
      address: "",
      salePrice: "",
      status: "occupied", // Fixed: Using a valid enum value instead of empty string
      isWinterized: false,
      updateMls: false,
      county: "",
    },
    clients: [{
      id: uuidv4(),
      name: "",
      email: "",
      phone: "",
      address: "",
      maritalStatus: "single", // Fixed: Using a valid enum value instead of empty string
      type: "buyer", // Fixed: Using a valid enum value instead of empty string
    }],
    commissionData: {
      commissionBase: "salePrice",
      totalCommission: "",
      listingAgentCommission: "",
      buyersAgentCommission: "",
      buyerPaidCommission: "",
      sellersAssist: "",
      isReferral: false,
      referralParty: "",
      brokerEin: "",
      referralFee: "",
      brokerSplit: "", // Added missing required property
      coordinatorFeePaidBy: "client",
    },
    propertyDetailsData: {
      resaleCertRequired: false,
      hoaName: "",
      coRequired: false,
      municipality: "",
      firstRightOfRefusal: false,
      firstRightName: "",
      attorneyRepresentation: false,
      attorneyName: "",
      // Added missing required properties
      propertyType: "",
      squareFootage: "",
      lotSize: "",
      bedrooms: "",
      bathrooms: "",
      garageSpaces: "",
      parkingSpaces: "",
    },
    warrantyData: {
      hasWarranty: false, // Fixed: Changed from homeWarranty to hasWarranty
      warrantyCompany: "",
      warrantyCost: "",
    },
    titleCompanyData: {
      titleCompanyName: "",
      titleCompanyContact: "",
      titleCompanyPhone: "",
      titleCompanyEmail: "",
    },
    additionalInfoData: {
      specialInstructions: "",
      urgentIssues: "",
      notes: "",
      additionalNotes: "",
      requiresFollowUp: false,
    },
    signatureData: {
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
      agentName: "",
      termsAccepted: false,
      infoConfirmed: false,
      signature: "",
      dateSubmitted: ""
    }
  }
};

interface TransactionFormContextType {
  state: TransactionFormState;
  dispatch: React.Dispatch<TransactionFormAction>;
}

const TransactionFormContext = createContext<TransactionFormContextType | undefined>(undefined);

function transactionFormReducer(
  state: TransactionFormState,
  action: TransactionFormAction
): TransactionFormState {
  switch (action.type) {
    case 'SET_ROLE':
      return {
        ...state,
        selectedRole: action.payload,
        currentStep: 1, // Automatically move to next step after role selection
      };
    case 'SET_STEP':
      // Validate step boundaries
      const newStep = Math.max(0, Math.min(action.payload, 9)); // Assuming 10 steps (0-9)
      return {
        ...state,
        currentStep: newStep,
      };
    case 'UPDATE_FORM_DATA':
      const updatedFormData = {
        ...state.formData,
        ...action.payload,
      };
      return {
        ...state,
        formData: updatedFormData,
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
              maritalStatus: "single", // Fixed: Using a valid enum value
              type: "buyer", // Fixed: Using a valid enum value
            },
          ],
        },
      };
    case 'REMOVE_CLIENT':
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
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

export function TransactionFormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(transactionFormReducer, initialState);

  return (
    <TransactionFormContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionFormContext.Provider>
  );
}

export function useTransactionForm() {
  const context = useContext(TransactionFormContext);
  if (!context) {
    throw new Error('useTransactionForm must be used within a TransactionFormProvider');
  }
  return context;
}
