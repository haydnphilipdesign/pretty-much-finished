import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the form state interface
interface FormState {
  formData: Record<string, any>;
  isValid: boolean;
  isDirty: boolean;
  currentStep: number;
  selectedRole: string | null;
}

// Define the form context interface
interface FormContextType {
  state: FormState;
  setFormData: (data: Record<string, any>) => void;
  updateFormField: (field: string, value: any) => void;
  resetForm: () => void;
  setCurrentStep: (step: number) => void;
  setSelectedRole: (role: string) => void;
  validateForm: () => boolean;
}

// Create the context with a default value
const FormContext = createContext<FormContextType | undefined>(undefined);

// Initial form state
const initialFormState: FormState = {
  formData: {},
  isValid: false,
  isDirty: false,
  currentStep: 0,
  selectedRole: null
};

// Provider component
export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FormState>(initialFormState);

  // Set the entire form data
  const setFormData = (data: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      formData: data,
      isDirty: true
    }));
  };

  // Update a specific field in the form data
  const updateFormField = (field: string, value: any) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value
      },
      isDirty: true
    }));
  };

  // Reset the form to its initial state
  const resetForm = () => {
    setState(initialFormState);
  };

  // Set the current step
  const setCurrentStep = (step: number) => {
    setState(prev => ({
      ...prev,
      currentStep: step
    }));
  };

  // Set the selected role
  const setSelectedRole = (role: string) => {
    setState(prev => ({
      ...prev,
      selectedRole: role
    }));
  };

  // Validate the form (placeholder - implement actual validation logic)
  const validateForm = () => {
    // Simple validation - check if required fields exist
    const isValid = Object.keys(state.formData).length > 0;
    
    setState(prev => ({
      ...prev,
      isValid
    }));
    
    return isValid;
  };

  return (
    <FormContext.Provider
      value={{
        state,
        setFormData,
        updateFormField,
        resetForm,
        setCurrentStep,
        setSelectedRole,
        validateForm
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the form context
export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};