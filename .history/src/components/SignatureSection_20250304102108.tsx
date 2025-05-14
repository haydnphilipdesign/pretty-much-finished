
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Pen, FileSignature } from "lucide-react";
import { SignatureData } from "@/types/transaction";

interface SignatureSectionProps {
  role: string | null;
  data: SignatureData;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
}

export function SignatureSection({ role, data, onChange, onSubmit }: SignatureSectionProps) {
  return (
    <div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Sign & Submit</h2>
        <p className="text-white/70">Review and sign the transaction details</p>
      </div>

      <Card className="p-6 backdrop-blur-lg bg-white/80 border-white/30 text-slate-800">
        <div className="space-y-6">
          <div className="flex items-start gap-2 mb-4">
            <FileSignature className="h-5 w-5 text-slate-700 mt-1" />
            <h3 className="text-xl font-medium text-slate-800">Electronic Signature</h3>
          </div>
        
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentName" className="text-slate-800">Agent Name <span className="text-red-500">*</span></Label>
              <Input
                id="agentName"
                value={data.agentName}
                onChange={(e) => onChange("agentName", e.target.value)}
                placeholder="Enter your full name"
                required
                className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateSubmitted" className="text-slate-800">Date <span className="text-red-500">*</span></Label>
              <Input
                id="dateSubmitted"
                type="date"
                value={data.dateSubmitted}
                onChange={(e) => onChange("dateSubmitted", e.target.value)}
                required
                className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="termsAccepted"
                checked={data.termsAccepted}
                onCheckedChange={(checked) => onChange("termsAccepted", checked)}
              />
              <Label htmlFor="termsAccepted" className="text-slate-800">
                I agree to the terms and conditions
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="infoConfirmed"
                checked={data.infoConfirmed}
                onCheckedChange={(checked) => onChange("infoConfirmed", checked)}
              />
              <Label htmlFor="infoConfirmed" className="text-slate-800">
                I confirm that all information provided is accurate and complete
              </Label>
            </div>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-white/50">
            <Pen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-sm text-slate-600 mb-4">Click below to add your electronic signature</p>
            <Input
              id="signature"
              value={data.signature}
              onChange={(e) => onChange("signature", e.target.value)}
              placeholder="Type your name to sign"
              required
              className="bg-transparent border-slate-300 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <Button 
            className="w-full bg-brand-gold hover:bg-brand-gold/90 text-slate-800" 
            onClick={onSubmit}
            disabled={!data.termsAccepted || !data.infoConfirmed || !data.signature || !data.agentName || !data.dateSubmitted}
          >
            Submit Transaction
          </Button>
        </div>
      </Card>
    </div>
  );
}
