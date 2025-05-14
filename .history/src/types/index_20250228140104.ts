import { PropertyData, CommissionData, Client, AdditionalInfoData, SignatureData } from './transaction';

export type AgentRole = 'listingAgent' | 'buyersAgent' | 'dualAgent';

export interface FormData {
  propertyData: PropertyData;
  clients: Client[];
  commissionData: CommissionData;
  propertyDetailsData: {
    resaleCertRequired: boolean;
    hoaName: string;
    coRequired: boolean;
    municipality: string;
    firstRightOfRefusal: boolean;
    firstRightName: string;
    attorneyRepresentation: boolean;
    attorneyName: string;
  };
  warrantyData: {
    homeWarranty: boolean;
    warrantyCompany: string;
    warrantyCost: string;
  };
  titleCompanyData: {
    titleCompanyName: string;
    titleCompanyContact: string;
    titleCompanyPhone: string;
    titleCompanyEmail: string;
  };
  additionalInfoData: AdditionalInfoData;
  signatureData: SignatureData;
}