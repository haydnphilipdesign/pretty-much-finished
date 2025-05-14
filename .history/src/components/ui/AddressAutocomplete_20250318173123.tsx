import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, addressComponents?: any[]) => void;
  label?: string;
  required?: boolean;
  error?: string | string[] | null;
  placeholder?: string;
  id?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  label,
  required = false,
  error,
  placeholder = "Enter address",
  id,
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
  }, []);

  useEffect(() => {
    // Initialize autocomplete when script is loaded
    const interval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places && inputRef.current) {
        const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' }
        });
        
        autocompleteInstance.addListener('place_changed', () => {
          const place = autocompleteInstance.getPlace();
          if (place && place.formatted_address) {
            onChange(place.formatted_address, place.address_components);
          }
        });
        
        setAutocomplete(autocompleteInstance);
        clearInterval(interval);
      }
    }, 100);
    
    return () => {
      clearInterval(interval);
      // Clean up autocomplete listener if it exists
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [onChange]);

  const errorMessage = Array.isArray(error) ? error[0] : error;

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Input
        ref={inputRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-white/80 border-slate-300 text-slate-800 ${errorMessage ? 'border-red-500' : ''}`}
        required={required}
      />
      {errorMessage && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}
    </div>
  );
} 