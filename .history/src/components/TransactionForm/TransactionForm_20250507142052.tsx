import React, { useEffect } from "react";
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
import { CommissionSection } from "@/components/TransactionForm/CommissionSection";
import { DocumentsSection } from "@/components/TransactionForm/DocumentsSection";
import { PropertyDetailsSection } from "@/components/TransactionForm/PropertyDetailsSection";
import { AdditionalInfoSection } from "@/components/TransactionForm/AdditionalInfoSection";
import { SignatureSection } from "@/components/TransactionForm/SignatureSection";
import { ReviewSection } from "@/components/TransactionForm/ReviewSection";
import { StepWizard } from "@/components/TransactionForm/StepWizard";
import { SubmissionProgress } from "@/components/TransactionForm/SubmissionProgress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

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

  // Get the selectedRole from agentData
  const selectedRole: AgentRole | undefined = agentData?.role || undefined;
  
  // Create a function to update the role
  const setSelectedRole = (role: AgentRole) => {
    setAgentData(prev => ({ ...prev, role }));
  };

  // Function to navigate to step with missing field
  const handleFixField = (field: string) => {
    // Map field names to their corresponding steps
    const fieldToStepMapping: Record<string, number> = {
      // Agent fields - Step 1
      'role': 1,
      
      // Property fields - Step 2
      'address': 2,
      'mlsNumber': 2,
      'salePrice': 2,
      'closingDate': 2,
      'county': 2,
      'propertyType': 2,
      'status': 2,
      'propertyAccessType': 2,
      'lockboxAccessCode': 2,
      
      // Client fields - Step 3
      'clients': 3,
      'client.name': 3,
      'client.phone': 3,
      'client.email': 3,
      'client.maritalStatus': 3,
      
      // Commission fields - Step 4
      'totalCommissionPercentage': 4,
      'listingAgentPercentage': 4,
      'buyersAgentPercentage': 4,
      'brokerFee': 4,
      'sellersAssist': 4,
      
      // Property Details fields - Step 5
      'municipality': 5,
      'hoaName': 5,
      'coRequired': 5,
      
      // Documents fields - Step 6
      'documents': 6,
      
      // Additional Info fields - Step 7
      'notes': 7,
      
      // Signature fields - Step 8
      'agentName': 8,
      'signature': 8,
      'infoConfirmed': 8,
      'termsAccepted': 8
    };
    
    // Find which step contains this field
    const step = fieldToStepMapping[field];
    if (step) {
      setCurrentStep(step);
      toast({
        title: "Navigated to field",
        description: `Now you can fix the missing ${field} field.`,
        variant: "default",
      });
    } else {
      console.error(`No mapping found for field: ${field}`);
      toast({
        title: "Navigation error",
        description: `Could not locate the field ${field}.`,
        variant: "destructive",
      });
    }
  };

  const handleAutofill = () => {
    // Populate agent data
    setAgentData({
      role: "LISTING AGENT",
      name: "John Smith",
      email: "john@kw.com",
      phone: "215-555-1234",
    });

    // Populate property data
    setPropertyData(prev => ({
      ...prev,
      mlsNumber: "KWRE1234567",
      address: "123 Main Street, Philadelphia, PA 19103",
      salePrice: "450000",
      status: "VACANT",
      isWinterized: "NO",
      updateMls: "YES",
      propertyAccessType: "ELECTRONIC LOCKBOX",
      lockboxAccessCode: "1234",
      county: "Philadelphia",
      propertyType: "RESIDENTIAL",
      isBuiltBefore1978: "NO",
      closingDate: ""
    }));
    
    // Determine client type based on agent role
    const clientType = agentData.role === "LISTING AGENT" ? "SELLER" : 
                       agentData.role === "BUYERS AGENT" ? "BUYER" : "SELLER";
    
    // Populate client data
    setClients([
      {
        id: uuidv4(),
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "215-555-9876",
        address: "456 Oak Street, Philadelphia, PA 19103",
        maritalStatus: "SINGLE",
        type: clientType,
      },
    ]);
    
    // Populate commission data
    setCommissionData(prev => ({
      ...prev,
      totalCommissionPercentage: "6",
      listingAgentPercentage: "3",
      buyersAgentPercentage: "3",
      hasBrokerFee: false,
      brokerFeeAmount: "0",
      sellerPaidAmount: "0",
      buyerPaidAmount: "0",
      hasSellersAssist: false,
      sellersAssist: "0",
      isReferral: false,
      referralParty: "",
      brokerEin: "",
      referralFee: "",
      coordinatorFeePaidBy: "client"
    }));
    
    // Populate property details
    setPropertyDetails({
      resaleCertRequired: false,
      hoaName: "Philadelphia Homeowners Association",
      coRequired: false,
      municipality: "Philadelphia",
      firstRightOfRefusal: false,
      firstRightName: "",
      attorneyRepresentation: true,
      attorneyName: "Robert Johnson, Esq.",
      homeWarranty: false,
      warrantyCompany: "American Home Shield",
      warrantyCost: "550",
      warrantyPaidBy: "SELLER"
    });
    
    // Populate title data
    setTitleData({
      titleCompany: "Keystone Premier Settlement",
    });
    
    // Populate additional info
    setAdditionalInfo({
      specialInstructions: "",
      urgentIssues: "None",
      notes: "Buyer is relocating for work and needs to close within 30 days",
    });
    
    // Populate signature data
    setSignatureData({
      signature: "",
      infoConfirmed: false,
      termsAccepted: false,
      agentName: "",
      dateSubmitted: new Date().toISOString().split("T")[0],
    });

    // Populate documents data
    setDocumentsData({
      documents: [],
      confirmDocuments: false
    });

    // Advance to next step
    setCurrentStep(2);
  };

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
    
    // Show confirmation toast
    toast({
      title: "Form Reset",
      description: "The form has been reset to its initial state.",
      variant: "default",
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

  // Since we removed the WarrantySection, adjust the total steps
  const totalSteps = 8;

  // Effect to scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Custom step click handler that adds scroll behavior
  const handleCustomStepClick = (step: number) => {
    // Scroll to top when clicking step navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleStepClick(step);
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
        <div className="relative min-h-screen bg-gradient-to-b from-blue-600 to-blue-900 pb-20">
          {/* Step wizard at top */}
          <div className="sticky top-0 z-30 bg-gradient-to-b from-blue-500 to-blue-600/95 shadow-md rounded-b-xl">
            <StepWizard 
              currentStep={currentStep} 
              totalSteps={8} 
              onStepClick={handleCustomStepClick}
              skippedFields={skippedFields} 
            />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 py-6">
            {/* Header with welcome message for step 1 */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl shadow-xl p-6 mb-8 border-l-4 border-green-500">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2">Welcome to the Transaction Form</h1>
                <p className="text-lg text-gray-600">
                  This form will guide you through submitting a new real estate transaction. You can save and come back anytime.
                </p>
              </div>
            )}
            
            {/* Main form container */}
            <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 border border-gray-100">
              <div className="mb-8">
                {/* Content header for each step */}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  {currentStep === 1 && "Select Your Role"}
                  {currentStep === 2 && "Property Information"}
                  {currentStep === 3 && "Client Information"}
                  {currentStep === 4 && "Commission Details"}
                  {currentStep === 5 && "Property & Title"}
                  {currentStep === 6 && "Required Documents"}
                  {currentStep === 7 && "Additional Information"}
                  {currentStep === 8 && "Review & Sign"}
                </h2>
                <p className="text-gray-600">
                  {currentStep === 1 && "Please select your role in this transaction to get started."}
                  {currentStep === 2 && "Enter property details for this transaction."}
                  {currentStep === 3 && "Provide information about the client(s)."}
                  {currentStep === 4 && "Enter commission and fee details."}
                  {currentStep === 5 && "Provide property and title company information."}
                  {currentStep === 6 && "Required documents for this transaction."}
                  {currentStep === 7 && "Any additional information or special instructions."}
                  {currentStep === 8 && "Review your transaction details and sign to complete."}
                </p>
              </div>
              
              {/* Form Content */}
              <div className="space-y-6">
                {currentStep === 1 && (
                  <RoleSelection
                    selectedRole={agentData.role}
                    onRoleChange={(value) => setAgentData(prev => ({ ...prev, role: value }))}
                    onAutofill={() => {}}
                  />
                )}
                {currentStep === 2 && (
                  <PropertyInformation
                    data={propertyData}
                    onChange={(field, value) => setPropertyData(prev => ({ ...prev, [field]: value }))}
                    role={agentData.role}
                  />
                )}
                {currentStep === 3 && (
                  <ClientInformation
                    clients={clients}
                    onChange={setClients}
                    role={agentData.role}
                    onAddClient={() => {}}
                    onRemoveClient={() => {}}
                    onClientChange={() => {}}
                  />
                )}
                {currentStep === 4 && (
                  <CommissionSection
                    data={commissionData}
                    onChange={(field, value) => setCommissionData(prev => ({ ...prev, [field]: value }))}
                    role={agentData.role}
                  />
                )}
                {currentStep === 5 && (
                  <PropertyDetailsSection
                    data={propertyDetails}
                    onChange={(field, value) => setPropertyDetails(prev => ({ ...prev, [field]: value }))}
                    role={agentData.role}
                    titleData={titleData}
                    onTitleChange={(field, value) => setTitleData(prev => ({ ...prev, [field]: value }))}
                  />
                )}
                {currentStep === 6 && (
                  <DocumentsSection
                    data={documentsData}
                    onChange={(field, value) => setDocumentsData(prev => ({ ...prev, [field]: value }))}
                    role={agentData.role}
                    titleData={titleData}
                    propertyData={propertyData}
                    commissionData={commissionData}
                  />
                )}
                {currentStep === 7 && (
                  <AdditionalInfoSection
                    data={additionalInfo}
                    onChange={(field, value) => setAdditionalInfo(prev => ({ ...prev, [field]: value }))}
                  />
                )}
                {currentStep === 8 && (
                  <div className="space-y-12">
                    {/* Show review section first */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Transaction Review</h3>
                      <p className="text-gray-600 mb-4">
                        Please review all transaction details below before signing and submitting.
                      </p>
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
                    
                    {/* Show signature section last */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-xl font-bold text-blue-800 mb-4">Sign to Complete</h3>
                      <p className="text-gray-600 mb-4">
                        Please sign below to confirm all information is correct and to submit your transaction.
                      </p>
                      <SignatureSection 
                        data={signatureData}
                        onChange={(field, value) => setSignatureData(prev => ({ ...prev, [field]: value }))}
                        role={agentData.role}
                        skippedFields={getSkippedFieldList()}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Navigation buttons */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
                {/* Back button */}
                <Button
                  variant="outline"
                  className={`${currentStep === 1 ? 'opacity-0' : 'opacity-100'} transition-opacity px-6 py-5 text-base`}
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Previous
                </Button>
                
                {/* Next/Submit button */}
                {currentStep < 8 ? (
                  <Button 
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-5 text-base"
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 px-6 py-5 text-base"
                    disabled={submitting || !signatureData.signature || !signatureData.infoConfirmed || !signatureData.termsAccepted}
                  >
                    {submitting ? "Submitting..." : "Submit Transaction"}
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
            
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
