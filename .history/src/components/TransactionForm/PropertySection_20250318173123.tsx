import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { Home } from "lucide-react";
import { PropertyData } from "@/types/transaction";
import { useState } from "react";

interface PropertySectionProps {
  data: PropertyData;
  onChange: (field: string, value: any) => void;
  errors?: Record<string, string[]>;
}

export function PropertySection({ data, onChange, errors }: PropertySectionProps) {
  const [errorsState, setErrorsState] = useState<Record<string, string>>({});

  console.log("PropertySection rendering with data:", data);

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
                  value={data.address || ""}
                  onChange={(address, addressComponents) => {
                    // Update the main address field
                    onChange("address", address);
                    
                    // Store address components separately for backend use only
                    if (addressComponents && addressComponents.length > 0) {
                      const city = addressComponents.find(c => c.types.includes("locality"))?.long_name || "";
                      const state = addressComponents.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "PA";
                      const zipCode = 
                        addressComponents.find(c => c.types.includes("postal_code"))?.long_name || 
                        addressComponents.find(c => c.types.includes("zip_code"))?.long_name || 
                        "";
                        
                      // Store these in hidden fields or in a data attribute for submission
                      // We don't update the UI with these values since we're using a single address field
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('property_address_components', JSON.stringify({
                          city, state, zipCode, 
                          streetAddress: address.split(',')[0] || ""
                        }));
                      }
                    }
                  }}
                  label="Property Address"
                  required={true}
                  error={errors?.address}
                  placeholder="123 Main St, Philadelphia, PA 19103"
                />
              </div>
            </div>
          </div>
          
          {/* ... rest of the component */}
        </div>
      </Card>
    </div>
  );
} 