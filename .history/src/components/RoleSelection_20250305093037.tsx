
import { Card } from "@/components/ui/card";
import { Home, Users, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectionProps {
  selectedRole: string | null;
  onRoleSelect: (role: string) => void;
}

const roles = [{
  id: "listing-agent",
  title: "Listing Agent",
  description: "Representing the seller in this transaction",
  icon: Home
}, {
  id: "buyers-agent",
  title: "Buyer's Agent",
  description: "Representing the buyer in this transaction",
  icon: Users
}, {
  id: "dual-agent",
  title: "Dual Agent",
  description: "Representing both parties in this transaction",
  icon: UserCheck
}];

export function RoleSelection({
  selectedRole,
  onRoleSelect
}: RoleSelectionProps) {
  return (
    <div className="space-y-8 animate-fade-in">
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
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-brand-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-8 relative z-10">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors", 
                  isSelected ? "bg-brand-gold text-brand-navy" : "bg-white/70 text-brand-navy group-hover:bg-white/80"
                )}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-slate-800">{role.title}</h3>
                <p className="text-slate-700 leading-relaxed text-lg font-medium">
                  {role.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
