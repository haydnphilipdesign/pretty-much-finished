import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { ClientFormFields } from './client/ClientFormFields';
import type { Client, AgentRole } from '@/types/transaction';

interface ClientInformationProps {
  clients: Client[];
  onChange: (clients: Client[]) => void;
  agentRole?: string;
  onAddClient?: () => void;
  onRemoveClient?: (id: string) => void;
  onClientChange?: (id: string, field: string, value: any) => void;
  role?: string;
}

export const ClientInformation: React.FC<ClientInformationProps> = ({
  clients,
  role,
  onClientChange,
  onAddClient,
  onRemoveClient,
  onChange
}) => {
  // Update parent component when clients change
  useEffect(() => {
    onChange(clients);
  }, [clients, onChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Client Information</h2>
        <p className="text-white/70">Enter the client details for this transaction</p>
      </div>

      <div className="space-y-4">
        {clients.map((client, index) => (
          <Card key={client.id} className="p-6 backdrop-blur-lg bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">Client {index + 1}</h3>
                </div>
                {clients.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveClient(client.id)}
                  >
                    Remove Client
                  </Button>
                )}
              </div>

              <ClientFormFields
                client={client}
                onClientChange={(field, value) => onClientChange(client.id, field, value)}
                role={role}
              />
            </div>
          </Card>
        ))}

        <Button
          type="button"
          onClick={onAddClient}
          className="w-full"
        >
          Add Another Client
        </Button>
      </div>
    </div>
  );
};
