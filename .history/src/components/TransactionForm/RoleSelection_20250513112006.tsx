import { Home, Users, UserCheck, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AgentRole } from '@/types/transaction';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RoleSelectionProps {
  selectedRole?: string;
  onRoleChange: (role: any) => void;
  agentName?: string;
  onAgentNameChange?: (name: string) => void;
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

export function RoleSelection({ selectedRole, onRoleChange, agentName, onAgentNameChange }: RoleSelectionProps) {
  const selectedRoleObj = roles.find(role => role.id === selectedRole);
  
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label htmlFor="role-select" className="text-lg font-semibold text-gray-800 block">
            Please select your role
          </Label>
          
          <Select 
            value={selectedRole} 
            onValueChange={(value: AgentRole) => onRoleChange(value)}
          >
            <SelectTrigger id="role-select" className="bg-white border-gray-300 text-gray-800 w-full">
              <SelectValue placeholder="Select your role..." />
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
          
          <div className="mt-4">
            <Label htmlFor="agent-name" className="text-sm font-medium text-gray-700 block mb-2">
              Your name
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="agent-name"
                placeholder="Enter your full name"
                className="pl-10 bg-white border-gray-300 text-gray-800"
                value={agentName || ''}
                onChange={(e) => onAgentNameChange && onAgentNameChange(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {selectedRole && (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <div className="flex items-start space-x-3">
              {selectedRoleObj?.icon && <selectedRoleObj.icon className="w-6 h-6 text-blue-700 mt-0.5 flex-shrink-0" />}
              <div>
                <p className="font-medium text-blue-900 text-lg">
                  {selectedRoleObj?.title}
                </p>
                <p className="text-gray-700 mt-2">
                  {selectedRoleObj?.description}
                </p>
                <div className="mt-4 text-sm text-gray-800 bg-blue-100/50 p-3 rounded">
                  <p>As a {selectedRoleObj?.title.toLowerCase()}, you'll need to provide:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-800">
                    <li>Property information</li>
                    <li>Client details</li>
                    <li>Commission structure</li>
                    {selectedRole === "LISTING AGENT" && <li>Property access information</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
