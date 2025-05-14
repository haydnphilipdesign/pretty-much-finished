import React, { useState } from 'react';
import { submitToAirtable } from '@/utils/airtable';
import CoverSheetButton from '@/components/CoverSheetButton';
import { TransactionFormData } from '@/types/transaction';

const ExampleIntegration = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [agentRole, setAgentRole] = useState<'BUYERS AGENT' | 'LISTING AGENT' | 'DUAL AGENT'>('DUAL AGENT');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Example form submission handler
  const handleSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Create a sample form data object
      // In a real implementation, you would get this from your form
      const formData: TransactionFormData = {
        agentData: {
          role: agentRole,
          name: 'John Smith',
          email: 'john@example.com',
          phone: '555-123-4567'
        },
        propertyData: {
          address: '123 Main St, Anytown, PA 12345',
          mlsNumber: 'MLS12345',
          salePrice: '350000',
          status: 'OCCUPIED',
          isWinterized: 'NO',
          updateMls: 'YES',
          propertyAccessType: 'ELECTRONIC LOCKBOX',
          lockboxAccessCode: '1234',
          county: 'Example County',
          propertyType: 'RESIDENTIAL',
          isBuiltBefore1978: 'NO',
          closingDate: '2023-12-31'
        },
        propertyDetailsData: {
          resaleCertRequired: false,
          hoaName: 'Example HOA',
          coRequired: false,
          municipality: 'Example Township',
          firstRightOfRefusal: false,
          firstRightName: '',
          attorneyRepresentation: true,
          attorneyName: 'Example Attorney',
          homeWarranty: true,
          warrantyCompany: 'Example Warranty Company',
          warrantyCost: '500',
          warrantyPaidBy: 'SELLER'
        },
        titleData: {
          titleCompany: 'Example Title Company'
        },
        signatureData: {
          signature: 'John Smith',
          confirmAccuracy: true
        },
        documentsData: {
          documents: [
            { name: 'Agreement of Sale', required: true, selected: true },
            { name: 'Seller Disclosure', required: true, selected: true },
            { name: 'Lead-Based Paint Disclosure', required: false, selected: false },
            { name: 'Propaganda Brochure', required: false, selected: true },
            { name: 'Community Documents', required: false, selected: false }
          ],
          confirmDocuments: true
        },
        clients: [
          {
            id: '1',
            name: 'Buyer Name',
            email: 'buyer@example.com',
            phone: '555-111-2222',
            address: '456 Buyer St, Buyertown, PA 12346',
            maritalStatus: 'MARRIED',
            type: 'BUYER'
          },
          {
            id: '2',
            name: 'Seller Name',
            email: 'seller@example.com',
            phone: '555-333-4444',
            address: '789 Seller Ave, Sellersville, PA 12347',
            maritalStatus: 'SINGLE',
            type: 'SELLER'
          }
        ],
        commissionData: {
          totalCommissionPercentage: '6',
          listingAgentPercentage: '3',
          buyersAgentPercentage: '3',
          hasBrokerFee: false,
          brokerFeeAmount: '',
          hasSellersAssist: true,
          sellersAssist: '5000',
          isReferral: false,
          referralParty: '',
          brokerEin: '',
          referralFee: '',
          coordinatorFeePaidBy: 'agent'
        },
        additionalInfo: {
          specialInstructions: 'Example special instructions',
          urgentIssues: '',
          notes: 'Example notes'
        }
      };

      // Submit the form data to Airtable
      const result = await submitToAirtable(formData);

      // Update state with the result
      setSubmitted(true);
      setTransactionId(result.transactionId);
      setPdfUrl(result.pdfUrl || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during submission';
      setError(errorMessage);
      console.error('Error submitting form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAgentRole(event.target.value as 'BUYERS AGENT' | 'LISTING AGENT' | 'DUAL AGENT');
  };

  return (
    <div className="example-integration" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Cover Sheet Generator Integration Example</h1>
      <p>
        This example shows how the cover sheet generation is integrated with form submissions.
        When you submit the form, the data is sent to Airtable and a cover sheet is automatically generated.
      </p>

      <div className="form-container" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <h2>Example Form</h2>
        <form onSubmit={handleSubmitForm}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="agentRole" style={{ display: 'block', marginBottom: '5px' }}>
              Agent Role:
            </label>
            <select
              id="agentRole"
              value={agentRole}
              onChange={handleRoleChange}
              style={{ padding: '8px', width: '100%' }}
            >
              <option value="BUYERS AGENT">Buyer's Agent</option>
              <option value="LISTING AGENT">Listing Agent</option>
              <option value="DUAL AGENT">Dual Agent</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Form'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message" style={{ color: 'red', marginTop: '20px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {submitted && transactionId && (
        <div className="success-message" style={{ marginTop: '20px', padding: '10px', border: '1px solid #4CAF50', borderRadius: '4px', backgroundColor: '#f0f8f0' }}>
          <h3>Form Submitted Successfully!</h3>
          <p>Transaction ID: {transactionId}</p>
          
          {pdfUrl ? (
            <div>
              <p>Cover sheet was automatically generated!</p>
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '10px 15px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  marginTop: '10px'
                }}
              >
                View Cover Sheet
              </a>
            </div>
          ) : (
            <div>
              <p>Cover sheet could not be automatically generated. You can generate it manually:</p>
              <CoverSheetButton 
                transactionId={transactionId} 
                agentRole={agentRole}
                className="primary-button"
                onSuccess={(url) => setPdfUrl(url)}
              />
            </div>
          )}
        </div>
      )}

      <div className="explanation" style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        <h2>How It Works</h2>
        <p>
          The cover sheet generation is now integrated directly into the form submission process:
        </p>
        <ol>
          <li>When the form is submitted, data is sent to Airtable using the <code>submitToAirtable</code> function</li>
          <li>After successful submission, the function automatically calls <code>generateCoverSheetForTransaction</code></li>
          <li>The PDF is generated based on the agent role and transaction data</li>
          <li>The URL to the generated PDF is returned alongside the transaction ID</li>
          <li>The user can immediately view and download the generated cover sheet</li>
        </ol>
        <p>
          This approach simplifies the process by making PDF generation a natural extension of form submission,
          with no need for separate processes or duplicate data handling.
        </p>
      </div>
    </div>
  );
};

export default ExampleIntegration; 