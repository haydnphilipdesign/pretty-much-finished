import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GenerateCoverSheet from '@/components/GenerateCoverSheet';
import Airtable from 'airtable';

// Configure Airtable
const configureAirtable = (): Airtable.Base => {
  return new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
  }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || '');
};

// Table IDs
const TRANSACTIONS_TABLE_ID = 'tblHyCJCpQSgjn0md';

interface Transaction {
  id: string;
  fields: Record<string, any>;
  agentRole: string;
  address: string;
  mlsNumber: string;
}

const TransactionDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTransaction = async () => {
      setLoading(true);
      setError(null);

      try {
        const airtableBase = configureAirtable();
        const record = await airtableBase(TRANSACTIONS_TABLE_ID).find(id as string);

        setTransaction({
          id: record.id,
          fields: record.fields,
          agentRole: record.fields.fldOVyoxz38rWwAFy || 'DUAL AGENT',
          address: record.fields.fldypnfnHhplWYcCW || 'Unknown Address',
          mlsNumber: record.fields.fld6O2FgIXQU5G27o || 'Unknown MLS',
        });
      } catch (err) {
        console.error('Error fetching transaction:', err);
        setError('Failed to load transaction details');
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading transaction details...</div>;
  }

  if (error || !transaction) {
    return <div className="error">{error || 'Transaction not found'}</div>;
  }

  return (
    <div className="transaction-details-page">
      <h1>Transaction Details</h1>
      
      <div className="transaction-info">
        <h2>{transaction.address}</h2>
        <p>MLS #: {transaction.mlsNumber}</p>
        <p>Agent Role: {transaction.agentRole}</p>
      </div>
      
      <div className="cover-sheet-actions">
        <h3>Cover Sheet Generation</h3>
        <p>Generate a cover sheet for this transaction using the button below.</p>
        
        <GenerateCoverSheet 
          tableId={TRANSACTIONS_TABLE_ID}
          recordId={transaction.id}
          agentRole={transaction.agentRole as any}
          className="primary-button"
        />
      </div>
      
      <div className="transaction-fields">
        <h3>All Transaction Fields</h3>
        <table>
          <thead>
            <tr>
              <th>Field ID</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(transaction.fields).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionDetailsPage; 