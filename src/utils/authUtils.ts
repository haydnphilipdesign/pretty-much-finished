/**
 * Authentication Utilities
 * Simple utilities for the agent portal authentication
 */

// Set authentication state
export const setAuthenticated = (): void => {
  // Use sessionStorage (cleared when browser session ends)
  sessionStorage.setItem('isAuthenticated', 'true');
};

// Check if user is authenticated 
export const isAuthenticated = (): boolean => {
  // Check sessionStorage for authentication
  return sessionStorage.getItem('isAuthenticated') === 'true';
};

// Clear authentication data (logout)
export const logout = (): void => {
  sessionStorage.removeItem('isAuthenticated');
};
