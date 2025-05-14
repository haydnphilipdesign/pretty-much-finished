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
    status: "OCCUPIED",
    isWinterized: "NO",
    updateMls: "NO",
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
    commissionBase: "SALE PRICE",
    totalCommission: "",
    listingAgentCommission: "",
    buyersAgentCommission: "",
    buyerPaidCommission: "",
    sellersAssist: "",
    referralParty: "",
    brokerEin: "",
    referralFee: "",
    isReferral: "NO",
    coordinatorFeePaidBy: "CLIENT"
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
    agentName: agentData.agentName || "",
    dateSubmitted: "",
    signature: "",
    termsAccepted: false,
    infoConfirmed: false,
  });

  const handleStepClick = (step: number) => {
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

    // Special handling for step 4 (Commission) for buyer's agent
    if (currentStep === 4 && agentData.role === "buyersAgent" && 
        errors.totalCommission && errors.totalCommission.includes("Total commission is required")) {
      // Remove the total commission error for buyer's agent
      delete errors.totalCommission;
    }

    if (Object.keys(errors).length === 0 || step < currentStep) {
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

    // Make sure to pass the selectedRole correctly for validation
    const errors = validateStep(currentStep, formData);

    // Special handling for step 4 (Commission) for buyer's agent
    if (currentStep === 4 && agentData.role === "buyersAgent" && 
        errors.totalCommission && errors.totalCommission.includes("Total commission is required")) {
      // Remove the total commission error for buyer's agent
      delete errors.totalCommission;
    }

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
