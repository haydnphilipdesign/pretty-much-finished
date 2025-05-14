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
  AgentRole
} from "@/types/transaction";

export const useTransactionForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<AgentRole | undefined>(undefined);
  
  const [propertyData, setPropertyData] = useState<PropertyData>({
    mlsNumber: "",
    address: "",
    salePrice: "",
    status: "occupied",
    isWinterized: false,
    updateMls: false,
  });

  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "",
      email: "",
      phone: "",
      address: "",
      maritalStatus: "single",
      type: "buyer",
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
    brokerSplit: "",
    isReferral: false,
    coordinatorFeePaidBy: "client"
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
    hasWarranty: false,
    provider: "",
    cost: "",
    paidBy: "seller",
  });

  const [titleData, setTitleData] = useState<TitleCompanyData>({
    titleCompany: "",
  });

  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoData>({
    specialInstructions: "",
    urgentIssues: "",
    notes: "",
  });

  const [signatureData, setSignatureData] = useState<SignatureData>({
    agentName: "",
    termsAccepted: false,
    infoConfirmed: false,
  });

  const handleStepClick = (step: number) => {
    const formData: TransactionFormData & { selectedRole: AgentRole | undefined } = {
      selectedRole,
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
    const formData: TransactionFormData & { selectedRole: AgentRole | undefined } = {
      selectedRole,
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
    selectedRole,
    setSelectedRole,
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
