import React, { useCallback } from "react";
import { motion } from "framer-motion";
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

// Import hooks and utils
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { submitToAirtable } from "@/utils/airtable.final";
import { sendTransactionPdfViaApi } from "@/utils/pdfService";
import { useToast } from "@/hooks/use-toast";
import { PDFExport } from "@/components/TransactionForm/PDFExport";
import { formatPdfForAirtable } from "@/services/pdfService";

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
    handleStepClick,
    handleNext,
    handlePrevious,
    submitting,
  } = useTransactionForm();

  // Get the selectedRole from agentData
  const selectedRole: AgentRole | undefined = agentData?.role || undefined;
  
  // Create a function to update the role
  const setSelectedRole = (role: AgentRole) => {
    setAgentData(prev => ({ ...prev, role }));
  };

  const handleAutofill = useCallback(() => {
    // Set a default role if none is selected
    if (!selectedRole) setSelectedRole("listingAgent" as AgentRole);
    
    // Populate property data
    setPropertyData({
      mlsNumber: "PM-102356",
      address: "123 Main Street, Philadelphia, PA 19103",
      salePrice: "450000",
      status: "vacant",
      isWinterized: NO,
      updateMls: YES,
    });
    
    // Determine client type based on agent role
    const clientType = selectedRole === "listingAgent" ? "SELLER" : 
                      selectedRole === "buyersAgent" ? "BUYER" : "SELLER";
    
    // Populate client data
    setClients([
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "2155551234",
        address: "456 Oak Avenue, Philadelphia, PA 19103",
        maritalStatus: "MARRIED",
        type: clientType,
      }
    ]);
    
    // Populate commission data
    setCommissionData({
      totalCommission: "6",
      listingAgentCommission: "3",
      buyersAgentCommission: "3",
      buyerPaidCommission: "",
      sellersAssist: "5000",
      referralParty: "",
      brokerEin: "",
      referralFee: "",
      isReferral: NO,
      coordinatorFeePaidBy: "client"
    });
    
    // Populate property details
    setPropertyDetails({
      resaleCertRequired: YES === "YES",
      hoaName: "Philadelphia Homeowners Association",
      coRequired: NO === "YES",
      municipality: "Philadelphia",
      firstRightOfRefusal: NO === "YES",
      firstRightName: "",
      attorneyRepresentation: YES === "YES",
      attorneyName: "Robert Johnson, Esq.",
    });
    
    // Populate warranty data
    setWarrantyData({
      homeWarranty: YES === "YES",
      warrantyCompany: "Home Shield",
      warrantyCost: "550",
      paidBy: "SELLER",
    });
    
    // Populate title data
    setTitleData({
      titleCompany: "Liberty Title Company",
    });
    
    // Populate additional info
    setAdditionalInfo({
      specialInstructions: "Please expedite this transaction",
      urgentIssues: "None",
      notes: "Buyer is relocating for work and needs to close within 30 days",
      requiresFollowUp: false,
    });
    
    // Populate signature data
    setSignatureData({
      agentName: "Alex Johnson",
      dateSubmitted: new Date().toISOString().split('T')[0],
      signature: "Alex Johnson",
      termsAccepted: true,
      infoConfirmed: true,
    });
  }, [selectedRole, setSelectedRole, setPropertyData, setClients, setCommissionData, setPropertyDetails, setWarrantyData, setTitleData, setAdditionalInfo, setSignatureData]);

  const resetForm = () => {
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
    });
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Generate PDF
      const pdfBuffer = await generatePDF(formData);
      let submissionData = formData;
      if (pdfBuffer) {
        // Format PDF for Airtable attachment
        const addressSlug = formData.propertyData?.address
          ? formData.propertyData.address.replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_").substring(0, 30)
          : "unknown_address";
        const formattedDate = new Date().toISOString().split("T")[0];
        const pdfFilename = `Transaction_${addressSlug}_${formattedDate}.pdf`;
        const formattedAttachment = await formatPdfForAirtable(pdfBuffer, pdfFilename);
        // Add formatted attachment to form data
        submissionData = {
          ...formData,
          _formattedPdfAttachment: formattedAttachment
        };
      }
      const result = await submitToAirtable(submissionData);
      if (result.success) {
        setIsSuccess(true);
        // handle success
      } else {
        throw new Error(result.error || "Failed to submit transaction");
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      setError(error.message || "An error occurred during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Since we removed the WarrantySection, adjust the total steps
  const totalSteps = 8;

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
                onStepClick={handleStepClick}
              />

              <div className="p-2 md:p-6">
                {currentStep === 1 && (
                  <RoleSelection
                    selectedRole={selectedRole}
                    onRoleSelect={setSelectedRole}
                    onAutofill={handleAutofill}
                  />
                )}

                {currentStep === 2 && (
                  <PropertyInformation
                    data={propertyData}
                    onChange={(field, value) => setPropertyData(prev => ({ ...prev, [field]: value }))}
                    role={selectedRole}
                  />
                )}

                {currentStep === 3 && (
                  <ClientInformation
                    clients={clients}
                    onAddClient={() => setClients((prev) => [
                      ...prev,
                      {
                        id: String(prev.length + 1),
                        name: "",
                        email: "",
                        phone: "",
                        address: "",
                        maritalStatus: "single",
                        type: selectedRole === "listingAgent" ? "seller" :
                          selectedRole === "buyersAgent" ? "buyer" : "buyer",
                      },
                    ])}
                    onRemoveClient={(id) => setClients((prev) => prev.filter((client) => client.id !== id))}
                    onClientChange={(id, field, value) => setClients((prev) =>
                      prev.map((client) =>
                        client.id === id ? { ...client, [field]: value } : client
                      )
                    )}
                    role={selectedRole}
                  />
                )}

                {currentStep === 4 && (
                  <CommissionSection
                    role={selectedRole}
                    data={commissionData}
                    onChange={(field, value) => setCommissionData(prev => ({ ...prev, [field]: value }))}
                  />
                )}

                {currentStep === 5 && (
                  <PropertyDetailsSection
                    role={selectedRole}
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
                    role={agentData?.role || 'DUAL AGENT'}
                    titleData={titleData}
                    propertyData={propertyData}
                    commissionData={commissionData}
                    onChange={(field, value) => {
                      // Handle document section changes
                      if (field === 'documents') {
                        setPropertyData(prev => ({ ...prev, documents: value }));
                      } else if (field === 'confirmDocuments') {
                        setPropertyData(prev => ({ ...prev, documentConfirmation: value }));
                      }
                    }}
                  />
                )}

                {currentStep === 7 && (
                  <AdditionalInfoSection
                    data={additionalInfo}
                    onChange={(field, value) => setAdditionalInfo(prev => ({ ...prev, [field]: value }))}
                  />
                )}

                {currentStep === 8 && (
                  <SignatureSection
                    data={signatureData}
                    onChange={(field, value) => setSignatureData(prev => ({ ...prev, [field]: value }))}
                    onSubmit={handleSubmit}
                  />
                )}
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
        <Toaster />
        <SonnerToaster position="bottom-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}