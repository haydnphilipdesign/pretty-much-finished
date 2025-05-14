import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyData } from '@/types/transaction';

interface PropertyAccessSectionProps {
  data: PropertyData;
  onChange: (field: keyof PropertyData, value: any) => void;
  isVisible: boolean;
}

export const PropertyAccessSection: React.FC<PropertyAccessSectionProps> = ({
  data,
  onChange,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyAccessType">Property Access Type*</Label>
          <Select
            value={data.propertyAccessType}
            onValueChange={(value) => onChange('propertyAccessType', value)}
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

        {data.propertyAccessType !== 'APPOINTMENT ONLY' && (
          <div className="space-y-2">
            <Label htmlFor="lockboxAccessCode">Access Code*</Label>
            <Input
              id="lockboxAccessCode"
              value={data.lockboxAccessCode}
              onChange={(e) => onChange('lockboxAccessCode', e.target.value)}
              placeholder="Enter access code"
            />
          </div>
        )}
      </div>
    </div>
  );
}; 