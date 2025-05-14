import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Use our authentication utility to check if user is authenticated
    const authorized = isAuthenticated();
    setIsAuthorized(authorized);
    
    if (!authorized) {
      navigate('/login');
    }
    
    setIsChecking(false);
  }, [navigate]);
  
  // Show nothing while checking to prevent flashes of content
  if (isChecking) {
    return null;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }
  
  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;