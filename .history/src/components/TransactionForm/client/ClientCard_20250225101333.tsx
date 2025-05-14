import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Trash2 } from "lucide-react";
import { ClientFormFields } from "./ClientFormFields";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  maritalStatus: string;
  type: string;
}

interface ClientCardProps {
  client: Client;
  onRemoveClient: (id: string) => void;
  onClientChange: (id: string, field: string, value: string) => void;
  role: string | null;
  showRemoveButton: boolean;
}

export function ClientCard({
  client,
  onRemoveClient,
  onClientChange,
  role,
  showRemoveButton,
}: ClientCardProps) {
  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-brand-navy">Client Details</h3>
        {showRemoveButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveClient(client.id)}
            className="hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/5 to-transparent animate-pulse pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <ClientFormFields
          client={client}
          onClientChange={onClientChange}
          role={role}
        />
      </div>
    </Card>
  );
}
