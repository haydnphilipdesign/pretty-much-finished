
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

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

// Helper function to get role-specific documents
const getRoleDocuments = (role: string | null): string[] => {
  switch (role) {
    case "buyers-agent":
      return [
        "Agreement of Sale",
        "Attorney Review Clause (if applicable)",
        "KW Affiliate Services Disclosure",
        "KW Affiliate Services Addendum",
        "KW Wire Fraud Notice",
        "KW Home Warranty Waiver",
        "Consumer Notice",
        "Buyer's Agency Contract",
        "Seller's Property Disclosure",
        "Lead Based Paint Disclosure (if applicable)",
        "Deposit Money Notice",
        "Buyer's Estimated Costs",
        "Cooperating Broker's Compensation",
        "KPSS ABA (if using Keystone Premier Settlement)",
        "For Your Protection Notice (if applicable)",
        "Referral Agreement & W-9 (if applicable)",
      ];
    case "listing-agent":
      return [
        "Agreement of Sale",
        "Attorney Review Clause (if applicable)",
        "KW Affiliate Services Addendum",
        "Seller's Property Disclosure",
        "Lead Based Paint Disclosure (if applicable)",
        "Seller's Estimated Costs",
        "KW Wire Fraud Notice",
        "Referral Agreement & W-9 (if applicable)",
        "KW Home Warranty Waiver",
        "Cooperating Broker's Compensation",
      ];
    case "dual-agent":
      return [
        "Agreement of Sale",
        "Attorney Review Clause (if applicable)",
        "KW Affiliate Services Disclosure",
        "KW Affiliate Services Addendum",
        "Consumer Notice",
        "Buyer's Agency Contract",
        "Seller's Property Disclosure",
        "Lead Based Paint Disclosure (if applicable)",
        "Deposit Money Notice",
        "Buyer's Estimated Costs",
        "Seller's Estimated Costs",
        "KPSS ABA (if using Keystone Premier Settlement)",
        "For Your Protection Notice (if applicable)",
        "Referral Agreement & W-9 (if applicable)",
        "KW Wire Fraud Notice",
        "KW Home Warranty Waiver",
        "Cooperating Broker's Compensation",
        "Dual Agency Disclosure",
      ];
    default:
      return [];
  }
};

interface DocumentsSectionProps {
  role: string | null;
}

export function DocumentsSection({ role }: DocumentsSectionProps) {
  const [documentsConfirmed, setDocumentsConfirmed] = useState(false);
  const roleDocuments = getRoleDocuments(role);

  // Group documents by category
  const documentsByCategory: Record<string, string[]> = {};
  Object.entries(DOCUMENT_CATEGORIES).forEach(([category, docs]) => {
    const categoryDocs = docs.filter(doc => roleDocuments.includes(doc));
    if (categoryDocs.length > 0) {
      documentsByCategory[category] = categoryDocs;
    }
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Required Documents</h2>
        <p className="text-white/70">
          Please review the list of required documents for your transaction
        </p>
      </div>
      
      <Card className="p-6 backdrop-blur-lg bg-white/80 border-white/30 text-slate-800">
        <div className="space-y-6">
          <div className="flex items-start gap-2">
            <ListChecks className="h-6 w-6 text-slate-700 mt-1" />
            <div>
              <h3 className="text-xl font-medium text-slate-800">Document Checklist</h3>
              <p className="text-slate-600 text-sm">
                The following documents are required for your transaction
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {Object.entries(documentsByCategory).map(([category, documents]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium text-slate-800">{category}</h4>
                <ul className="space-y-1 pl-5 list-disc text-slate-700 text-sm">
                  {documents.map((document) => (
                    <li key={document}>{document}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="documentsConfirmed"
                checked={documentsConfirmed}
                onCheckedChange={(checked) => setDocumentsConfirmed(checked as boolean)}
              />
              <label
                htmlFor="documentsConfirmed"
                className="text-sm font-medium text-slate-800 leading-none"
              >
                I have reviewed the required documents and will upload all required documents to either DocuSign or Dotloop.
              </label>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
