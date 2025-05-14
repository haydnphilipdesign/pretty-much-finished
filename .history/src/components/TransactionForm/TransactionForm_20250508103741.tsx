import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AgentRole, Client } from '@/types/transaction';
import { v4 as uuidv4 } from 'uuid'; // Add uuid import

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Import hooks and utils
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { useToast } from "@/hooks/use-toast";

// Add import for ValidationBypassButtons
import { ValidationBypassButtons } from './ValidationBypassButtons';

// Create a new QueryClient instance
const queryClient = new QueryClient();

export function TransactionForm() {
  const { toast } = useToast();
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

  // Near the top with other state declarations
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Modify the resetForm function to close the dialog
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
    
    // Close the reset confirmation dialog
    setResetDialogOpen(false);
    
    // Show confirmation toast with explicit duration
    toast({
      title: "Form Reset",
      description: "The form has been reset to its initial state.",
      variant: "default",
      duration: 3000, // 3 seconds
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

  // Effect to scroll to form content on step change
  useEffect(() => {
    if (formContentRef.current) {
      // Scroll to show the title at the top by scrolling to a point above the form content
      window.scrollTo({
        top: formContentRef.current.offsetTop - 100, // Subtract 100px to show the title
        behavior: 'smooth'
      });
    }
  }, [currentStep]);

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
        <div className="relative min-h-screen bg-gradient-to-b from-blue-600 to-blue-900 pb-10 sm:pb-10 md:pb-10">
          {/* Step wizard at top - no longer sticky */}
          <div className="bg-blue-600 shadow-md rounded-b-xl mb-6">
            <div className="container mx-auto px-4 py-3">
              <h1 className="text-xl md:text-2xl font-bold text-white text-center mb-3">Transaction Submission Form</h1>
              <StepWizard 
                currentStep={currentStep} 
                totalSteps={9} 
                onStepClick={handleCustomStepClick}
                skippedFields={skippedFields}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            </div>
          </div>
          
          <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-6">
            {/* Main form container */}
            <div ref={formContentRef} className="bg-white shadow-xl rounded-xl p-4 sm:p-8 border border-gray-100 mb-20 md:mb-0">
              {/* Missing Fields Warning - Only shown in review section now */}
              
              {/* Form Content */}
              <div className="space-y-6">
                {currentStep === 1 && (
                  <>
                    <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Welcome to the Transaction Form</h2>
                      <p className="text-gray-600 text-sm sm:text-base">
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
                    <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Property Information</h2>
                      <p className="text-gray-600 text-sm sm:text-base">
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
                    <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Client Information</h2>
                      <p className="text-gray-600 text-sm sm:text-base">
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
                    <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Commission Details</h2>
                      <p className="text-gray-600 text-sm sm:text-base">
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
                    <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Property & Title</h2>
                      <p className="text-gray-600 text-sm sm:text-base">
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
                    <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Required Documents</h2>
                      <p className="text-gray-600 text-sm sm:text-base">
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
                    <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Additional Information</h2>
                      <p className="text-gray-600 text-sm sm:text-base">
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
                    <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Review Transaction</h2>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Please review your transaction details before proceeding to sign and submit.
                      </p>
                    </div>
                    
                    {/* Review Section */}
                    <div className="max-w-5xl mx-auto">
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
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
                    <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Sign & Submit</h2>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Please sign below to confirm all information is correct and to submit your transaction.
                      </p>
                    </div>
                    
                    {/* Signature Section */}
                    <div className="max-w-5xl mx-auto">
                      <SignatureSection 
                        data={signatureData}
                        onChange={(field, value) => setSignatureData(prev => ({ ...prev, [field]: value }))}
                        role={agentData.role}
                        skippedFields={[]} 
                        onFieldFix={handleFixField}
                      />
                    </div>
                  </>
                )}
              </div>
              
              {/* Main form actions bar */}
              <div className="flex flex-wrap justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                {/* Reset form button */}
                <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-10 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Form
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Reset Form</DialogTitle>
                      <DialogDescription>
                        This will clear all form data and cannot be undone. Are you sure you want to reset the form?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex space-x-2 mt-4">
                      <Button 
                        variant="outline" 
                        onClick={resetForm}
                        className="flex-1"
                      >
                        Yes, Reset Form
                      </Button>
                      <Button 
                        variant="default"
                        className="flex-1"
                        onClick={() => setResetDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                {/* Save as draft button in the center */}
                <Button
                  variant="outline"
                  className="h-10 text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={handleSaveDraft}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                
                {/* Form navigation hidden on mobile */}
                <div className="hidden md:flex items-center space-x-3 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    className={`${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity h-10`}
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  
                  {currentStep < 9 ? (
                    <Button 
                      onClick={handleNext}
                      className="bg-blue-600 hover:bg-blue-700 h-10"
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      className="bg-green-600 hover:bg-green-700 h-10"
                      disabled={submitting || !signatureData.signature || !signatureData.infoConfirmed || !signatureData.termsAccepted}
                    >
                      {submitting ? "Submitting..." : "Submit Transaction"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Elegant footer quote - hidden on mobile due to nav bar */}
              <div className="hidden md:block text-center mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-100">
                <p className="text-gray-500 italic font-light text-xs sm:text-sm">
                  Every transaction is a work of art, carefully crafted with expertise and precision
                </p>
                <div className="mt-2 flex justify-center space-x-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-gray-300"
                      style={{ 
                        opacity: i === 2 ? 0.9 : 0.5,
                      }}
                    />
                  ))}
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
              <ValidationBypassButtons
                errorCount={Object.keys(validationErrors).length}
                errors={validationErrors}
                onContinue={handleContinueWithErrors}
                onFix={handleFixField}
                onClose={closeValidationUI}
              />
            )}
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
