import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './tooltip';
import { Info, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FieldHelpProps {
  title: string;
  description: string;
  examples?: string[];
  requirements?: string[];
  className?: string;
  children?: React.ReactNode;
}

export const FieldHelp: React.FC<FieldHelpProps> = ({
  title,
  description,
  examples,
  requirements,
  className,
  children
}) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <div className={cn('inline-flex items-center gap-1 cursor-help', className)}>
          {children}
          <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs p-4 space-y-2">
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
        
        {examples && examples.length > 0 && (
          <div className="space-y-1">
            <h5 className="text-xs font-medium">Examples:</h5>
            <ul className="text-xs text-gray-500 list-disc pl-4">
              {examples.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
        )}
        
        {requirements && requirements.length > 0 && (
          <div className="space-y-1">
            <h5 className="text-xs font-medium">Requirements:</h5>
            <ul className="text-xs text-gray-500 list-disc pl-4">
              {requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

// Example usage:
export const FieldHelpExamples = {
  // Role Section
  role: {
    title: "Agent Role",
    description: "Select your role in this transaction.",
    examples: ["Buyer's Agent", "Listing Agent", "Dual Agent"],
    requirements: ["Must select one role"]
  },

  // Property Section
  mlsNumber: {
    title: "MLS Number",
    description: "The unique identifier for the property listing in the Multiple Listing Service.",
    examples: ["A123456", "MLS-789"],
    requirements: ["Must be a valid MLS number", "Should match the property listing"]
  },
  propertyAddress: {
    title: "Property Address",
    description: "The complete street address of the property.",
    examples: ["123 Main St, City, State 12345"],
    requirements: ["Must include street number and name", "City and state are required", "ZIP code is recommended"]
  },
  salePrice: {
    title: "Sale Price",
    description: "The agreed-upon sale price for the property.",
    examples: ["$250,000", "500000"],
    requirements: ["Must be a valid number", "Do not include cents"]
  },

  // Client Section
  clientName: {
    title: "Client Name",
    description: "Full legal name of the client.",
    examples: ["John A. Smith", "Jane Doe"],
    requirements: ["Must match legal documents", "Include middle initial if applicable"]
  },
  clientEmail: {
    title: "Client Email",
    description: "Primary email address for client communications.",
    examples: ["john.smith@email.com"],
    requirements: ["Must be a valid email address", "Should be actively monitored by client"]
  },
  clientPhone: {
    title: "Client Phone",
    description: "Best contact number for the client.",
    examples: ["(555) 123-4567", "555-123-4567"],
    requirements: ["Include area code", "Must be a valid phone number"]
  },
  maritalStatus: {
    title: "Marital Status",
    description: "Client's current marital status for legal purposes.",
    examples: ["Single", "Married", "Divorced"],
    requirements: ["Must be accurately reported", "Affects title requirements"]
  },

  // Commission Section

  totalCommission: {
    title: "Total Commission",
    description: "Total commission percentage or amount for the transaction.",
    examples: ["2.5%", "$7,500"],
    requirements: ["Can be percentage or fixed amount", "Must be greater than 0"]
  },
  referralFee: {
    title: "Referral Fee",
    description: "Fee paid to referring agent or broker, if applicable.",
    examples: ["25%", "$1,000"],
    requirements: ["Optional", "Must have referral agreement if applicable"]
  },

  // Property Details Section
  propertyStatus: {
    title: "Property Status",
    description: "Current occupancy status of the property.",
    examples: ["Vacant", "Owner Occupied", "Tenant Occupied"],
    requirements: ["Must be verified", "Affects showing instructions"]
  },
  winterizedStatus: {
    title: "Winterized Status",
    description: "Whether the property has been winterized.",
    examples: ["Yes", "No", "Unknown"],
    requirements: ["Required for vacant properties", "Important for property preservation"]
  },
  accessType: {
    title: "Access Type",
    description: "How to access the property for showings.",
    examples: ["Electronic Lockbox", "Call Listing Agent", "Appointment Only"],
    requirements: ["Must be accurate", "Include any special instructions"]
  },

  // Warranty Section
  homeWarrantyPurchased: {
    title: "Home Warranty",
    description: "Whether a home warranty will be purchased.",
    examples: ["Yes", "No"],
    requirements: ["Must be specified in agreement", "Include warranty company if Yes"]
  },
  warrantyPaidBy: {
    title: "Warranty Paid By",
    description: "Party responsible for warranty cost.",
    examples: ["Seller", "Buyer", "Split"],
    requirements: ["Must be specified if warranty is purchased"]
  },

  // Title Company Section
  titleCompany: {
    title: "Title Company",
    description: "Company handling title work and closing.",
    examples: ["ABC Title Co.", "First American Title"],
    requirements: ["Must be a licensed title company", "Include contact information"]
  },

  // Documents Section
  requiredDocuments: {
    title: "Required Documents",
    description: "Essential documents for the transaction.",
    examples: ["Sales Agreement", "Seller's Disclosure", "Lead Paint Disclosure"],
    requirements: ["All required documents must be attached", "Must be properly signed"]
  },

  // Additional Info Section
  specialInstructions: {
    title: "Special Instructions",
    description: "Any special requirements or notes for this transaction.",
    examples: ["Requires rush processing", "Conditional on inspection"],
    requirements: ["Be clear and specific", "Include any deadlines"]
  },

  // Signature Section
  agentSignature: {
    title: "Agent Signature",
    description: "Your electronic signature confirming all information is accurate.",
    examples: ["Type full name", "Draw signature"],
    requirements: ["Must match your legal name", "Constitutes legal signature"]
  }
};