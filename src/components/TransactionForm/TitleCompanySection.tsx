import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { TitleCompanyData } from "@/types/transaction";
import { FileSpreadsheet } from "lucide-react";
import { useState } from "react";

interface TitleCompanySectionProps {
  role: string;
  data: TitleCompanyData;
  onChange: (field: string, value: any) => void;
}

export function TitleCompanySection({ role, data, onChange }: TitleCompanySectionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "contactEmail":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Invalid email format";
      case "contactPhone":
        return /^\d{10}$/.test(value.replace(/\D/g, "")) ? "" : "Invalid phone number";
      default:
        return value.trim() ? "" : "This field is required";
    }
  };

  const handleChange = (field: string, value: string) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    onChange(field, value);
  };

  return (
    <Card className="p-6 backdrop-blur-lg bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
      <div className="space-y-6">
        <div className="flex items-start gap-2 mb-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-medium text-slate-800">Title Company Information</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titleCompany" className="text-slate-800">Title Company Name <span className="text-red-500">*</span></Label>
            <Input
              id="titleCompany"
              value={data.titleCompany}
              onChange={(e) => handleChange("titleCompany", e.target.value)}
              placeholder="Enter title company name"
              required
              className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 ${errors.titleCompany ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.titleCompany}
              aria-describedby={errors.titleCompany ? "titleCompany-error" : undefined}
            />
            {errors.titleCompany && <p id="titleCompany-error" className="text-sm text-red-500 mt-1">{errors.titleCompany}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactName" className="text-slate-800">Contact Person <span className="text-red-500">*</span></Label>
            <Input
              id="contactName"
              value={data.contactName || ''}
              onChange={(e) => handleChange("contactName", e.target.value)}
              placeholder="Enter contact person's name"
              required
              className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 ${errors.contactName ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.contactName}
              aria-describedby={errors.contactName ? "contactName-error" : undefined}
            />
            {errors.contactName && <p id="contactName-error" className="text-sm text-red-500 mt-1">{errors.contactName}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="text-slate-800">Contact Email <span className="text-red-500">*</span></Label>
            <Input
              id="contactEmail"
              type="email"
              value={data.contactEmail || ''}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
              placeholder="Enter contact email"
              required
              className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 ${errors.contactEmail ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.contactEmail}
              aria-describedby={errors.contactEmail ? "contactEmail-error" : undefined}
            />
            {errors.contactEmail && <p id="contactEmail-error" className="text-sm text-red-500 mt-1">{errors.contactEmail}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactPhone" className="text-slate-800">Contact Phone <span className="text-red-500">*</span></Label>
            <Input
              id="contactPhone"
              type="tel"
              value={data.contactPhone || ''}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
              placeholder="Enter contact phone number"
              required
              className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 ${errors.contactPhone ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.contactPhone}
              aria-describedby={errors.contactPhone ? "contactPhone-error" : undefined}
            />
            {errors.contactPhone && <p id="contactPhone-error" className="text-sm text-red-500 mt-1">{errors.contactPhone}</p>}
          </div>
        </div>
      </div>
    </Card>
  );
}
