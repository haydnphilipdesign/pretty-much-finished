import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Card } from "../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { WarrantyData } from "../../types/transaction";

interface WarrantySectionProps {
  role: string | null;
  data: WarrantyData;
  onChange: (field: string, value: any) => void;
}

export function WarrantySection({ role, data, onChange }: WarrantySectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Warranty Information</h2>
        <p className="text-gray-500 mb-6">Enter warranty details for the property</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="hasWarranty">Home Warranty Purchased</Label>
            <Switch
              id="hasWarranty"
              checked={data.hasWarranty}
              onCheckedChange={(checked) => onChange("hasWarranty", checked)}
            />
          </div>

          {data.hasWarranty && (
            <>
              <div className="space-y-2">
                <Label htmlFor="provider">Warranty Provider <span className="text-red-500">*</span></Label>
                <Input
                  id="provider"
                  value={data.provider}
                  onChange={(e) => onChange("provider", e.target.value)}
                  placeholder="Enter warranty provider name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Warranty Cost <span className="text-red-500">*</span></Label>
                <Input
                  id="cost"
                  type="number"
                  value={data.cost}
                  onChange={(e) => onChange("cost", e.target.value)}
                  placeholder="Enter warranty cost"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Warranty Paid By <span className="text-red-500">*</span></Label>
                <RadioGroup
                  value={data.paidBy}
                  onValueChange={(value) => onChange("paidBy", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="seller" id="seller" />
                    <Label htmlFor="seller">Seller</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="buyer" id="buyer" />
                    <Label htmlFor="buyer">Buyer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="agent" id="agent" />
                    <Label htmlFor="agent">Agent</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}