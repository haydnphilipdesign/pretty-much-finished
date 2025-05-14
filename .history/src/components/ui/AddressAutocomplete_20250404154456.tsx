import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGoogleMapsScript } from '@/hooks/useGoogleMapsScript';
import { AlertCircle, Info, MapPin } from 'lucide-react';

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
  const { isLoaded, hasError, errorMessage: mapsError } = useGoogleMapsScript();
  const [showManualInputGuide, setShowManualInputGuide] = useState(false);

  // Initialize Google Maps Autocomplete when the script is loaded
  useEffect(() => {
    if (isLoaded && inputRef.current && !autocomplete) {
      try {
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
      } catch (error) {
        console.error('Error initializing Google Maps Autocomplete:', error);
        // No need to set hasError here as the hook already handles it
      }
    }
    
    // Cleanup
    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [isLoaded, onChange]);

  // Toggle the manual input guide
  const toggleManualInputGuide = () => {
    setShowManualInputGuide(!showManualInputGuide);
  };

  const validationError = Array.isArray(error) ? error[0] : error;

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-slate-800">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hasError ? "Enter address manually" : placeholder}
          className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 pl-8 ${error ? 'border-red-500' : ''}`}
          aria-invalid={!!error}
        />
        <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
      </div>
      
      {validationError && (
        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
          <AlertCircle className="w-4 h-4" />
          <span>{validationError}</span>
        </div>
      )}
      
      {hasError && (
        <div className="space-y-2">
          <div className="flex items-center gap-1 mt-1 text-sm text-amber-500">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{mapsError || 'Google Maps service is currently unavailable. Please enter the address manually.'}</span>
          </div>
          
          <button 
            type="button" 
            onClick={toggleManualInputGuide}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            {showManualInputGuide ? 'Hide' : 'Show'} manual address entry format
          </button>
          
          {showManualInputGuide && (
            <div className="text-sm bg-blue-50 border border-blue-200 rounded p-3 mt-2">
              <h4 className="font-medium mb-2">Please enter the address in this format:</h4>
              <p className="mb-2">123 Main Street, City, PA 12345</p>
              <p className="text-xs text-slate-600">
                Include the street number, street name, city, state (as 2-letter code), and zip code.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 