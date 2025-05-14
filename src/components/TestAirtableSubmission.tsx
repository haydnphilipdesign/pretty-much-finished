import { useState } from 'react';
import { submitToAirtable } from '../utils/airtable.final';
import { Button, Card, CardContent, CardHeader, Typography, Box, CircularProgress } from '@mui/material';
import { TransactionFormState } from '@/types/transactionFormState';

/**
 * Component for testing Airtable submission
 * This allows testing without going through the whole form
 */
const TestAirtableSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  // Test transaction data
  const sampleData: TransactionFormState = {
    clients: [
      {
        id: '1',
        name: 'Test Buyer',
        email: 'testbuyer@example.com',
        phone: '(215) 555-1234',
        address: '123 Test Street, Philadelphia, PA 19103',
        maritalStatus: "SINGLE",
        type: "BUYER",
        role: "buyer"
      },
      {
        id: '2',
        name: 'Test Seller',
        email: 'testseller@example.com',
        phone: '(215) 555-5678',
        address: '456 Sample Ave, Philadelphia, PA 19103',
        maritalStatus: "MARRIED",
        type: "SELLER",
        role: "seller"
      }
    ],
    agentData: {
      role: 'listingAgent',
      agentName: 'Test Agent',
      name: 'Test Agent',
      email: 'testagent@example.com',
      phone: '(215) 555-9012'
    },
    propertyData: {
      mlsNumber: 'PAPH123456',
      address: '789 Test Property, Philadelphia, PA 19103',
      salePrice: '350000',
      propertyStatus: 'vacant',
      isWinterized: 'yes',
      updateMLS: 'yes',
      propertyAccessType: 'ELECTRONIC LOCKBOX',
      lockboxAccessCode: '1234',
      resaleCertRequired: false,
      hoaName: 'Test HOA',
      coRequired: false,
      municipality: 'Philadelphia',
      firstRightOfRefusal: false,
      firstRightName: '',
      attorneyRepresentation: false,
      attorneyName: ''
    },
    propertyDetailsData: {
      resaleCertRequired: false,
      hoaName: 'Test HOA',
      coRequired: false,
      municipality: 'Philadelphia',
      firstRightOfRefusal: false,
      firstRightName: '',
      attorneyRepresentation: false,
      attorneyName: ''
    },
    commissionData: {
      totalCommissionPercentage: '6',
      listingAgentPercentage: '3',
      buyersAgentPercentage: '3',
      brokerFeeAmount: '500',
      sellersAssist: '5000',
      referralParty: '',
      referralFee: '',
      brokerEin: '12-3456789',
      coordinatorFeePaidBy: "client"
    },
    warrantyData: {
      warrantyCompany: 'Test Warranty Co',
      warrantyCost: '500',
      paidBy: 'seller'
    },
    titleData: {
      titleCompany: 'Test Title Co'
    },
    additionalInfo: {
      specialInstructions: 'Test special instructions',
      urgentIssues: 'Test urgent issues',
      notes: 'Test additional notes'
    }
  };

  const handleTestSubmit = async () => {
    setIsSubmitting(true);
    setResult(null);
    setError(null);

    try {
      // Show environment variable info (without exposing actual values)
      console.log('Environment variables:', {
        apiKey: import.meta.env.VITE_AIRTABLE_API_KEY ? 'defined' : 'undefined',
        baseId: import.meta.env.VITE_AIRTABLE_BASE_ID ? 'defined' : 'undefined'
      });
      
      const submitResult = await submitToAirtable(sampleData);
      setResult(submitResult);
      console.log('Test form submission result:', submitResult);
    } catch (err) {
      console.error('Error in test submission:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 800, margin: '20px auto', padding: 2 }}>
      <CardHeader title="Test Airtable Form Submission" />
      <CardContent>
        <Typography variant="body1" gutterBottom>
          This will submit a test transaction to Airtable with sample data.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleTestSubmit} 
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              Submitting...
            </>
          ) : 'Submit Test Transaction'}
        </Button>

        {result && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Success!</Typography>
            <Typography variant="body1">
              Transaction ID: {result.transactionId}
            </Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Error</Typography>
            <Typography variant="body1">{error}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TestAirtableSubmission;
