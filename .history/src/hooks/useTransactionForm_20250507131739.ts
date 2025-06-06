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
    role: "LISTING AGENT",
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
      
      // Set next step to loading
      updateSubmissionStep(nextStep, 'loading');
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

    // Get validation errors
    let errors = validateStep(currentStep, submissionData);
    let shouldProceed = false;
    
    // Special handling for role selection (step 1)
    if (currentStep === 1) {
      if (!agentData.role || !['LISTING AGENT', 'BUYERS AGENT', 'DUAL AGENT'].includes(agentData.role)) {
        errors = { role: ["Please select a valid role to continue"] };
        toast({
          title: "Validation Error",
          description: "Please select a valid role to continue",
          variant: "destructive",
        });
        return;
      }
    }

    // Special handling for documents section (step 6)
    if (currentStep === 6) {
      // Check if document confirmation is checked
      if (!documentsData.confirmDocuments) {
        errors = { confirmDocuments: ["You must confirm the document requirements to proceed"] };
        toast({
          title: "Validation Error",
          description: "You must confirm the document requirements to proceed",
          variant: "destructive",
        });
        
        // Record validation status in localStorage
        localStorage.setItem('documentsValidated', 'false');
        
        // Scroll to the documents section
        const docsSection = document.getElementById('documents-section');
        if (docsSection) {
          docsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      } else {
        // Only bypass other document validation if confirmation is checked
        errors = {};
        localStorage.setItem('documentsValidated', 'true');
      }
    }

    if (Object.keys(errors).length === 0 || bypassValidationMode) {
      // If bypassing validation, record the skipped fields
      if (bypassValidationMode && Object.keys(errors).length > 0) {
        markFieldsAsSkipped(currentStep, Object.keys(errors));
        
        // Show a toast notification that fields were skipped
        toast({
          title: "Warning: Missing Information",
          description: "You're proceeding with incomplete information. You can fill these fields later, but they will be required for final submission.",
          variant: "warning",
        });
        
        // Turn off bypass mode after using it once
        setBypassValidationMode(false);
      }
      
      // Scroll to top when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep((prev) => Math.min(prev + 1, 8)); // Use 8 as the max step
    } else {
      // Collect all error messages into a single message
      const errorMessages = Object.values(errors).flat();
      const combinedMessage = errorMessages.join("\n• ");
      
      // Show a single toast with all validation errors
      toast({
        title: "Missing Required Information",
        description: `• ${combinedMessage}\n\nWould you like to continue anyway?`,
        variant: "destructive",
        action: (
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => {
                setBypassValidationMode(true);
                handleNext();
              }}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs"
            >
              Proceed Anyway
            </button>
          </div>
        )
      });
      
      // Scroll to the first field with an error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[aria-invalid="true"], #${firstErrorField}`);
      
      if (errorElement) {
        // Scroll the error element into view
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handlePrevious = () => {
    // Scroll to top when moving to previous step
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
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
    setAgentData({ role: "LISTING AGENT", name: "", email: "", phone: "" });
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
      const result = await submitToAirtable(formData);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to submit transaction");
      }
      
      console.log("Airtable submission successful.");
      
      // Mark saving step as complete and move to document generation
      completeCurrentStep();

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
        
        // Send email with the PDF
        await sendTransactionPdfViaApi(formData, result.transactionId);
        
        // Email step complete, move to upload step
        completeCurrentStep();

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
        
        // Keep the progress modal visible for a moment to show completion
        setTimeout(() => {
          setShowProgressOverlay(false);
          setSubmitting(false);
          
          // Reset the form after successful submission
          resetForm();
          
          // Show a success message
          toast({
            title: "Transaction Submitted Successfully",
            description: "Your transaction has been processed and saved.",
            variant: "default",
          });
        }, 1500);
        
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
    toggleBypassMode
  };
};
