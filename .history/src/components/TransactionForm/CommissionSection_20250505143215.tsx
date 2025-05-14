iimport React, { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
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

    switch (field) {
      case 'totalCommissionPercentage':
      case 'listingAgentPercentage':
      case 'buyersAgentPercentage':
      case 'referralFee':
        const numValue = parseFloat(value);
        if (!value.trim()) {
          return 'This field is required';
        }
        if (isNaN(numValue) || numValue < 0 || numValue > 100) {
          return 'Please enter a valid percentage between 0 and 100';
        }
        break;
      case 'brokerFeeAmount':
      case 'buyerPaidAmount':
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

  const calculateCommission = useCallback((field: string, value: string, currentData: CommissionData) => {
    const total = parseFloat(currentData.totalCommissionPercentage || '0');
    const listing = parseFloat(currentData.listingAgentPercentage || '0');
    const buyers = parseFloat(currentData.buyersAgentPercentage || '0');
    const sellerPaid = parseFloat(currentData.brokerFeeAmount || '0');
    const buyerPaid = parseFloat(currentData.buyerPaidAmount || '0');

    let updates: Partial<CommissionData> = {};

    // Auto-calculate commission percentages
    if (field === 'totalCommissionPercentage' || field === 'listingAgentPercentage' || field === 'buyersAgentPercentage') {
      const newValue = parseFloat(value || '0');
      
      if (field === 'totalCommissionPercentage') {
        if (listing > 0) {
          updates.buyersAgentPercentage = (newValue - listing).toFixed(2);
        } else if (buyers > 0) {
          updates.listingAgentPercentage = (newValue - buyers).toFixed(2);
        }
      } else if (field === 'listingAgentPercentage') {
        if (total > 0) {
          updates.buyersAgentPercentage = (total - newValue).toFixed(2);
        } else if (buyers > 0) {
          updates.totalCommissionPercentage = (newValue + buyers).toFixed(2);
        }
      } else if (field === 'buyersAgentPercentage') {
        if (total > 0) {
          updates.listingAgentPercentage = (total - newValue).toFixed(2);
        } else if (listing > 0) {
          updates.totalCommissionPercentage = (listing + newValue).toFixed(2);
        }
      }
    }

    // Auto-calculate paid amounts
    if (field === 'totalCommissionPercentage' || field === 'brokerFeeAmount' || field === 'buyerPaidAmount') {
      const newValue = parseFloat(value || '0');
      
      if (field === 'totalCommissionPercentage' && sellerPaid > 0) {
        const totalAmount = parseFloat(value) * 10000; // Convert percentage to amount
        updates.buyerPaidAmount = (totalAmount - sellerPaid).toFixed(2);
      } else if (field === 'brokerFeeAmount' && total > 0) {
        const totalAmount = total * 10000; // Convert percentage to amount
        updates.buyerPaidAmount = (totalAmount - newValue).toFixed(2);
      } else if (field === 'buyerPaidAmount' && total > 0) {
        const totalAmount = total * 10000; // Convert percentage to amount
        updates.brokerFeeAmount = (totalAmount - newValue).toFixed(2);
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

  }, [onChange, validateField]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Commission Details</h2>
        <p className="text-white/70">Enter the commission information for this transaction</p>
      </div>

      <Card className="p-3 sm:p-6 backdrop-blur-lg bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start gap-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {isListingOrDual && (
              <>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="totalCommissionPercentage">Total Commission %*</Label>
                  <Input
                    id="totalCommissionPercentage"
                    value={data.totalCommissionPercentage}
                    onChange={(e) => handleChange('totalCommissionPercentage', e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="Enter total commission"
                    required
                    className="w-full"
                  />
                  {errors.totalCommissionPercentage && (
                    <p className="text-sm text-red-500">{errors.totalCommissionPercentage}</p>
                  )}
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="listingAgentPercentage">Listing Agent Commission %*</Label>
                  <Input
                    id="listingAgentPercentage"
                    value={data.listingAgentPercentage}
                    onChange={(e) => handleChange('listingAgentPercentage', e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="Enter listing agent commission"
                    required
                    className="w-full"
                  />
                  {errors.listingAgentPercentage && (
                    <p className="text-sm text-red-500">{errors.listingAgentPercentage}</p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="buyersAgentPercentage">Buyer's Agent Commission %*</Label>
              <Input
                id="buyersAgentPercentage"
                value={data.buyersAgentPercentage}
                onChange={(e) => handleChange('buyersAgentPercentage', e.target.value)}
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="Enter buyer's agent commission"
                required
                className="w-full"
              />
              {errors.buyersAgentPercentage && (
                <p className="text-sm text-red-500">{errors.buyersAgentPercentage}</p>
              )}
            </div>

            {role !== 'BUYERS AGENT' && (
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="brokerFeeAmount">Seller Paid Amount</Label>
                <Input
                  id="brokerFeeAmount"
                  value={data.brokerFeeAmount}
                  onChange={(e) => handleChange('brokerFeeAmount', e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter seller paid amount"
                  className="w-full"
                />
                {errors.brokerFeeAmount && (
                  <p className="text-sm text-red-500">{errors.brokerFeeAmount}</p>
                )}
              </div>
            )}

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="buyerPaidAmount">Buyer Paid Amount</Label>
              <Input
                id="buyerPaidAmount"
                value={data.buyerPaidAmount}
                onChange={(e) => handleChange('buyerPaidAmount', e.target.value)}
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter buyer paid amount"
                className="w-full"
              />
              {errors.buyerPaidAmount && (
                <p className="text-sm text-red-500">{errors.buyerPaidAmount}</p>
              )}
            </div>

            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="hasSellersAssist"
                  checked={data.hasSellersAssist}
                  onCheckedChange={(checked) => handleChange('hasSellersAssist', checked)}
                />
                <Label htmlFor="hasSellersAssist">Seller's Assist</Label>
              </div>
            </div>

            {data.hasSellersAssist && (
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="sellersAssist">Seller's Assist Amount*</Label>
                <Input
                  id="sellersAssist"
                  value={data.sellersAssist}
                  onChange={(e) => handleChange('sellersAssist', e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter seller's assist amount"
                  required
                  className="w-full"
                />
                {errors.sellersAssist && (
                  <p className="text-sm text-red-500">{errors.sellersAssist}</p>
                )}
              </div>
            )}

            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isReferral"
                  checked={data.isReferral}
                  onCheckedChange={(checked) => handleChange('isReferral', checked)}
                />
                <Label htmlFor="isReferral">Is this a referral?</Label>
              </div>
            </div>

            {data.isReferral && (
              <>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="referralParty">Referral Party*</Label>
                  <Input
                    id="referralParty"
                    value={data.referralParty}
                    onChange={(e) => handleChange('referralParty', e.target.value)}
                    placeholder="Enter referral party"
                    required
                    className="w-full"
                  />
                  {errors.referralParty && (
                    <p className="text-sm text-red-500">{errors.referralParty}</p>
                  )}
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="brokerEin">Broker EIN*</Label>
                  <Input
                    id="brokerEin"
                    value={data.brokerEin}
                    onChange={(e) => handleChange('brokerEin', e.target.value)}
                    placeholder="Enter broker EIN"
                    required
                    className="w-full"
                  />
                  {errors.brokerEin && (
                    <p className="text-sm text-red-500">{errors.brokerEin}</p>
                  )}
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="referralFee">Referral Fee %*</Label>
                  <Input
                    id="referralFee"
                    value={data.referralFee}
                    onChange={(e) => handleChange('referralFee', e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="Enter referral fee percentage"
                    required
                    className="w-full"
                  />
                  {errors.referralFee && (
                    <p className="text-sm text-red-500">{errors.referralFee}</p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-1.5 sm:space-y-2">
              <Label>Coordinator Fee Paid By*</Label>
              <Select
                value={data.coordinatorFeePaidBy}
                onValueChange={(value: 'client' | 'agent') => handleChange('coordinatorFeePaidBy', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select who pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CommissionSection;