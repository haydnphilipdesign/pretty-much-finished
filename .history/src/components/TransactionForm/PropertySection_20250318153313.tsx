import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { Home } from "lucide-react";
import { PropertyData } from "@/types/transaction";
import { useState } from "react";

interface PropertySectionProps {
  data: PropertyData;
  onChange: (field: string, value: string | boolean) => void;
}

export function PropertySection({ data, onChange }: PropertySectionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ... existing validation and change handlers

  return (
    <div className="space-y-6">
      {/* ... existing title */}
      
      <Card className="p-6 bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-6">
          {/* ... existing MLS section */}
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Property Address</h3>
            
            <div className="space-y-4">
              <div className="space-y-2 md:col-span-2">
                <AddressAutocomplete
                  id="streetAddress"
                  value={data.streetAddress}
                  onChange={(address, addressComponents) => {
                    onChange("streetAddress", address);
                    
                    // If we have address components, automatically fill in city, state, zip
                    if (addressComponents && addressComponents.length > 0) {
                      const city = addressComponents.find(c => c.types.includes("locality"))?.long_name || "";
                      const state = addressComponents.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "PA";
                      // Try multiple possible types for postal code
                      const zipCode = 
                        addressComponents.find(c => c.types.includes("postal_code"))?.long_name || 
                        addressComponents.find(c => c.types.includes("zip_code"))?.long_name || 
                        "";
                      
                      console.log('Extracted: city=', city, 'state=', state, 'zip=', zipCode);
                      if (city) onChange("city", city);
                      if (state) onChange("state", state);
                      if (zipCode) {
                        console.log('Setting zip code to', zipCode);
                        onChange("zipCode", zipCode);
                      }
                    } else {
                      // Fallback: Try to extract from the full address string
                      const addressParts = address.split(',').map(part => part.trim());
                      if (addressParts.length >= 3) {
                        // Usually the format is: Street, City, State ZIP
                        const lastPart = addressParts[addressParts.length - 1];
                        const stateZipMatch = lastPart.match(/([A-Z]{2})\s+(\d{5}(-\d{4})?)/);
                        
                        if (stateZipMatch) {
                          const state = stateZipMatch[1];
                          const zipCode = stateZipMatch[2];
                          const city = addressParts[addressParts.length - 2];
                          
                          onChange("city", city);
                          onChange("state", state);
                          onChange("zipCode", zipCode);
                        }
                      }
                    }
                  }}
                  label="Street Address"
                  required={true}
                  error={errors.streetAddress}
                  placeholder="123 Main St"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-800">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={data.city}
                    onChange={(e) => onChange("city", e.target.value)}
                    placeholder="Philadelphia"
                    className="bg-white/80 border-slate-300 text-slate-800"
                    required
                  />
                  {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state" className="text-slate-800">
                      State <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="state"
                      value={data.state || "PA"}
                      onChange={(e) => onChange("state", e.target.value)}
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
                      onChange={(e) => onChange("zipCode", e.target.value.slice(0, 5))}
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
          </div>
          
          {/* ... rest of the component */}
        </div>
      </Card>
    </div>
  );
} 