import { PropertyData, CommissionData, Client, AdditionalInfoData, SignatureData, TitleCompanyData } from './transaction';

export type { AgentRole } from './transaction';

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
  titleData: TitleCompanyData;
  additionalInfo: AdditionalInfoData;
  signatureData: SignatureData;
}