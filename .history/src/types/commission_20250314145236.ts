export interface CommissionData {
  totalCommission: string;
  totalCommissionPercentage: string;
  listingAgentPercentage: string;
  buyersAgentPercentage: string;
  hasBrokerFee: boolean;
  brokerFeeAmount: string;
  hasSellersAssist: boolean;
  sellersAssist: string;
  isReferral: boolean;
  referralParty: string;
  brokerEin: string;
  referralFee: string;
  coordinatorFeePaidBy: "client" | "agent" | "";
}

export interface CommissionSectionProps {
  role: string | null;
  data: CommissionData;
  onChange: (field: keyof CommissionData, value: string | boolean) => void;
}

export interface CommissionInputProps {
  label: string;
  id: keyof CommissionData;
  value: string;
  onChange: (field: keyof CommissionData, value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}