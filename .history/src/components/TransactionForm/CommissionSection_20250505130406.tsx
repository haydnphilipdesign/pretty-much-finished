import React, { useCallback, useState } from "react";
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

  const handleChange = useCallback((field: keyof CommissionData, value: string | boolean) => {
    if (typeof value === 'string') {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
    onChange(field, value);
  }, [onChange, validateField]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Commission Details</h2>
        <p className="text-white/70">Enter the commission information for this transaction</p>
      </div>

      <Card className="p-3 sm:p-6 backdrop-blur-lg bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-start gap-2 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {isListingOrDual && (
              <>
                <div className="space-y-2">
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
                  />
                  {errors.totalCommissionPercentage && (
                    <p className="text-sm text-red-500">{errors.totalCommissionPercentage}</p>
                  )}
                </div>

                <div className="space-y-2">
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
                  />
                  {errors.listingAgentPercentage && (
                    <p className="text-sm text-red-500">{errors.listingAgentPercentage}</p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2">
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
              />
              {errors.buyersAgentPercentage && (
                <p className="text-sm text-red-500">{errors.buyersAgentPercentage}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brokerFeeAmount">Seller Paid Amount*</Label>
              <Input
                id="brokerFeeAmount"
                value={data.brokerFeeAmount}
                onChange={(e) => handleChange('brokerFeeAmount', e.target.value)}
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter seller paid amount"
                required
              />
              {errors.brokerFeeAmount && (
                <p className="text-sm text-red-500">{errors.brokerFeeAmount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerPaidAmount">Buyer Paid Amount*</Label>
              <Input
                id="buyerPaidAmount"
                value={data.buyerPaidAmount}
                onChange={(e) => handleChange('buyerPaidAmount', e.target.value)}
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter buyer paid amount"
                required
              />
              {errors.buyerPaidAmount && (
                <p className="text-sm text-red-500">{errors.buyerPaidAmount}</p>
              )}
            </div>

            <div className="col-span-2">
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
              <div className="space-y-2">
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
                />
                {errors.sellersAssist && (
                  <p className="text-sm text-red-500">{errors.sellersAssist}</p>
                )}
              </div>
            )}

            <div className="col-span-2">
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
                <div className="space-y-2">
                  <Label htmlFor="referralParty">Referral Party*</Label>
                  <Input
                    id="referralParty"
                    value={data.referralParty}
                    onChange={(e) => handleChange('referralParty', e.target.value)}
                    placeholder="Enter referral party"
                    required
                  />
                  {errors.referralParty && (
                    <p className="text-sm text-red-500">{errors.referralParty}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brokerEin">Broker EIN*</Label>
                  <Input
                    id="brokerEin"
                    value={data.brokerEin}
                    onChange={(e) => handleChange('brokerEin', e.target.value)}
                    placeholder="Enter broker EIN"
                    required
                  />
                  {errors.brokerEin && (
                    <p className="text-sm text-red-500">{errors.brokerEin}</p>
                  )}
                </div>

                <div className="space-y-2">
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
                  />
                  {errors.referralFee && (
                    <p className="text-sm text-red-500">{errors.referralFee}</p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2 md:col-span-1">
              <Label>Coordinator Fee Paid By*</Label>
              <Select
                value={data.coordinatorFeePaidBy}
                onValueChange={(value: 'client' | 'agent') => handleChange('coordinatorFeePaidBy', value)}
              >
                <SelectTrigger>
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
