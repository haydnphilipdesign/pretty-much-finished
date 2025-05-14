import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PropertyDetailsData, TitleCompanyData } from "@/types/transaction";
import { Building, FileSpreadsheet, Shield, Home, User, FileText, Landmark } from "lucide-react";
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Property Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-600" />
              Property Requirements
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="resaleCertRequired" className="flex items-center text-gray-800">
                  <Home className="h-4 w-4 mr-2 text-blue-600" />
                  Resale Certificate Required
                </Label>
                <Switch
                  id="resaleCertRequired"
                  checked={data?.resaleCertRequired}
                  onCheckedChange={(checked) => onChange?.("resaleCertRequired", checked)}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              {data?.resaleCertRequired && (
                <div className="space-y-2 mt-2 ml-6 pl-2 border-l-2 border-blue-100">
                  <Label htmlFor="hoaName" className="text-gray-800">HOA Name</Label>
                  <Input
                    id="hoaName"
                    value={data?.hoaName}
                    onChange={(e) => onChange?.("hoaName", e.target.value)}
                    placeholder="Enter HOA name"
                    className="bg-white border-gray-300"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <Label htmlFor="coRequired" className="flex items-center text-gray-800">
                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                CO Required
              </Label>
              <Switch
                id="coRequired"
                checked={data?.coRequired}
                onCheckedChange={(checked) => onChange?.("coRequired", checked)}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            {data?.coRequired && (
              <div className="space-y-2 mt-2 ml-6 pl-2 border-l-2 border-blue-100">
                <Label htmlFor="municipality" className="text-gray-800">Municipality</Label>
                <Input
                  id="municipality"
                  value={data?.municipality}
                  onChange={(e) => onChange?.("municipality", e.target.value)}
                  placeholder="Enter municipality"
                  className="bg-white border-gray-300"
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <Label htmlFor="firstRightOfRefusal" className="flex items-center text-gray-800">
                <User className="h-4 w-4 mr-2 text-blue-600" />
                First Right of Refusal
              </Label>
              <Switch
                id="firstRightOfRefusal"
                checked={data?.firstRightOfRefusal}
                onCheckedChange={(checked) => onChange?.("firstRightOfRefusal", checked)}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            {data?.firstRightOfRefusal && (
              <div className="space-y-2 mt-2 ml-6 pl-2 border-l-2 border-blue-100">
                <Label htmlFor="firstRightName" className="text-gray-800">First Right Name</Label>
                <Input
                  id="firstRightName"
                  value={data?.firstRightName}
                  onChange={(e) => onChange?.("firstRightName", e.target.value)}
                  placeholder="Enter first right name"
                  className="bg-white border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Title Company Information */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Landmark className="h-5 w-5 mr-2 text-blue-600" />
              Title Company
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="titleCompany" className="text-gray-800">Title Company Name</Label>
              <Input
                id="titleCompany"
                value={titleData?.titleCompany}
                onChange={(e) => onTitleChange?.("titleCompany", e.target.value)}
                placeholder="Enter title company name"
                className="bg-white border-gray-300"
              />
            </div>
          </div>
        </div>
        
        {/* Right Column - Attorney and Warranty */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Legal Representation
            </h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="attorneyRepresentation" className="flex items-center text-gray-800">
                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                Attorney Representation
              </Label>
              <Switch
                id="attorneyRepresentation"
                checked={data?.attorneyRepresentation}
                onCheckedChange={(checked) => onChange?.("attorneyRepresentation", checked)}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            {data?.attorneyRepresentation && (
              <div className="space-y-2 mt-2 ml-6 pl-2 border-l-2 border-blue-100">
                <Label htmlFor="attorneyName" className="text-gray-800">Attorney Name</Label>
                <Input
                  id="attorneyName"
                  value={data?.attorneyName}
                  onChange={(e) => onChange?.("attorneyName", e.target.value)}
                  placeholder="Enter attorney name"
                  className="bg-white border-gray-300"
                />
              </div>
            )}
          </div>
          
          {/* Home Warranty - Only Shown if role is Listing Agent or Dual Agent */}
          {isListingOrDual && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Home Warranty
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="homeWarranty"
                    checked={data.homeWarranty}
                    onCheckedChange={(checked) => handleWarrantyChange("homeWarranty", checked)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor="homeWarranty" className="text-gray-800">Home Warranty Included</Label>
                </div>
                
                {data.homeWarranty && (
                  <div className="space-y-4 mt-2 ml-6 pl-2 border-l-2 border-blue-100">
                    <div className="space-y-2">
                      <Label htmlFor="warrantyCompany" className="text-gray-800">
                        Warranty Company <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="warrantyCompany"
                        value={data.warrantyCompany}
                        onChange={(e) => handleWarrantyChange("warrantyCompany", e.target.value)}
                        placeholder="Enter company name"
                        required
                        className="bg-white border-gray-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="warrantyCost" className="text-gray-800">
                        Warranty Cost <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="warrantyCost"
                          value={data.warrantyCost}
                          onChange={(e) => handleWarrantyChange("warrantyCost", e.target.value)}
                          placeholder="Enter cost"
                          required
                          type="text"
                          className={`bg-white border-gray-300 pl-7 ${errors.warrantyCost ? 'border-red-500' : ''}`}
                          aria-invalid={!!errors.warrantyCost}
                        />
                      </div>
                      {errors.warrantyCost && <p className="text-xs text-red-500 mt-1">{errors.warrantyCost}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="warrantyPaidBy" className="text-gray-800">Paid By</Label>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
