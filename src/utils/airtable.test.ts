import Airtable from 'airtable';

// Get environment variables
const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const CLIENTS_TABLE_ID = import.meta.env.VITE_AIRTABLE_CLIENTS_TABLE_ID || 'tblvdy7T9Hv4SasdI';

// Check if API key and base ID are set
if (!API_KEY) {
  console.error('Airtable API key is not set. Please check your environment variables.');
}

if (!BASE_ID) {
  console.error('Airtable base ID is not set. Please check your environment variables.');
}

if (!CLIENTS_TABLE_ID) {
  console.error('Clients table ID is not set. Please check your environment variables.');
}

// Log environment variables status
console.log('Airtable API key:', API_KEY ? `Set (${API_KEY.substring(0, 5)}...)` : 'Not set');
console.log('Airtable base ID:', BASE_ID ? `Set (${BASE_ID})` : 'Not set');
console.log('Clients table ID:', CLIENTS_TABLE_ID);

const airtableBase = new Airtable({
  apiKey: API_KEY,
}).base(BASE_ID);

const clientsTable = airtableBase(CLIENTS_TABLE_ID);

// Test function to create a client record
export const testCreateClient = async () => {
  // Validate environment variables first
  if (!API_KEY) {
    throw new Error('Airtable API key is not set. Please check your environment variables.');
  }

  if (!BASE_ID) {
    throw new Error('Airtable base ID is not set. Please check your environment variables.');
  }

  if (!CLIENTS_TABLE_ID) {
    throw new Error('Clients table ID is not set. Please check your environment variables.');
  }

  try {
    console.log('Creating test client record in table:', CLIENTS_TABLE_ID);
    
    // Only include fields from Fields.csv
    const record = await clientsTable.create({
      fields: {
        'fldSqxNOZ9B5PgSab': 'Test Client',         // Client Name
        'flddP6a8EG6qTJdIi': 'test@example.com',    // Client Email
        'fldBnh8W6iGW014yY': '(123) 456-7890',      // Client Phone
        'fldz1IpeR1256LhuC': '123 Test St',         // Client Address
        'fldSY6vbE1zAhJZqd': 'BUYER',               // Client Type
        'fldeK6mjSfxELU0MD': 'SINGLE'               // Marital Status
      }
    });
    
    console.log('Test client created successfully:', record.getId());
    return { success: true, id: record.getId() };
  } catch (error) {
    console.error('Error creating test client:', error);
    throw error;
  }
};

// Export the test function
export default testCreateClient;
