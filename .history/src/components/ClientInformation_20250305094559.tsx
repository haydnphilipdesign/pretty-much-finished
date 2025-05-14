
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { ClientCard } from "./client/ClientCard";

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
  const clientType = role === "listing-agent" ? "Seller" : role === "buyers-agent" ? "Buyer" : "Client";

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">{clientType} Information</h2>
        <Button onClick={onAddClient} variant="outline">
          Add {clientType}
        </Button>
      </div>

      {clients.map((client, index) => (
        <Card key={client.id} className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{clientType} {index + 1}</h3>
            {clients.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveClient(client.id)}
              >
                Remove
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor={`name-${client.id}`}>Name</Label>
              <Input
                id={`name-${client.id}`}
                value={client.name}
                onChange={(e) => onClientChange(client.id, "name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`email-${client.id}`}>Email</Label>
              <Input
                id={`email-${client.id}`}
                type="email"
                value={client.email}
                onChange={(e) => onClientChange(client.id, "email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`phone-${client.id}`}>Phone</Label>
              <Input
                id={`phone-${client.id}`}
                value={client.phone}
                onChange={(e) => onClientChange(client.id, "phone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`address-${client.id}`}>Address</Label>
              <Input
                id={`address-${client.id}`}
                value={client.address}
                onChange={(e) => onClientChange(client.id, "address", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`maritalStatus-${client.id}`}>Marital Status</Label>
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
          </div>
        </Card>
      ))}
    </div>
  );
}
