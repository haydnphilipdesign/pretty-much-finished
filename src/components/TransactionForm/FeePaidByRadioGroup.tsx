import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FeePaidByRadioGroupProps {
  value: string;
  onChange: (value: string) => void;
}

export function FeePaidByRadioGroup({ value, onChange }: FeePaidByRadioGroupProps) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-800">Transaction Coordinator Fee Paid By <span className="text-red-500">*</span></Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="client" 
            id="coordinatorFeeClient" 
            className="h-5 w-5 border-2 border-slate-300 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" 
          />
          <Label htmlFor="coordinatorFeeClient" className="text-slate-800">Client</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="agent" 
            id="coordinatorFeeAgent" 
            className="h-5 w-5 border-2 border-slate-300 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" 
          />
          <Label htmlFor="coordinatorFeeAgent" className="text-slate-800">Agent</Label>
        </div>
      </RadioGroup>
    </div>
  );
}