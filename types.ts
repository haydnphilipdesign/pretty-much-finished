export type TCFeePaidBy = "Client" | "Agent";
export type AccessType = "Combo Lockbox" | "Electronic Lockbox" | "Keypad" | "Appointment Only";

export interface ClientData {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  maritalStatus?: string;
}

export interface TransactionFormData {
  role: string;
  mlsNumber: string;
  updateMLS: boolean;
  propertyAddress: string;
  salePrice: string | number;
  clients: ClientData[];
  totalCommission: string | number;
  listingAgentCommission: string | number;
  listingAgentCommissionType: "Fixed" | "Percentage" | null;
  buyersAgentCommission: string | number;
  buyersAgentCommissionType: "Fixed" | "Percentage" | null;
  buyerPaidCommission: string | number;
  referralParty: string;
  brokerEIN: string;
  referralFee: string | number;
  resaleCertRequired: boolean;
  hoa: string;
  coRequired: boolean;
  municipalityTownship: string;
  firstRightOfRefusal: boolean;
  firstRightOfRefusalName: string;
  attorneyRepresentation: boolean;
  attorneyName: string;
  homeWarrantyPurchased: boolean;
  homeWarrantyCompany: string;
  warrantyCost: string | number;
  warrantyPaidBy: "Seller" | "Buyer" | "Agent" | null;
  titleCompany: string;
  tcFeePaidBy: TCFeePaidBy | null;
  propertyStatus: "Vacant" | "Occupied" | null;
  accessType: AccessType | null;
  accessCode: string;
  specialInstructions: string;
  urgentIssues: string;
  additionalNotes: string;
  requiredDocuments: string[];
} 