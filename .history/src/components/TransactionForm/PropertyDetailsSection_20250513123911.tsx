import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { PropertyDetailsData, TitleCompanyData } from "@/types/transaction";
import { Building, FileSpreadsheet, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { AgentRole } from "@/types/transaction";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PropertyDetailsSectionProps {
  data: PropertyDetailsData;
  onChange: (field: keyof PropertyDetailsData, value: any) => void;
  role: AgentRole;
  titleData?: TitleCompanyData;
  onTitleChange?: (field: string, value: any) => void;
}

export const PropertyDetailsSection: React.FC<PropertyDetailsSectionProps> = ({
  data,
  onChange,
  role,
  titleData,
  onTitleChange
}) => {
  // isListingOrDual is kept for home warranty section but not used for resale certificate
  const isListingOrDual = role === 'LISTING AGENT' || role === 'DUAL AGENT';
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "warrantyCost":
        if (value === '') return '';
        const cost = parseFloat(value);
        return !isNaN(cost) && cost >= 0 ? "" : "Invalid cost amount";
      default:
        return value.trim() ? "" : "This field is required";
    }
  };

  const handleWarrantyChange = (field: keyof PropertyDetailsData, value: string | boolean) => {
    if (typeof value === 'string') {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
    onChange(field, value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Applicables</h2>
        <p className="text-white/70">
          Enter supplementary property information and title company details
        </p>
      </div>

      <Card className="p-6 backdrop-blur-lg bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-6">
          <div className="flex items-start gap-2 mb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            {isListingOrDual && (
              <>
                <div className="flex items-center justify-between">
                  <Label htmlFor="resaleCertRequired" className="text-slate-800">Resale Certificate Required</Label>
                  <Switch
                    id="resaleCertRequired"
                    checked={data?.resaleCertRequired}
                    onCheckedChange={(checked) => onChange?.("resaleCertRequired", checked)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>

                {data?.resaleCertRequired && (
                  <div className="space-y-2 pl-6">
                    <Label htmlFor="hoaName" className="text-slate-800">HOA Name</Label>
                    <Input
                      id="hoaName"
                      value={data?.hoaName}
                      onChange={(e) => onChange?.("hoaName", e.target.value)}
                      placeholder="Enter HOA name"
                      className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="coRequired" className="text-slate-800">CO Required</Label>
              <Switch
                id="coRequired"
                checked={data?.coRequired}
                onCheckedChange={(checked) => onChange?.("coRequired", checked)}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            {data?.coRequired && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="municipality" className="text-slate-800">Municipality</Label>
                <Input
                  id="municipality"
                  value={data?.municipality}
                  onChange={(e) => onChange?.("municipality", e.target.value)}
                  placeholder="Enter municipality"
                  className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="firstRightOfRefusal" className="text-slate-800">First Right of Refusal</Label>
              <Switch
                id="firstRightOfRefusal"
                checked={data?.firstRightOfRefusal}
                onCheckedChange={(checked) => onChange?.("firstRightOfRefusal", checked)}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            {data?.firstRightOfRefusal && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="firstRightName" className="text-slate-800">First Right Name</Label>
                <Input
                  id="firstRightName"
                  value={data?.firstRightName}
                  onChange={(e) => onChange?.("firstRightName", e.target.value)}
                  placeholder="Enter first right name"
                  className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="attorneyRepresentation" className="text-slate-800">Attorney Representation</Label>
              <Switch
                id="attorneyRepresentation"
                checked={data?.attorneyRepresentation}
                onCheckedChange={(checked) => onChange?.("attorneyRepresentation", checked)}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            {data?.attorneyRepresentation && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="attorneyName" className="text-slate-800">Attorney Name</Label>
                <Input
                  id="attorneyName"
                  value={data?.attorneyName}
                  onChange={(e) => onChange?.("attorneyName", e.target.value)}
                  placeholder="Enter attorney name"
                  className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
                />
              </div>
            )}
            
            {/* Title Company Information */}
            <Separator className="my-4 bg-slate-200" />
            
            <div className="flex items-start gap-2 mb-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="titleCompany" className="text-slate-800">Title Company Name</Label>
              <Input
                id="titleCompany"
                value={titleData?.titleCompany}
                onChange={(e) => onTitleChange?.("titleCompany", e.target.value)}
                placeholder="Enter title company name"
                className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>
            
            {/* Home Warranty - Only Shown if role is Listing Agent or Dual Agent */}
            {isListingOrDual && (
              <>
                <Separator className="my-4 bg-slate-200" />
                
                <div className="flex items-start gap-2 mb-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="homeWarranty"
                      checked={data.homeWarranty}
                      onCheckedChange={(checked) => handleWarrantyChange("homeWarranty", checked)}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="homeWarranty" className="text-slate-800">Home Warranty Included</Label>
                  </div>
                  
                  {data.homeWarranty && (
                    <div className="space-y-4 pl-6">
                      <div className="space-y-2">
                        <Label htmlFor="warrantyCompany" className="text-slate-800">
                          Warranty Company <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="warrantyCompany"
                          value={data.warrantyCompany}
                          onChange={(e) => handleWarrantyChange("warrantyCompany", e.target.value)}
                          placeholder="Enter company name"
                          required
                          className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="warrantyCost" className="text-slate-800">
                          Warranty Cost <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="warrantyCost"
                          value={data.warrantyCost}
                          onChange={(e) => handleWarrantyChange("warrantyCost", e.target.value)}
                          placeholder="Enter cost"
                          required
                          type="text"
                          className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 ${errors.warrantyCost ? 'border-red-500' : ''}`}
                          aria-invalid={!!errors.warrantyCost}
                          aria-describedby={errors.warrantyCost ? "warrantyCost-error" : undefined}
                        />
                        {errors.warrantyCost && <p id="warrantyCost-error" className="text-sm text-red-500 mt-1">{errors.warrantyCost}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="warrantyPaidBy" className="text-slate-800">Paid By</Label>
                        <Select
                          value={data.warrantyPaidBy}
                          onValueChange={(value: 'SELLER' | 'BUYER' | 'AGENT') => handleWarrantyChange("warrantyPaidBy", value)}
                        >
                          <SelectTrigger id="warrantyPaidBy">
                            <SelectValue placeholder="Select one..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SELLER">Seller</SelectItem>
                            <SelectItem value="BUYER">Buyer</SelectItem>
                            <SelectItem value="AGENT">Agent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
