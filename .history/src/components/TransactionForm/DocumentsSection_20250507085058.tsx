import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { ListChecks, AlertCircle } from "lucide-react";
import { DocumentsData, DocumentItem } from "@/types/transaction";

// Document categories with their respective documents
const DOCUMENT_CATEGORIES = {
  "Core Transaction Documents": [
    "Agreement of Sale",
    "Deposit Money Notice",
    "Cooperating Broker's Compensation",
    "KW Wire Fraud Notice",
  ],
  "Agency & Disclosure Documents": [
    "Buyer's Agency Contract",
    "Listing Agreement",
    "Dual Agency Disclosure",
    "Consumer Notice",
    "KW Affiliate Services Disclosure",
    "KW Affiliate Services Addendum",
    "Seller's Property Disclosure",
  ],
  "Financial Documents": [
    "Buyer's Estimated Costs",
    "Seller's Estimated Costs",
  ],
  "Warranty Documents": [
    "KW Home Warranty Waiver",
  ],
  "Documents for Specific Situations": [
    "Attorney Review Clause (if applicable)",
    "Lead Based Paint Disclosure (if applicable)",
    "KPSS ABA (if using Keystone Premier Settlement)",
    "For Your Protection Notice (if applicable)",
    "Referral Agreement & W-9 (if applicable)",
  ],
} as const;

interface DocumentsSectionProps {
  role: string | null;
  titleData: any;
  propertyData: any;
  commissionData: any;
  data?: DocumentsData;
  onChange: (field: string, value: any) => void;
}

export function DocumentsSection({ 
  role, 
  titleData,
  propertyData,
  commissionData,
  data = { documents: [], confirmDocuments: false },
  onChange 
}: DocumentsSectionProps) {
  // Add validation state
  const [showValidationError, setShowValidationError] = useState(false);
  
  const handleConfirmationChange = (checked: boolean) => {
    onChange('confirmDocuments', checked);
    if (checked) {
      setShowValidationError(false);
    }
  };

  return (
    <div className="space-y-6" id="documents-section-top">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Required Documentation</h2>
        <p className="text-white/70">
          Review the list of required documents for this transaction
        </p>
      </div>

      <Card className="p-6 backdrop-blur-lg bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-6">
          <div className="flex items-start gap-2 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <ListChecks className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium text-slate-800">Document Checklist</h3>
          </div>

          <div className="space-y-6">
            {Object.entries(DOCUMENT_CATEGORIES).map(([category, documents]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-slate-800">{category}</h4>
                <div className="space-y-2 pl-4">
                  {documents.map((document) => (
                    <div key={document} className="text-sm text-slate-700 leading-tight">
                      • {document}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="documentConfirmation"
                  checked={data.confirmDocuments}
                  onCheckedChange={(checked) => handleConfirmationChange(checked === true)}
                  className={`mt-1 border-slate-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 ${
                    showValidationError && !data.confirmDocuments ? 'border-red-500 ring-2 ring-red-200' : ''
                  }`}
                  required
                />
                <div className="flex flex-col space-y-1">
                  <label
                    htmlFor="documentConfirmation"
                    className={`text-sm ${showValidationError && !data.confirmDocuments ? 'text-red-600 font-medium' : 'text-slate-700'} leading-tight`}
                  >
                    <span className="text-red-500 mr-1">*</span>
                    I confirm that I have reviewed the list of required documents and will upload them to DocuSign or Dotloop as required.
                  </label>
                  
                  {showValidationError && !data.confirmDocuments && (
                    <div className="flex items-center text-red-600 text-xs mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      <span>This confirmation is required to proceed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
