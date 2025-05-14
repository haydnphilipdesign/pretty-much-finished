import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";
import { PropertyData } from "@/types/transaction";
import { useState } from "react";

interface PropertySectionProps {
  data: PropertyData;
  onChange: (field: string, value: string | boolean) => void;
}

export function PropertySection({ data, onChange }: PropertySectionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Property Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-slate-800">
                  Street Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  value={data.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="123 Main St, Philadelphia, PA 19103"
                  className="bg-white/80 border-slate-300 text-slate-800"
                  required
                />
                {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Property Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mlsNumber" className="text-slate-800">
                  MLS Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mlsNumber"
                  value={data.mlsNumber}
                  onChange={(e) => handleChange("mlsNumber", e.target.value)}
                  placeholder="PM-123456"
                  className="bg-white/80 border-slate-300 text-slate-800"
                  required
                />
                {errors.mlsNumber && <p className="text-sm text-red-500 mt-1">{errors.mlsNumber}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salePrice" className="text-slate-800">
                  Sale Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="salePrice"
                  value={data.salePrice}
                  onChange={(e) => handleChange("salePrice", e.target.value)}
                  placeholder="450000"
                  className="bg-white/80 border-slate-300 text-slate-800"
                  required
                />
                {errors.salePrice && <p className="text-sm text-red-500 mt-1">{errors.salePrice}</p>}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 