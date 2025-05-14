
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users } from "lucide-react";
import { ClientCard } from "./client/ClientCard";
import { cn } from "@/lib/utils";
import { BaseSectionProps } from "@/types/forms";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  maritalStatus: string;
  type: string;
}

interface ClientInformationProps extends BaseSectionProps {
  clients: Client[];
  onAddClient: () => void;
  onRemoveClient: (id: string) => void;
  onClientChange: (id: string, field: string, value: any) => void;
  role: "listing-agent" | "buyers-agent" | "dual-agent" | null;
}

export function ClientInformation({
  clients,
  onAddClient,
  onRemoveClient,
  onClientChange,
  role,
  className
}: ClientInformationProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          Client Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clients.map((client, index) => (
          <ClientCard
            key={client.id}
            client={client}
            onRemoveClient={onRemoveClient}
            onClientChange={onClientChange}
            role={role}
            showRemoveButton={clients.length > 1}
          />
        ))}
        <Button
          onClick={onAddClient}
          variant="outline"
          className="w-full mt-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Client
        </Button>
      </CardContent>
    </Card>
  );
}
