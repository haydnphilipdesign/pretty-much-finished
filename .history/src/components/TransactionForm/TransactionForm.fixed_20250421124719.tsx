import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AgentRole } from '@/types/transaction';

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
import { submitToAirtable } from "@/utils/airtable";
import { useToast } from "@/hooks/use-toast";

// Create a new QueryClient instance
const queryClient = new QueryClient();

export function TransactionForm() {
  const { toast } = useToast();
  const {
    currentStep,
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
    
    // Populate client data
    setClients([
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "2155551234",
        address: "456 Oak Avenue, Philadelphia, PA 19103",
        maritalStatus: "MARRIED",
        type: "SELLER",
      },
      {
        id: "2",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "2155555678",
        address: "789 Pine Street, Philadelphia, PA 19103",
        maritalStatus: "SINGLE",
        type: "BUYER",
      },
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
      requiresFollowUp: NO,
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

  const handleSubmit = async () => {
    try {
      const formData = {
        agentData,
        propertyData,
        clients,
        commissionData,
        propertyDetails,
        warrantyData,
        titleData,
        additionalInfo,
        signatureData,
      };
      
      await submitToAirtable(formData);
      
      toast({
        title: "Success!",
        description: "Transaction submitted successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error submitting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to submit transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Since we removed the WarrantySection, adjust the total steps
  const totalSteps = 8;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen p-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl backdrop-blur-md bg-white/20 rounded-xl border border-white/30 shadow-xl overflow-hidden"
          >
            <div className="py-4 px-8">
              <div className="flex justify-center mb-6">
                <img
                  src="/lovable-uploads/9849cb8f-e9f4-4d2d-ac43-b638a6715172.png"
                  alt="PA Real Estate Support Services LLC"
                  className="h-12"
                />
              </div>

              <StepWizard
                currentStep={currentStep}
                totalSteps={totalSteps}
                onStepClick={handleStepClick}
              />

              <div className="p-4 md:p-6">
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
                  <DocumentsSection role={selectedRole} />
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
