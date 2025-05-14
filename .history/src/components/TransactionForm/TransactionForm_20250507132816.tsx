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

// Import hooks and utils
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { useToast } from "@/hooks/use-toast";

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
    // Progress tracking state and functions
    showProgressOverlay,
    submissionSteps,
    currentSubmissionStep,
    submissionError,
    closeProgressOverlay,
    // New skipped fields tracking
    skippedFields,
    getAllSkippedFields,
    isFieldSkipped
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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="relative min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 pb-20">
          {/* Step wizard at top */}
          <div className="sticky top-0 z-30 bg-gradient-to-b from-blue-900 to-blue-900/95 shadow-md rounded-b-xl">
            <StepWizard 
              currentStep={currentStep} 
              totalSteps={8} 
              onStepClick={handleCustomStepClick}
              skippedFields={skippedFields} 
            />
          </div>
          
          <SubmissionProgress
            isOpen={showProgressOverlay}
            onClose={closeProgressOverlay}
            steps={submissionSteps}
            currentStep={currentSubmissionStep}
            error={submissionError}
          />
          
          <div className="container max-w-5xl mx-auto p-4 mt-4">
            <div className="relative">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                {/* Dynamically show form step based on currentStep */}
                <AnimatePresence mode="wait">
                  <div>
                    {currentStep === 1 && (
                      <RoleSelection 
                        selectedRole={selectedRole} 
                        onRoleChange={setSelectedRole} 
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
                        onChange={clientsOnChange}
                        agentRole={agentData.role}
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
                        titleData={titleData}
                        onTitleChange={(field: string, value: any) => setTitleData(prev => ({ ...prev, [field]: value }))}
                        role={agentData.role}
                      />
                    )}
                    {currentStep === 6 && (
                      <DocumentsSection 
                        role={agentData.role}
                        titleData={titleData}
                        propertyData={propertyData}
                        commissionData={commissionData}
                        data={documentsData}
                        onChange={(field, value) => setDocumentsData(prev => ({ ...prev, [field]: value }))}
                      />
                    )}
                    {currentStep === 7 && (
                      <AdditionalInfoSection 
                        data={additionalInfo}
                        onChange={(field, value) => setAdditionalInfo(prev => ({ ...prev, [field]: value}))}
                      />
                    )}
                    {currentStep === 8 && (
                      <>
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
                          skippedFields={allSkippedFields()}
                          onFieldFix={handleFixField}
                        />
                        <SignatureSection 
                          data={signatureData}
                          onChange={(field, value) => setSignatureData(prev => ({ ...prev, [field]: value }))}
                          role={agentData.role}
                          skippedFields={allSkippedFields()}
                          onFieldFix={handleFixField}
                        />
                      </>
                    )}
                  </div>
                </AnimatePresence>
              </motion.div>
              
              <FormNavigation
                currentStep={currentStep}
                totalSteps={8}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSubmit={handleSubmit}
                onReset={resetForm}
                isSubmitting={submitting}
                canSubmit={!!signatureData.signature && signatureData.infoConfirmed && signatureData.termsAccepted}
                onStepClick={handleCustomStepClick}
                skippedFieldsByStep={skippedFields}
              />
            </div>
          </div>
          
          {/* Toaster */}
          <Toaster />
          <SonnerToaster position="top-center" />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
