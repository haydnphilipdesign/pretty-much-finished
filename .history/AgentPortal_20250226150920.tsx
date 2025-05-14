import { submitToAirtable } from '../utils/airtable';
import { useToast } from '@/components/ui/use-toast';

// Ensure that 'Dual Agent' is used with the correct capitalization
const agentRole =
  transactionData.agentRole === "dualAgent"
    ? "Dual Agent"
    : transactionData.agentRole;

const submissionData = {
  ...transactionData,
  documents: formattedDocs,
};

const agentRoleOptions = [
  { value: "Listing Agent", label: "Listing Agent" },
  { value: "Buyer's Agent", label: "Buyer's Agent" },
  { value: "Dual Agent", label: "Dual Agent" },
];

const handleSubmit = async (formData) => {
  const toast = useToast();
  const submissionId = Date.now().toString();
  
  console.log(`[${submissionId}] Starting form submission`, {
    timestamp: new Date().toISOString(),
    agentRole: formData.agentRole,
    mlsNumber: formData.mlsNumber,
    clientCount: formData.clients.length
  });

  try {
    const submissionData = {
      agentRole: formData.agentRole,
      propertyData: {
        mlsNumber: formData.mlsNumber,
        address: formData.address,
        salePrice: formData.salePrice,
        status: formData.status,
        isWinterized: formData.isWinterized,
        updateMls: formData.updateMls
      },
      commissionData: {
        commissionBase: formData.commissionBase,
        sellersAssist: formData.sellersAssist,
        totalCommission: formData.totalCommission,
        listingAgentCommission: formData.listingAgentCommission,
        buyersAgentCommission: formData.buyersAgentCommission,
        buyerPaidCommission: formData.buyerPaidCommission,
        isReferral: formData.isReferral,
        referralParty: formData.referralParty,
        brokerEin: formData.brokerEin,
        referralFee: formData.referralFee
      },
      clients: formData.clients.map(client => ({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        type: client.type,
        maritalStatus: client.maritalStatus
      })),
      documents: formData.documents,
      additionalInfo: {
        specialInstructions: formData.specialInstructions,
        urgentIssues: formData.urgentIssues,
        notes: formData.notes,
        requiresFollowUp: formData.requiresFollowUp
      },
      signatureData: {
        agentName: formData.agentName,
        termsAccepted: formData.termsAccepted,
        infoConfirmed: formData.infoConfirmed,
        signature: formData.signature
      }
    };

    console.log(`[${submissionId}] Submitting to Airtable`, {
      timestamp: new Date().toISOString(),
      mlsNumber: submissionData.propertyData.mlsNumber,
      address: submissionData.propertyData.address
    });

    const result = await submitToAirtable(submissionData);
    
    console.log(`[${submissionId}] Submission successful`, {
      timestamp: new Date().toISOString(),
      transactionId: result.id,
      mlsNumber: submissionData.propertyData.mlsNumber
    });

    toast({
      title: "Success",
      description: "Transaction submitted successfully",
      variant: "success"
    });

  } catch (error) {
    console.error(`[${submissionId}] Submission failed`, {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      formData: {
        mlsNumber: formData.mlsNumber,
        address: formData.address,
        agentRole: formData.agentRole,
        clientCount: formData.clients.length
      }
    });

    toast({
      title: "Error",
      description: "Failed to submit transaction. Please try again.",
      variant: "destructive"
    });
  }
};
