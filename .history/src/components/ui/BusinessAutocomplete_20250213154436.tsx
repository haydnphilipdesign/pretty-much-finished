import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Input } from "./input";

interface BusinessAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  types?: string[];
  onDetailsReceived?: (details: any) => void;
}

export const BusinessAutocomplete = ({
  value,
  onChange,
  placeholder = "Enter business name",
  className = "",
  types = ['establishment'],
  onDetailsReceived
}: BusinessAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const autocompleteService = useRef<any>(null);
  const sessionToken = useRef<any>(null);

  useEffect(() => {
    // Load the Google Maps JavaScript API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
      }
    };
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src^="https://maps.googleapis.com/maps/api/js"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const handleSelect = async (prediction: any) => {
    // Create a PlacesService instance
    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    
    try {
      // Get detailed place information
      const place = await new Promise((resolve, reject) => {
        placesService.getDetails(
          {
            placeId: prediction.place_id,
            fields: ['name', 'formatted_address', 'address_components']
          },
          (result: any, status: any) => {
            if (status === 'OK') {
              resolve(result);
            } else {
              reject(new Error(`Place details request failed: ${status}`));
            }
          }
        );
      });

      const placeDetails = place as any;
      onChange(placeDetails.name);

      if (onDetailsReceived) {
        onDetailsReceived({
          name: placeDetails.name,
          address: placeDetails.formatted_address,
          addressComponents: placeDetails.address_components
        });
      }

      setIsOpen(false);
      setSuggestions([]);
    } catch (error) {
      console.error('Error fetching place details:', error);
      onChange(prediction.description);
      setIsOpen(false);
      setSuggestions([]);
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);

    if (!autocompleteService.current || value.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    try {
      const response = await autocompleteService.current.getPlacePredictions({
        input: value,
        sessionToken: sessionToken.current,
        componentRestrictions: { country: 'us' },
        types
      });

      if (response.predictions.length > 0) {
        setSuggestions(response.predictions);
        setIsOpen(true);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
      />
      {suggestions.length > 0 && isOpen && (
        <div className="absolute w-full z-50 mt-1 rounded-md border bg-popover shadow-md">
          <div className="py-2">
            {suggestions.map((prediction: any, index) => (
              <div
                key={index}
                className="px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={() => handleSelect(prediction)}
              >
                {prediction.description}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 