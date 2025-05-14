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

    const result = await submitToAirtable(submissionData);
    // Handle successful submission
  } catch (error) {
    // Handle error
  }
}; 