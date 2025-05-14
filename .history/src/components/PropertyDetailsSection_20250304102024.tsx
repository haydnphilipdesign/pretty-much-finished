
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { PropertyDetailsData, TitleCompanyData } from "@/types/transaction";
import { Building, FileSpreadsheet } from "lucide-react";

interface PropertyDetailsSectionProps {
  role: string | null;
  data?: PropertyDetailsData;
  onChange?: (field: string, value: any) => void;
  titleData?: TitleCompanyData;
  onTitleChange?: (field: string, value: any) => void;
}

export function PropertyDetailsSection({ 
  role, 
  data, 
  onChange,
  titleData, 
  onTitleChange 
}: PropertyDetailsSectionProps) {
  const isListingOrDualAgent = role === "listing-agent" || role === "dual-agent";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Property & Title Information</h2>
        <p className="text-white/70">
          Enter additional property details and title company information
        </p>
      </div>

      <Card className="p-6 backdrop-blur-lg bg-transparent border-white/30 text-slate-800">
        <div className="space-y-6">
          <div className="flex items-start gap-2 mb-4">
            <Building className="h-5 w-5 text-slate-700 mt-1" />
            <h3 className="text-xl font-medium text-slate-800">Property Details</h3>
          </div>
          
          <div className="space-y-4">
            {isListingOrDualAgent && (
              <>
                <div className="flex items-center justify-between">
                  <Label htmlFor="resaleCertRequired" className="text-slate-800">Resale Certificate Required</Label>
                  <Switch
                    id="resaleCertRequired"
                    checked={data?.resaleCertRequired}
                    onCheckedChange={(checked) => onChange?.("resaleCertRequired", checked)}
                  />
                </div>

                {data?.resaleCertRequired && (
                  <div className="space-y-2">
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
              />
            </div>

            {data?.coRequired && (
              <div className="space-y-2">
                <Label htmlFor="municipality" className="text-slate-800">Municipality/Township</Label>
                <Input
                  id="municipality"
                  value={data?.municipality}
                  onChange={(e) => onChange?.("municipality", e.target.value)}
                  placeholder="Enter municipality/township"
                  className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
                />
              </div>
            )}

            {isListingOrDualAgent && (
              <>
                <div className="flex items-center justify-between">
                  <Label htmlFor="firstRightOfRefusal" className="text-slate-800">First Right of Refusal</Label>
                  <Switch
                    id="firstRightOfRefusal"
                    checked={data?.firstRightOfRefusal}
                    onCheckedChange={(checked) => onChange?.("firstRightOfRefusal", checked)}
                  />
                </div>

                {data?.firstRightOfRefusal && (
                  <div className="space-y-2">
                    <Label htmlFor="firstRightName" className="text-slate-800">First Right of Refusal Name</Label>
                    <Input
                      id="firstRightName"
                      value={data?.firstRightName}
                      onChange={(e) => onChange?.("firstRightName", e.target.value)}
                      placeholder="Enter name"
                      className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="attorneyRepresentation" className="text-slate-800">Attorney Representation</Label>
              <Switch
                id="attorneyRepresentation"
                checked={data?.attorneyRepresentation}
                onCheckedChange={(checked) => onChange?.("attorneyRepresentation", checked)}
              />
            </div>

            {data?.attorneyRepresentation && (
              <div className="space-y-2">
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
          </div>
          
          {/* Title Company Information */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-start gap-2 mb-4">
              <FileSpreadsheet className="h-5 w-5 text-slate-700 mt-1" />
              <h3 className="text-xl font-medium text-slate-800">Title Company Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-slate-800">Title Company Name <span className="text-red-500">*</span></Label>
                <Input
                  id="companyName"
                  value={titleData?.companyName}
                  onChange={(e) => onTitleChange?.("companyName", e.target.value)}
                  placeholder="Enter title company name"
                  required
                  className="bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
