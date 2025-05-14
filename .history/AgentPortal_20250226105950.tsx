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