/**
 * Combines address components into a single formatted address string
 */
export const formatAddress = (
  streetAddress: string,
  city: string,
  state: string,
  zipCode: string
): string => {
  return `${streetAddress}, ${city}, ${state} ${zipCode}`;
};

/**
 * Parses a full address string into components
 * Returns default values if parsing fails
 */
export const parseAddress = (
  fullAddress: string
): { streetAddress: string; city: string; state: string; zipCode: string } => {
  try {
    // Try to parse "123 Main St, Philadelphia, PA 19103" format
    const parts = fullAddress.split(',').map(part => part.trim());
    
    if (parts.length >= 3) {
      const streetAddress = parts[0];
      const city = parts[1];
      const stateZip = parts[2].split(' ');
      
      const state = stateZip[0];
      const zipCode = stateZip[1] || '';
      
      return { streetAddress, city, state, zipCode };
    }
    
    // If parsing fails, return the full address as street address
    return { 
      streetAddress: fullAddress, 
      city: '', 
      state: 'PA', 
      zipCode: '' 
    };
  } catch (error) {
    // If any error occurs, return empty values
    return { 
      streetAddress: fullAddress, 
      city: '', 
      state: 'PA', 
      zipCode: '' 
    };
  }
}; 