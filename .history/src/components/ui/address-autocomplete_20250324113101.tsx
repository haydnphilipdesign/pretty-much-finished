/// <reference types="@types/google.maps" />
import React, { useEffect, useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressComponents {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  fullAddress: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string, components?: AddressComponents) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  label,
  required = false,
  placeholder = "Enter address",
  className = "",
  error
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Google Places API script if not already loaded
    if (!window.google?.maps?.places) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      // Initialize Google Places Autocomplete
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['formatted_address', 'address_components'],
        types: ['address']
      });

      // Add place_changed event listener
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address && place.address_components) {
          // Extract address components
          const streetNumber = place.address_components.find((c: google.maps.GeocoderAddressComponent) => 
            c.types.includes('street_number'))?.long_name || '';
          const streetName = place.address_components.find((c: google.maps.GeocoderAddressComponent) => 
            c.types.includes('route'))?.long_name || '';
          const city = place.address_components.find((c: google.maps.GeocoderAddressComponent) => 
            c.types.includes('locality'))?.long_name || '';
          const state = place.address_components.find((c: google.maps.GeocoderAddressComponent) => 
            c.types.includes('administrative_area_level_1'))?.short_name || 'PA';
          const zipCode = place.address_components.find((c: google.maps.GeocoderAddressComponent) => 
            c.types.includes('postal_code'))?.long_name || '';

          // Create address components object
          const components: AddressComponents = {
            streetAddress: `${streetNumber} ${streetName}`.trim(),
            city,
            state,
            zipCode,
            fullAddress: place.formatted_address
          };

          onChange(place.formatted_address, components);
        }
      });
    }

    return () => {
      // Cleanup Google Places Autocomplete instance
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [isLoaded, onChange]);

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-slate-800">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 ${error ? 'border-red-500' : ''} ${className}`}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
} 