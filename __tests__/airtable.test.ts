import { submitToAirtable } from '../src/utils/airtable';

describe('submitToAirtable', () => {
  it('should submit data to Airtable successfully', async () => {
    const mockData = {
      agentRole: 'Listing Agent',
      propertyData: {
        mlsNumber: '123456',
        address: '123 Main St',
        salePrice: 500000,
        status: 'Active',
        isWinterized: false,
        updateMls: true
      },
      // ... other required fields
    };

    const result = await submitToAirtable(mockData);
    expect(result).toBeDefined();
    // Add more assertions based on your expected results
  });

  it('should throw error for missing required fields', async () => {
    const mockData = {
      // Missing required fields
    };

    await expect(submitToAirtable(mockData)).rejects.toThrow();
  });
}); 