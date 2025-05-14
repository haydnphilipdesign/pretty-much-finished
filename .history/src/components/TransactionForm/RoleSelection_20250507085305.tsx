import { Home, Users, UserCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AgentRole } from '@/types/transaction';
import { Button } from "@/components/ui/button";

interface RoleSelectionProps {
  selectedRole: AgentRole;
  onRoleSelect: (role: AgentRole) => void;
  onAutofill?: () => void;
}

const roles = [{
  id: "LISTING AGENT",
  title: "Listing Agent",
  description: "Representing the seller in this transaction",
  icon: Home
}, {
  id: "BUYERS AGENT",
  title: "Buyer's Agent",
  description: "Representing the buyer in this transaction",
  icon: Users
}, {
  id: "DUAL AGENT",
  title: "Dual Agent",
  description: "Representing both parties in this transaction",
  icon: UserCheck
}];

export function RoleSelection({ selectedRole, onRoleSelect, onAutofill }: RoleSelectionProps) {
  const handleRoleSelect = (value: AgentRole) => {
    console.log("Role selected in component:", value);
    if (typeof onRoleSelect !== 'function') {
      console.error('onRoleSelect is not a function');
      return;
    }
    onRoleSelect(value);
  };

  console.log("Current selected role:", selectedRole);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-3">
        <h2 className="tracking-tight font-bold text-3xl text-white">Select Your Role</h2>
        <p className="text-white/70 text-lg max-w-2xl">
          Choose your role in this real estate transaction to continue with the appropriate workflow
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-white text-lg">Agent Role</Label>
          <Select 
            value={selectedRole}
            onValueChange={handleRoleSelect}
            defaultValue={selectedRole}
          >
            <SelectTrigger className="w-full bg-white/90 border-white/30 text-slate-800">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {roles.map((role) => (
            <div 
              key={role.id}
              onClick={() => handleRoleSelect(role.id as AgentRole)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedRole === role.id 
                  ? 'bg-white/90 border-blue-500 shadow-md' 
                  : 'bg-white/60 border-white/30 hover:bg-white/80'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-full ${
                  selectedRole === role.id ? 'bg-blue-100' : 'bg-slate-100'
                }`}>
                  <role.icon className={`h-5 w-5 ${
                    selectedRole === role.id ? 'text-blue-600' : 'text-slate-600'
                  }`} />
                </div>
                <h3 className="font-semibold text-slate-800">{role.title}</h3>
              </div>
              <p className="text-sm text-slate-600">{role.description}</p>
            </div>
          ))}
        </div>
        
        {onAutofill && (
          <div className="mt-6">
            <Button 
              type="button" 
              onClick={onAutofill}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Auto-Fill Example Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
