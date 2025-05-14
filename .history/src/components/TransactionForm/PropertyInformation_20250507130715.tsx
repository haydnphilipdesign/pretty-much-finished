import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Building } from "lucide-react";
import type { PropertyData } from '@/types/transaction';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AddressInput } from "@/components/ui/AddressInput";

interface PropertyInformationProps {
  data: PropertyData;
  onChange: (field: keyof PropertyData, value: any) => void;
  role: 'LISTING AGENT' | 'BUYERS AGENT' | 'DUAL AGENT';
}

export const PropertyInformation: React.FC<PropertyInformationProps> = ({
  data,
  onChange,
  role
}) => {
  const isListingOrDual = role === 'LISTING AGENT' || role === 'DUAL AGENT';
  const isResidential = data.propertyType === 'RESIDENTIAL';
  const isVacant = data.status === 'VACANT';
  
  // Debug log to check role and conditional values
  useEffect(() => {
    console.log('Property Information Component:', { 
      role, 
      isListingOrDual,
      propertyType: data.propertyType,
      isResidential,
      status: data.status,
      isVacant
    });
  }, [role, data.propertyType, data.status]);
  
  function handleMlsNumberChange(value: string): void {
    // Allow typing partial MLS numbers during input, including partial typing of PM- prefix
    if (value === '' || 
        /^P(M)?(-)?$/.test(value) || // Allow typing P, PM, PM-
        /^PM-[0-9]{0,6}$/.test(value) || // Allow PM- followed by up to 6 digits
        /^[0-9]{0,6}$/.test(value)) { // Allow up to 6 digits without prefix
      onChange('mlsNumber', value);
    }
  }

  function validateMlsNumber(mls: string): boolean {
    // This matches the validation in utils/validation.ts
    return /^(PM-)?[0-9]{6}$/.test(mls);
  }

  function handleSalePriceChange(value: string): void {
    // Allow emptying the field and valid numeric values
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      onChange('salePrice', value);
    }
  }

  function handleClosingDateChange(value: string): void {
    // Always allow empty input for UX
    if (value === '') {
      onChange('closingDate', value);
      return;
    }

    // Check if it's a valid date before applying
    const selectedDate = new Date(value);
    if (!isNaN(selectedDate.getTime())) {
      // Only allow dates within a reasonable range (current date to 10 years in the future)
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of day
      
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 10); // Set to 10 years from now
      
      if (selectedDate <= maxDate) {
        onChange('closingDate', value);
      }
    }
  }
  
  function isValidClosingDate(dateStr: string): boolean {
    if (!dateStr) return false;
    
    const selectedDate = new Date(dateStr);
    if (isNaN(selectedDate.getTime())) return false;
    
    // Check if date is within reasonable range (up to 10 years in the future)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 10);
    
    return selectedDate <= maxDate;
  }

  // Calculate min and max dates for the date input
  const today = new Date().toISOString().split('T')[0]; // today in YYYY-MM-DD format
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 10);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Property Information</h2>
        <p className="text-white/70">Enter the property details for this transaction</p>
      </div>

      <Card className="p-6 backdrop-blur-lg bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-6">
          <div className="flex items-start gap-2 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
          </div>

          <div className="space-y-4">
            {/* MLS Number - Always shown and required for Listing Agent and Dual Agent */}
            <div className="space-y-2">
              <Label htmlFor="mlsNumber" className="text-slate-800">
                MLS Number {isListingOrDual && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="mlsNumber"
                value={data.mlsNumber}
                onChange={(e) => handleMlsNumberChange(e.target.value)}
                placeholder="Enter MLS number (e.g. PM-123456)"
                required={isListingOrDual}
                className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 ${
                  data.mlsNumber && !validateMlsNumber(data.mlsNumber) ? "border-red-500" : ""
                }`}
                aria-invalid={isListingOrDual && !validateMlsNumber(data.mlsNumber) ? "true" : "false"}
              />
              {isListingOrDual && !data.mlsNumber && (
                <p className="text-sm text-red-500 mt-1">MLS Number is required for Listing and Dual Agents</p>
              )}
              {data.mlsNumber && !validateMlsNumber(data.mlsNumber) && (
                <p className="text-sm text-red-500 mt-1">
                  MLS Number must be either a 6-digit number or "PM-" followed by a 6-digit number
                </p>
              )}
            </div>
            
            {/* Property Address - Required for all roles */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-slate-800">Property Address <span className="text-red-500">*</span></Label>
              <AddressInput 
                value={data.address} 
                onChange={(value: string) => onChange('address', value)}
                required={true}
                placeholder="Enter full property address"
                error={!data.address ? "Property Address is required" : ""}
              />
            </div>
            
            {/* Sale Price - Required for all roles */}
            <div className="space-y-2">
              <Label htmlFor="salePrice" className="text-slate-800">Sale Price ($) <span className="text-red-500">*</span></Label>
              <Input 
                id="salePrice" 
                placeholder="Enter sale price" 
                value={data.salePrice} 
                onChange={e => handleSalePriceChange(e.target.value)} 
                type="text"
                className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
                aria-invalid={!data.salePrice ? "true" : "false"}
              />
              {!data.salePrice && (
                <p className="text-sm text-red-500 mt-1">Sale Price is required</p>
              )}
            </div>

            {/* Property Type - Should come before Property Status */}
            <div className="space-y-2">
              <Label htmlFor="propertyType" className="text-slate-800">Property Type <span className="text-red-500">*</span></Label>
              <Select
                value={data.propertyType}
                onValueChange={(value: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND') => {
                  onChange('propertyType', value);
                }}
              >
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Select one..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                  <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                  <SelectItem value="LAND">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Property Status - Only for Residential property type */}
            {isResidential && (
              <div className="space-y-2">
                <Label className="text-slate-800">Property Status <span className="text-red-500">*</span></Label>
                <Select
                  value={data.status}
                  onValueChange={(value: 'OCCUPIED' | 'VACANT') => {
                    onChange('status', value);
                    // Reset winterized status when changing from VACANT
                    if (value !== 'VACANT') {
                      onChange('isWinterized', "NO");
                    }
                  }}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select one..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OCCUPIED">Occupied</SelectItem>
                    <SelectItem value="VACANT">Vacant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Winterized Status - Show when status is VACANT for Listing/Dual agents */}
            {isVacant && isListingOrDual && (
              <div className="space-y-2">
                <Label htmlFor="isWinterized" className="text-slate-800">Property is Winterized</Label>
                <Select
                  value={data.isWinterized}
                  onValueChange={(value: 'YES' | 'NO') => onChange('isWinterized', value)}
                >
                  <SelectTrigger id="isWinterized">
                    <SelectValue placeholder="Select one..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YES">YES</SelectItem>
                    <SelectItem value="NO">NO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* County */}
            <div className="space-y-2">
              <Label htmlFor="county" className="text-slate-800">County <span className="text-red-500">*</span></Label>
              <Input 
                id="county" 
                placeholder="Enter county" 
                value={data.county} 
                onChange={e => onChange('county', e.target.value)} 
                required
                className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 ${
                  !data.county ? "border-red-500" : ""
                }`}
                aria-invalid={!data.county ? "true" : "false"}
              />
              {!data.county && (
                <p className="text-sm text-red-500 mt-1">County is required</p>
              )}
            </div>

            {/* Update MLS Status - Only required for Listing Agent and Dual Agent */}
            {isListingOrDual && (
              <div className="space-y-2">
                <Label htmlFor="updateMls" className="text-slate-800">Update MLS Status</Label>
                <Select
                  value={data.updateMls}
                  onValueChange={(value: 'YES' | 'NO') => onChange('updateMls', value)}
                >
                  <SelectTrigger id="updateMls">
                    <SelectValue placeholder="Select one..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YES">YES</SelectItem>
                    <SelectItem value="NO">NO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Built Before 1978 - Only for Residential */}
            {isResidential && (
              <div className="flex flex-col space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="builtBefore1978">Built Before 1978</Label>
                </div>
                <div data-field-id="fldZmPfpsSJLOtcYr">
                  <Select
                    value={data.isBuiltBefore1978}
                    onValueChange={(value) => onChange('isBuiltBefore1978', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select one..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YES">YES</SelectItem>
                      <SelectItem value="NO">NO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Property Access Type - Required for all roles when property is residential */}
            {isResidential && (
              <div className="space-y-2">
                <Label htmlFor="propertyAccessType" className="text-slate-800">Property Access Type <span className="text-red-500">*</span></Label>
                <Select
                  value={data.propertyAccessType}
                  onValueChange={(value) => onChange('propertyAccessType', value)}
                  data-field-id="fld7TTQpaC83ehY7H"
                >
                  <SelectTrigger id="propertyAccessType">
                    <SelectValue placeholder="Select one..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ELECTRONIC LOCKBOX">Electronic Lockbox</SelectItem>
                    <SelectItem value="COMBO LOCKBOX">Combo Lockbox</SelectItem>
                    <SelectItem value="KEYPAD">Keypad</SelectItem>
                    <SelectItem value="APPOINTMENT ONLY">Appointment Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Lockbox Access Code - Show when property access type is not APPOINTMENT ONLY */}
            {isResidential && data.propertyAccessType && data.propertyAccessType !== "APPOINTMENT ONLY" && (
              <div className="space-y-2">
                <Label htmlFor="lockboxAccessCode" className="text-slate-800">Access Code</Label>
                <Input 
                  id="lockboxAccessCode" 
                  placeholder="Enter access code" 
                  value={data.lockboxAccessCode} 
                  onChange={e => onChange('lockboxAccessCode', e.target.value)}
                  className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
                  data-field-id="fldrh8eB5V8TjSZlR"
                />
                <p className="text-xs text-slate-500">
                  Provide the lockbox code, keypad code, or other access information.
                </p>
              </div>
            )}

            {/* Closing Date */}
            <div className="space-y-2">
              <Label htmlFor="closingDate" className="text-slate-800">Closing Date <span className="text-red-500">*</span></Label>
              <Input 
                id="closingDate" 
                type="date"
                value={data.closingDate} 
                onChange={e => handleClosingDateChange(e.target.value)} 
                min={today}
                max={maxDateStr}
                required
                className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 ${
                  !data.closingDate || !isValidClosingDate(data.closingDate) ? "border-red-500" : ""
                }`}
                aria-invalid={!data.closingDate || !isValidClosingDate(data.closingDate) ? "true" : "false"}
              />
              {!data.closingDate && (
                <p className="text-sm text-red-500 mt-1">Closing date is required</p>
              )}
              {data.closingDate && !isValidClosingDate(data.closingDate) && (
                <p className="text-sm text-red-500 mt-1">
                  Please select a valid closing date (up to 10 years in the future)
                </p>
              )}
              <p className="text-xs text-slate-500">
                Select a date between today and {new Date(maxDateStr).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};