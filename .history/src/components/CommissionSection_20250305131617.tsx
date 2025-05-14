
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import type { CommissionData } from '@/types/transaction';

interface CommissionData {
  commissionBase: "salePrice" | "other";
  totalCommission: string;
  listingAgentCommission: string;
  buyersAgentCommission: string;
  buyerPaidCommission: string;
  sellersAssist: string;
  isReferral: boolean;
  referralParty: string;
  brokerEin: string;
  referralFee: string;
  brokerSplit: string;
  coordinatorFeePaidBy: "client" | "agent";
}

interface CommissionSectionProps {
  commissionData: CommissionData;
  setCommissionData: (data: CommissionData) => void;
}

export function CommissionSection({ commissionData, setCommissionData }: CommissionSectionProps) {
  if (!commissionData) {
    // Provide default values if commissionData is undefined
    commissionData = {
      commissionBase: "salePrice",
      totalCommission: "",
      listingAgentCommission: "",
      buyersAgentCommission: "",
      buyerPaidCommission: "",
      sellersAssist: "",
      isReferral: false,
      referralParty: "",
      brokerEin: "",
      referralFee: "",
      brokerSplit: "",
      coordinatorFeePaidBy: "client"
    };
  }

  const handleChange = (field: string, value: any) => {
    setCommissionData({
      ...commissionData,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Commission Information</h2>
      
      <div className="grid gap-4">
        <div>
          <Label htmlFor="commissionBase">Commission Base</Label>
          <RadioGroup
            value={commissionData.commissionBase}
            onValueChange={(value) => handleChange('commissionBase', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="salePrice" id="salePrice" />
              <Label htmlFor="salePrice">Sale Price</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="totalCommission">Total Commission</Label>
          <Input
            id="totalCommission"
            value={commissionData.totalCommission}
            onChange={(e) => handleChange('totalCommission', e.target.value)}
            placeholder="Enter total commission"
          />
        </div>

        {/* Add other commission fields here */}
        
        <div>
          <Label htmlFor="isReferral">Referral?</Label>
          <Switch
            checked={commissionData.isReferral}
            onCheckedChange={(checked) => handleChange('isReferral', checked)}
          />
        </div>

        {commissionData.isReferral && (
          <>
            <div>
              <Label htmlFor="referralParty">Referral Party</Label>
              <Input
                id="referralParty"
                value={commissionData.referralParty}
                onChange={(e) => handleChange('referralParty', e.target.value)}
                placeholder="Enter referral party"
              />
            </div>
            
            <div>
              <Label htmlFor="brokerEin">Broker EIN</Label>
              <Input
                id="brokerEin"
                value={commissionData.brokerEin}
                onChange={(e) => handleChange('brokerEin', e.target.value)}
                placeholder="Enter broker EIN"
              />
            </div>

            <div>
              <Label htmlFor="referralFee">Referral Fee</Label>
              <Input
                id="referralFee"
                value={commissionData.referralFee}
                onChange={(e) => handleChange('referralFee', e.target.value)}
                placeholder="Enter referral fee"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
