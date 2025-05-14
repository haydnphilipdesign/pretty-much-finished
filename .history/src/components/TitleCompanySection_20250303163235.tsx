import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface TitleCompanyData {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
}

interface TitleCompanySectionProps {
  role?: string | null;
  data: TitleCompanyData;
  onChange: (data: TitleCompanyData) => void;
}

export function TitleCompanySection({ role, data, onChange }: TitleCompanySectionProps) {
  const handleChange = (field: keyof TitleCompanyData, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-white">Title Company Information</h2>
        <p className="text-white/80 mb-6">Enter title company details for closing coordination</p>
      </div>

      <Card className="p-6 backdrop-blur-md bg-white/20 border border-white/30">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-white">Title Company Name <span className="text-red-500">*</span></Label>
            <Input
              id="companyName"
              value={data.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="Enter title company name"
              required
              className="bg-white/30 border-white/30 text-white placeholder:text-white/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactName" className="text-white">Contact Person</Label>
            <Input
              id="contactName"
              value={data.contactName}
              onChange={(e) => handleChange("contactName", e.target.value)}
              placeholder="Enter contact person's name"
              className="bg-white/30 border-white/30 text-white placeholder:text-white/50"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Phone Number</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className="bg-white/30 border-white/30 text-white placeholder:text-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email address"
                className="bg-white/30 border-white/30 text-white placeholder:text-white/50"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}