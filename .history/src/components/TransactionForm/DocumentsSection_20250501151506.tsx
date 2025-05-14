import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AgentRole, DocumentItem, DocumentsData, TitleCompanyData, PropertyData, CommissionData } from '@/types/transaction';

interface DocumentsSectionProps {
  onChange: (field: keyof DocumentsData, value: any) => void;
  role: AgentRole;
  titleData?: TitleCompanyData;
  propertyData?: PropertyData;
  commissionData?: CommissionData;
}

// Improved document requirements structure based on documents.ts
const documentRequirements = {
  listingAgent: {
    required: [
      { id: "agreementOfSaleAndAddenda", name: "Agreement of Sale and Addenda" },
      { id: "buyerPrequalification", name: "Buyer's Prequalification/Preapproval Letter/Proof of Funds" },
      { id: "kwAffiliateServicesAddendum", name: "KW Affiliate Services Addendum" },
      { id: "sellersPropertyDisclosure", name: "Seller's Property Disclosure" },
      { id: "sellersEstimatedCosts", name: "Seller's Estimated Costs" },
      { id: "kwWireFraudAdvisory", name: "KW Wire Fraud Advisory" },
      { id: "cooperatingBrokersCompensation", name: "Cooperating Broker's Compensation" },
      { id: "referralAgreementAndW9", name: "Referral Agreement (if applicable)" }
    ],
    optional: [
      { id: "attorneyReviewClause", name: "Attorney Review Clause" },
      { id: "leadBasedPaintDisclosure", name: "Lead Based Paint Disclosure" },
      { id: "kwHomeWarrantyWaiver", name: "KW Home Warranty Waiver" },
      { id: "dualAgencyDisclosure", name: "Dual Agency Disclosure" }
    ]
  },
  buyersAgent: {
    required: [
      { id: "agreementOfSaleAndAddenda", name: "Agreement of Sale and Addenda" },
      { id: "kwAffiliateServicesDisclosure", name: "KW Affiliate Services Disclosure" },
      { id: "kwAffiliateServicesAddendum", name: "KW Affiliate Services Addendum" },
      { id: "kwWireFraudAdvisory", name: "KW Wire Fraud Advisory" },
      { id: "kwHomeWarrantyWaiver", name: "KW Home Warranty Waiver" },
      { id: "consumerNotice", name: "Consumer Notice" },
      { id: "buyersAgencyContract", name: "Buyer's Agency Contract" },
      { id: "buyerPrequalification", name: "Buyer's Prequalification/Preapproval Letter" },
      { id: "sellersPropertyDisclosure", name: "Seller's Property Disclosure" },
      { id: "depositMoneyNotice", name: "Deposit Money Notice" },
      { id: "buyersEstimatedCosts", name: "Buyer's Estimated Costs" },
      { id: "cooperatingBrokersCompensation", name: "Cooperating Broker's Compensation" }
    ],
    optional: [
      { id: "attorneyReviewClause", name: "Attorney Review Clause" },
      { id: "kpssAba", name: "KPSS ABA" },
      { id: "leadBasedPaintDisclosure", name: "Lead Based Paint Disclosure" },
      { id: "forYourProtectionNotice", name: "For Your Protection Notice" },
      { id: "referralAgreementAndW9", name: "Referral Agreement & W9" },
      { id: "dualAgencyDisclosure", name: "Dual Agency Disclosure" }
    ]
  },
  dualAgent: {
    required: [
      { id: "agreementOfSaleAndAddenda", name: "Agreement of Sale and Addenda" },
      { id: "kwAffiliateServicesDisclosure", name: "KW Affiliate Services Disclosure" },
      { id: "kwAffiliateServicesAddendum", name: "KW Affiliate Services Addendum" },
      { id: "consumerNotice", name: "Consumer Notice" },
      { id: "buyersAgencyContract", name: "Buyer's Agency Contract" },
      { id: "buyerPrequalification", name: "Buyer's Prequalification/Preapproval Letter" },
      { id: "sellersPropertyDisclosure", name: "Seller's Property Disclosure" },
      { id: "depositMoneyNotice", name: "Deposit Money Notice" },
      { id: "buyersEstimatedCosts", name: "Buyer's Estimated Costs" },
      { id: "sellersEstimatedCosts", name: "Seller's Estimated Costs" },
      { id: "kwWireFraudAdvisory", name: "KW Wire Fraud Advisory" },
      { id: "dualAgencyDisclosure", name: "Dual Agency Disclosure" }
    ],
    optional: [
      { id: "kwHomeWarrantyWaiver", name: "KW Home Warranty Waiver" },
      { id: "leadBasedPaintDisclosure", name: "Lead Based Paint Disclosure" },
      { id: "attorneyReviewClause", name: "Attorney Review Clause" },
      { id: "kpssAba", name: "KPSS ABA" },
      { id: "forYourProtectionNotice", name: "For Your Protection Notice" },
      { id: "referralAgreementAndW9", name: "Referral Agreement & W9" }
    ]
  }
};

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  onChange,
  role,
  titleData,
  propertyData,
  commissionData
}) => {
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [documentConfirmation, setDocumentConfirmation] = useState<boolean>(false);
  const [autoSelectedDocs, setAutoSelectedDocs] = useState<Set<string>>(new Set());
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  // Helper function to get the role key
  const getRoleKey = (role: AgentRole): keyof typeof documentRequirements => {
    switch (role) {
      case 'LISTING AGENT':
        return 'listingAgent';
      case 'BUYERS AGENT':
        return 'buyersAgent';
      case 'DUAL AGENT':
        return 'dualAgent';
    }
  };

  // Auto-select all required documents on initial load
  useEffect(() => {
    if (initialLoad) {
      const roleKey = getRoleKey(role);
      const requiredDocs = documentRequirements[roleKey].required;
      const requiredIds = requiredDocs.map(doc => doc.id);
      
      setSelectedDocuments(new Set(requiredIds));
      setAutoSelectedDocs(new Set(requiredIds));
      setInitialLoad(false);
    }
  }, [initialLoad, role]);

  // Auto-select documents based on form data
  useEffect(() => {
    const newAutoSelected = new Set<string>();
    const roleKey = getRoleKey(role);
    const allDocs = [...documentRequirements[roleKey].required, ...documentRequirements[roleKey].optional];
    
    // First, auto-select all required documents
    documentRequirements[roleKey].required.forEach(doc => {
      newAutoSelected.add(doc.id);
    });
    
    // Check if certain documents should be auto-selected based on form data
    
    // KPSS ABA - Title company is KPSS
    if (titleData?.titleCompany?.toUpperCase()?.includes('KPSS') && 
        allDocs.some(doc => doc.id === 'kpssAba')) {
      newAutoSelected.add('kpssAba');
    }
    
    // Lead Based Paint Disclosure - Property built before 1978
    if (propertyData?.isBuiltBefore1978 === 'YES' && 
        allDocs.some(doc => doc.id === 'leadBasedPaintDisclosure')) {
      newAutoSelected.add('leadBasedPaintDisclosure');
    }

    // Attorney Review Clause - If attorney representation is true
    if (propertyData?.propertyType === 'RESIDENTIAL' && 
        allDocs.some(doc => doc.id === 'attorneyReviewClause')) {
      newAutoSelected.add('attorneyReviewClause');
    }

    // Referral Agreement - If isReferral is true
    if (commissionData?.isReferral && 
        allDocs.some(doc => doc.id === 'referralAgreementAndW9')) {
      newAutoSelected.add('referralAgreementAndW9');
    }

    // Update selected documents with auto-selected ones
    if (JSON.stringify(Array.from(newAutoSelected)) !== JSON.stringify(Array.from(autoSelectedDocs))) {
      setAutoSelectedDocs(newAutoSelected);
      
      // Merge user selections with auto-selections
      const mergedSelections = new Set([...selectedDocuments]);
      newAutoSelected.forEach(docId => {
        mergedSelections.add(docId);
      });
      
      setSelectedDocuments(mergedSelections);
    }
  }, [titleData, propertyData, commissionData, role, selectedDocuments, autoSelectedDocs]);

  // Highlight auto-selected documents
  const isAutoSelected = (id: string) => {
    return autoSelectedDocs.has(id);
  };

  // Update parent component when selected documents change
  useEffect(() => {
    const selectedDocs = Array.from(selectedDocuments).map(id => {
      const roleKey = getRoleKey(role);
      const allDocs = [...documentRequirements[roleKey].required, ...documentRequirements[roleKey].optional];
      const doc = allDocs.find(doc => doc.id === id);
      const isRequired = documentRequirements[roleKey].required.some(req => req.id === id);
      
      return {
        name: doc?.name || id,
        required: isRequired,
        selected: true
      };
    });

    try {
      onChange('documents', selectedDocs);
    } catch (error) {
      console.error('Error updating documents:', error);
    }
  }, [selectedDocuments, role, onChange]);

  const updateConfirmation = useCallback(() => {
    if (typeof onChange !== 'function') return;
    
    try {
      onChange('confirmDocuments', documentConfirmation);
    } catch (error) {
      console.error('Error updating confirmation:', error);
    }
  }, [documentConfirmation, onChange]);

  useEffect(() => {
    updateParentDocuments();
  }, [selectedDocuments, updateParentDocuments]);

  useEffect(() => {
    updateConfirmation();
  }, [documentConfirmation, updateConfirmation]);

  const handleDocumentToggle = (id: string) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Get the current role's document requirements
  const roleKey = getRoleKey(role);
  const { required, optional } = documentRequirements[roleKey];

  const renderDocumentList = (documents: Array<{ id: string, name: string }>, isRequired: boolean) => {
    return documents.map((document) => (
      <div key={document.id} className="flex items-center space-x-2 py-1">
        <Checkbox
          id={document.id}
          checked={selectedDocuments.has(document.id)}
          onCheckedChange={() => {
            handleDocumentToggle(document.id);
          }}
        />
        <label htmlFor={document.id} className="text-sm text-slate-800 cursor-pointer">
          {document.name}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
          {isAutoSelected(document.id) && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
              Auto-selected
            </span>
          )}
        </label>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Required Documents</h2>
        <p className="text-white/70">Please confirm all required documents are included</p>
      </div>

      <Card className="p-6 backdrop-blur-lg bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <FileCheck className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Document Checklist</h3>
            </div>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Required Documents</h3>
                {renderDocumentList(required, true)}
              </div>

              {optional.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Optional Documents</h3>
                  {renderDocumentList(optional, false)}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t pt-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="documentConfirmation"
                checked={documentConfirmation}
                onCheckedChange={(checked) => setDocumentConfirmation(checked === true)}
                className="border-slate-400"
              />
              <label htmlFor="documentConfirmation" className="text-sm font-medium text-slate-800 cursor-pointer">
                I confirm that all required documents have been included <span className="text-red-500">*</span>
              </label>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
