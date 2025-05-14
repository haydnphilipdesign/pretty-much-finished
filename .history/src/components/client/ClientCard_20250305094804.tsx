
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, User } from "lucide-react";
import { ClientFormFields } from "./ClientFormFields";
import { cn } from "@/lib/utils";

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
  showRemoveButton
}: ClientCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <h3 className="font-medium">Client Details</h3>
        </div>
        {showRemoveButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveClient(client.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ClientFormFields
          client={client}
          onClientChange={onClientChange}
          role={role}
        />
      </CardContent>
    </Card>
  );
}
