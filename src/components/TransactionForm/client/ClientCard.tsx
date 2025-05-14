import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, User } from "lucide-react";
import { ClientFormFields } from "./ClientFormFields";
import type { AgentRole } from '@/types/transaction';

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
  role: AgentRole | null;
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
    <Card className="p-6 backdrop-blur-lg bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl animate-fade-in hover:shadow-lg transition-all duration-300 group">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-medium text-slate-800">Client Details</h3>
        </div>
        {showRemoveButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveClient(client.id)}
            className="hover:bg-red-100 hover:text-red-500 text-slate-500 transition-colors duration-200"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="relative">
        <ClientFormFields
          client={client}
          onClientChange={onClientChange}
          role={role}
        />
      </div>
    </Card>
  );
}