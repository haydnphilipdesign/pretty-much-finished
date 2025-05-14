import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import type { AgentRole, Client } from '@/types/transaction';
import { AddressInput } from "@/components/ui/AddressInput";
import { Mail, Phone, Home, Heart, User, UserPlus } from "lucide-react";

interface ClientFormFieldsProps {
  client: Client;
  onClientChange: (field: keyof Client, value: string) => void;
  role: AgentRole;
}

export function ClientFormFields({ client, onClientChange, role }: ClientFormFieldsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [localClient, setLocalClient] = useState<Client>(client);

  useEffect(() => {
    setLocalClient(client);
  }, [client]);

  const handleChange = (field: keyof Client, value: string) => {
    // Clear error when field is changed
    setErrors(prev => ({ ...prev, [field]: '' }));
    
    // Format phone numbers as they're typed
    if (field === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 10) {
        value = formatPhoneNumber(digits);
      } else {
        return; // Don't update if more than 10 digits
      }
    }
    
    setLocalClient(prev => ({ ...prev, [field]: value }));
    onClientChange(field, value);
  };

  // Format phone number as user types
  const formatPhoneNumber = (digits: string) => {
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
  };

  // Validate phone format
  const validatePhone = (phone: string) => {
    const phoneDigits = phone.replace(/\D/g, '');
    return phoneDigits.length === 10;
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (field: keyof Client, value: string) => {
    switch (field) {
      case 'email':
        // Only validate email if a value is provided
        return value && !validateEmail(value) ? 'Please enter a valid email address' : '';
      case 'phone':
        // Only validate phone if a value is provided
        return value && !validatePhone(value) ? 'Please enter a valid phone number' : '';
      default:
        return value.trim() ? '' : 'This field is required';
    }
  };

  const handleBlur = (field: keyof Client) => {
    const error = validateField(field, localClient[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Determine if the agent is a dual agent
  const isDualAgent = role === "DUAL AGENT";

  // Set client type based on agent role
  useEffect(() => {
    // For listing agents, always set client type to SELLER
    if (role === "LISTING AGENT" && client.type !== "SELLER") {
      onClientChange("type", "SELLER");
    }
    
    // For buyers agents, always set client type to BUYER
    if (role === "BUYERS AGENT" && client.type !== "BUYER") {
      onClientChange("type", "BUYER");
    }
    
    // For dual agents, the type can be selected in the UI
  }, [role, client.type, onClientChange]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor={`name-${client.id}`} className="flex items-center text-gray-800">
            <User className="h-4 w-4 mr-2 text-blue-600" />
            Name <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id={`name-${client.id}`}
            value={localClient.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            required
            placeholder="Enter full name"
            className={`bg-white border-gray-300 placeholder:text-gray-400 ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor={`email-${client.id}`} className="flex items-center text-gray-800">
            <Mail className="h-4 w-4 mr-2 text-blue-600" />
            Email 
          </Label>
          <Input
            id={`email-${client.id}`}
            type="email"
            value={localClient.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="Enter email address"
            className={`bg-white border-gray-300 placeholder:text-gray-400 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor={`phone-${client.id}`} className="flex items-center text-gray-800">
            <Phone className="h-4 w-4 mr-2 text-blue-600" />
            Phone <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id={`phone-${client.id}`}
            value={localClient.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            placeholder="123-456-7890"
            maxLength={12}
            className={`bg-white border-gray-300 placeholder:text-gray-400 ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor={`address-${client.id}`} className="flex items-center text-gray-800">
            <Home className="h-4 w-4 mr-2 text-blue-600" />
            Address
          </Label>
          <AddressInput
            value={localClient.address}
            onChange={(value: string) => handleChange("address", value)}
            label=""
            id={`address-${client.id}`}
            placeholder="Enter address"
            error={errors.address}
          />
        </div>

        {/* Marital Status */}
        <div className="space-y-2">
          <Label htmlFor={`maritalStatus-${client.id}`} className="flex items-center text-gray-800">
            <Heart className="h-4 w-4 mr-2 text-blue-600" />
            Marital Status <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={localClient.maritalStatus}
            onValueChange={(value) => handleChange("maritalStatus", value)}
          >
            <SelectTrigger id={`maritalStatus-${client.id}`} className="bg-white border-gray-300">
              <SelectValue placeholder="Select marital status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SINGLE">Single</SelectItem>
              <SelectItem value="MARRIED">Married</SelectItem>
              <SelectItem value="DIVORCED">Divorced</SelectItem>
              <SelectItem value="DIVORCE IN PROGRESS">Divorce in Progress</SelectItem>
              <SelectItem value="WIDOWED">Widowed</SelectItem>
            </SelectContent>
          </Select>
          {errors.maritalStatus && <p className="text-xs text-red-500 mt-1">{errors.maritalStatus}</p>}
        </div>

        {/* Client Type (only for Dual Agent) */}
        {isDualAgent && (
          <div className="space-y-2">
            <Label htmlFor={`type-${client.id}`} className="flex items-center text-gray-800">
              <UserPlus className="h-4 w-4 mr-2 text-blue-600" />
              Client Type <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={localClient.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger id={`type-${client.id}`} className="bg-white border-gray-300">
                <SelectValue placeholder="Select client type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUYER">Buyer</SelectItem>
                <SelectItem value="SELLER">Seller</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
          </div>
        )}
      </div>
    </div>
  );
}