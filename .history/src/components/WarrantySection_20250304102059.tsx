
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WarrantyData } from "@/types/transaction";
import { Shield } from "lucide-react";

interface WarrantySectionProps {
  role: string | null;
  data: WarrantyData;
  onChange: (field: string, value: any) => void;
}

export function WarrantySection({ role, data, onChange }: WarrantySectionProps) {
  return (
    <div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Warranty Information</h2>
        <p className="text-white/70">Enter warranty details for the property</p>
      </div>

      <Card className="p-6 backdrop-blur-lg bg-transparent border-white/30 text-slate-800">
        <div className="space-y-6">
          <div className="flex items-start gap-2 mb-2">
            <Shield className="h-5 w-5 text-slate-700 mt-1" />
            <h3 className="text-xl font-medium text-slate-800">Home Warranty</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="hasWarranty" className="text-slate-800">Home Warranty Purchased</Label>
              <Switch
                id="hasWarranty"
                checked={data.hasWarranty}
                onCheckedChange={(checked) => onChange("hasWarranty", checked)}
              />
            </div>

            {data.hasWarranty && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="provider" className="text-slate-800">Warranty Provider <span className="text-red-500">*</span></Label>
                  <Input
                    id="provider"
                    value={data.provider}
                    onChange={(e) => onChange("provider", e.target.value)}
                    placeholder="Enter warranty provider name"
                    className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost" className="text-slate-800">Warranty Cost <span className="text-red-500">*</span></Label>
                  <Input
                    id="cost"
                    type="number"
                    value={data.cost}
                    onChange={(e) => onChange("cost", e.target.value)}
                    placeholder="Enter warranty cost"
                    className="bg-transparent border-slate-300 text-slate-800 placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-800">Warranty Paid By <span className="text-red-500">*</span></Label>
                  <RadioGroup
                    value={data.paidBy}
                    onValueChange={(value) => onChange("paidBy", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="seller" id="seller" className="border-slate-400" />
                      <Label htmlFor="seller" className="text-slate-800">Seller</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buyer" id="buyer" className="border-slate-400" />
                      <Label htmlFor="buyer" className="text-slate-800">Buyer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="agent" id="agent" className="border-slate-400" />
                      <Label htmlFor="agent" className="text-slate-800">Agent</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
