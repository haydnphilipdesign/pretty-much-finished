import { Home, Users, UserCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AgentRole } from '@/types/transaction';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  return (
    <div className="space-y-6">
      <Label htmlFor="role-select" className="text-2xl font-semibold text-white">Select your role in this transaction</Label>
      
      <Card className="p-6 backdrop-blur-lg bg-white/90 border-white/30 text-slate-800 shadow-md rounded-xl">
        <div className="space-y-6">
          <Select 
            value={selectedRole} 
            onValueChange={(value: AgentRole) => onRoleSelect(value)}
          >
            <SelectTrigger id="role-select" className="bg-white/80 border-slate-300 text-slate-800 w-full">
              <SelectValue placeholder="Select one..." />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role.id} value={role.id} className="cursor-pointer">
                  <div className="flex items-center space-x-2">
                    {role.icon && <role.icon className="w-4 h-4" />}
                    <span>{role.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedRole && (
            <div className="mt-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div className="flex items-start space-x-3">
                {selectedRole === "LISTING AGENT" && <Home className="w-5 h-5 text-blue-600 mt-0.5" />}
                {selectedRole === "BUYERS AGENT" && <Users className="w-5 h-5 text-blue-600 mt-0.5" />}
                {selectedRole === "DUAL AGENT" && <UserCheck className="w-5 h-5 text-blue-600 mt-0.5" />}
                <div>
                  <p className="font-medium text-slate-800">
                    {selectedRole === "LISTING AGENT" ? "Listing Agent" : 
                     selectedRole === "BUYERS AGENT" ? "Buyer's Agent" : 
                     "Dual Agent"}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    {selectedRole === "LISTING AGENT" ? "Representing the seller in this transaction" :
                     selectedRole === "BUYERS AGENT" ? "Representing the buyer in this transaction" :
                     "Representing both the buyer and seller in this transaction"}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {onAutofill && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAutofill}
              className="mt-4 text-slate-600"
            >
              Autofill Test Data
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
