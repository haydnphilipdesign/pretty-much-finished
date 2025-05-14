import { useEffect, useState } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

export const useGoogleMapsScript = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Check if script is already loaded
    if (window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    // Initialize the Maps JavaScript API
    const initGoogleMapsScript = () => {
      const existingScript = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Create a new script element
      const script = document.createElement('script');
      const currentUrl = window.location.origin;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap&loading=async&v=weekly`;
      script.async = true;
      script.defer = true;

      // Define the callback function
      window.initMap = () => {
        setIsLoaded(true);
        setHasError(false);
        setErrorMessage('');
      };

      // Handle script load errors
      const handleError = (error: Event | string) => {
        setHasError(true);
        setIsLoaded(false);
        
        // Log detailed error information
        console.error('Google Maps script loading error:', {
          error,
          currentUrl,
          apiKey: GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing',
        });

        if (error instanceof ErrorEvent) {
          if (error.error?.message?.includes('RefererNotAllowedMapError')) {
            setErrorMessage(`This website (${currentUrl}) is not authorized to use Google Maps API. Please check API key configuration.`);
          } else {
            setErrorMessage(error.error?.message || 'Failed to load Google Maps. Please check your internet connection.');
          }
        } else {
          setErrorMessage('Failed to load Google Maps. Please check your internet connection.');
        }
      };

      script.onerror = handleError;

      // Also catch initialization errors
      const originalInitMap = window.initMap;
      window.initMap = (...args) => {
        try {
          originalInitMap(...args);
        } catch (error) {
          handleError(new ErrorEvent('error', { error }));
        }
      };

      document.head.appendChild(script);
    };

    // Initialize the script
    if (!window.google?.maps) {
      // Declare initMap globally
      window.initMap = () => {
        setIsLoaded(true);
        setHasError(false);
      };
      initGoogleMapsScript();
    }

    return () => {
      // Cleanup by setting the initMap function to a no-op instead of deleting it
      if ('initMap' in window) {
        window.initMap = () => {};
      }
    };
  }, []);

  return { isLoaded, hasError, errorMessage };
};

// Add type declaration for the global initMap function
declare global {
  interface Window {
    initMap: (...args: any[]) => void;
    google: typeof google;
  }
} 