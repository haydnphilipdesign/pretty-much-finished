import { Client } from "@/types/transaction";
import { AddressInput } from "@/components/ui/AddressInput";

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
        onChange={(address: string) => {
          // Update the main address field
          onChange("address", address);
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