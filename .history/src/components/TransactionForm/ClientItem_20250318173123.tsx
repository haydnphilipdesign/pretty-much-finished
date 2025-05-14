import { Client } from "@/types/transaction";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";

interface ClientItemProps {
  client: Client;
  onChange: (field: string, value: any) => void;
  onRemove: () => void;
  index: number;
  clientCount: number;
}

export function ClientItem({ client, onChange, onRemove, index, clientCount }: ClientItemProps) {
  return (
    <div className="space-y-4 p-4 bg-white/80 rounded-lg shadow">
      {/* Other client fields */}
      
      <AddressAutocomplete
        value={client.address || ""}
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
              
            // Store these in local storage with client ID to keep them separate
            if (typeof window !== 'undefined') {
              localStorage.setItem(`client_${client.id}_address_components`, JSON.stringify({
                city, state, zipCode, 
                streetAddress: address.split(',')[0] || ""
              }));
            }
          }
        }}
        label="Client Address"
        required={true}
        error={null}
        placeholder="123 Main St, Philadelphia, PA 19103"
      />
      
      {/* Other client fields */}
    </div>
  );
} 