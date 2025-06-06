import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SignatureData } from "@/types/transaction";
import { FileSignature, AlertTriangle } from "lucide-react";
import { MissingFieldsIndicator } from "./MissingFieldsIndicator";

interface SignatureSectionProps {
  data: SignatureData;
  onChange: (field: keyof SignatureData, value: any) => void;
  role?: string;
  onSubmit?: () => void;
  skippedFields?: string[];
  onFieldFix?: (field: string) => void;
}

export function SignatureSection({ 
  data, 
  onChange, 
  role, 
  onSubmit,
  skippedFields = [],
  onFieldFix
}: SignatureSectionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof SignatureData, value: any) => {
    // Clear error when field is changed
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    onChange(field, value);
    
    // If signature field changes, also update agentName field
    if (field === 'signature') {
      onChange('agentName', value);
    }
  };
  
  // Set the date and sync agent name when the component loads
  useEffect(() => {
    if (!data.dateSubmitted) {
      onChange('dateSubmitted', new Date().toISOString().split('T')[0]);
    }
    
    // If signature exists but agentName is not set, update it
    if (data.signature && !data.agentName) {
      onChange('agentName', data.signature);
    }
  }, []);

  // Show a more prominent warning if missing fields exist at submission time
  const hasMissingFields = skippedFields && skippedFields.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Sign & Submit</h2>
        <p className="text-white/70">
          Please review and sign to confirm all information is accurate
        </p>
      </div>
      
      {/* Missing Fields Warning */}
      {hasMissingFields && (
        <MissingFieldsIndicator 
          skippedFields={skippedFields} 
          onFixClick={onFieldFix}
        />
      )}

      <Card className="p-6 backdrop-blur-lg bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-6">
          <div className="flex items-start gap-2 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <FileSignature className="h-5 w-5 text-blue-600" />
            </div>
          </div>

          <div className="space-y-6">
            {/* Warning about missing fields */}
            {hasMissingFields && (
              <div className="flex p-3 bg-amber-50 border border-amber-200 rounded-md">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  <strong>Warning:</strong> Some required information is missing. You can fix this by 
                  going back to previous sections, or submit anyway and your form will be marked for follow-up.
                </p>
              </div>
            )}
          
            <div className="space-y-2">
              <Label htmlFor="signature" className="text-slate-800">
                Electronic Signature <span className="text-red-500">*</span>
              </Label>
              <Input
                id="signature"
                type="text"
                value={data.signature || ''}
                onChange={(e) => handleChange("signature", e.target.value)}
                placeholder="Type your full name"
                className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
                required
              />
              {errors.signature && (
                <p className="text-sm text-red-500">{errors.signature}</p>
              )}
              
              {/* Hidden field for agentName */}
              <input 
                type="hidden" 
                id="agentName" 
                value={data.agentName || ''} 
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={data.termsAccepted || false}
                  onCheckedChange={(checked) => 
                    handleChange("termsAccepted", checked === true)}
                  className="border-slate-400"
                />
                <Label htmlFor="termsAccepted" className="text-slate-800 flex items-center">
                  I accept the <a href="/terms" className="text-blue-600 hover:text-blue-800 mx-1">terms and conditions</a>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="infoConfirmed"
                  checked={data.infoConfirmed || false}
                  onCheckedChange={(checked) => 
                    handleChange("infoConfirmed", checked === true)}
                  className="border-slate-400"
                />
                <Label htmlFor="infoConfirmed" className="text-slate-800">
                  I confirm all information provided is accurate
                </Label>
              </div>
            </div>
            
            {/* Submit button removed to avoid duplication with form navigation */}
          </div>
        </div>
      </Card>
    </div>
  );
}