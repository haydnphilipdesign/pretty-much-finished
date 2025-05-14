import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SignatureData } from "@/types/transaction";
import { FileSignature } from "lucide-react";

interface SignatureSectionProps {
  data: SignatureData;
  onChange: (field: keyof SignatureData, value: any) => void;
  role?: string;
}

export function SignatureSection({ data, onChange, role }: SignatureSectionProps) {
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
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Sign & Submit</h2>
        <p className="text-white/70">
          Please review and sign to confirm all information is accurate
        </p>
      </div>

      <Card className="p-6 backdrop-blur-lg bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-6">
          <div className="flex items-start gap-2 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <FileSignature className="h-5 w-5 text-blue-600" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="signature" className="text-slate-800">
                Electronic Signature <span className="text-red-500">*</span>
              </Label>
              <Input
                id="signature"
                type="text"
                value={data.signature}
                onChange={(e) => handleChange("signature", e.target.value)}
                placeholder="Type your full name"
                className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
                required
              />
              {errors.signature && (
                <p className="text-sm text-red-500">{errors.signature}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={data.termsAccepted}
                  onCheckedChange={(checked) => 
                    handleChange("termsAccepted", checked === true)}
                  className="border-slate-400"
                />
                <Label htmlFor="termsAccepted" className="text-slate-800">
                  I accept the terms and conditions
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirmAccuracy"
                  checked={data.confirmAccuracy}
                  onCheckedChange={(checked) => 
                    handleChange("confirmAccuracy", checked === true)}
                  className="border-slate-400"
                />
                <Label htmlFor="confirmAccuracy" className="text-slate-800">
                  I confirm all information provided is accurate
                </Label>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
