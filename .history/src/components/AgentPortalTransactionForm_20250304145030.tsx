
import PortalTransactionForm from './TransactionForm/PortalTransactionForm';
import Header from './Header';
impor
interface AgentPortalTransactionFormProps {
  agent: {
    id: string;
    name?: string;
  };
  onSubmissionComplete?: (data: any) => void;
}

const AgentPortalTransactionForm = ({ 
  agent, 
  onSubmissionComplete 
}: AgentPortalTransactionFormProps) => {
  
  const handleFormSubmit = (data: any) => {
    console.log(`Transaction submitted by ${agent.name || agent.id}:`, data);
    
    // You can add additional logic here like navigating to a different page
    // or showing a success modal
    
    if (onSubmissionComplete) {
      onSubmissionComplete(data);
    }
  };
  
  return (
    <div className="agent-portal-form-container">
      <h2 className="text-2xl font-semibold mb-6">Submit New Transaction</h2>
      
      <PortalTransactionForm
        onFormSubmit={handleFormSubmit}
        agentId={agent.id}
        logo="/logo-flat.png" // Update with your actual logo path
      />
    </div>
  );
};

export default AgentPortalTransactionForm;
