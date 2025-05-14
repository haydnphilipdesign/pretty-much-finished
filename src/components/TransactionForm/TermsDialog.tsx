import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface TermsDialogProps {
  children: React.ReactNode;
}

export function TermsDialog({ children }: TermsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-blue-600 hover:text-blue-800 mx-1 cursor-pointer hover:underline">
          {children}
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Terms and Conditions
          </DialogTitle>
          <DialogDescription>
            Please review the following terms and conditions carefully
          </DialogDescription>
        </DialogHeader>
        
        <div className="terms-content space-y-4 my-4">
          <h2 className="text-lg font-semibold">1. General Terms</h2>
          <p className="text-sm">
            By using the transaction coordination services provided by PA Real Estate Support Services, you agree to the following terms and conditions. These terms govern your use of our services and form a legally binding agreement between you and PA Real Estate Support Services.
          </p>
          
          <h2 className="text-lg font-semibold">2. Services</h2>
          <p className="text-sm">
            PA Real Estate Support Services provides transaction coordination services to real estate professionals. Our services include document organization, deadline tracking, communication coordination, and other administrative support related to real estate transactions.
          </p>
          
          <h2 className="text-lg font-semibold">3. Client Responsibilities</h2>
          <p className="text-sm">
            As a client, you are responsible for:
          </p>
          <ul className="list-disc pl-5 text-sm">
            <li>Providing accurate and complete information about each transaction</li>
            <li>Responding promptly to requests for information or documents</li>
            <li>Reviewing all documents before signing</li>
            <li>Meeting deadlines as outlined in the transaction timeline</li>
            <li>Maintaining active communication throughout the transaction process</li>
          </ul>
          
          <h2 className="text-lg font-semibold">4. Confidentiality</h2>
          <p className="text-sm">
            We understand the sensitive nature of real estate transactions and commit to maintaining the confidentiality of all client information. We will not share your information with third parties unless required for the successful completion of the transaction or as required by law.
          </p>
          
          <h2 className="text-lg font-semibold">5. Data Collection and Storage</h2>
          <p className="text-sm">
            Information collected through our forms and services will be stored securely and used solely for the purpose of transaction coordination. We implement appropriate security measures to protect your data from unauthorized access or disclosure.
          </p>
          
          <h2 className="text-lg font-semibold">6. Limitation of Liability</h2>
          <p className="text-sm">
            PA Real Estate Support Services strives for accuracy and thoroughness in all services provided. However, we are not responsible for errors or omissions in documents or information provided by clients or third parties. Our liability is limited to the fees paid for our services.
          </p>
          
          <h2 className="text-lg font-semibold">7. Payment Terms</h2>
          <p className="text-sm">
            Payment for services is due according to the terms specified in your service agreement. We reserve the right to suspend services for accounts with outstanding balances.
          </p>
          
          <h2 className="text-lg font-semibold">8. Termination</h2>
          <p className="text-sm">
            Either party may terminate the service agreement with written notice. If termination occurs mid-transaction, fees may still apply based on the work completed.
          </p>
          
          <h2 className="text-lg font-semibold">9. Changes to Terms</h2>
          <p className="text-sm">
            We reserve the right to modify these terms and conditions at any time. Changes will be communicated via email or our website, and continued use of our services constitutes acceptance of the modified terms.
          </p>
          
          <h2 className="text-lg font-semibold">10. Governing Law</h2>
          <p className="text-sm">
            These terms and conditions are governed by the laws of the Commonwealth of Pennsylvania. Any disputes arising from these terms will be resolved through arbitration in Pennsylvania.
          </p>
        </div>
        
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button>I Understand</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}