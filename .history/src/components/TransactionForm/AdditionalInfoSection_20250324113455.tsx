import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AdditionalInfoData } from "@/types/transaction";
import { FileText } from "lucide-react";

interface AdditionalInfoSectionProps {
  data: AdditionalInfoData;
  onChange: (field: keyof AdditionalInfoData, value: any) => void;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  data,
  onChange
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Additional Information</h2>
        <p className="text-white/70">
          Add any additional notes or special conditions
        </p>
      </div>

      <Card className="p-6 backdrop-blur-lg bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-6">
          <div className="flex items-start gap-2 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialInstructions" className="text-slate-800">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                value={data.specialInstructions}
                onChange={(e) => onChange('specialInstructions', e.target.value)}
                placeholder="Enter any special instructions"
                className="min-h-[100px] bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgentIssues" className="text-slate-800">Urgent Issues</Label>
              <Textarea
                id="urgentIssues"
                value={data.urgentIssues}
                onChange={(e) => onChange('urgentIssues', e.target.value)}
                placeholder="Enter any urgent issues that need immediate attention"
                className="min-h-[100px] bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-800">Additional Notes</Label>
              <Textarea
                id="notes"
                value={data.notes}
                onChange={(e) => onChange('notes', e.target.value)}
                placeholder="Enter any additional notes or comments"
                className="min-h-[100px] bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
