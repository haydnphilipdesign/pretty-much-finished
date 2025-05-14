
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PenTool } from "lucide-react";
import { SignatureData } from "@/types/transaction";

interface SignatureSectionProps {
  data?: Partial<SignatureData>;
  onChange: (field: string, value: string | boolean) => void;
  errors?: Record<string, string>;
}

export function SignatureSection({
  data = {},
  onChange,
  errors = {}
}: SignatureSectionProps) {
  // Provide default values
  const signatureData = {
    agentName: "",
    termsAccepted: false,
    infoConfirmed: false,
    signature: "",
    date: new Date().toISOString().split('T')[0],
    ...data
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Agent Signature</h2>
        <p className="text-white/70">Please review and sign the submission</p>
      </div>

      <Card className="p-6 backdrop-blur-lg bg-white/80 border-white/30 text-slate-800">
        <div className="space-y-6">
          <div className="flex items-start gap-2 mb-2">
            <PenTool className="h-5 w-5 text-slate-700 mt-1" />
            <h3 className="text-xl font-medium text-slate-800">Signature Details</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentName" className="text-slate-800">
                Agent Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="agentName"
                value={signatureData.agentName}
                onChange={(e) => onChange("agentName", e.target.value)}
                placeholder="Enter your full name"
                className="bg-transparent border-slate-300 text-slate-800 placeholder:text-slate-400"
                required
              />
              {errors.agentName && (
                <p className="text-red-500 text-sm">{errors.agentName}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={signatureData.termsAccepted}
                  onCheckedChange={(checked) => 
                    onChange("termsAccepted", checked === true)
                  }
                />
                <Label htmlFor="termsAccepted" className="text-slate-800">
                  I accept the terms and conditions
                </Label>
              </div>
              {errors.termsAccepted && (
                <p className="text-red-500 text-sm">{errors.termsAccepted}</p>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="infoConfirmed"
                  checked={signatureData.infoConfirmed}
                  onCheckedChange={(checked) => 
                    onChange("infoConfirmed", checked === true)
                  }
                />
                <Label htmlFor="infoConfirmed" className="text-slate-800">
                  I confirm all information is accurate and complete
                </Label>
              </div>
              {errors.infoConfirmed && (
                <p className="text-red-500 text-sm">{errors.infoConfirmed}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signature" className="text-slate-800">
                Digital Signature <span className="text-red-500">*</span>
              </Label>
              <Input
                id="signature"
                value={signatureData.signature}
                onChange={(e) => onChange("signature", e.target.value)}
                placeholder="Type your full name as signature"
                className="bg-transparent border-slate-300 text-slate-800 placeholder:text-slate-400"
                required
              />
              {errors.signature && (
                <p className="text-red-500 text-sm">{errors.signature}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-slate-800">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={signatureData.date}
                onChange={(e) => onChange("date", e.target.value)}
                className="bg-transparent border-slate-300 text-slate-800"
                required
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
