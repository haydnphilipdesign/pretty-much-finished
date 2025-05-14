import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AgentRole } from "@/types/transaction";

// Import components
import RoleSelection from "./RoleSelection";
import PropertySection from "./PropertySection";
import ClientInformation from "./ClientInformation";
import CommissionSection from "./CommissionSection";
import PropertyAccessSection from "./PropertyAccessSection";
import PropertyDetailsSection from "./PropertyDetailsSection";
import AdditionalInfoSection from "./AdditionalInfoSection";
import DocumentsSection from "./DocumentsSection";
import SignatureSection from "./SignatureSection";
import FormNavigation from "./FormNavigation";

// Create a new QueryClient instance
const queryClient = new QueryClient();

export function TransactionFormWithAutofill() {
  // Basic form state
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 8;
  
  // Agent data state with autofill capability
  const [agentData, setAgentData] = useState({
    role: "",
    name: "",
    email: "",
    phone: ""
  });
  
  // Property data state
  const [propertyData, setPropertyData] = useState({
    mlsNumber: "",
    address: "",
    salePrice: "",
    status: "VACANT" as "VACANT" | "OCCUPIED",
    isWinterized: "YES" as "YES" | "NO",
    updateMls: "YES" as "YES" | "NO",
    propertyAccessType: "ELECTRONIC LOCKBOX" as "ELECTRONIC LOCKBOX" | "COMBO LOCKBOX" | "KEYPAD" | "APPOINTMENT ONLY",
    lockboxAccessCode: "",
    county: "",
    propertyType: "RESIDENTIAL" as "RESIDENTIAL" | "COMMERCIAL" | "LAND",
    isBuiltBefore1978: "YES" as "YES" | "NO" | "",
    closingDate: ""
  });
  
  // Clients data state
  const [clients, setClients] = useState<any[]>([]);
  
  // Other form sections state
  const [commissionData, setCommissionData] = useState({});
  const [propertyDetails, setPropertyDetails] = useState({});
  const [titleData, setTitleData] = useState({});
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [documentsData, setDocumentsData] = useState({ documents: [], confirmDocuments: false });
  const [signatureData, setSignatureData] = useState({ signature: "", confirmAccuracy: false });
  
  // Handle role selection
  const handleRoleSelect = (role: AgentRole) => {
    setAgentData({
      ...agentData,
      role
    });
  };

  // Simple autofill function
  const handleAutofill = () => {
    // Set a default role - this will be enough to activate the Next button
    const testRole = "DUAL AGENT";
    setAgentData({
      ...agentData,
      role: testRole as AgentRole,
      name: "Test Agent",
      email: "test.agent@example.com",
      phone: "2155551234"
    });
    
    // Optionally, create test data for other form sections if needed
    // This demonstrates the flexibility of the autofill function
    setPropertyData({
      mlsNumber: "MLS-" + Math.floor(Math.random() * 100000),
      address: "123 Test Street, Philadelphia, PA 19103",
      salePrice: "450000",
      status: "VACANT",
      isWinterized: "YES",
      updateMls: "YES",
      propertyAccessType: "ELECTRONIC LOCKBOX",
      lockboxAccessCode: "1234",
      county: "Philadelphia",
      propertyType: "RESIDENTIAL",
      isBuiltBefore1978: "YES",
      closingDate: new Date().toISOString().split('T')[0]
    });
    
    // Set dummy client data
    setClients([
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "2155551234",
        address: "456 Oak Avenue, Philadelphia, PA 19103",
        maritalStatus: "MARRIED",
        type: "SELLER"
      },
      {
        id: "2",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "2155555678",
        address: "789 Pine Street, Philadelphia, PA 19103",
        maritalStatus: "SINGLE",
        type: "BUYER"
      }
    ]);
    
    // Show success toast
    toast({
      title: "Form Autofilled",
      description: "Test data has been loaded into the form",
    });
    
    // Optionally, move to the next step to view the data
    // setCurrentStep(1);
  };

  // Function to handle property data changes
  const handlePropertyChange = (field: string, value: any) => {
    setPropertyData(prev => ({ ...prev, [field]: value }));
  };

  // Function to add a client
  const handleAddClient = () => {
    const newClient = {
      id: Date.now().toString(),
      name: "",
      email: "",
      phone: "",
      address: "",
      maritalStatus: "SINGLE",
      type: "BUYER"
    };
    setClients([...clients, newClient]);
  };

  // Function to remove a client
  const handleRemoveClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
  };

  // Function to update client fields
  const handleClientChange = (id: string, field: string, value: string) => {
    setClients(clients.map(client => 
      client.id === id ? { ...client, [field]: value } : client
    ));
  };

  // Render the form
  return (
    <QueryClientProvider client={queryClient}>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="min-h-screen pb-20 bg-gradient-to-b from-blue-700 to-indigo-900"
      >
        <div className="container max-w-5xl mx-auto px-4 py-10">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Real Estate Transaction Form</h1>
            <p className="text-white/90 text-lg">
              Complete the form below to submit transaction details to PARESS
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="space-y-8">
              {currentStep === 0 && (
                <RoleSelection 
                  selectedRole={agentData.role as AgentRole}
                  onSelectRole={handleRoleSelect}
                  onNext={() => setCurrentStep(1)}
                  onAutofill={handleAutofill}
                />
              )}
              
              {currentStep === 1 && (
                <PropertySection 
                  data={propertyData}
                  onChange={handlePropertyChange}
                />
              )}
              
              {currentStep === 2 && (
                <ClientInformation
                  clients={clients}
                  onAddClient={handleAddClient}
                  onRemoveClient={handleRemoveClient}
                  onClientChange={handleClientChange}
                  role={agentData.role as AgentRole}
                  onChange={() => {}}
                />
              )}
              
              {/* Add other form sections as needed */}
              
              <FormNavigation 
                currentStep={currentStep} 
                totalSteps={totalSteps} 
                onNext={() => setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))} 
                onPrevious={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
                onSubmit={() => console.log("Form submitted")}
              />
            </div>
          </div>
        </div>
        <Toaster />
      </motion.div>
    </QueryClientProvider>
  );
} 