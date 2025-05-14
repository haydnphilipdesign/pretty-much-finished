/**
 * Transaction Form component using the transaction-first approach
 * 
 * This component demonstrates how to use the transaction-first approach
 * for submitting transaction data to Airtable.
 */

import React, { useState } from 'react';
import { useTransactionFormTransactionFirst } from '../../hooks/useTransactionFormTransactionFirst';
import { TransactionFormData } from '../../types/transaction';

export function TransactionFormTransactionFirst() {
  const { submitTransaction, isSubmitting, error, success, result } = useTransactionFormTransactionFirst();
  const [formData, setFormData] = useState<TransactionFormData>({
    mlsNumber: '',
    address: '',
    propertyStatus: 'VACANT',
    salePrice: '',
    isWinterized: 'NO',
    updateMls: 'YES',
    clients: [],
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!formData.mlsNumber || !formData.address || !formData.salePrice) {
        alert('Please fill in all required fields');
        return;
      }
      
      if (!formData.clients || formData.clients.length === 0) {
        alert('Please add at least one client');
        return;
      }
      
      // Submit transaction data
      const result = await submitTransaction(formData);
      console.log('Transaction submitted successfully:', result);
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a client
  const handleAddClient = () => {
    setFormData(prev => ({
      ...prev,
      clients: [
        ...(prev.clients || []),
        {
          name: '',
          email: '',
          phone: '',
          address: prev.address, // Default to property address
          type: 'BUYER',
          maritalStatus: 'SINGLE',
        },
      ],
    }));
  };

  // Update client data
  const handleClientChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedClients = [...(prev.clients || [])];
      updatedClients[index] = {
        ...updatedClients[index],
        [field]: value,
      };
      return {
        ...prev,
        clients: updatedClients,
      };
    });
  };

  // Remove a client
  const handleRemoveClient = (index: number) => {
    setFormData(prev => {
      const updatedClients = [...(prev.clients || [])];
      updatedClients.splice(index, 1);
      return {
        ...prev,
        clients: updatedClients,
      };
    });
  };

  return (
    <div className="transaction-form-container">
      <h2>Transaction Form (Transaction-First Approach)</h2>
      
      {error && (
        <div className="error-message">
          <h3>Error</h3>
          <p>{error.message}</p>
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <h3>Success!</h3>
          <p>Transaction created with ID: {result?.transactionId}</p>
          <p>Client IDs: {result?.clientIds.join(', ')}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Property Information</h3>
          
          <div className="form-group">
            <label htmlFor="mlsNumber">MLS Number*</label>
            <input
              type="text"
              id="mlsNumber"
              name="mlsNumber"
              value={formData.mlsNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Property Address*</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="propertyStatus">Property Status*</label>
            <select
              id="propertyStatus"
              name="propertyStatus"
              value={formData.propertyStatus}
              onChange={handleInputChange}
              required
            >
              <option value="VACANT">Vacant</option>
              <option value="OCCUPIED">Occupied</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="salePrice">Sale Price*</label>
            <input
              type="text"
              id="salePrice"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="isWinterized">Winterized</label>
            <select
              id="isWinterized"
              name="isWinterized"
              value={formData.isWinterized}
              onChange={handleInputChange}
            >
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="updateMls">Update MLS</label>
            <select
              id="updateMls"
              name="updateMls"
              value={formData.updateMls}
              onChange={handleInputChange}
            >
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Clients</h3>
          
          <button 
            type="button" 
            onClick={handleAddClient}
            className="add-client-button"
          >
            Add Client
          </button>
          
          {formData.clients && formData.clients.map((client, index) => (
            <div key={index} className="client-form">
              <h4>Client {index + 1}</h4>
              
              <div className="form-group">
                <label htmlFor={`client-${index}-name`}>Name*</label>
                <input
                  type="text"
                  id={`client-${index}-name`}
                  value={client.name}
                  onChange={(e) => handleClientChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`client-${index}-email`}>Email</label>
                <input
                  type="email"
                  id={`client-${index}-email`}
                  value={client.email}
                  onChange={(e) => handleClientChange(index, 'email', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`client-${index}-phone`}>Phone</label>
                <input
                  type="tel"
                  id={`client-${index}-phone`}
                  value={client.phone}
                  onChange={(e) => handleClientChange(index, 'phone', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`client-${index}-address`}>Address</label>
                <input
                  type="text"
                  id={`client-${index}-address`}
                  value={client.address}
                  onChange={(e) => handleClientChange(index, 'address', e.target.value)}
                  placeholder="Leave blank to use property address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`client-${index}-type`}>Type*</label>
                <select
                  id={`client-${index}-type`}
                  value={client.type}
                  onChange={(e) => handleClientChange(index, 'type', e.target.value)}
                  required
                >
                  <option value="BUYER">Buyer</option>
                  <option value="SELLER">Seller</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor={`client-${index}-maritalStatus`}>Marital Status</label>
                <select
                  id={`client-${index}-maritalStatus`}
                  value={client.maritalStatus}
                  onChange={(e) => handleClientChange(index, 'maritalStatus', e.target.value)}
                >
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="DIVORCE IN PROGRESS">Divorce in Progress</option>
                  <option value="WIDOWED">Widowed</option>
                </select>
              </div>
              
              <button
                type="button"
                onClick={() => handleRemoveClient(index)}
                className="remove-client-button"
              >
                Remove Client
              </button>
            </div>
          ))}
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Transaction'}
          </button>
        </div>
      </form>
      
      <style jsx>{`
        .transaction-form-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        h2 {
          color: #333;
          margin-bottom: 20px;
        }
        
        .form-section {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
        
        h3 {
          margin-top: 0;
          color: #444;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        input, select, textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        
        .client-form {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #fff;
        }
        
        .add-client-button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-bottom: 15px;
        }
        
        .remove-client-button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
        
        .submit-button {
          background-color: #2196F3;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 18px;
          margin-top: 20px;
        }
        
        .submit-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          border: 1px solid #ef9a9a;
        }
        
        .success-message {
          background-color: #e8f5e9;
          color: #2e7d32;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          border: 1px solid #a5d6a7;
        }
      `}</style>
    </div>
  );
}

export default TransactionFormTransactionFirst;
