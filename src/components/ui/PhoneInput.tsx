import React, { useState, useCallback } from 'react';
import { Input } from './input';
import { Label } from './label';
import { ChangeEvent, useEffect } from "react";
import { cn } from "../../lib/utils";
import { Info } from "lucide-react";

interface PhoneInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
  onValidationChange?: (isValid: boolean) => void;
}

// Regex for valid North American phone numbers
const PHONE_REGEX = /^\(\d{3}\) \d{3}-\d{4}(?:\s*(?:ext|x|ext.)\s*\d{1,5})?$/i;

const formatPhoneNumber = (value: string): string => {
  // Extract extension if present
  const extensionMatch = value.match(/(?:ext|x|ext.)\s*(\d+)$/i);
  const extension = extensionMatch ? extensionMatch[0] : '';
  
  // Clean the main number part
  const cleaned = value.replace(/\D/g, '').slice(0, 10);
  
  // Format the main number
  let formatted = '';
  if (cleaned.length === 0) return '';
  if (cleaned.length <= 3) formatted = `(${cleaned}`;
  else if (cleaned.length <= 6) formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  else formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  
  // Add back the extension if present
  return extension ? `${formatted} ${extension}` : formatted;
};

const validatePhoneNumber = (phone: string): boolean => {
  if (!phone) return false;
  return PHONE_REGEX.test(phone);
};

export function PhoneInput({ id, value, onChange, label, required, error, placeholder = "(215) 555-0123", className = "", onValidationChange }: PhoneInputProps) {
  const [isValid, setIsValid] = useState(true);
  const [isTouched, setIsTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const validateAndUpdateState = (phone: string) => {
    if (!phone && !required) {
      setErrorMessage("");
      setIsValid(true);
      onValidationChange?.(true);
      return;
    }

    if (!phone && required) {
      setErrorMessage("Phone number is required");
      setIsValid(false);
      onValidationChange?.(false);
      return;
    }

    const valid = validatePhoneNumber(phone);
    setIsValid(valid);
    onValidationChange?.(valid);
    setErrorMessage(valid ? "" : "Please enter a valid phone number");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
    setIsTouched(true);
    validateAndUpdateState(formatted);
  };

  const handleBlur = () => {
    setIsTouched(true);
    validateAndUpdateState(value);
  };

  // Validate initial value
  useEffect(() => {
    if (value) {
      validateAndUpdateState(value);
    }
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-800">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn(
          className,
          !isValid && isTouched && "border-red-500 focus:ring-red-500",
          isValid && value && "border-green-500 focus:ring-green-500"
        )}
        required={required}
        maxLength={20} // Increased to accommodate extensions
        aria-invalid={!isValid}
        aria-describedby={errorMessage ? "phone-error" : undefined}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      
      {/* Error message */}
      {!isValid && isTouched && errorMessage && (
        <div className="flex items-center gap-1 mt-1 text-sm text-red-500" id="phone-error">
          <Info className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
