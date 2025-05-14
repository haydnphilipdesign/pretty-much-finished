
import { Card } from "@/components/ui/card";
import { Home, Users, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectionProps extends BaseSectionProps {
  selectedRole: "listing-agent" | "buyers-agent" | "dual-agent" | null;
  onRoleSelect: (role: string) => void;
}

export function RoleSelection({ selectedRole, onRoleSelect, className }: RoleSelectionProps) {
  const roles = [
    {
      id: "listing-agent",
      title: "Listing Agent",
      description: "Representing the seller in this transaction",
      icon: Home
    },
    {
      id: "buyers-agent",
      title: "Buyer's Agent",
      description: "Representing the buyer in this transaction",
      icon: Users
    },
    {
      id: "dual-agent",
      title: "Dual Agent",
      description: "Representing both parties in this transaction",
      icon: UserCheck
    }
  ];

  return (
    <div className={cn("space-y-8 animate-fade-in", className)}>
      <div className="space-y-3">
        <h2 className="tracking-tight font-bold text-3xl text-white">Select Your Role</h2>
        <p className="text-white/70 text-lg max-w-2xl">
          Choose your role in this real estate transaction to continue with the appropriate workflow
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {roles.map(role => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          return (
            <Card 
              key={role.id} 
              className={cn(
                "relative cursor-pointer transition-all hover:shadow-glow animate-scale overflow-hidden group backdrop-blur-lg bg-white/80 border border-white/30 text-slate-800",
                isSelected ? "ring-2 ring-brand-gold bg-white/90" : "hover:bg-white/90"
              )} 
              onClick={() => onRoleSelect(role.id)}
            >
              <div className="p-6">
                <Icon className="h-8 w-8 mb-3 text-brand-gold" />
                <h3 className="font-semibold text-lg mb-1">{role.title}</h3>
                <p className="text-sm text-slate-600">{role.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
