import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { submitToAirtable } from '@/utils/airtable';
import { AgentRole, TransactionFormData } from '@/types/transaction';

// Fix the toast initialization - it should be inside a component
export default function AgentPortal() {
  const { toast } = useToast();

  // Initialize state for transaction data
  const [transactionData, setTransactionData] = useState({
    agentRole: 'listingAgent' as AgentRole,
    mlsNumber: '',
    address: '',
    salePrice: '',
    status: 'Occupied',
    isWinterized: false,
    updateMls: false,
    county: '',
    isBuiltBefore1978: false,
    propertyType: 'residential',
    price: '',
    closingDate: ''
  });

  // Define the FormattedDocument interface locally if it's not exported
  interface FormattedDocument {
    name: string;
    url: string;
    type: string;
    size?: number;
    uploadDate?: string;
  }

  const [formattedDocs, setFormattedDocs] = useState<FormattedDocument[]>([]);

  // Ensure that agent role values are consistent with AgentRole type
  const agentRole =
    transactionData.agentRole === "dualAgent"
      ? "dualAgent"
      : transactionData.agentRole;

  const submissionData = {
    ...transactionData,
    documents: formattedDocs
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Prepare data for submission
      const formData: TransactionFormData & { selectedRole: string } = {
        propertyData: {
          mlsNumber: transactionData.mlsNumber,
          address: transactionData.address,
          salePrice: transactionData.salePrice,
          propertyStatus: transactionData.status as "OCCUPIED" | "VACANT",
          isWinterized: transactionData.isWinterized ? "YES" : "NO",
          updateMls: transactionData.updateMls ? "YES" : "NO",
          resaleCertRequired: false,
          hoaName: null,
          coRequired: false,
          municipality: null,
          firstRightOfRefusal: false,
          firstRightName: null,
          attorneyRepresentation: false,
          attorneyName: null
        },
        commissionData: {
          commissionBase: "SALE PRICE",
          sellersAssist: "",
          totalCommission: "",
          totalCommissionPercentage: "",
          fixedCommissionAmount: "",
          listingAgentPercentage: "",
          buyersAgentPercentage: "",
          buyerPaidPercentage: "",
          isReferral: "NO",
          referralParty: "",
          brokerEin: "",
          referralFee: ""
        },
        clients: [],
        additionalInfo: {
          specialInstructions: "",
          urgentIssues: "",
          notes: "",
          requiresFollowUp: "NO"
        },
        agentData: {
          role: transactionData.agentRole,
          agentName: ""
        },
        selectedRole: transactionData.agentRole
      };

      // Submit to Airtable
      const response = await submitToAirtable(formData);
      
      if (response.success) {
        toast({
          title: "Success!",
          description: "Your transaction has been submitted successfully.",
          variant: "default", // Use "default" instead of "success"
        });
      } else {
        toast({
          title: "Error",
          description: "There was an error submitting your transaction. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fix the event handler for file uploads
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString()
      }));
      
      setFormattedDocs([...formattedDocs, ...newFiles]);
    }
  };

  // Fix the DOM manipulation
  const handleRemoveDocument = (index: number) => {
    const updatedDocs = [...formattedDocs];
    updatedDocs.splice(index, 1);
    setFormattedDocs(updatedDocs);
  };

  return (
    <                                                                                                                                                                                                                                                                                                                                                                  >
      {/* Your JSX here */}
    </div>
  );
}
