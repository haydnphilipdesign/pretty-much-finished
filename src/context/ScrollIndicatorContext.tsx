import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScrollIndicatorContextType {
  /** Show the scroll indicator */
  showScrollIndicator: () => void;
  /** Hide the scroll indicator */
  hideScrollIndicator: () => void;
  /** Whether the scroll indicator is currently visible */
  isScrollIndicatorVisible: boolean;
}

const ScrollIndicatorContext = createContext<ScrollIndicatorContextType | undefined>(undefined);

interface ScrollIndicatorProviderProps {
  children: ReactNode;
}

/**
 * Provider for the scroll indicator context
 */
export const ScrollIndicatorProvider: React.FC<ScrollIndicatorProviderProps> = ({ children }) => {
  const [isScrollIndicatorVisible, setIsScrollIndicatorVisible] = useState(false);

  const showScrollIndicator = () => {
    setIsScrollIndicatorVisible(true);
  };

  const hideScrollIndicator = () => {
    setIsScrollIndicatorVisible(false);
  };

  return (
    <ScrollIndicatorContext.Provider
      value={{
        showScrollIndicator,
        hideScrollIndicator,
        isScrollIndicatorVisible
      }}
    >
      {children}
    </ScrollIndicatorContext.Provider>
  );
};

/**
 * Hook to use the scroll indicator context
 */
export const useScrollIndicator = (): ScrollIndicatorContextType => {
  const context = useContext(ScrollIndicatorContext);
  
  if (context === undefined) {
    throw new Error('useScrollIndicator must be used within a ScrollIndicatorProvider');
  }
  
  return context;
};
