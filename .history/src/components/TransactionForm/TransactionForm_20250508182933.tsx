import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AgentRole, Client } from '@/types/transaction';
import { v4 as uuidv4 } from 'uuid'; // Add uuid import
import './TransactionForm.css'; // Import custom styling

// Import components
import { FormNavigation } from "@/components/TransactionForm/FormNavigation";
import { RoleSelection } from "@/components/TransactionForm/RoleSelection";
import { PropertyInformation } from "@/components/TransactionForm/PropertyInformation";
import { ClientInformation } from "@/components/TransactionForm/ClientInformation";
import { CommissionSection } from "@/components/TransactionForm/CommissionSectionImproved";
import { DocumentsSection } from "@/components/TransactionForm/DocumentsSection";
import { PropertyDetailsSection } from "@/components/TransactionForm/PropertyDetailsSectionImproved";
import { AdditionalInfoSection } from "@/components/TransactionForm/AdditionalInfoSection";
import { SignatureSection } from "@/components/TransactionForm/SignatureSection";
import { ReviewSection } from "@/components/TransactionForm/ReviewSection";
import { StepWizard } from "@/components/TransactionForm/StepWizard";
import { SubmissionProgress } from "@/components/TransactionForm/SubmissionProgress";
import { MissingFieldsIndicator } from './MissingFieldsIndicator';
import { ReviewMissingFieldsIndicator } from './ReviewMissingFieldsIndicator';
import { MobileNavBar } from "@/components/TransactionForm/MobileNavBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send, Save, RefreshCw, RotateCcw } from "lucide-react";

// Import custom dialog components
import { ResetFormDialog } from "./ResetFormDialog";
import { CustomValidationDialog } from "./CustomValidationDialog";

// Import hooks and utils
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { useToast } from "@/hooks/use-toast";

// Add import for ValidationBypassButtons
import { ValidationBypassButtons } from './ValidationBypassButtons';

// Create a new QueryClient instance
const queryClient = new QueryClient();

