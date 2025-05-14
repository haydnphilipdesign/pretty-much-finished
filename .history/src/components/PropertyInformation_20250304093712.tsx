
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Building } from "lucide-react";

interface PropertyInformationProps {
  data: {
    mlsNumber: string;
    address: string;
    salePrice: string;
    status: string;
    isWinterized: boolean;
    updateMls: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
  role: string | null;
}

export function PropertyInformation({
  data = {
    mlsNumber: '',
    address: '',
    salePrice: '',
    status: '',
    isWinterized: false,
    updateMls: false
  },
  onChange,
  role
}: PropertyInformationProps) {
  const canUpdateMls = role === "listing-agent" || role === "dual-agent";
  
  const handleMlsNumberChange = (value: string) => {
    // Remove any non-digit characters
    let cleaned = value.replace(/[^\d]/g, '');

    // Limit to 6 digits
    cleaned = cleaned.slice(0, 6);

    // Pad with leading zeros if needed
    cleaned = cleaned.padStart(6, '0');
    onChange("mlsNumber", cleaned);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Property Information</h2>
        <p className="text-white/70">
          Enter the details about the property
        </p>
      </div>

      <Card className="p-6 backdrop-blur-lg bg-white/30 border-white/30 text-slate-800">
        <div className="space-y-6">
          <div className="flex items-start gap-2 mb-2">
            <Building className="h-5 w-5 text-slate-700 mt-1" />
            <h3 className="text-xl font-medium text-slate-800">Property Details</h3>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mlsNumber" className="text-slate-800">MLS Number <span className="text-red-500">*</span></Label>
              <Input 
                id="mlsNumber" 
                placeholder="Enter 6 digits" 
                value={data?.mlsNumber || ''} 
                onChange={e => handleMlsNumberChange(e.target.value)} 
                required 
                className="bg-white/50 border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-500">
                Format example: 123456
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salePrice" className="text-slate-800">Sale Price <span className="text-red-500">*</span></Label>
              <Input 
                id="salePrice" 
                placeholder="Enter sale price" 
                value={data?.salePrice || ''} 
                onChange={e => onChange("salePrice", e.target.value)} 
                type="number" 
                required 
                className="bg-white/50 border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-slate-800">Property Address <span className="text-red-500">*</span></Label>
            <Input 
              id="address" 
              placeholder="Enter full property address" 
              value={data?.address || ''} 
              onChange={e => onChange("address", e.target.value)} 
              required
              className="bg-white/50 border-slate-300 text-slate-800 placeholder:text-slate-400" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-800">Property Status <span className="text-red-500">*</span></Label>
            <RadioGroup value={data?.status || ''} onValueChange={value => onChange("status", value)} className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vacant" id="vacant" className="border-slate-400" />
                <Label htmlFor="vacant" className="text-slate-800">Vacant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occupied" id="occupied" className="border-slate-400" />
                <Label htmlFor="occupied" className="text-slate-800">Occupied</Label>
              </div>
            </RadioGroup>
          </div>

          {data?.status === "vacant" && (
            <div className="flex items-center space-x-2">
              <Switch 
                id="winterized" 
                checked={data?.isWinterized || false} 
                onCheckedChange={checked => onChange("isWinterized", checked)} 
              />
              <Label htmlFor="winterized" className="text-slate-800">Property is winterized</Label>
            </div>
          )}

          {canUpdateMls && (
            <div className="flex items-center space-x-2">
              <Switch 
                id="updateMls" 
                checked={data?.updateMls || false} 
                onCheckedChange={checked => onChange("updateMls", checked)} 
              />
              <Label htmlFor="updateMls" className="text-slate-800">Update MLS status</Label>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
