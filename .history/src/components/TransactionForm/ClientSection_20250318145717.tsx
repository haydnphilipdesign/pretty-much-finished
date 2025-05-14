export function ClientItem({ client, onChange, onRemove, index, clientCount }: ClientItemProps) {
  // ... existing code
  
  return (
    <div className="space-y-4 p-4 border rounded-md border-slate-200">
      {/* ... existing fields */}
      
      <div className="space-y-4">
        <h4 className="text-md font-medium text-slate-800">Address</h4>
        
        <div className="space-y-2">
          <Label htmlFor={`client-${client.id}-streetAddress`} className="text-slate-800">
            Street Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`client-${client.id}-streetAddress`}
            value={client.streetAddress}
            onChange={(e) => handleChange("streetAddress", e.target.value)}
            placeholder="123 Main St"
            className="bg-white/80 border-slate-300 text-slate-800"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`client-${client.id}-city`} className="text-slate-800">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`client-${client.id}-city`}
              value={client.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Philadelphia"
              className="bg-white/80 border-slate-300 text-slate-800"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`client-${client.id}-state`} className="text-slate-800">
              State <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`client-${client.id}-state`}
              value={client.state}
              onChange={(e) => handleChange("state", e.target.value.toUpperCase().slice(0, 2))}
              placeholder="PA"
              className="bg-white/80 border-slate-300 text-slate-800 uppercase"
              maxLength={2}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`client-${client.id}-zipCode`} className="text-slate-800">
            Zip Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`client-${client.id}-zipCode`}
            value={client.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value.slice(0, 5))}
            placeholder="19103"
            className="bg-white/80 border-slate-300 text-slate-800"
            maxLength={5}
            pattern="[0-9]{5}"
          />
        </div>
      </div>
      
      {/* ... rest of the component */}
    </div>
  );
} 