export function TransactionForm() {
  const { toast, dismiss } = useToast();
  const {
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
    handleSubmit: submitTransaction,
    submitting,
    showProgressOverlay,
    submissionSteps,
    currentSubmissionStep,
    submissionError,
    closeProgressOverlay,
    skippedFields,
    getAllSkippedFields,
    isFieldSkipped,
    showValidationUI,
    validationErrors,
    handleContinueWithErrors,
    handleFixValidationError,
    closeValidationUI
  } = useTransactionForm();

  // Add functionality to save form draft
  const handleSaveDraft = () => {
    try {
      localStorage.setItem('transactionFormDraft', JSON.stringify({
        agentData,
        propertyData,
        clients,
        commissionData,
        propertyDetails,
        titleData,
        additionalInfo,
        signatureData,
        documentsData,
        currentStep
      }));
      
      toast({
        title: "Draft saved",
        description: "Your form progress has been saved as a draft.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error saving draft",
        description: "There was a problem saving your draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get the selectedRole from agentData
  const selectedRole: AgentRole | undefined = agentData?.role || undefined;
  
  // Create a function to update the role
  const setSelectedRole = (role: AgentRole) => {
    setAgentData(prev => ({ ...prev, role }));
  };

  // Function to navigate to step with missing field
  const handleFixField = (field: string) => {
    // First, log the field for debugging
    console.log(`Attempting to navigate to field: ${field}`);
    
    // Clean field name - remove any nested structure notation
    const cleanField = field.includes('.') ? field.split('.').pop() || field : field;
    
    // Map field names to their corresponding steps - expanded with more field variations
    const fieldToStepMapping: Record<string, number> = {
      // Agent fields - Step 1
      'role': 1,
      'agentRole': 1,
      
      // Property fields - Step 2
      'address': 2,
      'propertyAddress': 2,
      'mlsNumber': 2,
      'mls': 2,
      'salePrice': 2,
      'price': 2,
      'closingDate': 2,
      'closing': 2,
      'county': 2,
      'propertyType': 2,
      'status': 2,
      'propertyStatus': 2,
      'propertyAccessType': 2,
      'accessType': 2,
      'lockboxAccessCode': 2,
      'lockbox': 2,
      'accessCode': 2,
      'isWinterized': 2,
      'isBuiltBefore1978': 2,
      'updateMls': 2,
      
      // Client fields - Step 3
      'clients': 3,
      'client': 3,
      'clientType': 3,
      'name': 3,
      'phone': 3,
      'email': 3,
      'maritalStatus': 3,
      'clientAddress': 3,
      
      // Commission fields - Step 4
      'totalCommissionPercentage': 4,
      'totalCommission': 4,
      'listingAgentPercentage': 4,
      'listingAgent': 4,
      'buyersAgentPercentage': 4,
      'buyersAgent': 4,
      'brokerFee': 4,
      'brokerFeeAmount': 4,
      'hasBrokerFee': 4,
      'sellersAssist': 4,
      'hasSellersAssist': 4,
      'sellerPaidAmount': 4,
      'buyerPaidAmount': 4,
      'isReferral': 4,
      'referralParty': 4,
      'brokerEin': 4,
      'referralFee': 4,
      'coordinatorFeePaidBy': 4,
      
      // Property Details fields - Step 5
      'municipality': 5,
      'hoaName': 5,
      'hoa': 5,
      'coRequired': 5,
      'co': 5,
      'resaleCertRequired': 5,
      'resaleCert': 5,
      'firstRightOfRefusal': 5,
      'firstRightName': 5,
      'attorneyRepresentation': 5,
      'attorneyName': 5,
      'homeWarranty': 5,
      'warrantyCompany': 5,
      'warrantyCost': 5,
      'warrantyPaidBy': 5,
      'titleCompany': 5,
      
      // Documents fields - Step 6
      'documents': 6,
      'confirmDocuments': 6,
      
      // Additional Info fields - Step 7
      'notes': 7,
      'specialInstructions': 7,
      'urgentIssues': 7,
      'additionalInfo': 7,
      
      // Review - Step 8
      'review': 8,
      
      // Signature fields - Step 9
      'agentName': 9,
      'signature': 9,
      'infoConfirmed': 9,
      'termsAccepted': 9,
      'dateSubmitted': 9
    };
    
    // First try exact match
    let step = fieldToStepMapping[field];
    
    // If not found, try with the cleaned field name
    if (!step && cleanField !== field) {
      step = fieldToStepMapping[cleanField];
    }
    
    // If still not found, try to find a partial match
    if (!step) {
      // Look for partial matches in the field names
      const partialMatches = Object.keys(fieldToStepMapping).filter(key => 
        field.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(field.toLowerCase())
      );
      
      if (partialMatches.length > 0) {
        // Use the first match if multiple are found
        step = fieldToStepMapping[partialMatches[0]];
        console.log(`Using partial match: ${partialMatches[0]} for field: ${field}`);
      }
    }
    
    if (step) {
      setCurrentStep(step);
      // Only show toast for direct "Fix" clicks, not for validation bypass navigation
      if (window.location.hash !== '#bypassingValidation') {
        toast({
          title: "Navigating to field",
          description: `Now fix the missing "${field}" field in step ${step}.`,
          variant: "default",
        });
      }
      
      // Add a temporary hash to prevent duplicate toasts
      window.location.hash = '';
    } else {
      console.error(`No mapping found for field: ${field}`);
      
      // If we still can't find it, use a fallback based on field naming patterns
      let fallbackStep = 0;
      
      if (field.toLowerCase().includes('client')) fallbackStep = 3;
      else if (field.toLowerCase().includes('property')) fallbackStep = 2;
      else if (field.toLowerCase().includes('commission') || field.toLowerCase().includes('fee')) fallbackStep = 4;
      else if (field.toLowerCase().includes('warranty') || field.toLowerCase().includes('title')) fallbackStep = 5;
      else if (field.toLowerCase().includes('document')) fallbackStep = 6;
      else if (field.toLowerCase().includes('signature') || field.toLowerCase().includes('confirm')) fallbackStep = 9;
      
      if (fallbackStep > 0) {
        setCurrentStep(fallbackStep);
        toast({
          title: "Field located",
          description: `Please fix the "${field}" field in this section.`,
          variant: "default",
        });
      } else {
        // As a last resort, just show the missing fields
        toast({
          title: "Field not found",
          description: `Please check all form sections for missing fields.`,
          variant: "default",
        });
      }
    }
  };

  // Modify the resetForm function
  const resetForm = () => {
    // Clear localStorage first to ensure draft is removed
    localStorage.removeItem('transactionFormDraft');
    localStorage.removeItem('documentsValidated');
    
    // Reset all form state
    setAgentData({
      role: "LISTING AGENT",
      name: "",
      email: "",
      phone: "",
    });
    setPropertyData({
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
      isBuiltBefore1978: "",
      closingDate: "",
    });
    setClients([]);
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
      brokerEin: "",
      referralFee: "",
      coordinatorFeePaidBy: "client"
    });
    setPropertyDetails({
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
    setTitleData({
      titleCompany: "",
    });
    setAdditionalInfo({
      specialInstructions: "",
      urgentIssues: "",
      notes: ""
    });
    setSignatureData({
      signature: "",
      infoConfirmed: false,
      termsAccepted: false,
      agentName: "",
      dateSubmitted: new Date().toISOString().split('T')[0],
    });
    setDocumentsData({
      documents: [],
      confirmDocuments: false
    });
    setCurrentStep(1);
    
    // Dismiss any existing toasts
    dismiss();
    
    // Show confirmation toast with shorter duration
    toast({
      title: "Form Reset",
      description: "The form has been reset to its initial state.",
      variant: "default",
      duration: 2000, // 2 seconds instead of 3
    });
  };

  const handleSubmit = async () => {
    try {
      // Use the renamed submitTransaction function from useTransactionForm
      await submitTransaction();
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  // Since we added the Signature section as a separate step, adjust the total steps
  const totalSteps = 9;

  // Create a ref for the form content
  const formContentRef = React.useRef<HTMLDivElement>(null);
  
  // State to track if the viewport is mobile sized
  const [isMobile, setIsMobile] = useState(false);
  
  // Update isMobile state based on screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint in Tailwind
    };
    
    // Check immediately
    checkMobile();
    
    // Add listener for resize events
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Effect to scroll to form content on step change and account for sticky header
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const scrollTimeout = setTimeout(() => {
      // Try to find the section title element
      const sectionTitle = document.getElementById('section-title');
      const formContent = formContentRef.current;
      
      if (sectionTitle || formContent) {
        // Calculate the proper scroll position based on device type
        const calculateScrollOffset = () => {
          // Get actual header height if possible
          const header = document.querySelector('.bg-blue-600.shadow-md');
          const headerHeight = header ? header.getBoundingClientRect().height : 0;
          
          // Add extra padding for visual comfort (prevent title from being exactly at the top edge)
          const visualPadding = 20;
          
          // For mobile, we need more offset due to the mobile navigation bar
          const isMobileView = window.innerWidth < 768;
          const mobileExtraOffset = isMobileView ? 60 : 0;
          
          // Calculate the final offset with a safe fallback of 320px if we can't determine header height
          const offset = headerHeight ? (headerHeight + visualPadding + mobileExtraOffset) : 320;
          
          return offset;
        };
        
        // Get calculated offset
        const scrollOffset = calculateScrollOffset();
        
        // Prioritize scrolling to section title if available, fall back to form content
        const targetElement = sectionTitle || formContent;
        const targetPosition = targetElement.offsetTop - scrollOffset;
        
        // Scroll with the proper offset
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // For debugging
        console.log(`Scrolling to ${sectionTitle ? 'section title' : 'form content'} with offset: ${scrollOffset}px`);
      }
    }, 50); // Small delay to ensure DOM is fully updated
    
    // Clean up the timeout on unmount or before next effect run
    return () => clearTimeout(scrollTimeout);
  }, [currentStep, isMobile]); // Include isMobile in dependency array to recalculate on screen size changes

  // Custom step click handler that adds scroll behavior
  const handleCustomStepClick = (step: number) => {
    // Apply the step change
    handleStepClick(step);
    // Scroll will happen via the useEffect when currentStep changes
  };

  // Add the onChange handler for clients
  const clientsOnChange = (updatedClients: Client[]) => {
    setClients(updatedClients);
  };

  // Wrapper function to avoid naming conflicts
  const getSkippedFieldList = () => {
    return getAllSkippedFields();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="relative min-h-screen bg-brand-blue pb-10 sm:pb-10 md:pb-10">
          {/* Modern header with branding and shadow effect */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 shadow-lg rounded-b-xl mb-6 relative overflow-hidden">
            {/* Subtle pattern overlay for depth */}
            <div className="absolute inset-0 opacity-10 pattern-overlay"></div>
            
            {/* Logo and brand mark */}
            <div className="absolute top-2 left-4 flex items-center">
              <span className="bg-white rounded-full p-1.5 shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </span>
              <span className="text-white/90 font-medium text-sm ml-2 hidden sm:inline-block">PA Real Estate Support</span>
            </div>
            
            <div className="container mx-auto px-4 py-3 pt-4">
              <h1 className="text-xl md:text-2xl font-bold text-white text-center mb-3 mt-2 tracking-tight">
                Transaction Submission Portal
                <span className="block text-sm font-medium text-blue-100 opacity-90 mt-1">Streamlined transaction management for real estate professionals</span>
              </h1>
              <StepWizard 
                currentStep={currentStep} 
                totalSteps={9} 
                onStepClick={handleCustomStepClick}
                skippedFields={skippedFields}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            </div>
            
            {/* Visual indicator showing where we are in the form process */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-300/30 to-blue-300/30 overflow-hidden">
              <div 
                className="h-full bg-white" 
                style={{ width: `${(currentStep / totalSteps) * 100}%`, transition: 'width 0.5s ease-in-out' }}
              ></div>
            </div>
          </div>
          
          <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-6">
            {/* Main form container with enhanced visual design */}
            <div ref={formContentRef} className="modern-form-container rounded-xl p-4 sm:p-8 mb-20 md:mb-0 relative">
              
              {/* Missing Fields Warning - Only shown in review section now */}
              
              {/* Form Content with section fade-in effect */}
              <div className="space-y-6 section-fade-in">
                {currentStep === 1 && (
                  <>
                    <div id="section-title" className="pt-4 md:pt-6 mb-4 sm:mb-6 pb-3 sm:pb-4">
                      {/* Enhanced section header with icon and gradient accent */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center rounded-full w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 shadow-md mr-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M14.5 22V12C14.5 10.8954 13.6046 10 12.5 10H6.5C5.39543 10 4.5 10.8954 4.5 12V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2.5 22H21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19.5 22V6C19.5 4.89543 18.6046 4 17.5 4H14.5C13.3954 4 12.5 4.89543 12.5 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7.5 22V17H11.5V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Welcome to the Transaction Portal</h2>
                      </div>
                      <div className="fancy-divider my-3"></div>
                      <p className="text-gray-600 text-sm sm:text-base pl-2 border-l-4 border-blue-500/30 ml-1">
                        This form will guide you through submitting a new real estate transaction. Please select your role to get started.
                      </p>
                    </div>
                    <RoleSelection
                      selectedRole={agentData.role}
                      onRoleChange={(value) => setAgentData(prev => ({ ...prev, role: value }))}
                    />
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <div id="section-title" className="pt-4 md:pt-6 mb-4 sm:mb-6 pb-3 sm:pb-4">
                      {/* Property Information section header with home icon */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center rounded-full w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 shadow-md mr-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Property Information</h2>
                      </div>
                      <div className="fancy-divider my-3"></div>
                      <p className="text-gray-600 text-sm sm:text-base pl-2 border-l-4 border-blue-500/30 ml-1">
                        Enter property details for this transaction.
                      </p>
                    </div>
                    <PropertyInformation
                      data={propertyData}
                      onChange={(field, value) => setPropertyData(prev => ({ ...prev, [field]: value }))}
                      role={agentData.role}
                    />
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <div id="section-title" className="pt-4 md:pt-6 mb-4 sm:mb-6 pb-3 sm:pb-4">
                      {/* Client Information section header with people icon */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center rounded-full w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 shadow-md mr-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Client Information</h2>
                      </div>
                      <div className="fancy-divider my-3"></div>
                      <p className="text-gray-600 text-sm sm:text-base pl-2 border-l-4 border-blue-500/30 ml-1">
                        Provide information about the client(s).
                      </p>
                    </div>
                    <ClientInformation
                      clients={clients}
                      onChange={setClients}
                      role={agentData.role}
                    />
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <div id="section-title" className="pt-4 md:pt-6 mb-4 sm:mb-6 pb-3 sm:pb-4">
                      {/* Commission Details section header with money icon */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center rounded-full w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 shadow-md mr-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 9.35C14.5 8.8 13.33 8 12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C13.33 16 14.5 15.2 15 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 7V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 15V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Commission Details</h2>
                      </div>
                      <div className="fancy-divider my-3"></div>
                      <p className="text-gray-600 text-sm sm:text-base pl-2 border-l-4 border-blue-500/30 ml-1">
                        Enter commission and fee details.
                      </p>
                    </div>
                    <CommissionSection
                      data={commissionData}
                      onChange={(field, value) => setCommissionData(prev => ({ ...prev, [field]: value }))}
                      role={agentData.role}
                    />
                  </>
                )}
                {currentStep === 5 && (
                  <>
                    <div id="section-title" className="pt-4 md:pt-6 mb-4 sm:mb-6 pb-3 sm:pb-4">
                      {/* Property & Title section header with document icon */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center rounded-full w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 shadow-md mr-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Property & Title</h2>
                      </div>
                      <div className="fancy-divider my-3"></div>
                      <p className="text-gray-600 text-sm sm:text-base pl-2 border-l-4 border-blue-500/30 ml-1">
                        Provide property and title company information.
                      </p>
                    </div>
                    <PropertyDetailsSection
                      data={propertyDetails}
                      onChange={(field, value) => setPropertyDetails(prev => ({ ...prev, [field]: value }))}
                      role={agentData.role}
                      titleData={titleData}
                      onTitleChange={(field, value) => setTitleData(prev => ({ ...prev, [field]: value }))}
                    />
                  </>
                )}
                {currentStep === 6 && (
                  <>
                    <div id="section-title" className="pt-4 md:pt-6 mb-4 sm:mb-6 pb-3 sm:pb-4">
                      {/* Required Documents section header with clipboard icon */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center rounded-full w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 shadow-md mr-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 16H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Required Documents</h2>
                      </div>
                      <div className="fancy-divider my-3"></div>
                      <p className="text-gray-600 text-sm sm:text-base pl-2 border-l-4 border-blue-500/30 ml-1">
                        Required documents for this transaction.
                      </p>
                    </div>
                    <DocumentsSection
                      data={documentsData}
                      onChange={(field, value) => setDocumentsData(prev => ({ ...prev, [field]: value }))}
                      role={agentData.role}
                      titleData={titleData}
                      propertyData={propertyData}
                      commissionData={commissionData}
                    />
                  </>
                )}
                {currentStep === 7 && (
                  <>
                    <div id="section-title" className="pt-4 md:pt-6 mb-4 sm:mb-6 pb-3 sm:pb-4">
                      {/* Additional Information section header with info icon */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center rounded-full w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 shadow-md mr-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Additional Information</h2>
                      </div>
                      <div className="fancy-divider my-3"></div>
                      <p className="text-gray-600 text-sm sm:text-base pl-2 border-l-4 border-blue-500/30 ml-1">
                        Any additional information or special instructions.
                      </p>
                    </div>
                    <AdditionalInfoSection
                      data={additionalInfo}
                      onChange={(field, value) => setAdditionalInfo(prev => ({ ...prev, [field]: value }))}
                    />
                  </>
                )}
                {currentStep === 8 && (
                  <>
                    <div id="section-title" className="pt-4 md:pt-6 mb-4 sm:mb-6 pb-3 sm:pb-4">
                      {/* Review Transaction section header with magnifying glass icon */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center rounded-full w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 shadow-md mr-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Review Transaction</h2>
                      </div>
                      <div className="fancy-divider my-3"></div>
                      <p className="text-gray-600 text-sm sm:text-base pl-2 border-l-4 border-blue-500/30 ml-1">
                        Please review your transaction details before proceeding to sign and submit.
                      </p>
                    </div>
                    
                    {/* Review Section with enhanced styling */}
                    <div className="max-w-5xl mx-auto">
                      <div className="glass-effect bg-white/95 rounded-xl p-6 border border-gray-200 shadow-lg relative overflow-hidden">
                        {/* Subtle visual accent for review section */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
                        <div className="absolute -top-14 -right-14 w-28 h-28 bg-blue-500/10 rounded-full"></div>
                        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-blue-500/10 rounded-full"></div>
                        
                        {/* Missing Fields Warning - Filter out signature fields */}
                        {getSkippedFieldList() && getSkippedFieldList().filter(f => 
                          !f.includes('signature') && 
                          !f.includes('infoConfirmed') && 
                          !f.includes('termsAccepted') && 
                          !f.includes('agentName')).length > 0 && (
                          <ReviewMissingFieldsIndicator 
                            skippedFields={getSkippedFieldList().filter(f => 
                              !f.includes('signature') && 
                              !f.includes('infoConfirmed') && 
                              !f.includes('termsAccepted') && 
                              !f.includes('agentName')) || []} 
                            onFixClick={handleFixField}
                          />
                        )}
                        
                        <div className="mt-4">
                          <ReviewSection 
                            data={{
                              agentData,
                              propertyData,
                              clients,
                              commissionData,
                              propertyDetailsData: propertyDetails,
                              titleData,
                              additionalInfo,
                              signatureData,
                              documentsData
                            }}
                            skippedFields={getSkippedFieldList()}
                            onFieldFix={handleFixField}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {currentStep === 9 && (
                  <>
                    <div id="section-title" className="pt-4 md:pt-6 mb-4 sm:mb-6 pb-3 sm:pb-4">
                      {/* Sign & Submit section header with pen icon */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center rounded-full w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 shadow-md mr-3 animated-badge">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M12 19L19 12L22 15L15 22L12 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18 13L16.5 5.5L2 2L5.5 16.5L13 18L18 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 2L9.586 9.586" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M11 13C12.1046 13 13 12.1046 13 11C13 9.89543 12.1046 9 11 9C9.89543 9 9 9.89543 9 11C9 12.1046 9.89543 13 11 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Sign & Submit</h2>
                      </div>
                      <div className="fancy-divider my-3"></div>
                      <p className="text-gray-600 text-sm sm:text-base pl-2 border-l-4 border-green-500/40 ml-1">
                        Please sign below to confirm all information is correct and to submit your transaction.
                      </p>
                    </div>
                    
                    {/* Signature Section with enhanced styling */}
                    <div className="max-w-5xl mx-auto">
                      <div className="glass-effect rounded-xl p-6 border border-gray-200/60 shadow-lg relative overflow-hidden">
                        {/* Subtle visual accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
                        <div className="absolute -top-14 -right-14 w-28 h-28 bg-green-500/10 rounded-full"></div>
                        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-green-500/10 rounded-full"></div>
                        
                        <SignatureSection 
                          data={signatureData}
                          onChange={(field, value) => setSignatureData(prev => ({ ...prev, [field]: value }))}
                          role={agentData.role}
                          skippedFields={[]} 
                          onFieldFix={handleFixField}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Enhanced main form actions bar */}
              <div className="flex flex-wrap justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex items-center">
                  {/* Reset form button with enhanced styling */}
                  <ResetFormDialog onReset={resetForm} />
                  
                  {/* Current progress indicator */}
                  <div className="ml-4 hidden sm:flex items-center">
                    <div className="bg-gray-100 h-2 w-24 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full progress-indicator" 
                        style={{ width: `${(currentStep/totalSteps) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {Math.round((currentStep/totalSteps) * 100)}% Complete
                    </span>
                  </div>
                </div>
                
                {/* Save as draft button with badge indicator */}
                <div className="relative">
                  <Button
                    variant="outline"
                    className="h-10 text-blue-600 border-blue-200 hover:bg-blue-50 shadow-sm"
                    onClick={handleSaveDraft}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                  </Button>
                </div>
                
                {/* Form navigation hidden on mobile - enhanced styling */}
                <div className="hidden md:flex items-center space-x-3 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    className={`${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity h-10 shadow-sm`}
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  
                  {currentStep < 9 ? (
                    <Button 
                      onClick={handleNext}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 h-10 shadow-sm"
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-green-600 to-green-700 h-10 shadow-sm relative group overflow-hidden"
                      disabled={submitting || !signatureData.signature || !signatureData.infoConfirmed || !signatureData.termsAccepted}
                    >
                      {/* Submit button animation effect */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative flex items-center">
                        {submitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Transaction
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Enhanced elegant footer quote - hidden on mobile due to nav bar */}
              <div className="hidden md:block text-center mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-100">
                <p className="text-gray-500 italic font-light text-xs sm:text-sm bg-gradient-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent">
                  Every transaction is a work of art, carefully crafted with expertise and precision
                </p>
                <div className="mt-2 flex justify-center space-x-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-gradient-to-r from-blue-300 to-blue-400"
                      style={{ 
                        opacity: i === 2 ? 0.9 : 0.5,
                      }}
                    />
                  ))}
                </div>
                {/* Add subtle company branding */}
                <div className="mt-2 text-xs text-gray-400">
                  Powered by PA Real Estate Support Services
                </div>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <MobileNavBar 
              currentStep={currentStep}
              totalSteps={totalSteps}
              onPrevious={handlePrevious}
              onNext={handleNext}
              canGoNext={currentStep === 9 ? Boolean(signatureData.signature && signatureData.infoConfirmed && signatureData.termsAccepted) : true}
              isLastStep={currentStep === 9}
              hasMissingFields={Boolean(getAllSkippedFields().length)}
              onSave={handleSaveDraft}
            />
            
            {/* Progress indicator */}
            {showProgressOverlay && (
              <SubmissionProgress
                steps={submissionSteps}
                currentStep={currentSubmissionStep}
                error={submissionError}
                onClose={closeProgressOverlay}
                isOpen={showProgressOverlay}
              />
            )}
            
            {/* Toast containers */}
            <Toaster />
            <SonnerToaster position="top-center" />
            
            {/* Validation bypass component */}
            {showValidationUI && (
              <CustomValidationDialog
                errorCount={Object.keys(validationErrors).length}
                errors={validationErrors}
                onContinue={handleContinueWithErrors}
                onFix={handleFixField}
                onClose={closeValidationUI}
                isOpen={showValidationUI}
              />
            )}
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
