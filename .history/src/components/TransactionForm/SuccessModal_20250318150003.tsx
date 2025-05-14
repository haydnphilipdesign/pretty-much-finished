import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Download, Mail } from "lucide-react";

interface SuccessModalProps {
  onDismiss: () => void;
  onNewTransaction: () => void;
  transactionId?: string;
}

export function SuccessModal({ onDismiss, onNewTransaction, transactionId }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="p-6 bg-white w-full max-w-md rounded-xl">
        <div className="flex flex-col items-center text-center space-y-4">
          <CheckCircle className="text-green-500 w-16 h-16" />
          <h2 className="text-2xl font-bold text-slate-800">Transaction Submitted!</h2>
          <p className="text-slate-600">
            Your transaction has been successfully submitted to Airtable.
            {transactionId && (
              <span className="block mt-2">Transaction ID: {transactionId}</span>
            )}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onClick={() => {
                // Implement email sending logic
                window.location.href = `mailto:?subject=Transaction Submitted&body=Transaction ID: ${transactionId}`;
              }}
            >
              <Mail size={16} />
              Email Receipt
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onClick={() => {
                // Implement PDF generation and download logic
                alert('PDF download would happen here');
              }}
            >
              <Download size={16} />
              Download PDF
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              variant="default" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={onNewTransaction}
            >
              Start New Transaction
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={onDismiss}
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 