export interface PropertyData {
  mlsNumber: string;
  address: string;
  salePrice: string;
  status: "vacant" | "occupied";
  isWinterized: boolean;
  updateMls: boolean;
  county: string;
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
  buyerPaidCommission: string;
  referralParty: string;
  brokerEin: string;
  referralFee: string;
  isReferral: boolean;
  sellersAssist: string;
  coordinatorFeePaidBy: "client" | "agent";
}

export interface PropertyDetailsData {
  resaleCertRequired: boolean;
  hoaName: string;
  coRequired: boolean;
  municipality: string;
  firstRightOfRefusal: boolean;
  firstRightName: string;
  attorneyRepresentation: boolean;
  attorneyName: string;
}

export interface WarrantyData {
  homeWarranty: boolean;
  warrantyCompany: string;
  warrantyCost: string;
}

export interface TitleCompanyData {
  titleCompany: string;
}

export interface AdditionalInfoData {
  specialInstructions: string;
  urgentIssues: string;
  notes: string;
  requiresFollowUp: boolean;
}

export interface SignatureData {
  date: string;
  listingAgent: string;
  listingLicense: string;
  listingBroker: string;
  listingCoAgent: string;
  listingCoLicense: string;
  buyersAgent: string;
  buyersLicense: string;
  buyersBroker: string;
  buyersCoAgent: string;
  buyersCoLicense: string;
}

export interface TransactionFormData {
  propertyData: PropertyData;
  clients: Client[];
  commissionData: CommissionData;
  propertyDetailsData: PropertyDetailsData;
  warrantyData: WarrantyData;
  titleData: TitleCompanyData;
  additionalInfo: AdditionalInfoData;
  signatureData: SignatureData;
}

export interface FormData {
  propertyData: PropertyData;
  clients: Client[];
  commissionData: CommissionData;
  propertyDetailsData: PropertyDetailsData;
  warrantyData: WarrantyData;
  titleData: TitleCompanyData;
  additionalInfo: AdditionalInfoData;
  signatureData: SignatureData;
}

export type AgentRole = "listingAgent" | "buyersAgent" | "dualAgent";
