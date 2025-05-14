import { useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import components
import { FormNavigation } from "@/components/TransactionForm/FormNavigation";
import { PropertyInformation } from "./PropertyInformation";
import { ClientInformation } from "./ClientInformation";
import { CommissionSection } from "./CommissionSection";
import { PropertyDetailsSection } from "./PropertyDetailsSection";
import { AdditionalInfoSection } from "./AdditionalInfoSection";
import { SignatureSection } from "./SignatureSection";
import { StepWizard } from "@/components/TransactionForm/StepWizard";
import { RoleSelection } from "./RoleSelection";

// Import hooks and utils
import { useTransactionForm } from "@/hooks/useTransactionForm";
import type { Client, AgentRole } from "@/types/transaction";

// Create a new QueryClient instance
const queryClient = new QueryClient();

export function TransactionForm() {
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
    titleData,
    setTitleData,
    additionalInfo,
    setAdditionalInfo,
    signatureData,
    setSignatureData,
    handleStepClick,
    handleNext,
    handlePrevious,
    handleSubmit,
    setSubmitting
  } = useTransactionForm();

  // Initialize form data
  useEffect(() => {
    setAgentData({
      role: "LISTING AGENT",
      name: "",
      email: "",
      phone: ""
    });

    setPropertyData({
      mlsNumber: "",
      address: "",
      salePrice: "",
      status: "OCCUPIED",
      isWinterized: false,
      updateMls: false,
      propertyAccessType: "ELECTRONIC LOCKBOX",
      lockboxAccessCode: "",
      county: "",
      propertyType: "RESIDENTIAL",
      isBuiltBefore1978: "NO",
      closingDate: ""
    });

    setClients([
      {
        id: "1",
        name: "",
        email: "",
        phone: "",
        address: "",
        maritalStatus: "SINGLE",
        type: "BUYER"
      }
    ]);

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
      warrantyPaidBy: "SELLER"
    });

    setTitleData({
      titleCompany: ""
    });

    setAdditionalInfo({
      specialInstructions: "",
      urgentIssues: "",
      notes: "",
      requiresFollowUp: false
    });

    setSignatureData({
      signature: "",
      confirmAccuracy: false
    });
  }, [setAgentData, setPropertyData, setClients, setCommissionData, setPropertyDetails, setTitleData, setAdditionalInfo, setSignatureData]);

  const handleRoleSelect = (role: AgentRole) => {
    setAgentData(prev => ({ ...prev, role }));
  };

  const handleClientChange = (id: string, field: keyof Client, value: string) => {
    setClients(prev => prev.map(client => 
      client.id === id ? { ...client, [field]: value } : client
    ));
  };

  const handleAddClient = () => {
    setClients(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        email: "",
        phone: "",
        address: "",
        maritalStatus: "SINGLE",
        type: agentData.role === "LISTING AGENT" ? "SELLER" : "BUYER"
      }
    ]);
  };

  const handleRemoveClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const handleError = (error: Error) => {
    console.error("Form submission error:", error.message);
    setSubmitting(false);
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
              <div className="mx-auto max-w-6xl w-full">
                <RoleSelection
                  selectedRole={agentData.role}
                  onRoleSelect={handleRoleSelect}
                  onAutofill={() => {}}
                />
              </div>

              <StepWizard
                currentStep={currentStep}
                totalSteps={totalSteps}
                onStepClick={handleStepClick}
              />

              {currentStep === 1 && (
                <PropertyInformation 
                  data={propertyData} 
                  onChange={(field, value) => setPropertyData(prev => ({ ...prev, [field]: value }))}
                  role={agentData.role}
                />
              )}

              {currentStep === 2 && (
                <ClientInformation
                  clients={clients}
                  onChange={setClients}
                  role={agentData.role}
                  onClientChange={handleClientChange}
                  onAddClient={handleAddClient}
                  onRemoveClient={handleRemoveClient}
                />
              )}

              {currentStep === 3 && (
                <CommissionSection
                  data={commissionData}
                  onChange={(field, value) => setCommissionData(prev => ({ ...prev, [field]: value }))}
                  role={agentData.role}
                />
              )}

              {currentStep === 4 && (
                <PropertyDetailsSection
                  data={propertyDetails}
                  onChange={(field, value) => setPropertyDetails(prev => ({ ...prev, [field]: value }))}
                  role={agentData.role}
                  titleData={titleData}
                  onTitleChange={(field, value) => setTitleData(prev => ({ ...prev, [field]: value }))}
                />
              )}

              {currentStep === 5 && (
                <AdditionalInfoSection
                  data={additionalInfo}
                  onChange={(field, value) => setAdditionalInfo(prev => ({ ...prev, [field]: value }))}
                />
              )}

              {currentStep === 6 && (
                <SignatureSection
                  data={signatureData}
                  onChange={(field, value) => setSignatureData(prev => ({ ...prev, [field]: value }))}
                  onSubmit={async () => {
                    try {
                      await handleSubmit();
                      return true;
                    } catch (error) {
                      handleError(error as Error);
                      return false;
                    }
                  }}
                />
              )}

              <FormNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSubmit={async () => {
                  try {
                    await handleSubmit();
                    return true;
                  } catch (error) {
                    handleError(error as Error);
                    return false;
                  }
                }}
              />
            </div>
          </motion.div>
        </div>
      </TooltipProvider>
      <Toaster />
      <SonnerToaster />
    </QueryClientProvider>
  );
}
