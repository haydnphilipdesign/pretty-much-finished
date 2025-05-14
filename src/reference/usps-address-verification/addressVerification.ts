/**
 * Address verification utilities using USPS API
 */
import { useState } from 'react';

// Type definition for environment variables
interface ImportMetaEnv {
  VITE_USPS_USER_ID: string;
  VITE_USPS_API_URL: string;
  VITE_USE_MANUAL_ADDRESS_VALIDATION: string;
}

// Safely access environment variables
const getEnvVar = (key: keyof ImportMetaEnv, defaultValue: string = ''): string => {
  // Using type assertion to access env variables safely
  return (import.meta.env as unknown as ImportMetaEnv)[key] || defaultValue;
};

// Interface for address components
export interface AddressComponents {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}

// Interface for verified address response
export interface VerifiedAddress {
  success: boolean;
  standardizedAddress?: AddressComponents;
  formattedAddress?: string;
  message?: string;
}

// Parse an address string into components
export const parseAddressString = (addressString: string): AddressComponents => {
  // Handle various address formats
  // Simple parsing assuming format: "Street, City, State ZIP"
  const parts = addressString.split(',').map(part => part.trim());
  
  if (parts.length < 2) {
    return {
      street1: addressString,
      city: '',
      state: '',
      zip: ''
    };
  }
  
  const street1 = parts[0];
  
  // Last part typically contains State and ZIP
  const lastPart = parts[parts.length - 1];
  const stateZipMatch = lastPart.match(/([A-Z]{2})\s+(\d{5}(-\d{4})?)/);
  
  let state = '';
  let zip = '';
  let city = '';
  
  if (stateZipMatch) {
    state = stateZipMatch[1];
    zip = stateZipMatch[2];
    // City is usually the second-to-last part if we have state/zip
    city = parts.length > 2 ? parts[parts.length - 2] : '';
  } else {
    // If no state/zip pattern found, assume the last part is the city
    city = lastPart;
  }
  
  return {
    street1,
    city,
    state,
    zip
  };
};

// Format address components into a single string
export const formatAddress = (address: AddressComponents): string => {
  const parts = [address.street1];
  
  if (address.street2) {
    parts.push(address.street2);
  }
  
  if (address.city && address.state) {
    if (address.zip) {
      parts.push(`${address.city}, ${address.state} ${address.zip}`);
    } else {
      parts.push(`${address.city}, ${address.state}`);
    }
  }
  
  return parts.join(', ');
};

// Validate an address with basic format checking
export const validateAddressFormat = (address: AddressComponents): { isValid: boolean; message?: string } => {
  if (!address.street1 || address.street1.length < 3) {
    return { isValid: false, message: 'Street address is required' };
  }
  
  if (!address.city || address.city.length < 2) {
    return { isValid: false, message: 'City is required' };
  }
  
  if (!address.state || !/^[A-Z]{2}$/.test(address.state)) {
    return { isValid: false, message: 'State must be a valid 2-letter code (e.g., PA)' };
  }
  
  if (!address.zip || !/^\d{5}(-\d{4})?$/.test(address.zip)) {
    return { isValid: false, message: 'ZIP code must be in format 12345 or 12345-6789' };
  }
  
  return { isValid: true };
};

// Verify address with USPS API
export const verifyAddress = async (address: AddressComponents): Promise<VerifiedAddress> => {
  // Check if using manual validation (bypassing API)
  if (getEnvVar('VITE_USE_MANUAL_ADDRESS_VALIDATION') === 'true') {
    const validation = validateAddressFormat(address);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.message
      };
    }
    
    return {
      success: true,
      standardizedAddress: address,
      formattedAddress: formatAddress(address)
    };
  }
  
  try {
    // Create XML for USPS Address Verification API
    const xml = `
      <AddressValidateRequest USERID="${getEnvVar('VITE_USPS_USER_ID')}">
        <Revision>1</Revision>
        <Address ID="0">
          <Address1>${address.street2 || ''}</Address1>
          <Address2>${address.street1}</Address2>
          <City>${address.city}</City>
          <State>${address.state}</State>
          <Zip5>${address.zip.split('-')[0]}</Zip5>
          <Zip4>${address.zip.includes('-') ? address.zip.split('-')[1] : ''}</Zip4>
        </Address>
      </AddressValidateRequest>
    `;
    
    // Call USPS API
    const response = await fetch(`${getEnvVar('VITE_USPS_API_URL')}?API=Verify&XML=${encodeURIComponent(xml)}`);
    const data = await response.text();
    
    // Parse XML response (simple parsing)
    if (data.includes('<Error>')) {
      const errorMatch = data.match(/<Description>(.*?)<\/Description>/);
      return {
        success: false,
        message: errorMatch ? errorMatch[1] : 'Address verification failed'
      };
    }
    
    // Extract address components from response
    const address1Match = data.match(/<Address1>(.*?)<\/Address1>/);
    const address2Match = data.match(/<Address2>(.*?)<\/Address2>/);
    const cityMatch = data.match(/<City>(.*?)<\/City>/);
    const stateMatch = data.match(/<State>(.*?)<\/State>/);
    const zip5Match = data.match(/<Zip5>(.*?)<\/Zip5>/);
    const zip4Match = data.match(/<Zip4>(.*?)<\/Zip4>/);
    
    const standardizedAddress: AddressComponents = {
      street1: address2Match ? address2Match[1] : address.street1,
      street2: address1Match ? address1Match[1] : address.street2,
      city: cityMatch ? cityMatch[1] : address.city,
      state: stateMatch ? stateMatch[1] : address.state,
      zip: zip5Match ? 
        (zip4Match && zip4Match[1] ? `${zip5Match[1]}-${zip4Match[1]}` : zip5Match[1]) 
        : address.zip
    };
    
    return {
      success: true,
      standardizedAddress,
      formattedAddress: formatAddress(standardizedAddress)
    };
  } catch (error) {
    console.error('Address verification error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Address verification failed'
    };
  }
}; 