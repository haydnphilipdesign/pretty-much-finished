
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Building } from "lucide-react";
import { useTransactionForm } from "@/context/TransactionFormContext";

interface PropertyInformationProps extends BaseSectionProps {
  propertyData: {
    mlsNumber: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    listPrice: string;
    salePrice: string;
    closingDate: string;
  };
  setPropertyData: (data: any) => void;
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
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-semibold text-white">Property Information</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="mlsNumber">MLS Number</Label>
          <Input
            id="mlsNumber"
            value={propertyData.mlsNumber}
            onChange={(e) => handleChange("mlsNumber", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="address">Property Address</Label>
          <Input
            id="address"
            value={propertyData.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={propertyData.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={propertyData.state}
            onChange={(e) => handleChange("state", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            value={propertyData.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="listPrice">List Price</Label>
          <Input
            id="listPrice"
            type="number"
            value={propertyData.listPrice}
            onChange={(e) => handleChange("listPrice", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="salePrice">Sale Price</Label>
          <Input
            id="salePrice"
            type="number"
            value={propertyData.salePrice}
            onChange={(e) => handleChange("salePrice", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="closingDate">Closing Date</Label>
          <Input
            id="closingDate"
            type="date"
            value={propertyData.closingDate}
            onChange={(e) => handleChange("closingDate", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
