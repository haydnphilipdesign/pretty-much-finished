import React, { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AgentRole } from '@/types/transaction';
import { v4 as uuidv4 } from 'uuid'; // Add uuid import

// Define constants for checkbox values
const YES = "YES";
const NO = "NO";

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
import { StepWizard } from "@/components/TransactionForm/StepWizard";
import { SubmissionProgress } from "@/components/TransactionForm/SubmissionProgress";

// Import hooks and utils
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { submitToAirtable } from "@/utils/airtable.final";
import { sendTransactionPdfViaApi } from "@/utils/pdfService";
import { useToast } from "@/hooks/use-toast";
import { PDFExport } from "@/components/TransactionForm/PDFExport";

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
    warrantyData,
    setWarrantyData,
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
    closeProgressOverlay
  } = useTransactionForm();

  // Get the selectedRole from agentData
  const selectedRole: AgentRole | undefined = agentData?.role || undefined;
  
  // Create a function to update the role
  const setSelectedRole = (role: AgentRole) => {
    setAgentData(prev => ({ ...prev, role }));
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
    setPropertyData({
      mlsNumber: "KWRE1234567",
      address: "123 Main Street, Philadelphia, PA 19103",
      salePrice: "450000",
      status: "VACANT", // Corrected to uppercase enum value
      isWinterized: "NO",
      updateMls: "YES",
    });
    
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
    setCommissionData({
      totalCommissionPercentage: "6",
      listingAgentPercentage: "3",
      buyersAgentPercentage: "3",
      referralFeePercentage: "0",
      transactionCoordinatorFee: "395",
      convenienceFee: "30",
      checkAmount: "0",
      brokerEin: "",
      referralFee: "",
      isReferral: false,
      coordinatorFeePaidBy: "SELLER"
    });
    
    // Populate property details
    setPropertyDetails({
      resaleCertRequired: true,
      hoaName: "Philadelphia Homeowners Association",
      coRequired: false,
      municipality: "Philadelphia",
      firstRightOfRefusal: false,
      firstRightName: "",
      attorneyRepresentation: true,
      attorneyName: "Robert Johnson, Esq.",
      homeWarranty: "YES",
      warrantyCompany: "American Home Shield",
      warrantyCost: "550",
      warrantyPaidBy: "SELLER"
    });
    
    // Populate title data
    setTitleData({
      titleCompany: "Keystone Premier Settlement",
      titleAgent: "Sarah Williams",
      titleEmail: "sarah@keystonepremier.com",
      titlePhone: "215-555-4321",
    });
    
    // Populate additional info
    setAdditionalInfo({
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
      isBuiltBefore1978: "NO",
      closingDate: ""
    });
    setClients([{
      id: uuidv4(),
      name: '',
      email: '',
      phone: '',
      address: '',
      maritalStatus: 'SINGLE',
      type: 'BUYER'
    }]);
    setCommissionData({
      totalCommissionPercentage: "",
      listingAgentPercentage: "",
      buyersAgentPercentage: "",
      hasBrokerFee: false,
      brokerFeeAmount: "",
      hasSellersAssist: false,
      sellersAssist: "",
      isReferral: false,
      referralParty: "",
      referralFee: "",
      brokerEin: "",
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
        <div className="min-h-screen p-2 md:p-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl backdrop-blur-md bg-white/20 rounded-xl border border-white/30 shadow-xl overflow-hidden"
          >
            <div className="py-2 md:py-4 px-3 md:px-8">
              <div className="mx-auto max-w-6xl w-full">
                {/* Test buttons removed */}
              </div>

              <StepWizard
                currentStep={currentStep}
                totalSteps={totalSteps}
                onStepClick={handleCustomStepClick}
              />

              <div className="p-2 md:p-6">
                <div className="space-y-8">
                  {/* Form Steps */}
                  <div>
                    {currentStep === 1 && (
                      <RoleSelection 
                        id="agent-information-section"
                        selectedRole={agentData.role} 
                        onRoleSelect={(role) => setSelectedRole(role)}
                        onAutofill={handleAutofill}
                      />
                    )}

                    {currentStep === 2 && (
                      <PropertyInformation 
                        id="property-information-section"
                        data={propertyData} 
                        onChange={(field, value) => setPropertyData(prev => ({ ...prev, [field]: value }))}
                        role={agentData.role}
                      />
                    )}

                    {currentStep === 3 && (
                      <ClientInformation
                        id="client-information-section"
                        clients={clients}
                        onChange={clientsOnChange}
                        onAddClient={() => setClients((prev) => [
                          ...prev,
                          {
                            id: uuidv4(),
                            name: "",
                            email: "",
                            phone: "",
                            address: "",
                            maritalStatus: "SINGLE",
                            type: agentData.role === "LISTING AGENT" ? "SELLER" :
                                  agentData.role === "BUYERS AGENT" ? "BUYER" : "BUYER",
                          },
                        ])}
                        onRemoveClient={(id) => setClients((prev) => prev.filter((client) => client.id !== id))}
                        onClientChange={(id, field, value) => setClients((prev) =>
                          prev.map((client) =>
                            client.id === id ? { ...client, [field]: value } : client
                          )
                        )}
                        role={agentData.role}
                      />
                    )}

                    {currentStep === 4 && (
                      <CommissionSection 
                        id="commission-section"
                        data={commissionData} 
                        onChange={(field, value) => setCommissionData(prev => ({ ...prev, [field]: value }))}
                        role={agentData.role}
                      />
                    )}

                    {currentStep === 5 && (
                      <PropertyDetailsSection 
                        id="property-details-section"
                        data={propertyDetails}
                        onChange={(field, value) => setPropertyDetails(prev => ({ ...prev, [field]: value }))}
                        titleData={titleData}
                        onTitleChange={(field, value) => setTitleData(prev => ({ ...prev, [field]: value }))}
                        warrantyData={warrantyData}
                        onWarrantyChange={(field, value) => setWarrantyData(prev => ({ ...prev, [field]: value }))}
                      />
                    )}

                    {currentStep === 6 && (
                      <DocumentsSection 
                        id="documents-section"
                        data={documentsData} 
                        onChange={(field, value) => {
                          setDocumentsData(prev => ({ ...prev, [field]: value }));
                        }}
                      />
                    )}

                    {currentStep === 7 && (
                      <AdditionalInfoSection 
                        id="additional-info-section"
                        data={additionalInfo} 
                        onChange={(field, value) => setAdditionalInfo(prev => ({ ...prev, [field]: value }))}
                      />
                    )}

                    {currentStep === 8 && (
                      <SignatureSection
                        id="review-section"
                        data={signatureData}
                        onChange={(field, value) => setSignatureData(prev => ({ ...prev, [field]: value }))}
                        onSubmit={handleSubmit}
                      />
                    )}
                  </div>
                </div>
              </div>

              <FormNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSubmit={handleSubmit}
                onReset={resetForm}
                isSubmitting={submitting}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Submission Progress Overlay */}
        <AnimatePresence>
          {showProgressOverlay && (
            <SubmissionProgress 
              isVisible={showProgressOverlay}
              steps={submissionSteps}
              currentStepIndex={currentSubmissionStep}
              error={submissionError}
              onClose={submissionError ? closeProgressOverlay : undefined}
            />
          )}
        </AnimatePresence>
        
        {/* Toast components with updated positions */}
        <Toaster />
        <SonnerToaster position="top-center" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
