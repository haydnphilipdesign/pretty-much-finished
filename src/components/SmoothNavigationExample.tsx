import React from 'react';
import { useNavigation } from '../providers/SmoothNavigationProvider';
import useSmoothNavigation from '../hooks/useSmoothNavigation';

/**
 * Example component demonstrating both the SmoothLink component and
 * the useSmoothNavigation hook for programmatic navigation.
 */
const SmoothNavigationExample: React.FC = () => {
  const { Link } = useNavigation();
  const { smoothNavigate } = useSmoothNavigation();
  
  const handleProgrammaticNavigation = () => {
    smoothNavigate('/about');
  };
  
  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Smooth Navigation Example</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Using SmoothLink Component</h3>
          <div className="flex flex-wrap gap-2">
            <Link 
              to="/" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              About
            </Link>
            <Link 
              to="/services" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Services
            </Link>
            <Link 
              to="/privacy" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Privacy
            </Link>
            <Link 
              to="/terms" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Using Programmatic Navigation</h3>
          <button 
            onClick={handleProgrammaticNavigation}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Go to About (Programmatically)
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mt-4">
        Try scrolling down the page and then clicking these links. 
        Notice how the page smoothly scrolls to the top before navigating.
      </p>
    </div>
  );
};

export default SmoothNavigationExample;
