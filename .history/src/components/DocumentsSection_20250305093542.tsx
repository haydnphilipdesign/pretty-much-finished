
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

interface DocumentsSectionProps extends BaseSectionProps {
  documents: {
    purchaseAgreement?: File;
    disclosures?: File[];
    inspectionReports?: File[];
    otherDocuments?: File[];
  };
  setDocuments: (data: any) => void;
}

export function DocumentsSection({
  documents,
  setDocuments,
  className
}: DocumentsSectionProps) {
  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files) return;
    
    if (field === "disclosures" || field === "inspectionReports" || field === "otherDocuments") {
      setDocuments({
        ...documents,
        [field]: [...(documents[field] || []), ...Array.from(files)]
      });
    } else {
      setDocuments({
        ...documents,
        [field]: files[0]
      });
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-semibold text-white">Required Documents</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="purchaseAgreement">Purchase Agreement</Label>
          <Input
            id="purchaseAgreement"
            type="file"
            onChange={(e) => handleFileUpload("purchaseAgreement", e.target.files)}
          />
        </div>
        <div>
          <Label htmlFor="disclosures">Disclosures</Label>
          <Input
            id="disclosures"
            type="file"
            multiple
            onChange={(e) => handleFileUpload("disclosures", e.target.files)}
          />
        </div>
        <div>
          <Label htmlFor="inspectionReports">Inspection Reports</Label>
          <Input
            id="inspectionReports"
            type="file"
            multiple
            onChange={(e) => handleFileUpload("inspectionReports", e.target.files)}
          />
        </div>
        <div>
          <Label htmlFor="otherDocuments">Other Documents</Label>
          <Input
            id="otherDocuments"
            type="file"
            multiple
            onChange={(e) => handleFileUpload("otherDocuments", e.target.files)}
          />
        </div>
      </div>
    </div>
  );
}
