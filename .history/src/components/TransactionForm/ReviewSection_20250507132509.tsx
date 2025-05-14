import React from 'react';
import { Card } from "@/components/ui/card";
import { FileCheck, AlertTriangle } from "lucide-react";
import { TransactionFormData } from "@/types/transaction";
import { MissingFieldsIndicator } from './MissingFieldsIndicator';
import { formatDate } from '@/utils/dateUtils';

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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Review & Submit</h2>
        <p className="text-white/70">
          Please review your transaction information before submitting
        </p>
      </div>

      {/* Missing Fields Warning */}
      {skippedFields && skippedFields.length > 0 && (
        <MissingFieldsIndicator
          skippedFields={skippedFields}
          onFixClick={onFieldFix}
        />
      )}

      <Card className="p-6 backdrop-blur-lg bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-6">
          <div className="flex items-start gap-2 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <FileCheck className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Transaction Summary</h3>
          </div>

          <div className="space-y-4">
            {/* Agent Info */}
            <div className="border-b pb-4">
              <h4 className="font-medium text-slate-700 mb-2">Agent Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Role</p>
                  <p className="font-medium">{data.agentData?.role || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="font-medium">{data.signatureData?.agentName || data.agentData?.name || 'Not specified'}</p>
                </div>
                {data.agentData?.email && (
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium">{data.agentData.email}</p>
                  </div>
                )}
                {data.agentData?.phone && (
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium">{data.agentData.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Property Info */}
            <div className="border-b pb-4">
              <h4 className="font-medium text-slate-700 mb-2">Property Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="font-medium">{data.propertyData?.address || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">MLS Number</p>
                  <p className="font-medium">{data.propertyData?.mlsNumber || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Sale Price</p>
                  <p className="font-medium">{data.propertyData?.salePrice ? formatCurrency(data.propertyData.salePrice) : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Closing Date</p>
                  <p className="font-medium">{data.propertyData?.closingDate ? formatDate(data.propertyData.closingDate) : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">County</p>
                  <p className="font-medium">{data.propertyData?.county || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Property Type</p>
                  <p className="font-medium">{data.propertyData?.propertyType || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="border-b pb-4">
              <h4 className="font-medium text-slate-700 mb-2">Client Information</h4>
              {data.clients && data.clients.length > 0 ? (
                <div className="space-y-4">
                  {data.clients.map((client, index) => (
                    <div key={client.id || index} className="bg-slate-50 p-3 rounded-lg">
                      <p className="font-medium text-slate-700">{client.name || 'Unnamed Client'} ({client.type})</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {client.phone && (
                          <div>
                            <p className="text-xs text-slate-500">Phone</p>
                            <p className="text-sm">{client.phone}</p>
                          </div>
                        )}
                        {client.email && (
                          <div>
                            <p className="text-xs text-slate-500">Email</p>
                            <p className="text-sm">{client.email}</p>
                          </div>
                        )}
                        {client.address && (
                          <div className="col-span-2">
                            <p className="text-xs text-slate-500">Address</p>
                            <p className="text-sm">{client.address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  No client information provided
                </p>
              )}
            </div>

            {/* Commission Info */}
            <div className="border-b pb-4">
              <h4 className="font-medium text-slate-700 mb-2">Commission Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.commissionData?.totalCommissionPercentage && (
                  <div>
                    <p className="text-sm text-slate-500">Total Commission</p>
                    <p className="font-medium">{data.commissionData.totalCommissionPercentage}%</p>
                  </div>
                )}
                {data.commissionData?.listingAgentPercentage && (
                  <div>
                    <p className="text-sm text-slate-500">Listing Agent Commission</p>
                    <p className="font-medium">{data.commissionData.listingAgentPercentage}%</p>
                  </div>
                )}
                {data.commissionData?.buyersAgentPercentage && (
                  <div>
                    <p className="text-sm text-slate-500">Buyer's Agent Commission</p>
                    <p className="font-medium">{data.commissionData.buyersAgentPercentage}%</p>
                  </div>
                )}
                {data.commissionData?.hasSellersAssist && data.commissionData?.sellersAssist && (
                  <div>
                    <p className="text-sm text-slate-500">Seller's Assist</p>
                    <p className="font-medium">{formatCurrency(data.commissionData.sellersAssist)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            {data.additionalInfo?.notes && (
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Additional Notes</h4>
                <p className="text-sm bg-slate-50 p-3 rounded whitespace-pre-wrap">
                  {data.additionalInfo.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}; 