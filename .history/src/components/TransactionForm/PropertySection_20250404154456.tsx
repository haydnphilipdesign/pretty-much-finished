import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";
import { AddressInput } from "@/components/ui/AddressInput";
import type { PropertyData } from '@/types/transaction';

interface PropertySectionProps {
  data: PropertyData;
  onChange: (field: keyof PropertyData, value: any) => void;
}

export function PropertySection({ data, onChange }: PropertySectionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Property Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <AddressInput
                  value={data.address}
                  onChange={(value: string) => onChange('address', value)}
                  label="Street Address"
                  required
                  placeholder="123 Main St, Philadelphia, PA 19103"
                  error={errors.address}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Property Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mlsNumber" className="text-slate-800">
                  MLS Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mlsNumber"
                  value={data.mlsNumber}
                  onChange={(e) => onChange("mlsNumber", e.target.value)}
                  placeholder="PM-123456"
                  className="bg-white/80 border-slate-300 text-slate-800"
                  required
                />
                {errors.mlsNumber && <p className="text-sm text-red-500 mt-1">{errors.mlsNumber}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salePrice" className="text-slate-800">
                  Sale Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="salePrice"
                  value={data.salePrice}
                  onChange={(e) => onChange("salePrice", e.target.value)}
                  placeholder="450000"
                  className="bg-white/80 border-slate-300 text-slate-800"
                  required
                />
                {errors.salePrice && <p className="text-sm text-red-500 mt-1">{errors.salePrice}</p>}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 