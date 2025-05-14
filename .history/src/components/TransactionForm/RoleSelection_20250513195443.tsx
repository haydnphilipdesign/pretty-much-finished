import { Home, Users, UserCheck, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { AgentRole } from '@/types/transaction';
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
        <div className="space-y-6">
          {/* Agent Name Field First */}
          <div>
            <Label htmlFor="agent-name" className="text-lg font-semibold text-white block mb-2">
              Your name
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-white/70" />
              </div>
              <Input
                id="agent-name"
                placeholder="Enter your full name"
                className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-sm"
                value={agentName || ''}
                onChange={(e) => onAgentNameChange && onAgentNameChange(e.target.value)}
              />
            </div>
          </div>

          {/* Role Selection with Radio Buttons */}
          <div>
            <Label htmlFor="role-select" className="text-lg font-semibold text-white block mb-3">
              Please select your role
            </Label>

            <RadioGroup
              value={selectedRole}
              onValueChange={(value: AgentRole) => onRoleChange(value)}
              className="space-y-3 flex-col"
            >
              {roles.map(role => (
                <div key={role.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors">
                  <RadioGroupItem
                    value={role.id}
                    id={`role-${role.id}`}
                    className="mt-1 border-white text-white"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`role-${role.id}`}
                      className="flex items-center space-x-2 font-medium text-white cursor-pointer"
                    >
                      {role.icon && <role.icon className="w-5 h-5" />}
                      <span>{role.title}</span>
                    </label>
                    <p className="text-white/80 text-sm mt-1">{role.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {selectedRole && (
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            <div className="flex items-start space-x-3">
              {selectedRoleObj?.icon && <selectedRoleObj.icon className="w-6 h-6 text-white mt-0.5 flex-shrink-0" />}
              <div>
                <p className="font-medium text-white text-lg">
                  {selectedRoleObj?.title}
                </p>
                <p className="text-white/90 mt-2">
                  {selectedRoleObj?.description}
                </p>
                <div className="mt-4 text-sm text-white bg-white/10 p-3 rounded border border-white/10">
                  <p className="text-white">As a {selectedRoleObj?.title.toLowerCase()}, you'll need to provide:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-white">
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
