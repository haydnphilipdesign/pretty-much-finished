export interface AdditionalInfoData {
  notes: string;
  specialInstructions: string;
  otherConsiderations: string;
  [key: string]: string;  // Index signature for dynamic fields
}