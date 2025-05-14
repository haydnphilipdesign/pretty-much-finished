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
  TransactionFormData
} from "@/types/transaction";

// Basic form types
export interface FormData {
  propertyData: PropertyData;
  clients: Client[];
  commissionData: CommissionData;
  propertyDetailsData: PropertyDetailsData;
  warrantyData: WarrantyData;
  titleCompanyData: TitleCompanyData;
  additionalInfoData: AdditionalInfoData;
  signatureData: SignatureData;
}

export const useTransactionForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    propertyData: {
      mlsNumber: '',
      address: '',
      salePrice: '',
      closingDate: '',
      status: 'occupied',
      isWinterized: false,
      updateMls: false,
    },
    clients: [{
      id: '1',
      name: '',
      email: '',
      phone: '',
      address: '',
      maritalStatus: 'single',
      type: 'buyer',
    }],
    commissionData: {
      commissionBase: 'salePrice',
      totalCommission: '',
      listingAgentCommission: '',
      buyersAgentCommission: '',
      buyerPaidCommission: '',
      sellersAssist: '',
      referralParty: '',
      brokerEin: '',
      referralFee: '',
      brokerSplit: '',
      isReferral: false,
      coordinatorFeePaidBy: 'client'
    },
    propertyDetailsData: {
      resaleCertRequired: false,
      hoaName: '',
      coRequired: false,
      municipality: '',
      firstRightOfRefusal: false,
      firstRightName: '',
      attorneyRepresentation: false,
      attorneyName: ''
    },
    warrantyData: {
      hasWarranty: false,
      provider: '',
      cost: '',
      paidBy: 'seller',
    },
    titleCompanyData: {
      companyName: '',
    },
    additionalInfoData: {
      specialInstructions: '',
      urgentIssues: '',
      notes: '',
      requiresFollowUp: false,
      additionalNotes: '',
    },
    signatureData: {
      agentName: '',
      dateSubmitted: '',
      signature: '',
      termsAccepted: false,
      infoConfirmed: false,
    },
  });

  // Update a specific section of the form data
  const updateFormData = (section: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: value,
    }));
  };

  const handleStepClick = (step: number) => {
    const formData: TransactionFormData = {
      selectedRole: selectedRole || "",
      propertyData: formData.propertyData,
      clients: formData.clients,
      commissionData: formData.commissionData,
      propertyDetails: formData.propertyDetailsData,
      warrantyData: formData.warrantyData,
      titleData: formData.titleCompanyData,
      additionalInfo: formData.additionalInfoData,
      signatureData: formData.signatureData,
    };

    const errors = validateStep(currentStep, formData);

    // Special handling for step 4 (Commission) for buyer's agent
    if (currentStep === 4 && selectedRole === "buyers-agent" && 
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
      selectedRole: selectedRole || "",
      propertyData: formData.propertyData,
      clients: formData.clients,
      commissionData: formData.commissionData,
      propertyDetails: formData.propertyDetailsData,
      warrantyData: formData.warrantyData,
      titleData: formData.titleCompanyData,
      additionalInfo: formData.additionalInfoData,
      signatureData: formData.signatureData,
    };

    const errors = validateStep(currentStep, formData);

    // Special handling for step 4 (Commission) for buyer's agent
    if (currentStep === 4 && selectedRole === "buyers-agent" && 
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
    selectedRole,
    setSelectedRole,
    formData,
    updateFormData,
    handleStepClick,
    handleNext,
    handlePrevious,
  };
};
