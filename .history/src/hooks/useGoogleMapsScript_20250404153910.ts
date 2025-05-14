import { useEffect, useState } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

export const useGoogleMapsScript = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // If Google Maps is already loaded, set state accordingly
    if (window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    // Track script loading status
    let scriptLoaded = false;

    // Initialize the Maps JavaScript API
    const initGoogleMapsScript = () => {
      // Remove any existing Google Maps scripts to prevent conflicts
      const existingScript = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Create a new script element
      const script = document.createElement('script');
      const currentUrl = window.location.origin;
      
      // Check if API key exists
      if (!GOOGLE_MAPS_API_KEY) {
        console.error('Google Maps API key is missing');
        setHasError(true);
        setErrorMessage('Google Maps API key is missing. Please check your environment configuration.');
        return;
      }

      // Set script properties
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap&v=weekly`;
      script.async = true;
      script.defer = true;

      // Define the callback function
      window.initMap = () => {
        scriptLoaded = true;
        setIsLoaded(true);
        setHasError(false);
        setErrorMessage('');
      };

      // Handle script load errors
      const handleError = (error: Event | string | Error) => {
        setHasError(true);
        setIsLoaded(false);
        scriptLoaded = false;
        
        // Log detailed error information
        console.error('Google Maps script loading error:', {
          error,
          currentUrl,
          apiKey: GOOGLE_MAPS_API_KEY ? 'Present (but may be invalid)' : 'Missing',
        });

        // Format a user-friendly error message
        if (error instanceof ErrorEvent && error.error) {
          if (error.error.message?.includes('RefererNotAllowedMapError')) {
            setErrorMessage(`This website (${currentUrl}) is not authorized to use Google Maps API. The API key may have domain restrictions that exclude this domain.`);
          } else if (error.error.message?.includes('InvalidKeyMapError') || error.error.message?.includes('MissingKeyMapError')) {
            setErrorMessage('Invalid Google Maps API key. Please check your API key configuration.');
          } else if (error.error.message?.includes('ApiNotActivatedMapError')) {
            setErrorMessage('Google Maps API services are not activated for this API key. Enable the Places API in the Google Cloud Console.');
          } else {
            setErrorMessage(error.error.message || 'Failed to load Google Maps. Please check your internet connection.');
          }
        } else if (error instanceof Error) {
          setErrorMessage(error.message || 'Failed to load Google Maps.');
        } else {
          setErrorMessage('Failed to load Google Maps. Please try again later.');
        }
      };

      script.onerror = handleError;

      // Also catch initialization errors
      const originalInitMap = window.initMap;
      window.initMap = (...args) => {
        try {
          originalInitMap(...args);
        } catch (error) {
          handleError(error instanceof Error ? error : new Error('Error initializing Google Maps'));
        }
      };

      // Add the script to the DOM
      document.head.appendChild(script);

      // Set a timeout to detect if the script doesn't load or initialize within a reasonable time
      setTimeout(() => {
        if (!scriptLoaded) {
          handleError(new Error('Google Maps script loading timed out. The API key may be invalid or the service may be unavailable.'));
        }
      }, 10000); // 10 seconds timeout
    };

    // Initialize the script
    if (!window.google?.maps) {
      initGoogleMapsScript();
    }

    return () => {
      // Cleanup by setting the initMap function to a no-op
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