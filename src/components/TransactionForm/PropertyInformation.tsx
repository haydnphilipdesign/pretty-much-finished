import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, HomeIcon, DollarSign, Calendar, MapPin } from "lucide-react";
import type { PropertyData } from '@/types/transaction';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      // Only allow dates within a reasonable range (current date to 90 days in the future)
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of day
      
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 90); // Set to 90 days from now
      
      if (selectedDate <= maxDate) {
        onChange('closingDate', value);
      }
    }
  }
  
  function isValidClosingDate(dateStr: string): boolean {
    if (!dateStr) return false;
    
    const selectedDate = new Date(dateStr);
    if (isNaN(selectedDate.getTime())) return false;
    
    // Check if date is within reasonable range (up to 90 days in the future)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    
    return selectedDate <= maxDate;
  }

  // Calculate min and max dates for the date input
  const today = new Date().toISOString().split('T')[0]; // today in YYYY-MM-DD format
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
        {/* Left column */}
        <div className="space-y-6">
          {/* MLS Number */}
          <div className="space-y-2">
            <Label htmlFor="mlsNumber" className="flex items-center text-gray-800">
              <Building className="h-4 w-4 mr-2 text-blue-600" />
              MLS Number {isListingOrDual && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id="mlsNumber"
              value={data.mlsNumber}
              onChange={(e) => handleMlsNumberChange(e.target.value)}
              placeholder="Enter MLS number (e.g. PM-123456)"
              required={isListingOrDual}
              className={`bg-white border-gray-300 placeholder:text-gray-400 ${
                data.mlsNumber && !validateMlsNumber(data.mlsNumber) ? "border-red-500" : ""
              }`}
              aria-invalid={isListingOrDual && !validateMlsNumber(data.mlsNumber) ? "true" : "false"}
            />
            {isListingOrDual && !data.mlsNumber && (
              <p className="text-xs text-red-500 mt-1">MLS Number is required</p>
            )}
            {data.mlsNumber && !validateMlsNumber(data.mlsNumber) && (
              <p className="text-xs text-red-500 mt-1">
                MLS Number must be a 6-digit number or "PM-" followed by a 6-digit number
              </p>
            )}
          </div>
          
          {/* Property Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center text-gray-800">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
              Property Address <span className="text-red-500 ml-1">*</span>
            </Label>
            <AddressInput 
              value={data.address} 
              onChange={(value: string) => onChange('address', value)}
              required={true}
              placeholder="Enter full property address"
              error={!data.address ? "Property Address is required" : ""}
            />
          </div>
          
          {/* Property Type */}
          <div className="space-y-2">
            <Label htmlFor="propertyType" className="flex items-center text-gray-800">
              <HomeIcon className="h-4 w-4 mr-2 text-blue-600" />
              Property Type <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={data.propertyType}
              onValueChange={(value: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND') => {
                onChange('propertyType', value);
              }}
            >
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Select property type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                <SelectItem value="LAND">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* County */}
          <div className="space-y-2">
            <Label htmlFor="county" className="flex items-center text-gray-800">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
              County <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input 
              id="county" 
              placeholder="Enter county" 
              value={data.county} 
              onChange={e => onChange('county', e.target.value)} 
              required
              className={`bg-white border-gray-300 placeholder:text-gray-400 ${
                !data.county ? "border-red-500" : ""
              }`}
              aria-invalid={!data.county ? "true" : "false"}
            />
            {!data.county && (
              <p className="text-xs text-red-500 mt-1">County is required</p>
            )}
          </div>
          
          {/* Sale Price */}
          <div className="space-y-2">
            <Label htmlFor="salePrice" className="flex items-center text-gray-800">
              <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
              Sale Price <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input 
              id="salePrice" 
              placeholder="Enter sale price" 
              value={data.salePrice} 
              onChange={e => handleSalePriceChange(e.target.value)} 
              type="text"
              className="bg-white border-gray-300 placeholder:text-gray-400"
              aria-invalid={!data.salePrice ? "true" : "false"}
            />
            {!data.salePrice && (
              <p className="text-xs text-red-500 mt-1">Sale Price is required</p>
            )}
          </div>
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          {/* Closing Date */}
          <div className="space-y-2">
            <Label htmlFor="closingDate" className="flex items-center text-gray-800">
              <Calendar className="h-4 w-4 mr-2 text-blue-600" />
              Closing Date <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input 
              id="closingDate" 
              type="date"
              value={data.closingDate} 
              onChange={e => handleClosingDateChange(e.target.value)} 
              min={today}
              max={maxDateStr}
              required
              className={`bg-white border-gray-300 placeholder:text-gray-400 ${
                !data.closingDate || !isValidClosingDate(data.closingDate) ? "border-red-500" : ""
              }`}
              aria-invalid={!data.closingDate || !isValidClosingDate(data.closingDate) ? "true" : "false"}
            />
            {!data.closingDate && (
              <p className="text-xs text-red-500 mt-1">Closing date is required</p>
            )}
            {data.closingDate && !isValidClosingDate(data.closingDate) && (
              <p className="text-xs text-red-500 mt-1">
                Please select a valid closing date (up to 90 days in the future)
              </p>
            )}
            <p className="text-xs text-gray-500">
              Select a date between today and {new Date(maxDateStr).toLocaleDateString()}
            </p>
          </div>
          
          {/* Property Status - Only for Residential property type */}
          {isResidential && (
            <div className="space-y-2">
              <Label className="flex items-center text-gray-800">
                <HomeIcon className="h-4 w-4 mr-2 text-blue-600" />
                Property Status <span className="text-red-500 ml-1">*</span>
              </Label>
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
                  <SelectValue placeholder="Select property status..." />
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
              <Label htmlFor="isWinterized" className="flex items-center text-gray-800">
                <HomeIcon className="h-4 w-4 mr-2 text-blue-600" />
                Property is Winterized
              </Label>
              <Select
                value={data.isWinterized}
                onValueChange={(value: 'YES' | 'NO') => onChange('isWinterized', value)}
              >
                <SelectTrigger id="isWinterized">
                  <SelectValue placeholder="Select yes/no..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">Yes</SelectItem>
                  <SelectItem value="NO">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Update MLS Status - Only required for Listing Agent and Dual Agent */}
          {isListingOrDual && (
            <div className="space-y-2">
              <Label htmlFor="updateMls" className="flex items-center text-gray-800">
                <Building className="h-4 w-4 mr-2 text-blue-600" />
                Update MLS Status
              </Label>
              <Select
                value={data.updateMls}
                onValueChange={(value: 'YES' | 'NO') => onChange('updateMls', value)}
              >
                <SelectTrigger id="updateMls">
                  <SelectValue placeholder="Select yes/no..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">Yes</SelectItem>
                  <SelectItem value="NO">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Built Before 1978 - Only for Residential */}
          {isResidential && (
            <div className="space-y-2">
              <Label htmlFor="builtBefore1978" className="flex items-center text-gray-800">
                <HomeIcon className="h-4 w-4 mr-2 text-blue-600" />
                Built Before 1978
              </Label>
              <Select
                value={data.isBuiltBefore1978}
                onValueChange={(value) => onChange('isBuiltBefore1978', value)}
              >
                <SelectTrigger id="builtBefore1978">
                  <SelectValue placeholder="Select yes/no..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">Yes</SelectItem>
                  <SelectItem value="NO">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Property Access Type - Required only for Listing & Dual Agents when property is residential */}
          {isResidential && isListingOrDual && (
            <div className="space-y-2">
              <Label htmlFor="propertyAccessType" className="flex items-center text-gray-800">
                <HomeIcon className="h-4 w-4 mr-2 text-blue-600" />
                Property Access Type <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={data.propertyAccessType}
                onValueChange={(value) => onChange('propertyAccessType', value)}
              >
                <SelectTrigger id="propertyAccessType">
                  <SelectValue placeholder="Select access type..." />
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

          {/* Lockbox Access Code - Show when property access type is not APPOINTMENT ONLY and only for Listing & Dual Agents */}
          {isResidential && isListingOrDual && data.propertyAccessType && data.propertyAccessType !== "APPOINTMENT ONLY" && (
            <div className="space-y-2">
              <Label htmlFor="lockboxAccessCode" className="flex items-center text-gray-800 text-base">
                <HomeIcon className="h-4 w-4 mr-2 text-blue-600" />
                Access Code
              </Label>
              <Input 
                id="lockboxAccessCode" 
                placeholder="Enter access code" 
                value={data.lockboxAccessCode} 
                onChange={e => onChange('lockboxAccessCode', e.target.value)}
                className="bg-white border-gray-300 placeholder:text-gray-400 text-base w-full"
              />
              <p className="text-xs text-gray-500">
                Provide the lockbox code, keypad code, or other access information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};