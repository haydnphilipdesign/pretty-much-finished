import { ChangeEvent, useRef, useState } from "react";
import { Input } from "./input";
import { useGoogleMapsScript } from '@/hooks/useGoogleMapsScript';
import { Info } from 'lucide-react';

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
  const { isLoaded, hasError, errorMessage: mapsError } = useGoogleMapsScript();

  const handleSelect = async (prediction: any) => {
    if (!isLoaded || hasError) return;

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

    if (!isLoaded || hasError || value.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    if (!autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
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
        placeholder={hasError ? "Google Maps not available" : placeholder}
        className={className}
        disabled={hasError}
      />
      {hasError && (
        <div className="flex items-center gap-1 mt-1 text-sm text-amber-500">
          <Info className="w-4 h-4" />
          <span>{mapsError || 'Google Maps service is currently unavailable. Please try again later.'}</span>
        </div>
      )}
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