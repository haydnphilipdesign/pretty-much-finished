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

    // Show feedback dialog after successful submission
    const feedbackDialog = document.createElement('dialog');
    feedbackDialog.className = 'feedback-dialog';
    feedbackDialog.innerHTML = `
      <div class="feedback-content" style="padding: 20px; background: white; border-radius: 8px; max-width: 500px;">
        <h2 style="color: #B40101; margin-bottom: 15px;">Help Us Improve!</h2>
        <p style="margin-bottom: 20px;">How was your experience with our transaction form?</p>
        <div class="rating" style="margin-bottom: 20px;">
          ${[1, 2, 3, 4, 5].map(num => 
            `<button class="rating-btn" data-rating="${num}" style="margin: 0 5px; padding: 8px 12px; border: 1px solid #B40101; background: white; color: #B40101; border-radius: 4px; cursor: pointer;">${num}</button>`
          ).join('')}
        </div>
        <textarea placeholder="Any additional feedback?" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button class="cancel-btn" style="padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer;">Skip</button>
          <button class="submit-btn" style="padding: 8px 16px; background: #B40101; color: white; border: none; border-radius: 4px; cursor: pointer;">Submit Feedback</button>
        </div>
      </div>
    `;

    document.body.appendChild(feedbackDialog);
    feedbackDialog.showModal();

    // Handle feedback submission
    feedbackDialog.querySelector('.submit-btn').addEventListener('click', async () => {
      const rating = feedbackDialog.querySelector('.rating-btn.selected')?.dataset.rating;
      const comment = feedbackDialog.querySelector('textarea').value;
      
      if (rating) {
        try {
          await submitToAirtable({
            type: 'feedback',
            rating: parseInt(rating),
            comment,
            submissionId,
            timestamp: new Date().toISOString()
          });
          
          toast({
            title: "Thank You!",
            description: "Your feedback has been submitted.",
            variant: "success"
          });
        } catch (error) {
          console.error('Failed to submit feedback:', error);
        }
      }
      
      feedbackDialog.close();
      feedbackDialog.remove();
    });

    // Handle rating button clicks
    feedbackDialog.querySelectorAll('.rating-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        feedbackDialog.querySelectorAll('.rating-btn').forEach(b => {
          b.style.background = 'white';
          b.style.color = '#B40101';
          b.classList.remove('selected');
        });
        btn.style.background = '#B40101';
        btn.style.color = 'white';
        btn.classList.add('selected');
      });
    });

    // Handle cancel button
    feedbackDialog.querySelector('.cancel-btn').addEventListener('click', () => {
      feedbackDialog.close();
      feedbackDialog.remove();
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
