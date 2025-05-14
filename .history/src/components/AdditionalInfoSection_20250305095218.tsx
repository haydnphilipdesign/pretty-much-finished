
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { AdditionalInfoData } from "@/types/transaction";

interface AdditionalInfoSectionProps {
  data?: Partial<AdditionalInfoData>;
  onChange: (field: string, value: string | boolean) => void;
}

export function AdditionalInfoSection({ 
  data = {}, 
  onChange 
}: AdditionalInfoSectionProps) {
  // Provide default values
  const additionalInfo = {
    specialInstructions: "",
    urgentIssues: "",
    notes: "",
    requiresFollowUp: false,
    additionalNotes: "",
    ...data
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Additional Information</h2>
        <p className="text-white/70">
          Provide any additional details or special instructions
        </p>
      </div>

      <Card className="p-6 backdrop-blur-lg bg-white/80 border-white/30 text-slate-800">
        <div className="space-y-6">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-slate-700 mt-1" />
            <h3 className="text-xl font-medium text-slate-800">Additional Details</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialInstructions" className="text-slate-800">
                Special Instructions
              </Label>
              <Textarea
                id="specialInstructions"
                value={additionalInfo.specialInstructions}
                onChange={(e) => onChange("specialInstructions", e.target.value)}
                placeholder="Enter any special instructions"
                className="min-h-[100px] bg-transparent border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgentIssues" className="text-slate-800">
                Urgent Issues
              </Label>
              <Textarea
                id="urgentIssues"
                value={additionalInfo.urgentIssues}
                onChange={(e) => onChange("urgentIssues", e.target.value)}
                placeholder="Enter any urgent issues"
                className="min-h-[100px] bg-transparent border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-800">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                value={additionalInfo.notes}
                onChange={(e) => onChange("notes", e.target.value)}
                placeholder="Enter any additional notes"
                className="min-h-[100px] bg-transparent border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="requiresFollowUp" className="text-slate-800">
                Requires Follow-up
              </Label>
              <Switch
                id="requiresFollowUp"
                checked={additionalInfo.requiresFollowUp}
                onCheckedChange={(checked) => onChange("requiresFollowUp", checked)}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
