import React from 'react';
import ScrollIndicator from './ScrollIndicator';
import { useScrollIndicator } from '../context/ScrollIndicatorContext';

/**
 * Wrapper component that provides the ScrollIndicator
 */
const ScrollIndicatorWrapper: React.FC = () => {
  const { isScrollIndicatorVisible } = useScrollIndicator();
  
  return <ScrollIndicator isVisible={isScrollIndicatorVisible} />;
};

export default ScrollIndicatorWrapper;
