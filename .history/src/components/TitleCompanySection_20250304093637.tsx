
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { TitleCompanyData } from "@/types/transaction";

interface TitleCompanySectionProps {
  data: TitleCompanyData;
  onChange: (field: string, value: any) => void;
}

export function TitleCompanySection({ data, onChange }: TitleCompanySectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-white">Title Company Information</h2>
        <p className="text-white/80 mb-6">Enter title company details</p>
      </div>

      <Card className="p-6 backdrop-blur-lg bg-white/30 border-white/30 text-slate-800">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-slate-800">Title Company Name <span className="text-red-500">*</span></Label>
            <Input
              id="companyName"
              value={data.companyName}
              onChange={(e) => onChange("companyName", e.target.value)}
              placeholder="Enter title company name"
              required
              className="bg-white/50 border-slate-300 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName" className="text-slate-800">Contact Person Name</Label>
            <Input
              id="contactName"
              value={data.contactName}
              onChange={(e) => onChange("contactName", e.target.value)}
              placeholder="Enter contact person name"
              className="bg-white/50 border-slate-300 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-800">Phone Number</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="Enter phone number"
                type="tel"
                className="bg-white/50 border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-800">Email Address</Label>
              <Input
                id="email"
                value={data.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="Enter email address"
                type="email"
                className="bg-white/50 border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-slate-800">Office Address</Label>
            <Input
              id="address"
              value={data.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Enter office address"
              className="bg-white/50 border-slate-300 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-slate-800">City</Label>
              <Input
                id="city"
                value={data.city}
                onChange={(e) => onChange("city", e.target.value)}
                placeholder="Enter city"
                className="bg-white/50 border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-slate-800">State</Label>
              <Input
                id="state"
                value={data.state}
                onChange={(e) => onChange("state", e.target.value)}
                placeholder="Enter state"
                className="bg-white/50 border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-slate-800">ZIP Code</Label>
              <Input
                id="zipCode"
                value={data.zipCode}
                onChange={(e) => onChange("zipCode", e.target.value)}
                placeholder="Enter ZIP code"
                className="bg-white/50 border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}