import Airtable from 'airtable';
import { submitToAirtable } from './airtable';

// Type definitions for better code organization
interface AirtableBase {
  getTable: (tableName: string) => Airtable.Table<any>;
}

type FieldType = 'singleLineText' | 'email' | 'phoneNumber' | 'currency' | 'percent' | 'singleSelect' | 'checkbox' | 'foreignKey';

interface TableConfig {
  name: string;
  fields: {
    name: string;
    type: FieldType;
    options?: any;
  }[];
}

const TRANSACTION_TABLE_CONFIG: TableConfig = {
  name: 'Transactions',
  fields: [
    {
      name: 'MLS Number',
      type: 'singleLineText',
      options: {
        validation: {
          pattern: '^(?:\\d{6}|PM-\\d{6})$',
          message: 'MLS number must be either 6 digits or PM-xxxxxx format'
        }
      }
    },
    {
      name: 'Property Address',
      type: 'singleLineText',
      options: { required: true }
    },
    {
      name: 'Sale Price',
      type: 'currency',
      options: { required: true }
    },
    {
      name: 'Status',
      type: 'singleSelect',
      options: {
        choices: [
          { name: 'Vacant' },
          { name: 'Occupied' }
        ]
      }
    },
    {
      name: 'Is Winterized',
      type: 'checkbox'
    },
    {
      name: 'Update MLS',
      type: 'checkbox'
    },
    {
      name: 'County',
      type: 'singleLineText',
      options: { required: true }
    },
    {
      name: 'Agent Role',
      type: 'singleSelect',
      options: {
        choices: [
          { name: "Buyer's Agent" },
          { name: 'Listing Agent' },
          { name: 'Dual Agent' }
        ]
      }
    }
  ]
};

const CLIENT_TABLE_CONFIG: TableConfig = {
  name: 'Clients',
  fields: [
    {
      name: 'Name',
      type: 'singleLineText',
      options: { required: true }
    },
    {
      name: 'Email',
      type: 'email',
      options: { required: true }
    },
    {
      name: 'Phone',
      type: 'phoneNumber',
      options: {
        validation: {
          pattern: '^\\d{10}$',
          message: 'Phone number must be 10 digits'
        }
      }
    },
    {
      name: 'Address',
      type: 'singleLineText',
      options: { required: true }
    },
    {
      name: 'Marital Status',
      type: 'singleSelect',
      options: {
        choices: [
          { name: 'Single' },
          { name: 'Married' },
          { name: 'Divorced' },
          { name: 'Widowed' }
        ]
      }
    },
    {
      name: 'Type',
      type: 'singleSelect',
      options: {
        choices: [
          { name: 'Buyer' },
          { name: 'Seller' }
        ]
      }
    },
    {
      name: 'Related Transaction',
      type: 'foreignKey',
      options: {
        foreignTableId: 'Transactions',
        relationship: 'many-to-one'
      }
    }
  ]
};

const COMMISSION_TABLE_CONFIG: TableConfig = {
  name: 'Commissions',
  fields: [
    {
      name: 'Commission Base',
      type: 'singleSelect',
      options: {
        choices: [
          { name: 'Sale Price' },
          { name: 'Other' }
        ]
      }
    },
    {
      name: 'Total Commission',
      type: 'currency',
      options: { required: true }
    },
    {
      name: 'Listing Agent Commission',
      type: 'percent'
    },
    {
      name: 'Buyers Agent Commission',
      type: 'percent'
    },
    {
      name: 'Buyer Paid Commission',
      type: 'percent'
    },
    {
      name: 'Sellers Assist',
      type: 'currency'
    },
    {
      name: 'Is Referral',
      type: 'checkbox'
    },
    {
      name: 'Referral Party',
      type: 'singleLineText'
    },
    {
      name: 'Broker EIN',
      type: 'singleLineText',
      options: {
        validation: {
          pattern: '^\\d{2}-\\d{7}$',
          message: 'Invalid EIN format'
        }
      }
    },
    {
      name: 'Referral Fee',
      type: 'percent'
    },
    {
      name: 'Coordinator Fee Paid By',
      type: 'singleSelect',
      options: {
        choices: [
          { name: 'Client' },
          { name: 'Agent' }
        ]
      }
    },
    {
      name: 'Related Transaction',
      type: 'foreignKey',
      options: {
        foreignTableId: 'Transactions',
        relationship: 'one-to-one'
      }
    }
  ]
};

// Main function to set up Airtable base
export async function setupAirtableBase(apiKey: string, baseId: string) {
  const base = new Airtable({ apiKey }).base(baseId);
  
  try {
    // Access tables
    const transactionsTable = base('Transactions');
    const clientsTable = base('Clients');
    const commissionsTable = base('Commissions');

    // Query existing records
    const transactionsQuery = await transactionsTable.select().all();
    const clientsQuery = await clientsTable.select().all();
    const commissionsQuery = await commissionsTable.select().all();

    // Return current table statistics
    return {
      transactions: transactionsQuery.length,
      clients: clientsQuery.length,
      commissions: commissionsQuery.length
    };
  } catch (error) {
    console.error('Error setting up Airtable base:', error);
    throw error;
  }
}

export { TRANSACTION_TABLE_CONFIG, CLIENT_TABLE_CONFIG, COMMISSION_TABLE_CONFIG };