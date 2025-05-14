import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyData } from "@/types/transaction";

interface DebugPropertyFormProps {
  data: PropertyData;
  onChange: (field: string, value: string | boolean) => void;
  onSubmit: () => void;
}

export function DebugPropertyForm({ data, onChange, onSubmit }: DebugPropertyFormProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <h2 className="text-xl font-bold mb-4">Debug Property Form</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="mlsNumber">MLS Number</Label>
            <Input 
              id="mlsNumber"
              value={data.mlsNumber || ""}
              onChange={(e) => onChange("mlsNumber", e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="debug-streetAddress">Street Address</Label>
            <Input 
              id="debug-streetAddress"
              value={data.streetAddress || ""}
              onChange={(e) => onChange("streetAddress", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="debug-city">City</Label>
              <Input 
                id="debug-city"
                value={data.city || ""}
                onChange={(e) => onChange("city", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="debug-state">State</Label>
              <Input 
                id="debug-state"
                value={data.state || ""}
                onChange={(e) => onChange("state", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="debug-zipCode">Zip Code</Label>
              <Input 
                id="debug-zipCode"
                value={data.zipCode || ""}
                onChange={(e) => onChange("zipCode", e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={() => console.log("Current property data:", data)}>
            Log Current Data
          </Button>
        </div>
      </Card>
    </div>
  );
} 