import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Client } from '@/types/transaction';
import { DebugClientForm } from "./DebugClientForm";
import { Card } from "@/components/ui/card";
import { v4 as uuidv4 } from 'uuid';

interface DebugClientSectionProps {
  clients: Client[];
  onClientChange: (id: string, field: string, value: string | boolean) => void;
  onAddClient: () => void;
  onRemoveClient: (id: string) => void;
}

export function DebugClientSection({ 
  clients, 
  onClientChange, 
  onAddClient, 
  onRemoveClient 
}: DebugClientSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Client Information</h2>
      <p className="text-gray-600">Enter the details for all clients involved in this transaction (at least one client required)</p>
      
      <div className="space-y-4">
        {clients.map((client, index) => (
          <DebugClientForm
            key={client.id}
            client={client}
            onChange={(field, value) => onClientChange(client.id, field, value)}
            onRemove={clients.length > 1 ? () => onRemoveClient(client.id) : undefined}
            index={index}
          />
        ))}
      </div>
      
      <Button 
        onClick={onAddClient}
        className="w-full mt-4"
        variant="outline"
      >
        + Add Another Client
      </Button>
    </div>
  );
} 