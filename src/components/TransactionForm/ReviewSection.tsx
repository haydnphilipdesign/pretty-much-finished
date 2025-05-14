import React from 'react';
import { Card } from "@/components/ui/card";
import { FileCheck, AlertTriangle, Edit, Check } from "lucide-react";
import { TransactionFormData } from "@/types/transaction";
import { formatDate } from '@/utils/dateUtils';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReviewMissingFieldsIndicator } from './ReviewMissingFieldsIndicator';

interface ReviewSectionProps {
  data: TransactionFormData;
  skippedFields?: string[];
  onFieldFix?: (field: string) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  data,
  skippedFields = [],
  onFieldFix
}) => {
  // Format currency values
  const formatCurrency = (value: string) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseInt(value, 10));
  };

  // Filter out signature related fields from skipped fields for review page
  const filteredSkippedFields = skippedFields.filter(field => {
    if (field.includes('signature') || field.includes('infoConfirmed') || 
        field.includes('termsAccepted') || field.includes('agentName')) {
      return false;
    }
    return true;
  });
  
  // Check if a field is in the skipped fields list
  const isFieldSkipped = (field: string) => {
    // For signature related fields, don't show as skipped on review page
    if (field.includes('signature') || field.includes('infoConfirmed') || 
        field.includes('termsAccepted') || field.includes('agentName')) {
      return false;
    }
    
    return filteredSkippedFields.some(skipped => 
      skipped === field || 
      skipped.includes(field) || 
      field.includes(skipped)
    );
  };

  // Helper to render field with optional "Fix" button
  const renderField = (label: string, value: any, fieldName: string) => {
    const isEmpty = value === undefined || value === null || value === '';
    const isMissing = isEmpty || isFieldSkipped(fieldName);
    
    return (
      <div>
        <div className="flex justify-between items-start">
          <p className="text-sm text-gray-500">{label}</p>
          {isMissing && onFieldFix && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-6 px-2 py-0 text-blue-600 hover:bg-blue-50"
              onClick={() => onFieldFix(fieldName)}
            >
              <Edit className="w-3 h-3 mr-1" />
              Fix
            </Button>
          )}
        </div>
        <p className={cn(
          "font-medium",
          isMissing ? "text-amber-700" : "text-gray-800"
        )}>
          {isEmpty ? 'Not specified' : value}
          {!isEmpty && !isMissing && <Check className="inline-block w-3 h-3 ml-1 text-green-500" />}
        </p>
      </div>
    );
  };

  // Helper to create section header
  const renderSectionHeader = (title: string, step: number, icon: React.ReactNode) => {
    // Don't check for signature fields on review page
    const relevantSkippedFields = skippedFields.filter(field => {
      if (field.includes('signature') || field.includes('infoConfirmed') || 
          field.includes('termsAccepted') || field.includes('agentName')) {
        return false;
      }
      return true;
    });
    
    const hasMissingFields = relevantSkippedFields.some(field => {
      // Check relevant fields based on section
      switch (step) {
        case 1: // Agent Info
          return field.includes('role') || field.includes('agent');
        case 2: // Property
          return field.includes('property') || field.includes('address') || field.includes('price');
        case 3: // Clients
          return field.includes('client');
        case 4: // Commission
          return field.includes('commission') || field.includes('fee');
        case 5: // Property Details
          return field.includes('hoa') || field.includes('warranty') || field.includes('title');
        case 7: // Additional Info
          return field.includes('notes') || field.includes('additional');
        default:
          return false;
      }
    });

    return (
      <div className="flex items-start justify-between gap-2 mb-3 pb-1 border-b border-gray-100">
        <div className="flex items-center">
          <div className={cn(
            "p-2 rounded-full mr-2",
            hasMissingFields ? "bg-amber-100" : "bg-blue-100"
          )}>
            {icon}
          </div>
          <h4 className="font-medium text-gray-700">{title}</h4>
        </div>
        
        {hasMissingFields && onFieldFix && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100"
            onClick={() => {
              // Find first relevant missing field and navigate to it
              const fieldToFix = relevantSkippedFields.find(field => {
                switch (step) {
                  case 1: return field.includes('role') || field.includes('agent');
                  case 2: return field.includes('property') || field.includes('address') || field.includes('price');
                  case 3: return field.includes('client');
                  case 4: return field.includes('commission') || field.includes('fee');
                  case 5: return field.includes('hoa') || field.includes('warranty') || field.includes('title');
                  case 7: return field.includes('notes') || field.includes('additional');
                  default: return false;
                }
              });
              if (fieldToFix) onFieldFix(fieldToFix);
              else onFieldFix(`step${step}`); // Fallback to step number
            }}
          >
            <Edit className="w-3 h-3 mr-1" />
            Fix Missing Fields
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {filteredSkippedFields.length > 0 && (
        <ReviewMissingFieldsIndicator 
          skippedFields={filteredSkippedFields}
          onFixClick={onFieldFix}
        />
      )}
      
      <Card className="p-6 bg-white shadow-md rounded-xl">
        <div className="space-y-6">
          <div className="flex items-start gap-2 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <FileCheck className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Transaction Summary</h3>
          </div>

          <div className="space-y-6">
            {/* Agent Info */}
            <div className="border-b border-gray-200 pb-4">
              {renderSectionHeader("Agent Information", 1, <FileCheck className="h-4 w-4 text-blue-600" />)}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField("Role", data.agentData?.role, "role")}
                {renderField("Name", data.signatureData?.agentName || data.agentData?.name, "agentName")}
                {data.agentData?.email && renderField("Email", data.agentData.email, "email")}
                {data.agentData?.phone && renderField("Phone", data.agentData.phone, "phone")}
              </div>
            </div>

            {/* Property Info */}
            <div className="border-b border-gray-200 pb-4">
              {renderSectionHeader("Property Information", 2, <FileCheck className="h-4 w-4 text-blue-600" />)}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  {renderField("Address", data.propertyData?.address, "address")}
                </div>
                {renderField("MLS Number", data.propertyData?.mlsNumber, "mlsNumber")}
                {renderField("Sale Price", data.propertyData?.salePrice ? formatCurrency(data.propertyData.salePrice) : null, "salePrice")}
                {renderField("Closing Date", data.propertyData?.closingDate ? formatDate(data.propertyData.closingDate) : null, "closingDate")}
                {renderField("County", data.propertyData?.county, "county")}
                {renderField("Property Type", data.propertyData?.propertyType, "propertyType")}
                {renderField("Status", data.propertyData?.status, "status")}
              </div>
            </div>

            {/* Client Info */}
            <div className="border-b border-gray-200 pb-4">
              {renderSectionHeader("Client Information", 3, <FileCheck className="h-4 w-4 text-blue-600" />)}
              {data.clients && data.clients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.clients.map((client, index) => (
                    <div key={client.id || index} className={cn(
                      "p-3 rounded-lg",
                      isFieldSkipped(`clients[${index}]`) ? "bg-amber-50 border border-amber-200" : "bg-gray-50"
                    )}>
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-gray-700">{client.name || 'Unnamed Client'} ({client.type})</p>
                        {onFieldFix && isFieldSkipped(`clients[${index}]`) && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 px-2 py-0 text-blue-600 hover:bg-blue-50"
                            onClick={() => onFieldFix(`clients[${index}]`)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Fix
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {client.phone && (
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm">{client.phone}</p>
                          </div>
                        )}
                        {client.email && (
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm">{client.email}</p>
                          </div>
                        )}
                        {client.address && (
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500">Address</p>
                            <p className="text-sm">{client.address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-amber-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      No client information provided
                    </p>
                    {onFieldFix && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-7 px-2 text-blue-600 hover:bg-blue-50 border-blue-200"
                        onClick={() => onFieldFix('clients')}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Add Clients
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Commission Info */}
            <div className="border-b border-gray-200 pb-4">
              {renderSectionHeader("Commission Information", 4, <FileCheck className="h-4 w-4 text-blue-600" />)}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderField("Total Commission", data.commissionData?.totalCommissionPercentage ? `${data.commissionData.totalCommissionPercentage}%` : null, "totalCommissionPercentage")}
                {renderField("Listing Agent Commission", data.commissionData?.listingAgentPercentage ? `${data.commissionData.listingAgentPercentage}%` : null, "listingAgentPercentage")}
                {renderField("Buyer's Agent Commission", data.commissionData?.buyersAgentPercentage ? `${data.commissionData.buyersAgentPercentage}%` : null, "buyersAgentPercentage")}
                {data.commissionData?.hasSellersAssist && 
                  renderField("Seller's Assist", data.commissionData?.sellersAssist ? formatCurrency(data.commissionData.sellersAssist) : null, "sellersAssist")}
                {renderField("Coordinator Fee Paid By", data.commissionData?.coordinatorFeePaidBy === 'client' ? 'Client' : 'Agent', "coordinatorFeePaidBy")}
              </div>
            </div>
            
            {/* Property Details & Title */}
            <div className="border-b border-gray-200 pb-4">
              {renderSectionHeader("Property Details & Title", 5, <FileCheck className="h-4 w-4 text-blue-600" />)}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderField("Title Company", data.titleData?.titleCompany, "titleCompany")}
                {renderField("Municipality", data.propertyDetailsData?.municipality, "municipality")}
                {data.propertyDetailsData?.hoaName && 
                  renderField("HOA Name", data.propertyDetailsData.hoaName, "hoaName")}
                {renderField("CO Required", data.propertyDetailsData?.coRequired ? "Yes" : "No", "coRequired")}
                {data.propertyDetailsData?.homeWarranty && 
                  renderField("Warranty Company", data.propertyDetailsData.warrantyCompany, "warrantyCompany")}
                {data.propertyDetailsData?.homeWarranty && 
                  renderField("Warranty Cost", data.propertyDetailsData.warrantyCost ? formatCurrency(data.propertyDetailsData.warrantyCost) : null, "warrantyCost")}
                {data.propertyDetailsData?.homeWarranty && 
                  renderField("Warranty Paid By", data.propertyDetailsData.warrantyPaidBy, "warrantyPaidBy")}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              {renderSectionHeader("Additional Information", 7, <FileCheck className="h-4 w-4 text-blue-600" />)}
              {data.additionalInfo?.notes ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-gray-700 font-medium mb-2">Notes</h5>
                  <p className="text-sm whitespace-pre-wrap">{data.additionalInfo.notes}</p>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 italic">No additional information provided</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}; 