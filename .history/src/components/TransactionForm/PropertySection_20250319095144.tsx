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
      {/* ... existing title */}
      
      <Card className="p-6 bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-6">
          {/* ... existing MLS section */}
          
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
              
              <div className="space-y-2">
                <Label htmlFor="city" className="text-slate-800">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  value={data.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Philadelphia"
                  className="bg-white/80 border-slate-300 text-slate-800"
                  required
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
              </div>
              
              <div className="space-y-2 grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state" className="text-slate-800">
                    State <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="state"
                    value={data.state || "PA"}
                    onChange={(e) => handleChange("state", e.target.value)}
                    placeholder="PA"
                    className="bg-white/80 border-slate-300 text-slate-800 uppercase"
                    maxLength={2}
                    readOnly
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="zipCode" className="text-slate-800">
                    Zip Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="zipCode"
                    value={data.zipCode}
                    onChange={(e) => handleChange("zipCode", e.target.value.slice(0, 5))}
                    placeholder="19103"
                    className="bg-white/80 border-slate-300 text-slate-800"
                    maxLength={5}
                    pattern="[0-9]{5}"
                    required
                  />
                  {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
                </div>
              </div>
            </div>
          </div>
          
          {/* ... rest of the component */}
        </div>
      </Card>
    </div>
  );
} 