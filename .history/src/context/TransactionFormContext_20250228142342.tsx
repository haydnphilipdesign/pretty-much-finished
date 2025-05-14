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
      status: "",
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
      maritalStatus: "",
      type: "",
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
    },
    warrantyData: {
      homeWarranty: false,
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
              maritalStatus: "",
              type: "",
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
