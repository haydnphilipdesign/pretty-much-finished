
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Building } from "lucide-react";
import { useTransactionForm } from "@/context/TransactionFormContext";

interface PropertyData {
  mlsNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  listPrice: string;
  salePrice: string;
  closingDate: string;
}

interface PropertyInformationProps {
  propertyData: PropertyData;
  setPropertyData: (data: Partial<PropertyData>) => void;
  className?: string;
}

export function PropertyInformation({
  propertyData,
  setPropertyData,
  className
}: PropertyInformationProps) {
  const handleChange = (field: string, value: string) => {
    setPropertyData({
      ...propertyData,
      [field]: value
    });
  };

  return (
    <Card className={className}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Property Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mlsNumber">MLS Number</Label>
            <Input
              id="mlsNumber"
              value={propertyData.mlsNumber}
              onChange={(e) => handleChange('mlsNumber', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Property Address</Label>
            <Input
              id="address"
              value={propertyData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          {/* Add other property fields here */}
        </div>
      </div>
    </Card>
  );
}
