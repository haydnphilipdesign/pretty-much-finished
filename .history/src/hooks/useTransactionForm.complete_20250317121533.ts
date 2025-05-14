import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { validateStep } from "@/utils/validation";
import {
  PropertyData,
  Client,
  CommissionData,
  PropertyDetailsData,
  WarrantyData,
  TitleCompanyData,
  AdditionalInfoData,
  SignatureData,
  TransactionFormData,
  AgentData,
  AgentRole,
} from "@/types/transaction";

export const useTransactionForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [agentData, setAgentData] = useState<AgentData>({
    role: undefined as unknown as AgentRole, // Initialize as undefined to force user selection
    agentName: "",
  });

  const [propertyData, setPropertyData] = useState<PropertyData>({
    mlsNumber: "",
    address: "",
    salePrice: "",
    status: "OCCUPIED", // Using status instead of propertyStatus to match component
    isWinterized: "NO",
    updateMls: "NO",
    // Add these fields to match the PropertyData interface
    resaleCertRequired: false,
    hoaName: "",
    coRequired: false,
    municipality: "",
    firstRightOfRefusal: false,
    firstRightName: "",
    attorneyRepresentation: false,
    attorneyName: "",
  });

  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "",
      email: "",
      phone: "",
      address: "",
      maritalStatus: "SINGLE",
      type: "BUYER",
    },
  ]);

  const [commissionData, setCommissionData] = useState<CommissionData>({
    totalCommission: "",
    listingAgentCommission: "",
    buyersAgentCommission: "",
    brokerFee: "",
    sellersAssist: "",
    referralParty: "",
    brokerEin: "",
    referralFee: "",
    isReferral: "NO",
    coordinatorFeePaidBy: "CLIENT",
    // Add these fields to match the CommissionData interface
    totalCommissionPercentage: "",
    fixedCommissionAmount: "",
    listingAgentPercentage: "",
    buyersAgentPercentage: "",
    buyerPaidPercentage: "",
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
  });

  const [warrantyData, setWarrantyData] = useState<WarrantyData>({
    homeWarranty: false,
    warrantyCompany: "",
    warrantyCost: "",
    paidBy: "SELLER",
  });

  const [titleData, setTitleData] = useState<TitleCompanyData>({
    titleCompany: "",
  });

  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoData>({
    specialInstructions: "",
    urgentIssues: "",
    notes: "",
    requiresFollowUp: "NO",
  });

  const [signatureData, setSignatureData] = useState<SignatureData>({
    agentName: "",
    dateSubmitted: "",
    signature: "",
    termsAccepted: false,
    infoConfirmed: false,
  });

  const handleStepClick = (step: number) => {
    // Don't validate if going back
    if (step < currentStep) {
      setCurrentStep(step);
      return;
    }

    const formData: TransactionFormData = {
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

    const errors = validateStep(currentStep, formData);

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
    const formData: TransactionFormData = {
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

    const errors = validateStep(currentStep, formData);

    if (Object.keys(errors).length === 0) {
      setCurrentStep((prev) => Math.min(prev + 1, 10));
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

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return {
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
  };
};
