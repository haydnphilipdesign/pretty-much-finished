import React, { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Percent, Users, CircleDollarSign } from "lucide-react";
import type { CommissionData, AgentRole } from '@/types/transaction';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CommissionSectionProps {
  data: CommissionData;
  onChange: (field: keyof CommissionData, value: any) => void;
  role: AgentRole;
}

export const CommissionSection: React.FC<CommissionSectionProps> = ({
  data,
  onChange,
  role
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isListingOrDual = role === 'LISTING AGENT' || role === 'DUAL AGENT';

  const validateField = useCallback((field: string, value: string | boolean) => {
    if (typeof value === 'boolean') return '';
    
    // Allow empty values to support clearing fields
    if (value === '') return '';

    switch (field) {
      case 'totalCommissionPercentage':
      case 'listingAgentPercentage':
      case 'buyersAgentPercentage':
      case 'referralFee':
      case 'brokerFeeAmount':
      case 'sellerPaidAmount':
      case 'buyerPaidAmount':
        const numValue = parseFloat(value);
        if (!value.trim()) {
          return 'This field is required';
        }
        if (isNaN(numValue) || numValue < 0 || numValue > 100) {
          return 'Please enter a valid percentage between 0 and 100';
        }
        break;
      case 'sellersAssist':
        if (!value.trim()) {
          return 'This field is required';
        }
        const amount = parseFloat(value);
        if (isNaN(amount) || amount < 0) {
          return 'Please enter a valid amount';
        }
        break;
      case 'referralParty':
      case 'brokerEin':
        if (!value.trim()) {
          return 'This field is required';
        }
        break;
    }
    return '';
  }, []);

  // Helper function to calculate automatic commission values
  const calculateCommission = useCallback((field: string, value: string, currentData: CommissionData) => {
    // Parse current values, defaulting to 0 if not provided
    const total = parseFloat(currentData.totalCommissionPercentage || '0');
    const listing = parseFloat(currentData.listingAgentPercentage || '0');
    const buyers = parseFloat(currentData.buyersAgentPercentage || '0');
    const brokerFee = parseFloat(currentData.brokerFeeAmount || '0');

    // Store the updates we want to make
    let updates: Partial<CommissionData> = {};

    // Auto-calculate commission percentages
    if (field === 'totalCommissionPercentage' || field === 'listingAgentPercentage' || field === 'buyersAgentPercentage') {
      const newValue = parseFloat(value || '0');
      
      // When total percentage changes, adjust buyer's or listing agent's percentage
      if (field === 'totalCommissionPercentage') {
        if (listing > 0) {
          // If listing is known, adjust buyer's percentage: buyer = total - listing
          updates.buyersAgentPercentage = (newValue - listing).toFixed(2);
        } else if (buyers > 0) {
          // If buyer's is known, adjust listing percentage: listing = total - buyer
          updates.listingAgentPercentage = (newValue - buyers).toFixed(2);
        }
      } 
      // When listing percentage changes, adjust buyer's or total percentage
      else if (field === 'listingAgentPercentage') {
        if (total > 0) {
          // If total is known, adjust buyer's percentage: buyer = total - listing
          updates.buyersAgentPercentage = (total - newValue).toFixed(2);
        } else if (buyers > 0) {
          // If buyer's is known, calculate total: total = listing + buyer
          updates.totalCommissionPercentage = (newValue + buyers).toFixed(2);
        }
      } 
      // When buyer's percentage changes, adjust listing or total percentage
      else if (field === 'buyersAgentPercentage') {
        if (total > 0) {
          // If total is known, adjust listing percentage: listing = total - buyer
          updates.listingAgentPercentage = (total - newValue).toFixed(2);
        } else if (listing > 0) {
          // If listing is known, calculate total: total = listing + buyer
          updates.totalCommissionPercentage = (listing + newValue).toFixed(2);
        }
      }
    }

    return updates;
  }, []);

  const handleChange = useCallback((field: keyof CommissionData, value: string | boolean) => {
    if (typeof value === 'string') {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));

      // Calculate auto-fill values
      const updates = calculateCommission(field, value, data);
      
      // Apply all updates
      onChange(field, value);
      Object.entries(updates).forEach(([updateField, updateValue]) => {
        onChange(updateField as keyof CommissionData, updateValue);
      });
    } else {
      onChange(field, value);
    }

  }, [onChange, validateField, calculateCommission, data]);

  // Handle numeric input allowing for empty values
  const handleNumericChange = (field: keyof CommissionData, value: string) => {
    // Allow empty value or valid numbers
    if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      onChange(field, value);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <Percent className="h-5 w-5 mr-2 text-blue-600" />
            Commission Details
          </h3>
          
          {/* Combined Commission Percentages and Fee Payments */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {isListingOrDual && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="totalCommissionPercentage" className="flex items-center text-gray-800">
                    Total Commission <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="totalCommissionPercentage"
                      value={data.totalCommissionPercentage}
                      onChange={(e) => handleNumericChange('totalCommissionPercentage', e.target.value)}
                      type="text"
                      placeholder="e.g. 6.0"
                      required
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  {errors.totalCommissionPercentage && (
                    <p className="text-xs text-red-500">{errors.totalCommissionPercentage}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listingAgentPercentage" className="flex items-center text-gray-800">
                    Listing Agent <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="listingAgentPercentage"
                      value={data.listingAgentPercentage}
                      onChange={(e) => handleNumericChange('listingAgentPercentage', e.target.value)}
                      type="text"
                      placeholder="e.g. 3.0"
                      required
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  {errors.listingAgentPercentage && (
                    <p className="text-xs text-red-500">{errors.listingAgentPercentage}</p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="buyersAgentPercentage" className="flex items-center text-gray-800">
                Buyer's Agent <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="buyersAgentPercentage"
                  value={data.buyersAgentPercentage}
                  onChange={(e) => handleNumericChange('buyersAgentPercentage', e.target.value)}
                  type="text"
                  placeholder="e.g. 3.0"
                  required
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
              </div>
              {errors.buyersAgentPercentage && (
                <p className="text-xs text-red-500">{errors.buyersAgentPercentage}</p>
              )}
            </div>
          </div>
          
          {/* Fee Payment Percentages (now showing as percentages) */}
          {role !== 'BUYERS AGENT' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <Label htmlFor="sellerPaidAmount" className="flex items-center text-gray-800">
                  Seller Paid Percentage
                </Label>
                <div className="relative">
                  <Input
                    id="sellerPaidAmount"
                    value={data.sellerPaidAmount || ""}
                    onChange={(e) => handleNumericChange('sellerPaidAmount', e.target.value)}
                    type="text"
                    placeholder="e.g. 0.0"
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buyerPaidAmount" className="flex items-center text-gray-800">
                  Buyer Paid Percentage
                </Label>
                <div className="relative">
                  <Input
                    id="buyerPaidAmount"
                    value={data.buyerPaidAmount || ""}
                    onChange={(e) => handleNumericChange('buyerPaidAmount', e.target.value)}
                    type="text"
                    placeholder="e.g. 0.0"
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
            </div>
          )}

          {/* Coordinator Fee */}
          <div className="pt-4 border-t border-gray-100">
            <div className="space-y-2">
              <Label className="flex items-center text-gray-800">
                <CircleDollarSign className="h-4 w-4 mr-2 text-blue-600" />
                Coordinator Fee Paid By <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={data.coordinatorFeePaidBy}
                onValueChange={(value: 'client' | 'agent') => handleChange('coordinatorFeePaidBy', value)}
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select who pays..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Seller's Assist */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 py-2">
              <Switch
                id="hasSellersAssist"
                checked={data.hasSellersAssist}
                onCheckedChange={(checked) => handleChange('hasSellersAssist', checked)}
              />
              <Label htmlFor="hasSellersAssist" className="text-gray-800 cursor-pointer">Include Seller's Assist</Label>
            </div>

            {data.hasSellersAssist && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-2">
                  <Label htmlFor="sellersAssist" className="flex items-center text-gray-800">
                    Seller's Assist Amount <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative w-full max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="sellersAssist"
                      value={data.sellersAssist}
                      onChange={(e) => handleNumericChange('sellersAssist', e.target.value)}
                      type="text"
                      placeholder="Enter amount"
                      required
                      className="pl-7"
                    />
                  </div>
                  {errors.sellersAssist && (
                    <p className="text-xs text-red-500">{errors.sellersAssist}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Referral toggle moved here */}
            <div className="flex items-center space-x-2 py-2 mt-4">
              <Switch
                id="isReferral"
                checked={data.isReferral}
                onCheckedChange={(checked) => handleChange('isReferral', checked)}
              />
              <Label htmlFor="isReferral" className="text-gray-800 cursor-pointer">This is a referral</Label>
            </div>

            {data.isReferral && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="referralParty" className="flex items-center text-gray-800">
                      Referral Party <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="referralParty"
                      value={data.referralParty}
                      onChange={(e) => handleChange('referralParty', e.target.value)}
                      placeholder="Enter name"
                      required
                    />
                    {errors.referralParty && (
                      <p className="text-xs text-red-500">{errors.referralParty}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brokerEin" className="flex items-center text-gray-800">
                      Broker EIN <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="brokerEin"
                      value={data.brokerEin}
                      onChange={(e) => handleChange('brokerEin', e.target.value)}
                      placeholder="XX-XXXXXXX"
                      required
                    />
                    {errors.brokerEin && (
                      <p className="text-xs text-red-500">{errors.brokerEin}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referralFee" className="flex items-center text-gray-800">
                      Referral Fee <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="referralFee"
                        value={data.referralFee}
                        onChange={(e) => handleNumericChange('referralFee', e.target.value)}
                        type="text"
                        placeholder="Enter percentage"
                        required
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                    {errors.referralFee && (
                      <p className="text-xs text-red-500">{errors.referralFee}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionSection;
