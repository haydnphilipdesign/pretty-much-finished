import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";

export function ClientItem({ client, onChange, onRemove, index, clientCount }: ClientItemProps) {
  // ... existing code
  
  return (
    <div className="space-y-4 p-4 border rounded-md border-slate-200">
      {/* ... existing fields */}
      
      <div className="space-y-4">
        <h4 className="text-md font-medium text-slate-800">Address</h4>
        
        <div className="space-y-2">
          <Label htmlFor={`client-${client.id}-streetAddress`} className="text-slate-800">
            Street Address <span className="text-red-500">*</span>
          </Label>
          <AddressAutocomplete
            id={`client-${client.id}-streetAddress`}
            value={client.streetAddress || ""}
            onChange={(address, addressComponents) => {
              handleChange("streetAddress", address);
              
              // If we have address components, automatically fill in city, state, zip
              if (addressComponents && addressComponents.length > 0) {
                const city = addressComponents.find(c => c.types.includes("locality"))?.long_name || "";
                const state = addressComponents.find(c => c.types.includes("administrative_area_level_1"))?.short_name || "PA";
                const zipCode = 
                  addressComponents.find(c => c.types.includes("postal_code"))?.long_name || 
                  addressComponents.find(c => c.types.includes("zip_code"))?.long_name || 
                  "";
                
                if (city) handleChange("city", city);
                if (state) handleChange("state", state);
                if (zipCode) handleChange("zipCode", zipCode);
              } else {
                // Fallback parsing
                const addressParts = address.split(',').map(part => part.trim());
                if (addressParts.length >= 3) {
                  const lastPart = addressParts[addressParts.length - 1];
                  const stateZipMatch = lastPart.match(/([A-Z]{2})\s+(\d{5}(-\d{4})?)/);
                  
                  if (stateZipMatch) {
                    const state = stateZipMatch[1];
                    const zipCode = stateZipMatch[2];
                    const city = addressParts[addressParts.length - 2];
                    
                    handleChange("city", city);
                    handleChange("state", state);
                    handleChange("zipCode", zipCode);
                  }
                }
              }
            }}
            label="Street Address"
            required={true}
            error={errors?.[`client${index}StreetAddress`]}
            placeholder="123 Main St"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor={`client-${client.id}-city`} className="text-slate-800">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`client-${client.id}-city`}
              value={client.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Philadelphia"
              className="bg-white/80 border-slate-300 text-slate-800"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`client-${client.id}-state`} className="text-slate-800">
                State <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`client-${client.id}-state`}
                value={client.state || "PA"}
                onChange={(e) => handleChange("state", e.target.value.toUpperCase().slice(0, 2))}
                placeholder="PA"
                className="bg-white/80 border-slate-300 text-slate-800 uppercase"
                maxLength={2}
                required
              />
            </div>
            
            <div>
              <Label htmlFor={`client-${client.id}-zipCode`} className="text-slate-800">
                Zip Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`client-${client.id}-zipCode`}
                value={client.zipCode || ""}
                onChange={(e) => handleChange("zipCode", e.target.value.slice(0, 5))}
                placeholder="19103"
                className="bg-white/80 border-slate-300 text-slate-800"
                maxLength={5}
                pattern="[0-9]{5}"
                required
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* ... rest of the component */}
    </div>
  );
} 