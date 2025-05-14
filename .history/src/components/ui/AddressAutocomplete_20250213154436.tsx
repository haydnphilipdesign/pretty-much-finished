import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "./input";
import { cn } from "../../lib/utils";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onDetailsReceived?: (details: any) => void;
  placeholder?: string;
  className?: string;
  includeDetails?: boolean;
}

export const AddressAutocomplete = ({
  value,
  onChange,
  onDetailsReceived,
  placeholder = "Enter address",
  className = "",
  includeDetails = false
}: AddressInputProps) => {
  const [localValue, setLocalValue] = useState(value);

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    // Always update parent with raw input value
    onChange(newValue);
  };

  const handleBlur = () => {
    // Ensure the final value is committed
    if (localValue !== value) {
      onChange(localValue);
    }
    
    // Log the final value for debugging
    console.log('Address final value:', localValue);
  };

  return (
    <div className="w-full relative">
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn("w-full", className)}
      />
    </div>
  );
}; 