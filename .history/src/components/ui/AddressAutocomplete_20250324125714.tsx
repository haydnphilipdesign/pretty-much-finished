import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGoogleMapsScript } from '@/hooks/useGoogleMapsScript';
import { Info } from 'lucide-react';

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
  const { isLoaded, hasError, errorMessage } = useGoogleMapsScript();

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocomplete) {
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
    }
    
    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [isLoaded, onChange]);

  const errorMessage = Array.isArray(error) ? error[0] : error;

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
        placeholder={hasError ? "Google Maps not available" : placeholder}
        className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 ${error ? 'border-red-500' : ''}`}
        aria-invalid={!!error}
        disabled={hasError}
      />
      {errorMessage && (
        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
          <Info className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}
      {hasError && (
        <div className="flex items-center gap-1 mt-1 text-sm text-amber-500">
          <Info className="w-4 h-4" />
          <span>{errorMessage || 'Google Maps service is currently unavailable. Please try again later.'}</span>
        </div>
      )}
    </div>
  );
} 