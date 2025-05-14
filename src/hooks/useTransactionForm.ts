import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { validateStep, validateStepFlexible } from "@/utils/validation";
import { submitToAirtable } from "@/utils/airtable.final";
import { sendTransactionPdfViaApi } from "@/utils/pdfService";
import { formatPdfForAirtable } from "@/services/pdfService";
import { SubmissionStep } from "@/components/TransactionForm/SubmissionProgress";
import {
  PropertyData,
  Client,
  CommissionData,
  PropertyDetailsData,
  TitleCompanyData,
  AdditionalInfoData,
  SignatureData,
  TransactionFormData,
  AgentData,
  DocumentsData,
  DocumentItem
} from "@/types/transaction";
import { v4 as uuidv4 } from 'uuid';
import { MissingFieldsNotification } from '@/components/TransactionForm/MissingFieldsNotification';

// Define submission process steps
const SUBMISSION_STEPS: SubmissionStep[] = [
  { id: 'save', label: 'Saving your transaction information', status: 'pending' },
  { id: 'generate', label: 'Preparing your documents', status: 'pending' },
  { id: 'email', label: 'Sending confirmation', status: 'pending' },
  { id: 'complete', label: 'Completing your submission', status: 'pending' }
];

export const useTransactionForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [skippedFields, setSkippedFields] = useState<{step: number, fields: string[]}[]>([]);
  const [bypassValidationMode, setBypassValidationMode] = useState(false);

  const [agentData, setAgentData] = useState<AgentData>({
    role: undefined as unknown as AgentRole, // Initialize as undefined to force user selection
    name: "",
    email: "",
    phone: "",
  });

  const [propertyData, setPropertyData] = useState<PropertyData>({
    mlsNumber: "",
    address: "",
    salePrice: "",
    status: "OCCUPIED",
    isWinterized: "NO",
    updateMls: "NO",
    propertyAccessType: "ELECTRONIC LOCKBOX",
    lockboxAccessCode: "",
    county: "",
    propertyType: "RESIDENTIAL",
    isBuiltBefore1978: "NO",
    closingDate: ""
  });

  const [clients, setClients] = useState<Client[]>([
    {
      id: uuidv4(),
      name: '',
      email: '',
      phone: '',
      address: '',
      maritalStatus: 'SINGLE',
      type: 'BUYER'
    }
  ]);

  const [commissionData, setCommissionData] = useState<CommissionData>({
    totalCommissionPercentage: "",
    listingAgentPercentage: "",
    buyersAgentPercentage: "",
    hasBrokerFee: false,
    brokerFeeAmount: "",
    sellerPaidAmount: "",
    buyerPaidAmount: "",
    hasSellersAssist: false,
    sellersAssist: "",
    isReferral: false,
    referralParty: "",
    referralFee: "",
    brokerEin: "",
    coordinatorFeePaidBy: "client"
  });

  const [propertyDetails, setPropertyDetails] = useState<PropertyDetailsData>({
    resaleCertRequired: false,
    hoaName: "",
    coRequired: false,
    municipality: "",
    firstRightOfRefusal: false,
    firstRightName: "",
    attorneyRepresentation: false,
    attorneyName: "",
    homeWarranty: false,
    warrantyCompany: "",
    warrantyCost: "",
    warrantyPaidBy: "SELLER",
  });

  const [titleData, setTitleData] = useState<TitleCompanyData>({
    titleCompany: "",
  });

  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoData>({
    specialInstructions: "",
    urgentIssues: "",
    notes: ""
  });

  const [signatureData, setSignatureData] = useState<SignatureData>({
    signature: "",
    infoConfirmed: false,
    termsAccepted: false,
    agentName: "",
    dateSubmitted: new Date().toISOString().split('T')[0],
  });

  const [documentsData, setDocumentsData] = useState<DocumentsData>({
    documents: [],
    confirmDocuments: false
  });

  const [submitting, setSubmitting] = useState(false);

  // Submission progress tracking
  const [showProgressOverlay, setShowProgressOverlay] = useState(false);
  const [submissionSteps, setSubmissionSteps] = useState<SubmissionStep[]>([...SUBMISSION_STEPS]);
  const [currentSubmissionStep, setCurrentSubmissionStep] = useState(0);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // State for validation bypass UI
  const [showValidationUI, setShowValidationUI] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  // Functions to update submission progress
  const startSubmissionProgress = () => {
    setSubmissionSteps([...SUBMISSION_STEPS]);
    setCurrentSubmissionStep(0);
    setSubmissionError(null);
    setShowProgressOverlay(true);
    setSubmitting(true);

    // Set first step to loading
    updateSubmissionStep(0, 'loading');
  };

  const updateSubmissionStep = (stepIndex: number, status: SubmissionStep['status']) => {
    setSubmissionSteps(prev => {
      const newSteps = [...prev];
      if (newSteps[stepIndex]) {
        newSteps[stepIndex] = { ...newSteps[stepIndex], status };
      }
      return newSteps;
    });
  };

  const completeCurrentStep = () => {
    // Mark current step as complete
    updateSubmissionStep(currentSubmissionStep, 'complete');

    // Move to next step if there is one
    if (currentSubmissionStep < submissionSteps.length - 1) {
      const nextStep = currentSubmissionStep + 1;
      setCurrentSubmissionStep(nextStep);

      // Add a small delay before starting the next step for better visual feedback
      setTimeout(() => {
        // Set next step to loading
        updateSubmissionStep(nextStep, 'loading');
      }, 300);
    }
  };

  const handleSubmissionError = (message: string) => {
    // Mark current step as error
    updateSubmissionStep(currentSubmissionStep, 'error');

    // Set error message
    setSubmissionError(message);

    // Keep overlay visible, but allow for dismissal
    setSubmitting(false);
  };

  const closeProgressOverlay = () => {
    setShowProgressOverlay(false);
    setSubmissionError(null);
  };

  // Store skipped field information
  const markFieldsAsSkipped = (step: number, fields: string[]) => {
    setSkippedFields(prev => {
      // Check if we already have records for this step
      const existingStepIndex = prev.findIndex(item => item.step === step);

      if (existingStepIndex >= 0) {
        // Update existing step record
        const newSkippedFields = [...prev];
        newSkippedFields[existingStepIndex] = {
          ...newSkippedFields[existingStepIndex],
          fields: [...fields]
        };
        return newSkippedFields;
      } else {
        // Add new step record
        return [...prev, { step, fields }];
      }
    });
  };

  // Get all skipped fields for the current form
  const getAllSkippedFields = () => {
    return skippedFields.reduce((acc, stepData) => {
      return [...acc, ...stepData.fields];
    }, [] as string[]);
  };

  // Check if a specific field was skipped
  const isFieldSkipped = (fieldName: string) => {
    return skippedFields.some(stepData => stepData.fields.includes(fieldName));
  };

  // Toggle bypass validation mode
  const toggleBypassMode = () => {
    setBypassValidationMode(prev => !prev);
    return !bypassValidationMode;
  };

  // Load saved draft if available
  useEffect(() => {
    const savedDraft = localStorage.getItem('transactionFormDraft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);

        // Set all the form state from the draft
        setAgentData(parsedDraft.agentData || agentData);
        setPropertyData(parsedDraft.propertyData || propertyData);
        setClients(parsedDraft.clients || clients);
        setCommissionData(parsedDraft.commissionData || commissionData);
        setPropertyDetails(parsedDraft.propertyDetails || propertyDetails);
        setTitleData(parsedDraft.titleData || titleData);
        setAdditionalInfo(parsedDraft.additionalInfo || additionalInfo);
        setSignatureData(parsedDraft.signatureData || signatureData);
        setDocumentsData(parsedDraft.documentsData || documentsData);
        setCurrentStep(parsedDraft.currentStep || 1);

        toast({
          title: "Draft Loaded",
          description: "Your saved progress has been restored.",
          variant: "default",
          duration: 1500,
        });
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Auto-save draft when form data changes
  useEffect(() => {
    const formData = {
      agentData,
      propertyData,
      clients,
      commissionData,
      propertyDetails,
      titleData,
      additionalInfo,
      signatureData,
      documentsData,
      currentStep,
    };

    localStorage.setItem('transactionFormDraft', JSON.stringify(formData));
  }, [agentData, propertyData, clients, commissionData, propertyDetails,
      titleData, additionalInfo, signatureData, documentsData, currentStep]);

  // Function to clear draft data
  const clearDraft = () => {
    localStorage.removeItem('transactionFormDraft');
    toast({
      title: "Draft Cleared",
      description: "Saved progress has been cleared.",
      variant: "default",
      duration: 1500,
    });
  };

  const handleStepClick = (step: number) => {
    // Don't validate if going back
    if (step < currentStep) {
      setCurrentStep(step);
      return;
    }

    const errors = validateStep(currentStep, prepareForSubmission());

    if (Object.keys(errors).length === 0) {
      setCurrentStep(step);
    } else {
      Object.values(errors).flat().forEach((error) => {
        toast({
          title: "Validation Error",
          description: error,
          variant: "destructive",
        });
      });
    }
  };

  const handleNext = () => {
    const submissionData = prepareForSubmission();

    // Special handling for role selection (step 1)
    if (currentStep === 1) {
      if (!agentData.role || !['LISTING AGENT', 'BUYERS AGENT', 'DUAL AGENT'].includes(agentData.role)) {
        toast({
          title: "Please Select a Role",
          description: "Please select your role to continue",
          variant: "destructive",
        });
        return;
      }
    }

    // If we're in bypass mode, skip validation and proceed immediately
    if (bypassValidationMode) {
      setBypassValidationMode(false);

      // Get any skipped fields in this step
      const currentStepErrors = validateStep(currentStep, submissionData);

      if (Object.keys(currentStepErrors).length > 0) {
        // Record skipped fields for this step
        markFieldsAsSkipped(currentStep, Object.keys(currentStepErrors));
      }

      // Move to the next step
      setCurrentStep(prev => Math.min(prev + 1, 9));
      return;
    }

    // Regular validation process
    const validationErrors = validateStep(currentStep, submissionData);

    if (Object.keys(validationErrors).length === 0) {
      // No errors, proceed to next step
      setCurrentStep(prev => Math.min(prev + 1, 9));
    } else {
      // We have validation errors - show the user-friendly bypass UI
      setValidationErrors(validationErrors);
      setShowValidationUI(true);
    }
  };

  // Simplified function to handle continuing with errors
  const handleContinueWithErrors = () => {
    // Record the skipped fields for this step
    markFieldsAsSkipped(currentStep, Object.keys(validationErrors));

    // Close the validation UI
    setShowValidationUI(false);

    // Proceed to next step
    setCurrentStep(prev => Math.min(prev + 1, 9));
  };

  // Handle fixing validation errors
  const handleFixValidationError = (field: string) => {
    // Log the field for debugging and better understanding of field mappings
    console.log(`Attempting to navigate to field: ${field}`);

    // Mapping of common field names to their DOM IDs or selectors
    const fieldToElementMapping: Record<string, string> = {
      'mlsNumber': '[name="mlsNumber"]',
      'address': '[name="address"]',
      'salePrice': '[name="salePrice"]',
      'closingDate': '[name="closingDate"]',
      'county': '[name="county"]',
      'clients': '.client-form', // Class for client form sections
      'name': '[name*="name"]', // Any field with 'name' in the name attribute
      'email': '[name*="email"]',
      'phone': '[name*="phone"]',
      'totalCommissionPercentage': '[name="totalCommissionPercentage"]',
      'signature': '[name="signature"]',
      // Add more mappings as needed
    };

    // Try to find the element by mapped selector, ID, or name attribute
    let errorElement = null;

    // First try the mapping
    if (fieldToElementMapping[field]) {
      errorElement = document.querySelector(fieldToElementMapping[field]);
    }

    // If not found, try by ID
    if (!errorElement) {
      errorElement = document.getElementById(field);
    }

    // If still not found, try by name attribute
    if (!errorElement) {
      errorElement = document.querySelector(`[name="${field}"]`);
    }

    // If still not found, try with aria-invalid to find any invalid field
    if (!errorElement) {
      errorElement = document.querySelector(`[aria-invalid="true"]`);
    }

    // If we found an element, scroll to it
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      try {
        // Try to focus the element for better user experience
        (errorElement as HTMLElement).focus();
      } catch (e) {
        // Ignore focus errors
      }
    } else {
      // We couldn't find the specific element - this isn't an error condition
      // Just close the validation UI and let the handleFixField function in TransactionForm handle it
      console.log(`Could not find DOM element for field: ${field}, relying on parent navigation`);
    }

    // Hide validation UI without showing any error toasts
    setShowValidationUI(false);
  };

  // Close validation UI
  const closeValidationUI = () => {
    setShowValidationUI(false);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    // Scrolling will be handled by the useEffect in the TransactionForm component
  };

  const prepareForSubmission = (): TransactionFormData => {
    // Create a copy of agentData with the name from signatureData if available
    const updatedAgentData = {
      ...agentData,
      // Use the agent name from the signature section if available
      name: signatureData?.agentName || agentData.name
    };

    const submissionData: TransactionFormData = {
      agentData: updatedAgentData,
      propertyData,
      clients,
      commissionData,
      propertyDetailsData: propertyDetails,
      titleData,
      additionalInfo,
      signatureData,
      documentsData,
    };

    console.log("SUBMISSION DATA:", submissionData);
    return submissionData;
  };

  // Helper function to reset the form
  const resetForm = () => {
    // Clear localStorage items
    localStorage.removeItem('transactionFormDraft');
    localStorage.removeItem('documentsValidated');

    // Reset all form state
    setAgentData({ role: undefined as unknown as AgentRole, name: "", email: "", phone: "" });
    setPropertyData({ mlsNumber: "", address: "", salePrice: "", status: "OCCUPIED", isWinterized: "NO", updateMls: "NO", propertyAccessType: "ELECTRONIC LOCKBOX", lockboxAccessCode: "", county: "", propertyType: "RESIDENTIAL", isBuiltBefore1978: "NO", closingDate: "" });
    setClients([{ id: uuidv4(), name: '', email: '', phone: '', address: '', maritalStatus: 'SINGLE', type: 'BUYER' }]);
    setCommissionData({
      totalCommissionPercentage: "",
      listingAgentPercentage: "",
      buyersAgentPercentage: "",
      hasBrokerFee: false,
      brokerFeeAmount: "",
      sellerPaidAmount: "",
      buyerPaidAmount: "",
      hasSellersAssist: false,
      sellersAssist: "",
      isReferral: false,
      referralParty: "",
      referralFee: "",
      brokerEin: "",
      coordinatorFeePaidBy: "client"
    });
    setPropertyDetails({ resaleCertRequired: false, hoaName: "", coRequired: false, municipality: "", firstRightOfRefusal: false, firstRightName: "", attorneyRepresentation: false, attorneyName: "", homeWarranty: false, warrantyCompany: "", warrantyCost: "", warrantyPaidBy: "SELLER" });
    setTitleData({ titleCompany: "" });
    setAdditionalInfo({ specialInstructions: "", urgentIssues: "", notes: "" });
    setSignatureData({
      signature: "",
      infoConfirmed: false,
      termsAccepted: false,
      agentName: "",
      dateSubmitted: new Date().toISOString().split('T')[0]
    });
    setDocumentsData({ documents: [], confirmDocuments: false });

    // Reset step
    setCurrentStep(1);

    // Provide user feedback
    toast({
      title: "Form Reset",
      description: "The form has been reset to its initial state.",
      variant: "default",
    });

    // Reset progress states
    setSubmitting(false);
    setShowProgressOverlay(false);
    setSubmissionSteps([...SUBMISSION_STEPS]);
    setCurrentSubmissionStep(0);
    setSubmissionError(null);

    // Clear any draft or persistent storage
    clearDraft();
  };

  const handleSubmit = async (): Promise<void> => {
    // Start submission progress
    startSubmissionProgress();

    try {
      const formData = prepareForSubmission();

      // 1. Submit to Airtable first (without PDF attachment)
      console.log("Submitting to Airtable...");

      // Add a slight delay before completing first step to ensure it's visible
      await new Promise(resolve => setTimeout(resolve, 800));

      const result = await submitToAirtable(formData);

      if (!result.success) {
        throw new Error(result.error || "Failed to submit transaction");
      }

      console.log("Airtable submission successful.");

      // Mark saving step as complete and move to document generation
      completeCurrentStep();

      // Add a slight delay before continuing to ensure the second step is visible
      await new Promise(resolve => setTimeout(resolve, 800));

      // 2. Generate PDF, upload to Supabase, and send email
      console.log("Generating and uploading PDF...");
      try {
        // First generate PDFs and other documents
        const { uploadPdfToSupabase } = await import('@/utils/supabaseUpload');

        // Generate PDF with the API
        const pdfResponse = await fetch('/api/generate-pdf?returnPdf=true', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            transactionId: result.transactionId
          }),
        });

        if (!pdfResponse.ok) {
          throw new Error(`Failed to generate PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
        }

        const pdfResult = await pdfResponse.json();

        if (!pdfResult.success) {
          throw new Error(pdfResult.error || 'Failed to generate PDF');
        }

        // Get PDF data from response
        const pdfData = pdfResult.pdfBase64 || pdfResult.pdfData;

        if (!pdfData) {
          throw new Error('No PDF data returned from API');
        }

        // Document generation complete, move to next step (email)
        completeCurrentStep();

        // Add a slight delay before continuing to ensure the third step is visible
        await new Promise(resolve => setTimeout(resolve, 800));

        // Send email with the PDF
        await sendTransactionPdfViaApi(formData, result.transactionId);

        // Email step complete, move to upload step
        completeCurrentStep();

        // Add a slight delay before continuing to ensure the fourth step is visible
        await new Promise(resolve => setTimeout(resolve, 800));

        // Upload the PDF to storage
        const filename = `transaction-${formData.propertyData?.mlsNumber || 'unknown'}.pdf`;

        try {
          const uploadResult = await uploadPdfToSupabase(pdfData, filename, result.transactionId);

          if (!uploadResult.success) {
            // Supabase upload failed, try direct Airtable attachment
            console.log(`Supabase upload failed: ${uploadResult.error}. Trying direct Airtable attachment...`);

            // Try the direct Airtable attachment as fallback
            if (result.transactionId) {
              await attachToAirtable(pdfData, filename, result.transactionId);
            }
          }
        } catch (uploadError) {
          console.log(`Supabase upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}. Trying direct Airtable attachment...`);

          // Try the direct Airtable attachment as fallback
          if (result.transactionId) {
            await attachToAirtable(pdfData, filename, result.transactionId);
          }
        }

        // Final step complete
        completeCurrentStep();

        // Add an automatic success state to the progress modal
        setTimeout(() => {
          setSubmissionSteps(prev => {
            const newSteps = [...prev];
            // Add a success message to the last step
            if (newSteps[newSteps.length - 1]) {
              newSteps[newSteps.length - 1] = {
                ...newSteps[newSteps.length - 1],
                label: newSteps[newSteps.length - 1].label + ' - Success!',
              };
            }
            return newSteps;
          });

          // Keep the progress modal visible longer for better user experience
          setTimeout(() => {
            setShowProgressOverlay(false);
            setSubmitting(false);

            // Reset the form after successful submission
            resetForm();

            // We remove the toast here as it's redundant with the completed progress modal
          }, 3000); // Show the completed progress for 3 seconds
        }, 1000); // Wait 1 second after completion before adding success state

      } catch (error) {
        console.error("Error during PDF/email process:", error);
        handleSubmissionError("There was a problem processing your transaction. Please try again or contact support.");
      }

    } catch (error: any) {
      console.error("Error during submission process:", error);

      // Determine user-friendly error message
      let errorMessage = "There was a problem submitting your transaction. Please try again.";

      handleSubmissionError(errorMessage);
    }
  };

  // Helper function to attach PDF directly to Airtable
  const attachToAirtable = async (pdfData: string, filename: string, transactionId: string) => {
    try {
      const { formatPdfForAirtable } = await import('@/services/pdfService');

      await formatPdfForAirtable(pdfData, filename, transactionId);

      console.log('Successfully attached PDF to Airtable directly');

      return true;
    } catch (error) {
      console.error("Error attaching PDF to Airtable:", error);
      return false;
    }
  };

  return {
    currentStep,
    setCurrentStep,
    agentData,
    setAgentData,
    propertyData,
    setPropertyData,
    clients,
    setClients,
    commissionData,
    setCommissionData,
    propertyDetails,
    setPropertyDetails,
    titleData,
    setTitleData,
    additionalInfo,
    setAdditionalInfo,
    signatureData,
    setSignatureData,
    documentsData,
    setDocumentsData,
    handleStepClick,
    handleNext,
    handlePrevious,
    handleSubmit,
    submitting,
    // Progress tracking state and functions
    showProgressOverlay,
    submissionSteps,
    currentSubmissionStep,
    submissionError,
    closeProgressOverlay,
    // New skipped fields tracking
    skippedFields,
    getAllSkippedFields,
    isFieldSkipped,
    bypassValidationMode,
    toggleBypassMode,
    // Validation UI
    showValidationUI,
    validationErrors,
    handleContinueWithErrors,
    handleFixValidationError,
    closeValidationUI
  };
};
