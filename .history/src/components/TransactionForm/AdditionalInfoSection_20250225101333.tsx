import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import { AdditionalInfoData } from "../../types/transaction";

interface AdditionalInfoSectionProps {
  role: string | null;
  data: AdditionalInfoData;
  onChange: (field: string, value: any) => void;
}

export function AdditionalInfoSection({ role, data, onChange }: AdditionalInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
        <p className="text-gray-500 mb-6">Add any additional notes or special conditions</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              value={data.specialInstructions}
              onChange={(e) => onChange("specialInstructions", e.target.value)}
              placeholder="Enter any special instructions"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgentIssues">Urgent Issues</Label>
            <Textarea
              id="urgentIssues"
              value={data.urgentIssues}
              onChange={(e) => onChange("urgentIssues", e.target.value)}
              placeholder="Enter any urgent issues"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={data.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              placeholder="Enter any additional notes"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="requiresFollowUp">Requires Follow-up</Label>
            <Switch
              id="requiresFollowUp"
              checked={data.requiresFollowUp}
              onCheckedChange={(checked) => onChange("requiresFollowUp", checked)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}