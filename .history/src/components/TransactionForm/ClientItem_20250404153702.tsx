import { Client } from "@/types/transaction";
import { AddressInput } from "@/components/ui/AddressInput";
import { AddressComponents } from "@/utils/addressVerification";

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
      
      <AddressInput
        value={client.address || ""}
        onChange={(address, addressComponents) => {
          // Update the main address field
          onChange("address", address);
          
          // Store address components separately for backend use only
          if (addressComponents) {
            // Store these in local storage with client ID to keep them separate
            if (typeof window !== 'undefined') {
              localStorage.setItem(`client_${client.id}_address_components`, JSON.stringify({
                city: addressComponents.city, 
                state: addressComponents.state, 
                zipCode: addressComponents.zip, 
                streetAddress: addressComponents.street1
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