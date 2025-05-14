import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Trash, User, UserCheck } from "lucide-react";
import { ClientFormFields } from './client/ClientFormFields';
import type { Client, AgentRole } from '@/types/transaction';
import { v4 as uuidv4 } from 'uuid';

interface ClientInformationProps {
  clients: Client[];
  onChange: (clients: Client[]) => void;
  agentRole?: AgentRole;
  onAddClient?: () => void;
  onRemoveClient?: (id: string) => void;
  onClientChange?: (id: string, field: string, value: any) => void;
  role?: string;
}

export const ClientInformation: React.FC<ClientInformationProps> = ({
  clients,
  role,
  onClientChange,
  onAddClient,
  onRemoveClient,
  onChange
}) => {
  // Define default handlers
  const handleRemoveClient = (id: string) => {
    if (onRemoveClient) {
      onRemoveClient(id);
    } else {
      // Default implementation
      onChange(clients.filter(client => client.id !== id));
    }
  };

  const handleClientChange = (id: string, field: string, value: any) => {
    if (onClientChange) {
      onClientChange(id, field, value);
    } else {
      // Default implementation
      onChange(clients.map(client => 
        client.id === id ? { ...client, [field]: value } : client
      ));
    }
  };

  const handleAddClient = () => {
    if (onAddClient) {
      onAddClient();
    } else {
      // Default implementation
      const clientType = role === "LISTING AGENT" ? "SELLER" : "BUYER";
      const newClient: Client = {
        id: uuidv4(),
        name: '',
        email: '',
        phone: '',
        address: '',
        maritalStatus: 'SINGLE',
        type: clientType
      };
      onChange([...clients, newClient]);
    }
  };

  // Update client types when role changes or component loads
  useEffect(() => {
    if (role && clients.length > 0) {
      let needsUpdate = false;
      const updatedClients = clients.map(client => {
        // For listing agent, all clients should be sellers
        if (role === "LISTING AGENT" && client.type !== "SELLER") {
          needsUpdate = true;
          return { ...client, type: "SELLER" };
        }
        // For buyers agent, all clients should be buyers
        else if (role === "BUYERS AGENT" && client.type !== "BUYER") {
          needsUpdate = true;
          return { ...client, type: "BUYER" };
        }
        return client;
      });
      
      // Only update if needed to avoid infinite loops
      if (needsUpdate) {
        onChange(updatedClients);
      }
    }
  }, [role, clients, onChange]);

  // Determine client type label based on role
  const getClientTypeLabel = () => {
    if (role === "LISTING AGENT") return "Seller";
    if (role === "BUYERS AGENT") return "Buyer";
    return "Client";
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {clients.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No {getClientTypeLabel()}s Added Yet</h3>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">Add information about the {getClientTypeLabel().toLowerCase()}(s) for this transaction.</p>
          <Button
            onClick={handleAddClient}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add {getClientTypeLabel()}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {clients.map((client, index) => (
            <div 
              key={client.id} 
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Client header */}
              <div className="flex items-center justify-between bg-blue-50 px-6 py-3 border-b border-blue-100">
                <div className="flex items-center gap-2">
                  {role === "LISTING AGENT" ? (
                    <User className="h-5 w-5 text-blue-600" />
                  ) : role === "BUYERS AGENT" ? (
                    <Users className="h-5 w-5 text-blue-600" />
                  ) : (
                    <UserCheck className="h-5 w-5 text-blue-600" />
                  )}
                  <h3 className="font-medium text-blue-800">
                    {getClientTypeLabel()} {clients.length > 1 ? `#${index + 1}` : ''}
                  </h3>
                </div>
                
                {clients.length > 1 && (
                  <Button
                    onClick={() => handleRemoveClient(client.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              
              {/* Client form fields */}
              <div className="p-6">
                <ClientFormFields
                  client={client}
                  onClientChange={(field, value) => handleClientChange(client.id, field, value)}
                  role={role as AgentRole}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            onClick={handleAddClient}
            variant="outline"
            className="w-full py-4 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 mt-4 flex items-center justify-center"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add Another {getClientTypeLabel()}
          </Button>
        </div>
      )}
    </div>
  );
};
