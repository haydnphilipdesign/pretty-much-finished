// transactionFormState.ts
import { 
  PropertyData, 
  Client, 
  CommissionData, 
  PropertyDetailsData,
  TitleCompanyData,
  AdditionalInfoData,
  AgentData,
  SignatureData
} from './transaction';

export interface TransactionFormState {
  propertyData: PropertyData;
  clients: Client[];
  commissionData: CommissionData;
  propertyDetailsData: PropertyDetailsData;
  titleData: TitleCompanyData;
  additionalInfo: AdditionalInfoData;
  agentData: AgentData;
  signatureData: SignatureData;
  _formattedPdfAttachment?: any;
  transactionId?: string;
}
