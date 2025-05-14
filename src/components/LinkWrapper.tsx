import React from 'react';
import { LinkProps } from 'react-router-dom';
import { useNavigation } from '../providers/SmoothNavigationProvider';

/**
 * A wrapper component that uses the SmoothLink component from the NavigationContext
 * This is a drop-in replacement for the standard React Router Link component
 * that adds smooth scrolling to top before navigation.
 */
const LinkWrapper: React.FC<LinkProps> = (props) => {
  const { Link } = useNavigation();
  
  return <Link {...props} />;
};

export default LinkWrapper;
