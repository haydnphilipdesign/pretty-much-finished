import { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { Label } from './label';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, addressComponents?: any) => void;
  label: string;
  required?: boolean;
  error?: string;
  id: string;
  placeholder?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  label,
  required,
  error,
  id,
  placeholder
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    // Load Google Places API script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }
    
    // Initialize autocomplete when script is loaded
    const interval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places && inputRef.current) {
        const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' }
        });
        
        autocompleteInstance.addListener('place_changed', () => {
          const place = autocompleteInstance.getPlace();
          if (place.formatted_address) {
            onChange(place.formatted_address, place.address_components);
          }
        });
        
        setAutocomplete(autocompleteInstance);
        clearInterval(interval);
      }
    }, 100);
    
    return () => {
      clearInterval(interval);
      if (autocomplete) {
        // Clean up event listeners if needed
      }
    };
  }, [onChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-800">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        ref={inputRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-white/80 border-slate-300 text-slate-800 ${error ? 'border-red-500' : ''}`}
        placeholder={placeholder || "Enter address"}
        required={required}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
} 