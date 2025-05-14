// Ensure that 'Dual Agent' is used with the correct capitalization
const agentRole =
  transactionData.agentRole === "dualAgent"
    ? "Dual Agent"
    : transactionData.agentRole;

const submissionData = {
  ...transactionData,
  agentRole: agentRole, // Use the corrected agentRole
  documents: formattedDocs,
}; 