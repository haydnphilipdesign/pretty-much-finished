import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, MapPin } from 'lucide-react';

interface AddressInputProps {
  value: string;
  onChange: (address: string) => void;
  label?: string;
  required?: boolean;
  error?: string | string[] | null;
  placeholder?: string;
  id?: string;
}

export function AddressInput({
  value,
  onChange,
  label,
  required = false,
  error,
  placeholder = "Enter address",
  id,
}: AddressInputProps) {
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const validationError = Array.isArray(error) ? error[0] : error;

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-slate-800">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 pl-8 ${error ? 'border-red-500' : ''}`}
          aria-invalid={!!error}
          id={id}
        />
        <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
      </div>
      
      {validationError && (
        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
      
      <p className="text-xs text-slate-500">
        Format: 123 Main St, Philadelphia, PA 12345
      </p>
    </div>
  );
} 