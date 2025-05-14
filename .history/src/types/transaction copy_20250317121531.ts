
export interface PropertyData {
  mlsNumber: string;
  address: string;
  salePrice: string;
  status: "vacant" | "occupied";
  isWinterized: boolean;
  updateMls: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  type: "buyer" | "seller";
}

export interface CommissionData {
  totalCommission: string;
  listingAgentCommission: string;
  buyersAgentCommission: string;
  brokerFee: string;
  referralParty: string;
  brokerEin: string;
  referralFee: string;
  brokerSplit: string;
  isReferral: boolean;
  sellersAssist: string;
  coordinatorFeePaidBy: "client" | "agent";
}

export interface PropertyDetailsData {
  resaleCertRequired: boolean;
  hoaName?: string;
  coRequired: boolean;
  municipality?: string;
  firstRightOfRefusal: boolean;
  firstRightName?: string;
  attorneyRepresentation: boolean;
  attorneyName?: string;
}

export interface WarrantyData {
  hasWarranty: boolean;
  provider: string;
  cost: string;
  paidBy: "seller" | "buyer" | "agent";
}

export interface TitleCompanyData {
  companyName: string;
}

export interface AdditionalInfoData {
  specialInstructions?: string;
  urgentIssues?: string;
  notes?: string;
  requiresFollowUp: boolean;
}

export interface SignatureData {
  agentName: string;
  dateSubmitted: string;
  signature: string;
  termsAccepted: boolean;
  infoConfirmed: boolean;
}

export interface TransactionFormData {
  selectedRole: string;
  propertyData: PropertyData;
  clients: Client[];
  commissionData: CommissionData;
  propertyDetails: PropertyDetailsData;
  warrantyData: WarrantyData;
  titleData: TitleCompanyData;
  additionalInfo: AdditionalInfoData;
  signatureData: SignatureData;
}
