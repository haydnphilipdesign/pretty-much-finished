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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap&loading=async`;
      script.async = true;
      script.defer = true;

      // Define the callback function
      window.initMap = () => {
        setIsLoaded(true);
        setHasError(false);
      };

      // Handle script load errors
      script.onerror = (error: Event | string) => {
        setHasError(true);
        if (error instanceof ErrorEvent && error.error?.message?.includes('RefererNotAllowedMapError')) {
          setErrorMessage('This website is not authorized to use Google Maps API. Please check API key configuration.');
        } else {
          setErrorMessage('Failed to load Google Maps. Please check your internet connection.');
        }
        console.error('Google Maps script loading error:', error);
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
      // Cleanup
      delete window.initMap;
    };
  }, []);

  return { isLoaded, hasError, errorMessage };
};

// Add type declaration for the global initMap function
declare global {
  interface Window {
    initMap: () => void;
    google: typeof google;
  }
} 