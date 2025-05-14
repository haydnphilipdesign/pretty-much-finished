import { WarrantyData } from "@/types/transaction";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface WarrantySectionProps {
  role: string | null;
  data: WarrantyData;
  onChange: (field: string, value: any) => void;
}

export function WarrantySection({ role, data, onChange }: WarrantySectionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "warrantyCost":
        const cost = parseFloat(value);
        return !isNaN(cost) && cost >= 0 ? "" : "Invalid cost amount";
      default:
        return value.trim() ? "" : "This field is required";
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    if (typeof value === 'string') {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
    onChange(field, value);
  };

  return (
    <div className="space-y-6">
      <Separator className="my-4 bg-slate-200" />
      
      <div className="flex items-start gap-2 mb-2">
        <div className="bg-blue-100 p-2 rounded-full">
          <Shield className="h-5 w-5 text-blue-600" />
        </div>
        {/* Removed redundant subtitle "Home Warranty Details" */}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="homeWarranty"
            checked={data.homeWarranty}
            onCheckedChange={(checked) => handleChange("homeWarranty", checked)}
            className="border-slate-400"
          />
          <Label htmlFor="homeWarranty" className="text-slate-800">
            Home warranty included in this transaction
          </Label>
        </div>

        {data.homeWarranty && (
          <div className="space-y-4 pl-6">
            <div className="space-y-2">
              <Label htmlFor="warrantyCompany" className="text-slate-800">
                Warranty Company <span className="text-red-500">*</span>
              </Label>
              <Input
                id="warrantyCompany"
                value={data.warrantyCompany || ""}
                onChange={(e) => handleChange("warrantyCompany", e.target.value)}
                placeholder="Enter warranty company name"
                required
                className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 ${errors.warrantyCompany ? 'border-red-500' : ''}`}
                aria-invalid={!!errors.warrantyCompany}
                aria-describedby={errors.warrantyCompany ? "warrantyCompany-error" : undefined}
              />
              {errors.warrantyCompany && <p id="warrantyCompany-error" className="text-sm text-red-500 mt-1">{errors.warrantyCompany}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="warrantyCost" className="text-slate-800">
                Warranty Cost ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="warrantyCost"
                type="number"
                min="0"
                step="1"
                value={data.warrantyCost || ""}
                onChange={(e) => handleChange("warrantyCost", e.target.value)}
                placeholder="Enter warranty cost"
                required
                className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 ${errors.warrantyCost ? 'border-red-500' : ''}`}
                aria-invalid={!!errors.warrantyCost}
                aria-describedby={errors.warrantyCost ? "warrantyCost-error" : undefined}
              />
              {errors.warrantyCost && <p id="warrantyCost-error" className="text-sm text-red-500 mt-1">{errors.warrantyCost}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-800">
                Paid By <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={data.paidBy}
                onValueChange={(value) => handleChange("paidBy", value)}
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
              {errors.paidBy && <p className="text-sm text-red-500 mt-1">{errors.paidBy}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
