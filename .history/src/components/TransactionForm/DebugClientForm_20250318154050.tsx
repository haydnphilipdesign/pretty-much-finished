import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/transaction";
import { Select } from "@/components/ui/select";

interface DebugClientFormProps {
  client: Client;
  onChange: (field: string, value: string | boolean) => void;
  onRemove?: () => void;
  index: number;
}

export function DebugClientForm({ client, onChange, onRemove, index }: DebugClientFormProps) {
  return (
    <Card className="p-6 bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Client #{index + 1}</h3>
        {onRemove && (
          <Button variant="outline" onClick={onRemove} className="text-red-500">
            Remove
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`client-${client.id}-name`}>Full Name <span className="text-red-500">*</span></Label>
            <Input 
              id={`client-${client.id}-name`}
              value={client.name}
              onChange={(e) => onChange("name", e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor={`client-${client.id}-email`}>Email <span className="text-red-500">*</span></Label>
            <Input 
              id={`client-${client.id}-email`}
              value={client.email}
              onChange={(e) => onChange("email", e.target.value)}
              type="email"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor={`client-${client.id}-phone`}>Phone <span className="text-red-500">*</span></Label>
          <Input 
            id={`client-${client.id}-phone`}
            value={client.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor={`client-${client.id}-streetAddress`}>Street Address <span className="text-red-500">*</span></Label>
            <Input 
              id={`client-${client.id}-streetAddress`}
              value={client.streetAddress || ''}
              onChange={(e) => onChange("streetAddress", e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`client-${client.id}-city`}>City <span className="text-red-500">*</span></Label>
              <Input 
                id={`client-${client.id}-city`}
                value={client.city || ''}
                onChange={(e) => onChange("city", e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor={`client-${client.id}-state`}>State <span className="text-red-500">*</span></Label>
              <Input 
                id={`client-${client.id}-state`}
                value={client.state || 'PA'}
                onChange={(e) => onChange("state", e.target.value.toUpperCase().slice(0, 2))}
                maxLength={2}
                required
              />
            </div>
            
            <div>
              <Label htmlFor={`client-${client.id}-zipCode`}>Zip Code <span className="text-red-500">*</span></Label>
              <Input 
                id={`client-${client.id}-zipCode`}
                value={client.zipCode || ''}
                onChange={(e) => onChange("zipCode", e.target.value.slice(0, 5))}
                maxLength={5}
                pattern="[0-9]{5}"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`client-${client.id}-maritalStatus`}>Marital Status <span className="text-red-500">*</span></Label>
            <select
              id={`client-${client.id}-maritalStatus`}
              value={client.maritalStatus}
              onChange={(e) => onChange("maritalStatus", e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Status</option>
              <option value="SINGLE">Single</option>
              <option value="MARRIED">Married</option>
              <option value="DIVORCED">Divorced</option>
              <option value="DIVORCE IN PROGRESS">Divorce In Progress</option>
              <option value="WIDOWED">Widowed</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor={`client-${client.id}-type`}>Client Type <span className="text-red-500">*</span></Label>
            <select
              id={`client-${client.id}-type`}
              value={client.type}
              onChange={(e) => onChange("type", e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Type</option>
              <option value="BUYER">Buyer</option>
              <option value="SELLER">Seller</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  );
} 