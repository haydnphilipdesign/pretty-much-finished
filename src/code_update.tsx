/**
 * Enhanced React Form Implementation
 * 
 * A modern, type-safe form implementation with:
 * - Centralized state management
 * - Advanced validation
 * - Performance optimizations
 * - Accessibility features
 * 
 * Directory Structure:
 * /src
 *   /forms
 *     /components
 *     /context
 *     /hooks
 *     /types
 *     /validation
 */

// src/forms/types/form.types.ts
import { z } from 'zod';

export type AgentRole =   "listingAgent" | "buyersAgent" | "dualAgent";
export type MaritalStatus = "Single" | "Married" | "Divorced" | "Widowed";
export type ValidationState = 'valid' | 'invalid' | 'warning' | null;

export interface ClientInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  maritalStatus: MaritalStatus;
  designation: "Buyer" | "Seller";
}

export interface FormState {
  // Role Information
  role: AgentRole;
  
  // Property Information
  mlsNumber: string;
  propertyAddress: string;
  salePrice: string;
  
  // Client Information
  clients: ClientInfo[];
  
  // Commission Information
  totalCommission: string;
  buyersAgentCommission: string;
  listingAgentCommission: string;
  
  // Form Metadata
  currentStep: number;
  isSubmitting: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormState; value: any }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'CLEAR_ERROR'; field: string }
  | { type: 'SET_TOUCHED'; field: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'START_SUBMIT' }
  | { type: 'END_SUBMIT' }
  | { type: 'RESET_FORM' };

// src/forms/context/FormContext.tsx
import { createContext, useContext, useReducer, ReactNode } from 'react';
import { FormState, FormAction } from '../types/form.types';

const initialState: FormState = {
  role: "Buyer's Agent",
  mlsNumber: '',
  propertyAddress: '',
  salePrice: '',
  clients: [],
  totalCommission: '',
  buyersAgentCommission: '',
  listingAgentCommission: '',
  currentStep: 0,
  isSubmitting: false,
  errors: {},
  touched: {}
};

const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
} | undefined>(undefined);

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error
        }
      };
    case 'CLEAR_ERROR':
      const { [action.field]: _, ...remainingErrors } = state.errors;
      return {
        ...state,
        errors: remainingErrors
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true
        }
      };
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: state.currentStep + 1
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1)
      };
    case 'START_SUBMIT':
      return {
        ...state,
        isSubmitting: true
      };
    case 'END_SUBMIT':
      return {
        ...state,
        isSubmitting: false
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within FormProvider');
  }
  return context;
}

// src/forms/validation/schemas.ts
import { z } from 'zod';

export const clientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, 'Invalid phone format'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  designation: z.enum(['Buyer', 'Seller'])
});

export const propertySchema = z.object({
  mlsNumber: z.string().regex(/^(?:\d{6}|PM-\d{6})$/, 'Invalid MLS number format'),
  propertyAddress: z.string().min(5, 'Invalid address'),
  salePrice: z.string().regex(/^\d+(\.\d{2})?$/, 'Invalid price format')
});

// src/forms/hooks/useFormValidation.ts
import { useState, useCallback } from 'react';
import { z } from 'zod';
import { useForm } from '../context/FormContext';

export function useFormValidation(schema: z.ZodSchema) {
  const { state, dispatch } = useForm();
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(async (data: unknown) => {
    setIsValidating(true);
    try {
      await schema.parseAsync(data);
      return { valid: true, errors: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.flatten();
        Object.entries(errors.fieldErrors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            dispatch({ type: 'SET_ERROR', field, error: messages[0] });
          }
        });
        return { valid: false, errors: errors.fieldErrors };
      }
      throw error;
    } finally {
      setIsValidating(false);
    }
  }, [schema, dispatch]);

  return { validate, isValidating };
}

// src/forms/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// src/forms/components/FormField.tsx
import { memo, useCallback } from 'react';
import { useForm } from '../context/FormContext';

interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number';
  required?: boolean;
  validate?: (value: string) => string | undefined;
  placeholder?: string;
}

