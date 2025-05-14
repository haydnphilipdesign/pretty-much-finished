
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface ClientFormFieldsProps {
  client: Client;
  onClientChange: (id: string, field: string, value: string) => void;
  role: string | null;
}

export function ClientFormFields({ client, onClientChange, role }: ClientFormFieldsProps) {
  const getAvailableTypes = () => {
    switch (role) {
      case "listing-agent":
        return [{ value: "seller", label: "Seller" }];
      case "buyers-agent":
        return [{ value: "buyer", label: "Buyer" }];
      case "dual-agent":
        return [
          { value: "buyer", label: "Buyer" },
          { value: "seller", label: "Seller" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`${client.id}-name`}>Name</Label>
        <Input
          id={`${client.id}-name`}
          value={client.name}
          onChange={(e) => onClientChange(client.id, "name", e.target.value)}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor={`${client.id}-email`}>Email</Label>
        <Input
          id={`${client.id}-email`}
          type="email"
          value={client.email}
          onChange={(e) => onClientChange(client.id, "email", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${client.id}-phone`}>Phone</Label>
        <Input
          id={`${client.id}-phone`}
          type="tel"
          value={client.phone}
          onChange={(e) => onClientChange(client.id, "phone", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${client.id}-address`}>Address</Label>
        <Input
          id={`${client.id}-address`}
          value={client.address}
          onChange={(e) => onClientChange(client.id, "address", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label>Marital Status</Label>
        <Select
          value={client.maritalStatus}
          onValueChange={(value) => onClientChange(client.id, "maritalStatus", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select marital status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="married">Married</SelectItem>
            <SelectItem value="divorced">Divorced</SelectItem>
            <SelectItem value="widowed">Widowed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Client Type</Label>
        <RadioGroup
          value={client.type}
          onValueChange={(value) => onClientChange(client.id, "type", value)}
        >
          {getAvailableTypes().map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <RadioGroupItem value={type.value} id={`${client.id}-${type.value}`} />
              <Label htmlFor={`${client.id}-${type.value}`}>{type.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
