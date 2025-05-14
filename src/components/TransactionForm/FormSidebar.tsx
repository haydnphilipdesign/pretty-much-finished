import { Home, Building, User, DollarSign, FileText, Shield, Building2, FileSignature, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormSidebarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const steps = [
  { id: 1, title: "Role Selection", icon: Home },
  { id: 2, title: "Property Info", icon: Building },
  { id: 3, title: "Client Info", icon: User },
  { id: 4, title: "Commission", icon: DollarSign },
  { id: 5, title: "Property Details", icon: Info },
  { id: 6, title: "Warranty", icon: Shield },
  { id: 7, title: "Title Company", icon: Building2 },
  { id: 8, title: "Documents", icon: FileText },
  { id: 9, title: "Additional Info", icon: Info },
  { id: 10, title: "Sign & Submit", icon: FileSignature },
];

export function FormSidebar({ currentStep, onStepClick }: FormSidebarProps) {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Transaction Form</h2>
        <p className="text-sm text-gray-500 mt-1">Complete all required sections</p>
      </div>
      
      <nav className="space-y-1">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              className={cn(
                "flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                "hover:bg-gray-50",
                isActive && "bg-blue-50 text-blue-600",
                isCompleted && "text-green-600",
                !isActive && !isCompleted && "text-gray-500"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{step.title}</span>
              {isCompleted && (
                <span className="ml-auto text-green-600">✓</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}