export const FormField = memo(({ 
  name, 
  label, 
  type = 'text', 
  required = false,
  validate,
  placeholder 
}: FormFieldProps) => {
  const { state, dispatch } = useForm();
  
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch({ type: 'SET_FIELD', field: name as any, value });
    dispatch({ type: 'SET_TOUCHED', field: name });
    
    if (validate) {
      const error = validate(value);
      if (error) {
        dispatch({ type: 'SET_ERROR', field: name, error });
      } else {
        dispatch({ type: 'CLEAR_ERROR', field: name });
      }
    }
  }, [name, validate, dispatch]);

  const handleBlur = useCallback(() => {
    dispatch({ type: 'SET_TOUCHED', field: name });
  }, [name, dispatch]);

  const value = state[name as keyof FormState] || '';
  const error = state.errors[name];
  const touched = state.touched[name];
  const showError = touched && error;

  return (
    <div className="form-field">
      <label 
        htmlFor={name}
        className={required ? 'required' : ''}
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        aria-invalid={showError ? 'true' : 'false'}
        aria-describedby={showError ? `${name}-error` : undefined}
        className={showError ? 'error' : ''}
      />
      {showError && (
        <div 
          id={`${name}-error`}
          className="error-message"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
});

// src/forms/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Form Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert" className="error-boundary">
          <h2>Something went wrong</h2>
          <p>Please try again or contact support if the problem persists.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Form Section Components
 * Modernized implementations of the form sections with:
 * - Performance optimizations
 * - Proper validation
 * - Accessibility improvements
 * - Error handling
 */

// src/forms/sections/RoleSection.tsx
import { memo } from 'react';
import { useForm } from '../context/FormContext';
import { AgentRole } from '../types/form.types';
import { Select } from '../components/Select';

export const RoleSection = memo(() => {
  const { state, dispatch } = useForm();

  const roleOptions: AgentRole[] = [
    "Buyer's Agent",
    "Listing Agent",
    "Dual Agent"
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Role Selection</h2>
      
      <Select
        label="Your Role"
        value={state.role}
        options={roleOptions}
        onChange={(value) => dispatch({ 
          type: 'SET_FIELD', 
          field: 'role', 
          value 
        })}
        required
      />

      <div className="mt-4 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Role Information</h3>
        <ul className="list-disc pl-4 space-y-2">
          <li>Listing Agent: Represents the seller</li>
          <li>Buyer's Agent: Represents the buyer</li>
          <li>Dual Agent: Represents both parties</li>
        </ul>
      </div>
    </div>
  );
});

// src/forms/sections/PropertySection.tsx
import { memo, useCallback } from 'react';
import { useForm } from '../context/FormContext';
import { FormField } from '../components/FormField';
import { useFormValidation } from '../hooks/useFormValidation';
import { propertySchema } from '../validation/schemas';
import { useDebounce } from '../hooks/useDebounce';

export const PropertySection = memo(() => {
  const { state, dispatch } = useForm();
  const { validate } = useFormValidation(propertySchema);
  
  const handleAddressChange = useCallback((address: string) => {
    dispatch({ type: 'SET_FIELD', field: 'propertyAddress', value: address });
  }, [dispatch]);

  const debouncedValidate = useDebounce(async () => {
    await validate({
      mlsNumber: state.mlsNumber,
      propertyAddress: state.propertyAddress,
      salePrice: state.salePrice
    });
  }, 500);

  useEffect(() => {
    debouncedValidate();
  }, [state.mlsNumber, state.propertyAddress, state.salePrice]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Property Information</h2>
      
      <FormField
        name="mlsNumber"
        label="MLS Number"
        required
        placeholder="Enter MLS number"
        validate={(value) => {
          if (!value.match(/^(?:\d{6}|PM-\d{6})$/)) {
            return 'Invalid MLS number format';
          }
        }}
      />

      <AddressAutocomplete
        value={state.propertyAddress}
        onChange={handleAddressChange}
        onValidate={(isValid) => {
          if (!isValid) {
            dispatch({
              type: 'SET_ERROR',
              field: 'propertyAddress',
              error: 'Please enter a valid address'
            });
          } else {
            dispatch({
              type: 'CLEAR_ERROR',
              field: 'propertyAddress'
            });
          }
        }}
      />

      <FormField
        name="salePrice"
        label="Sale Price"
        type="number"
        required
        validate={(value) => {
          const price = Number(value);
          if (isNaN(price) || price <= 0) {
            return 'Please enter a valid sale price';
          }
        }}
      />
    </div>
  );
});

// src/forms/sections/ClientSection.tsx
import { memo, useCallback } from 'react';
import { useForm } from '../context/FormContext';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import { clientSchema } from '../validation/schemas';
import { useFormValidation } from '../hooks/useFormValidation';
import { v4 as uuidv4 } from 'uuid';
import { ClientInfo } from '../types/form.types';

interface ClientFormProps {
  client: ClientInfo;
  index: number;
  onRemove: (index: number) => void;
}

const ClientForm = memo(({ client, index, onRemove }: ClientFormProps) => {
  const { dispatch } = useForm();

  const handleFieldChange = useCallback((field: keyof ClientInfo, value: string) => {
    dispatch({
      type: 'UPDATE_CLIENT',
      payload: { index, field, value }
    });
  }, [index, dispatch]);

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Client {index + 1}</h3>
        {index > 0 && (
          <Button
            variant="ghost"
            onClick={() => onRemove(index)}
            aria-label={`Remove client ${index + 1}`}
          >
            Remove
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          name={`clients.${index}.name`}
          label="Full Name"
          required
          validate={(value) => {
            if (value.length < 2) {
              return 'Name must be at least 2 characters';
            }
          }}
        />

        <FormField
          name={`clients.${index}.email`}
          label="Email"
          type="email"
          required
          validate={(value) => {
            if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
              return 'Please enter a valid email address';
            }
          }}
        />

        <FormField
          name={`clients.${index}.phone`}
          label="Phone"
          type="tel"
          required
          validate={(value) => {
            if (!value.match(/^\d{3}-\d{3}-\d{4}$/)) {
              return 'Please enter a valid phone number (XXX-XXX-XXXX)';
            }
          }}
        />

        <Select
          label="Marital Status"
          value={client.maritalStatus}
          options={[
            "Single",
            "Married",
            "Divorced",
            "Widowed"
          ]}
          onChange={(value) => handleFieldChange('maritalStatus', value)}
          required
        />
      </div>
    </div>
  );
});

export const ClientSection = memo(() => {
  const { state, dispatch } = useForm();
  const { validate } = useFormValidation(clientSchema);

  const handleAddClient = useCallback(() => {
    if (state.clients.length < 4) {
      const newClient: ClientInfo = {
        id: uuidv4(),
        name: '',
        email: '',
        phone: '',
        address: '',
        maritalStatus: 'Single',
        designation: 'Buyer'
      };

      dispatch({
        type: 'SET_FIELD',
        field: 'clients',
        value: [...state.clients, newClient]
      });
    }
  }, [state.clients.length, dispatch]);

  const handleRemoveClient = useCallback((index: number) => {
    const newClients = [...state.clients];
    newClients.splice(index, 1);
    dispatch({
      type: 'SET_FIELD',
      field: 'clients',
      value: newClients
    });
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Client Information</h2>

      <div className="space-y-4">
        {state.clients.map((client, index) => (
          <ClientForm
            key={client.id}
            client={client}
            index={index}
            onRemove={handleRemoveClient}
          />
        ))}
      </div>

      {state.clients.length < 4 && (
        <Button
          onClick={handleAddClient}
          className="w-full"
          variant="outline"
        >
          Add Another Client
        </Button>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Important Notes</h3>
        <ul className="list-disc pl-4 space-y-2">
          <li>You can add up to 4 clients</li>
          <li>All fields are required for each client</li>
          <li>Phone numbers should be in XXX-XXX-XXXX format</li>
          <li>Email addresses must be valid</li>
        </ul>
      </div>
    </div>
  );
});

/**
 * Enhanced Form Sections: Commission and Documents
 * 
 * Key Features:
 * - Real-time commission calculations
 * - Memoized computations
 * - Dynamic document requirements
 * - Accessibility improvements
 * - Error handling
 */

// src/forms/sections/CommissionSection.tsx
import { memo, useMemo, useCallback } from 'react';
import { useForm } from '../context/FormContext';
import { FormField } from '../components/FormField';
import { Select } from '../components/Select';
import { useDebounce } from '../hooks/useDebounce';


interface CommissionCalculation {
  totalAmount: number;
  buyerAgentAmount: number;
  listingAgentAmount: number;
}

export const CommissionSection = memo(() => {
  const { state, dispatch } = useForm();

  const calculateCommission = useCallback((
    salePrice: string,
    percentage: string,
  ): CommissionCalculation => {
    const price = parseFloat(salePrice) || 0;
    const rate = parseFloat(percentage) || 0;
    
    const baseAmount = commissionBase === "Net Price" 
      ? price * 0.97  // Assuming 3% closing costs
      : price;
    
    const totalAmount = (baseAmount * rate) / 100;
    const splitAmount = totalAmount / 2;

    return {
      totalAmount,
      buyerAgentAmount: splitAmount,
      listingAgentAmount: splitAmount
    };
  }, []);

  const commissionAmounts = useMemo(() => {
    return calculateCommission(
      state.salePrice,
      state.totalCommission,
      state.commissionBase
    );
  }, [state.salePrice, state.totalCommission, state.commissionBase, calculateCommission]);

  const debouncedUpdateSplits = useDebounce(() => {
    if (state.role !== "Buyer's Agent") {
      dispatch({
        type: 'SET_FIELD',
        field: 'buyersAgentCommission',
        value: commissionAmounts.buyerAgentAmount.toFixed(2)
      });
      dispatch({
        type: 'SET_FIELD',
        field: 'listingAgentCommission',
        value: commissionAmounts.listingAgentAmount.toFixed(2)
      });
    }
  }, 300);

  useEffect(() => {
    debouncedUpdateSplits();
  }, [commissionAmounts]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Commission Information</h2>

      {state.role !== "Buyer's Agent" && (
        <>
          <Select
            label="Commission Base"
            value={state.commissionBase}
            options={COMMISSION_BASES}
            onChange={(value) => dispatch({
              type: 'SET_FIELD',
              field: 'commissionBase',
              value
            })}
            required
          />

          <FormField
            name="totalCommission"
            label="Total Commission Percentage"
            type="number"
            required
            validate={(value) => {
              const commission = parseFloat(value);
              if (isNaN(commission) || commission <= 0 || commission > 100) {
                return 'Please enter a valid commission percentage (0-100)';
              }
            }}
          />
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        {state.role !== "Buyer's Agent" && (
          <FormField
            name="listingAgentCommission"
            label="Listing Agent Commission"
            type="number"
            required
            readOnly
          />
        )}

        <FormField
          name="buyersAgentCommission"
          label="Buyer's Agent Commission"
          type="number"
          required
          readOnly={state.role !== "Buyer's Agent"}
          validate={(value) => {
            const commission = parseFloat(value);
            if (isNaN(commission) || commission <= 0 || commission > 100) {
              return 'Please enter a valid commission percentage (0-100)';
            }
          }}
        />
      </div>

      {commissionAmounts.totalAmount > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium mb-2">Commission Summary</h3>
          <dl className="grid grid-cols-2 gap-2">
            <dt>Total Commission:</dt>
            <dd>${commissionAmounts.totalAmount.toFixed(2)}</dd>
            
            {state.role !== "Buyer's Agent" && (
              <>
                <dt>Listing Agent Amount:</dt>
                <dd>${commissionAmounts.listingAgentAmount.toFixed(2)}</dd>
              </>
            )}
            
            <dt>Buyer's Agent Amount:</dt>
            <dd>${commissionAmounts.buyerAgentAmount.toFixed(2)}</dd>
          </dl>
        </div>
      )}
    </div>
  );
});

// src/forms/sections/DocumentsSection.tsx
import { memo, useMemo } from 'react';
import { useForm } from '../context/FormContext';
import { Checkbox } from '../components/Checkbox';
import { BUYERS_AGENT_DOCUMENTS, LISTING_AGENT_DOCUMENTS, DUAL_AGENT_DOCUMENTS } from '../types/form.types';

interface DocumentGroup {
  title: string;
  items: Array<{
    id: string;
    name: string;
    required: boolean;
    description: string;
  }>;
}

export const DocumentsSection = memo(() => {
  const { state, dispatch } = useForm();

  const documentGroups = useMemo((): DocumentGroup[] => {
    const roleDocuments = {
      "Buyer's Agent": BUYERS_AGENT_DOCUMENTS,
      "Listing Agent": LISTING_AGENT_DOCUMENTS,
      "Dual Agent": DUAL_AGENT_DOCUMENTS
    }[state.role] || [];

    return [
      {
        title: 'Required Documents',
        items: roleDocuments.map(doc => ({
          id: doc.toLowerCase().replace(/\s+/g, '-'),
          name: doc,
          required: true,
          description: 'Required for transaction compliance'
        }))
      }
    ];
  }, [state.role]);

  const handleDocumentChange = useCallback((documentId: string, checked: boolean) => {
    const newDocuments = checked
      ? [...state.requiredDocuments, documentId]
      : state.requiredDocuments.filter(id => id !== documentId);

    dispatch({
      type: 'SET_FIELD',
      field: 'requiredDocuments',
      value: newDocuments
    });
  }, [state.requiredDocuments, dispatch]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Required Documents</h2>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-blue-800">
          Please confirm that all required documents have been uploaded to either DocuSign or Dotloop.
          These documents are necessary for transaction compliance.
        </p>
      </div>

      {documentGroups.map(group => (
        <div key={group.title} className="space-y-4">
          <h3 className="font-medium">{group.title}</h3>
          <div className="space-y-3">
            {group.items.map(document => (
              <div key={document.id} className="flex items-start space-x-3">
                <Checkbox
                  id={document.id}
                  checked={state.requiredDocuments.includes(document.id)}
                  onCheckedChange={(checked) => handleDocumentChange(document.id, checked as boolean)}
                  required={document.required}
                  aria-describedby={`${document.id}-description`}
                />
                <div className="space-y-1">
                  <label
                    htmlFor={document.id}
                    className="block text-sm font-medium"
                  >
                    {document.name}
                    {document.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <p
                    id={`${document.id}-description`}
                    className="text-sm text-gray-500">
                    {document.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-medium mb-2">Document Requirements</h3>
        <ul className="list-disc pl-4 space-y-2 text-sm">
          <li>All required documents must be properly executed and uploaded</li>
          <li>Documents should be in PDF format</li>
          <li>Each document must be complete with all required signatures</li>
          <li>Submit only the most recent version of each document</li>
        </ul>
      </div>
    </div>
  );
});

/**
 * Form Utilities and Enhanced Components
 * 
 * This module provides reusable components and utilities for the form implementation.
 * Features:
 * - Accessibility-first design
 * - Performance optimizations
 * - Comprehensive error handling
 * - Type-safe implementations
 */

// src/forms/components/Select.tsx
import { memo, useId } from 'react';
import { useForm } from '../context/FormContext';
import { SelectProps } from '../types/form.types';

interface SelectProps<T extends string> {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
}

export const Select = memo(<T extends string>({
  label,
  value,
  options,
  onChange,
  required = false,
  disabled = false,
  error,
  helpText
}: SelectProps<T>) => {
  const id = useId();
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  return (
    <div className="form-field">
      <label
        htmlFor={id}
        className={required ? 'required' : undefined}
      >
        {label}
      </label>
      
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={[
          error ? errorId : null,
          helpText ? descriptionId : null
        ].filter(Boolean).join(' ') || undefined}
        className={`form-select ${error ? 'error' : ''}`}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && (
        <div
          id={errorId}
          className="error-message"
          role="alert"
        >
          {error}
        </div>
      )}

      {helpText && (
        <div
          id={descriptionId}
          className="help-text"
        >
          {helpText}
        </div>
      )}
    </div>
  );
});

// src/forms/components/FormProgress.tsx
import { memo } from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface FormProgressProps {
  steps: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
  currentStep: number;
  completedSteps: number[];
}

export const FormProgress = memo(({ 
  steps,
  currentStep,
  completedSteps
}: FormProgressProps) => {
  return (
    <nav aria-label="Form progress" className="form-progress">
      <ol role="list" className="steps-list">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = currentStep === index;
          
          return (
            <li
              key={step.id}
              className={`step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="step-indicator">
                {isCompleted ? (
                  <Check className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <span className="step-number">{index + 1}</span>
                )}
              </div>
              
              <div className="step-content">
                <div className="step-title">{step.label}</div>
                {step.description && (
                  <p className="step-description">{step.description}</p>
                )}
              </div>

              {index < steps.length - 1 && (
                <ChevronRight className="step-separator" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

// src/forms/components/FormActions.tsx
import { memo } from 'react';
import { Button } from './Button';
import { useForm } from '../context/FormContext';

interface FormActionsProps {
  onSubmit: () => void;
  onSaveDraft?: () => void;
  isSubmitting?: boolean;
}

export const FormActions = memo(({ 
  onSubmit,
  onSaveDraft,
  isSubmitting = false
}: FormActionsProps) => {
  const { state } = useForm();
  
  const hasErrors = Object.keys(state.errors).length > 0;
  const isLastStep = state.currentStep === steps.length - 1;

  return (
    <div className="form-actions">
      <div className="action-buttons">
        {onSaveDraft && (
          <Button
            variant="outline"
            onClick={onSaveDraft}
            disabled={isSubmitting}
          >
            Save Draft
          </Button>
        )}

        {isLastStep ? (
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={isSubmitting || hasErrors}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={hasErrors}
          >
            Continue
          </Button>
        )}
      </div>

      {hasErrors && (
        <div 
          role="alert" 
          className="error-summary"
        >
          Please correct the errors before continuing
        </div>
      )}
    </div>
  );
});

// src/forms/hooks/useFormSteps.ts
import { useMemo } from 'react';
import { useForm } from '../context/FormContext';

export const useFormSteps = () => {
  const { state } = useForm();

  const steps = useMemo(() => [
    {
      id: 'role',
      label: 'Role Selection',
      description: 'Select your role in this transaction',
      validate: () => {
        if (!state.role) {
          return 'Please select a role';
        }
      }
    },
    {
      id: 'property',
      label: 'Property Details',
      description: 'Enter property information',
      validate: () => {
        const errors: string[] = [];
        if (!state.propertyAddress) {
          errors.push('Property address is required');
        }
        if (!state.salePrice) {
          errors.push('Sale price is required');
        }
        return errors.length ? errors.join(', ') : undefined;
      }
    },
    // ... additional steps
  ], [state]);

  const currentStepValidation = useMemo(() => {
    const currentStep = steps[state.currentStep];
    return currentStep?.validate?.();
  }, [steps, state.currentStep, state]);

  return {
    steps,
    currentStep: state.currentStep,
    isValid: !currentStepValidation,
    currentStepError: currentStepValidation,
    totalSteps: steps.length
  };
};

// src/forms/hooks/useFormAnalytics.ts
import { useEffect } from 'react';
import { useForm } from '../context/FormContext';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export const useFormAnalytics = () => {
  const { state } = useForm();

  const trackEvent = useCallback((event: AnalyticsEvent) => {
    // Implementation depends on analytics provider
    console.log('Analytics Event:', event);
  }, []);

  useEffect(() => {
    trackEvent({
      category: 'Form',
      action: 'Step Change',
      label: `Step ${state.currentStep + 1}`,
      value: state.currentStep
    });
  }, [state.currentStep, trackEvent]);

  return { trackEvent };
};


# Form Validation and State Management

## Overview

This document outlines the implementation of form validation and state management within the React form system. The solution uses a combination of:

- Zod for schema validation
- React Context for state management
- Custom hooks for form logic
- TypeScript for type safety

## Validation Implementation

### Schema Definition

```typescript
// src/forms/validation/schemas.ts
import { z } from 'zod';
import { AgentRole, MaritalStatus } from '../types';

export const baseFormSchema = z.object({
  // Role Information
  role: z.enum(['Buyer\'s Agent', 'Listing Agent', 'Dual Agent']),
  
  // Property Information
  mlsNumber: z.string()
    .regex(/^(?:\d{6}|PM-\d{6})$/, 'Invalid MLS number format')
    .optional(),
  propertyAddress: z.string()
    .min(5, 'Property address is required')
    .max(200, 'Address is too long'),
  salePrice: z.string()
    .regex(/^\d+(\.\d{2})?$/, 'Invalid price format'),
    
  // Client Information
  clients: z.array(z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, 'Invalid phone format'),
    maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
    designation: z.enum(['Buyer', 'Seller'])
  })).min(1, 'At least one client is required')
});

export type FormSchema = z.infer<typeof baseFormSchema>;
```

### Validation Hook

```typescript
// src/forms/hooks/useFormValidation.ts
import { useCallback, useState } from 'react';
import { z } from 'zod';
import { useForm } from '../context/FormContext';

export const useFormValidation = (schema: z.ZodSchema) => {
  const { state, dispatch } = useForm();
  const [isValidating, setIsValidating] = useState(false);

  const validateField = useCallback(async (
    field: keyof typeof state,
    value: unknown
  ) => {
    try {
      await schema.pick({ [field]: true }).parseAsync({ [field]: value });
      dispatch({ type: 'CLEAR_ERROR', field });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const [firstError] = error.errors;
        dispatch({
          type: 'SET_ERROR',
          field,
          error: firstError.message
        });
        return false;
      }
      throw error;
    }
  }, [schema, dispatch]);

  const validateForm = useCallback(async () => {
    setIsValidating(true);
    try {
      await schema.parseAsync(state);
      return { valid: true, errors: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.flatten();
        Object.entries(errors.fieldErrors).forEach(([field, messages]) => {
          if (messages?.[0]) {
            dispatch({
              type: 'SET_ERROR',
              field,
              error: messages[0]
            });
          }
        });
        return { valid: false, errors: errors.fieldErrors };
      }
      throw error;
    } finally {
      setIsValidating(false);
    }
  }, [schema, state, dispatch]);

  return {
    validateField,
    validateForm,
    isValidating
  };
};
```

## State Management

### Context Implementation

```typescript
// src/forms/context/FormContext.tsx
import { createContext, useContext, useReducer, ReactNode } from 'react';
import { FormState, FormAction } from '../types';

const initialState: FormState = {
  // Initial state values...
};

const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
} | undefined>(undefined);

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.error
        }
      };
    case 'CLEAR_ERROR': {
      const { [action.field]: _, ...remainingErrors } = state.errors;
      return {
        ...state,
        errors: remainingErrors
      };
    }
    // Additional action handlers...
    default:
      return state;
  }
}

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}
```

### Form Section Hook

```typescript
// src/forms/hooks/useFormSection.ts
import { useCallback } from 'react';
import { useForm } from '../context/FormContext';
import { useFormValidation } from './useFormValidation';

export function useFormSection<T extends keyof FormState>(options: {
  sectionName: T;
  schema: z.ZodSchema;
}) {
  const { state, dispatch } = useForm();
  const { validateField } = useFormValidation(options.schema);

  const updateField = useCallback((
    field: keyof FormState[T],
    value: unknown
  ) => {
    dispatch({ type: 'SET_FIELD', field: `${options.sectionName}.${field}`, value });
    validateField(`${options.sectionName}.${field}` as keyof FormState, value);
  }, [dispatch, options.sectionName, validateField]);

  return {
    formData: state[options.sectionName],
    updateField,
    errors: state.errors,
    touched: state.touched
  };
}
```

## Usage Examples

### Form Section Implementation

```typescript
// src/forms/sections/PropertySection.tsx
import { memo } from 'react';
import { useFormSection } from '../hooks/useFormSection';
import { propertySchema } from '../validation/schemas';
import { FormField } from '../components/FormField';

export const PropertySection = memo(() => {
  const {
    formData,
    updateField,
    errors,
    touched
  } = useFormSection({
    sectionName: 'property',
    schema: propertySchema,
  });

  return (
    <div className="space-y-6">
      <FormField
        name="mlsNumber"
        label="MLS Number"
        validate={(value) => {
          if (!value.match(/^(?:\d{6}|PM-\d{6})$/)) {
            return 'Invalid MLS number format';
          }
        }}
      />
      {/* Additional fields... */}
    </div>
  );
});
```

## Advanced Form Features

### 1. Multi-Step Form Navigation

The form implements a sophisticated multi-step navigation system with state persistence and validation.

```typescript
// src/forms/hooks/useFormNavigation.ts
import { useCallback } from 'react';
import { useForm } from '../context/FormContext';

interface StepValidation {
  isValid: boolean;
  errors: string[];
}

export function useFormNavigation() {
  const { state, dispatch } = useForm();

  /**
   * Validates the current step and navigates to the next if valid
   * Returns validation result for UI feedback
   */
  const validateAndNavigate = useCallback(async (): Promise<StepValidation> => {
    const currentStep = formSteps[state.currentStep];
    const validation = await currentStep.validate(state);
    
    if (validation.isValid) {
      dispatch({ type: 'NEXT_STEP' });
      return { isValid: true, errors: [] };
    }
    
    return {
      isValid: false,
      errors: validation.errors
    };
  }, [state, dispatch]);

  return {
    currentStep: state.currentStep,
    totalSteps: formSteps.length,
    validateAndNavigate,
    goToPreviousStep: () => dispatch({ type: 'PREV_STEP' }),
    canGoBack: state.currentStep > 0,
    isLastStep: state.currentStep === formSteps.length - 1
  };
}
```

### 2. Form State Persistence

Implements automatic state persistence to prevent data loss during page refreshes or navigation.

```typescript
// src/forms/hooks/useFormPersistence.ts
import { useEffect } from 'react';
import { useForm } from '../context/FormContext';

export function useFormPersistence(formId: string) {
  const { state, dispatch } = useForm();

  /**
   * Save form state to localStorage with debouncing
   * Prevents excessive writes during rapid updates
   */
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem(
        `form_state_${formId}`,
        JSON.stringify({
          data: state,
          timestamp: Date.now()
        })
      );
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [state, formId]);

  /**
   * Restore form state on component mount
   * Includes validation of stored data
   */
  useEffect(() => {
    const savedState = localStorage.getItem(`form_state_${formId}`);
    if (savedState) {
      try {
        const { data, timestamp } = JSON.parse(savedState);
        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
        
        if (!isExpired) {
          dispatch({ type: 'RESTORE_STATE', state: data });
        }
      } catch (error) {
        console.error('Failed to restore form state:', error);
      }
    }
  }, [formId, dispatch]);
}
```

### 3. Field-Level Validation

Implements real-time validation with debouncing and error aggregation.

```typescript
// src/forms/hooks/useFieldValidation.ts
import { useCallback, useState } from 'react';
import { useDebounce } from './useDebounce';
import { ValidationResult } from '../types';

interface ValidationOptions {
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  debounceMs?: number;
}

export function useFieldValidation(
  fieldName: string,
  validators: ((value: unknown) => Promise<ValidationResult>)[],
  options: ValidationOptions = {}
) {
  const [isValidating, setIsValidating] = useState(false);
  const { dispatch } = useForm();

  /**
   * Aggregate validation results from multiple validators
   * Returns first error encountered or success
   */
  const runValidators = useCallback(async (value: unknown) => {
    setIsValidating(true);
    try {
      for (const validator of validators) {
        const result = await validator(value);
        if (!result.isValid) {
          return result;
        }
      }
      return { isValid: true };
    } finally {
      setIsValidating(false);
    }
  }, [validators]);

  /**
   * Debounced validation handler for onChange events
   * Prevents excessive validation during rapid typing
   */
  const debouncedValidate = useDebounce(async (value: unknown) => {
    if (options.validateOnChange) {
      const result = await runValidators(value);
      if (!result.isValid) {
        dispatch({
          type: 'SET_ERROR',
          field: fieldName,
          error: result.error
        });
      } else {
        dispatch({
          type: 'CLEAR_ERROR',
          field: fieldName
        });
      }
    }
  }, options.debounceMs ?? 300);

  return {
    isValidating,
    validate: runValidators,
    handleChange: debouncedValidate,
    handleBlur: options.validateOnBlur ? runValidators : undefined
  };
}
```

## Error Handling Strategy

The form implements a comprehensive error handling strategy with multiple levels of validation and error reporting.

### 1. Error Types

```typescript
// src/forms/types/errors.ts
export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationError {
  field: string;
  message: string;
  severity: ValidationSeverity;
  code?: string;
  metadata?: Record<string, unknown>;
}

export interface FormError extends ValidationError {
  timestamp: number;
  handled: boolean;
}
```

### 2. Error Management

```typescript
// src/forms/hooks/useErrorManagement.ts
import { useCallback } from 'react';
import { useForm } from '../context/FormContext';
import { ValidationError } from '../types/errors';

export function useErrorManagement() {
  const { state, dispatch } = useForm();

  /**
   * Aggregate errors by severity and section
   * Used for displaying error summaries
   */
  const getErrorSummary = useCallback(() => {
    return Object.entries(state.errors).reduce(
      (summary, [field, error]) => {
        const section = field.split('.')[0];
        const severity = error.severity || 'error';
        
        return {
          ...summary,
          [severity]: {
            ...summary[severity],
            [section]: [...(summary[severity][section] || []), error]
          }
        };
      },
      { error: {}, warning: {}, info: {} }
    );
  }, [state.errors]);

  /**
   * Handle error reporting and recovery
   * Implements retry logic for async validations
   */
  const handleError = useCallback(async (
    error: ValidationError,
    retryCount = 0
  ) => {
    const MAX_RETRIES = 3;
    
    if (error.severity === 'error' && retryCount < MAX_RETRIES) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        // Retry validation
        return handleError(error, retryCount + 1);
      } catch (retryError) {
        console.error('Validation retry failed:', retryError);
      }
    }

    dispatch({
      type: 'SET_ERROR',
      field: error.field,
      error: {
        ...error,
        timestamp: Date.now(),
        handled: true
      }
    });
  }, [dispatch]);

  return {
    errors: state.errors,
    getErrorSummary,
    handleError,
    hasErrors: Object.keys(state.errors).length > 0
  };
}
```

## Implementation Best Practices

1. **Validation Strategy**
   - Implement field-level validation for immediate feedback
   - Use form-level validation before submissions
   - Cache validation results to prevent unnecessary re-validation

2. **Performance Optimization**
   - Debounce validation calls
   - Memoize validation functions
   - Implement progressive validation

3. **Error Recovery**
   - Implement retry logic for async validations
   - Provide clear error messages
   - Support error aggregation and summaries

4. **State Management**
   - Use atomic updates for form state
   - Implement undo/redo capability
   - Support form state persistence

## Usage Examples

### Complex Form Implementation

```typescript
// src/forms/components/ComplexForm.tsx
import { memo } from 'react';
import { useForm } from '../context/FormContext';
import { useFormNavigation } from '../hooks/useFormNavigation';
import { useFormPersistence } from '../hooks/useFormPersistence';
import { useErrorManagement } from '../hooks/useErrorManagement';

export const ComplexForm = memo(() => {
  const { state } = useForm();
  const navigation = useFormNavigation();
  const errorManagement = useErrorManagement();

  useFormPersistence('complex-form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (errorManagement.hasErrors) {
      return;
    }

    try {
      // Form submission logic
    } catch (error) {
      errorManagement.handleError({
        field: 'form',
        message: 'Submission failed',
        severity: 'error',
        metadata: { error }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form content */}
    </form>
  );
});
```


/**
 * Form Implementation with Reduced Duplication
 * 
 * Key Features:
 * - Reusable base components
 * - Centralized validation
 * - Consistent styling
 * - Type-safe implementations
 */

// src/forms/components/base/FormContainer.tsx
import React, { memo } from 'react';
import { FormProvider } from '../../context/FormContext';

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit?: (data: any) => Promise<void>;
  className?: string;
}

export const FormContainer = memo(({ 
  children, 
  onSubmit,
  className 
}: FormContainerProps) => (
  <FormProvider>
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit?.(e);
      }}
      className={cn(
        'max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8',
        className
      )}
    >
      {children}
    </form>
  </FormProvider>
));

// src/forms/components/base/FormField.tsx
import React, { memo } from 'react';
import { useFieldValidation } from '../../hooks/useFieldValidation';
import { ValidationRule } from '../../types';

interface FormFieldProps {
  name: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  validation?: ReturnType<typeof useFieldValidation>;
  required?: boolean;
  type?: 'text' | 'number' | 'email' | 'tel';
  placeholder?: string;
  className?: string;
}

export const FormField = memo(({
  name,
  label,
  value,
  onChange,
  validation,
  required = false,
  type = 'text',
  placeholder,
  className
}: FormFieldProps) => {
  const id = useId();
  const { error, touched } = validation || {};

  return (
    <div className={cn('form-field', className)}>
      <label 
        htmlFor={id}
        className={cn(
          'block text-sm font-medium text-gray-700',
          required && 'required'
        )}
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'form-input',
          error && touched && 'error'
        )}
        aria-invalid={error && touched}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {error && touched && (
        <div
          id={`${id}-error`}
          className="text-sm text-red-500 mt-1"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
});

// src/forms/sections/PropertySection.tsx
import React, { memo } from 'react';
import { FormSection, FieldGroup, FormField } from '../components/base';
import { useFormSection } from '../hooks/useFormSection';
import { commonValidationRules } from '../validation/commonRules';

export const PropertySection = memo(() => {
  const { formData, updateField } = useFormSection('property');
  
  const mlsValidation = useFieldValidation('mlsNumber', {
    rules: [commonValidationRules.mlsNumber]
  });

  const priceValidation = useFieldValidation('salePrice', {
    required: true,
    rules: [commonValidationRules.currency]
  });

  return (
    <FormSection
      title="Property Information"
      description="Enter property details for this transaction"
    >
      <FieldGroup layout="double">
        <FormField
          name="mlsNumber"
          label="MLS Number"
          value={formData.mlsNumber}
          onChange={(value) => updateField('mlsNumber', value)}
          validation={mlsValidation}
          placeholder="Enter MLS number"
        />

        <FormField
          name="salePrice"
          label="Sale Price"
          value={formData.salePrice}
          onChange={(value) => updateField('salePrice', value)}
          validation={priceValidation}
          required
          type="number"
          placeholder="Enter sale price"
        />
      </FieldGroup>
    </FormSection>
  );
});

// src/forms/sections/ClientSection.tsx
import React, { memo } from 'react';
import { FormSection, FieldGroup, FormField } from '../components/base';
import { useFormSection } from '../hooks/useFormSection';
import { commonValidationRules } from '../validation/commonRules';

export const ClientSection = memo(() => {
  const { formData, updateField } = useFormSection('client');

  const emailValidation = useFieldValidation('email', {
    required: true,
    rules: [commonValidationRules.email]
  });

  const phoneValidation = useFieldValidation('phone', {
    required: true,
    rules: [commonValidationRules.phone]
  });

  return (
    <FormSection
      title="Client Information"
      description="Enter client contact details"
    >
      <FieldGroup layout="double">
        <FormField
          name="name"
          label="Full Name"
          value={formData.name}
          onChange={(value) => updateField('name', value)}
          required
        />

        <FormField
          name="email"
          label="Email"
          value={formData.email}
          onChange={(value) => updateField('email', value)}
          validation={emailValidation}
          required
          type="email"
        />

        <FormField
          name="phone"
          label="Phone"
          value={formData.phone}
          onChange={(value) => updateField('phone', value)}
          validation={phoneValidation}
          required
          type="tel"
        />
      </FieldGroup>
    </FormSection>
  );
});

// src/forms/sections/DocumentsSection.tsx
import React, { memo } from 'react';
import { FormSection } from '../components/base';
import { useFormSection } from '../hooks/useFormSection';
import { DocumentList } from '../components/DocumentList';

export const DocumentsSection = memo(() => {
  const { formData, updateField } = useFormSection('documents');

  return (
    <FormSection
      title="Required Documents"
      description="Confirm all required documents are uploaded"
    >
      <DocumentList
        documents={getRequiredDocuments(formData.role)}
        selectedDocuments={formData.selectedDocuments}
        onSelect={(documents) => updateField('selectedDocuments', documents)}
      />
    </FormSection>
  );
});

// src/forms/components/DocumentList.tsx
interface DocumentListProps {
  documents: Array<{
    id: string;
    name: string;
    required: boolean;
  }>;
  selectedDocuments: string[];
  onSelect: (documents: string[]) => void;
}

export const DocumentList = memo(({
  documents,
  selectedDocuments,
  onSelect
}: DocumentListProps) => (
  <div className="space-y-4">
    {documents.map((doc) => (
      <div
        key={doc.id}
        className="flex items-center space-x-3"
      >
        <Checkbox
          checked={selectedDocuments.includes(doc.id)}
          onCheckedChange={(checked) => {
            const newSelection = checked
              ? [...selectedDocuments, doc.id]
              : selectedDocuments.filter(id => id !== doc.id);
            onSelect(newSelection);
          }}
          id={doc.id}
        />
        <label
          htmlFor={doc.id}
          className={cn(
            'text-sm',
            doc.required && 'font-medium'
          )}
        >
          {doc.name}
          {doc.required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      </div>
    ))}
  </div>
));