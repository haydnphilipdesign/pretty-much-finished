import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, Info, MapPin } from 'lucide-react';
import { AddressComponents, parseAddressString, verifyAddress, validateAddressFormat } from '@/utils/addressVerification';

const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

interface AddressInputProps {
  value: string;
  onChange: (address: string, addressComponents?: AddressComponents) => void;
  label?: string;
  required?: boolean;
  error?: string | string[] | null;
  placeholder?: string;
  id?: string;
}

export function AddressInput({
  value,
  onChange,
  label,
  required = false,
  error,
  placeholder = "Enter address",
  id,
}: AddressInputProps) {
  // Component state
  const [mode, setMode] = useState<'single' | 'detailed'>('single');
  const [isVerifying, setIsVerifying] = useState(false);
  const [addressComponents, setAddressComponents] = useState<AddressComponents>(() => 
    parseAddressString(value)
  );
  const [verificationMessage, setVerificationMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle single input change
  const handleSingleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    // If user is typing, clear any verification message
    if (verificationMessage) {
      setVerificationMessage(null);
    }
  };

  // Handle detailed inputs change
  const handleDetailedInputChange = (field: keyof AddressComponents, value: string) => {
    const newComponents = { ...addressComponents, [field]: value };
    setAddressComponents(newComponents);
    
    // Update the full address string and pass it up
    const fullAddress = `${newComponents.street1}${newComponents.street2 ? `, ${newComponents.street2}` : ''}, ${newComponents.city}, ${newComponents.state} ${newComponents.zip}`;
    onChange(fullAddress, newComponents);
    
    // Clear verification when user edits
    if (verificationMessage) {
      setVerificationMessage(null);
    }
  };

  // Toggle between single line and detailed address entry
  const toggleMode = () => {
    if (mode === 'single') {
      // When switching to detailed, parse the current address
      setAddressComponents(parseAddressString(value));
    } else {
      // When switching to single line, format the components
      // (handled by onChange so we don't need to do anything here)
    }
    setMode(mode === 'single' ? 'detailed' : 'single');
  };

  // Verify address with USPS
  const handleVerifyAddress = async () => {
    let addressToVerify: AddressComponents;
    
    if (mode === 'single') {
      addressToVerify = parseAddressString(value);
    } else {
      addressToVerify = addressComponents;
    }
    
    // Basic validation before making API call
    const validation = validateAddressFormat(addressToVerify);
    if (!validation.isValid) {
      setVerificationMessage({
        type: 'error',
        text: validation.message || 'Please enter a complete address before verifying'
      });
      return;
    }
    
    setIsVerifying(true);
    setVerificationMessage({ type: 'info', text: 'Verifying address...' });
    
    try {
      const result = await verifyAddress(addressToVerify);
      
      if (result.success && result.standardizedAddress) {
        setVerificationMessage({ type: 'success', text: 'Address verified successfully' });
        
        // Update address components with standardized address
        setAddressComponents(result.standardizedAddress);
        
        // Update the full address and pass up to parent
        if (result.formattedAddress) {
          onChange(result.formattedAddress, result.standardizedAddress);
        }
      } else {
        setVerificationMessage({ 
          type: 'error', 
          text: result.message || 'Unable to verify address. Please check all fields and try again.' 
        });
      }
    } catch (error) {
      setVerificationMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An error occurred during address verification' 
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const validationError = Array.isArray(error) ? error[0] : error;

  return (
    <div className="space-y-3">
      {label && (
        <Label className="text-slate-800">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      {mode === 'single' ? (
        <div className="space-y-2">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleSingleInputChange}
              placeholder={placeholder}
              className={`bg-white/80 border-slate-300 text-slate-800 placeholder:text-slate-400 pl-8 ${error ? 'border-red-500' : ''}`}
              aria-invalid={!!error}
              id={id}
            />
            <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          </div>
          
          <div className="flex justify-between text-sm">
            <button 
              type="button"
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-800"
            >
              Switch to detailed entry
            </button>
            
            <Button
              type="button"
              onClick={handleVerifyAddress}
              variant="outline"
              size="sm"
              disabled={isVerifying || !value.trim()}
              className="h-8 text-xs"
            >
              {isVerifying ? 'Verifying...' : 'Verify Address'}
            </Button>
          </div>
          
          <p className="text-xs text-slate-500">
            Format: 123 Main St, Philadelphia, PA 12345
          </p>
        </div>
      ) : (
        <div className="space-y-3 border border-slate-200 rounded-md p-3 bg-white/80">
          <div className="grid grid-cols-1 gap-2">
            <div>
              <Label htmlFor="street1" className="text-sm text-slate-700">Street Address</Label>
              <Input
                id="street1"
                value={addressComponents.street1}
                onChange={(e) => handleDetailedInputChange('street1', e.target.value)}
                placeholder="123 Main St"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="street2" className="text-sm text-slate-700">Apartment/Suite/Unit (optional)</Label>
              <Input
                id="street2"
                value={addressComponents.street2 || ''}
                onChange={(e) => handleDetailedInputChange('street2', e.target.value)}
                placeholder="Apt 4B"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-3">
              <Label htmlFor="city" className="text-sm text-slate-700">City</Label>
              <Input
                id="city"
                value={addressComponents.city}
                onChange={(e) => handleDetailedInputChange('city', e.target.value)}
                placeholder="Philadelphia"
                className="mt-1"
              />
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="state" className="text-sm text-slate-700">State</Label>
              <select
                id="state"
                value={addressComponents.state}
                onChange={(e) => handleDetailedInputChange('state', e.target.value)}
                className="w-full h-9 rounded-md border border-slate-300 bg-white/80 px-3 py-1 text-sm mt-1"
              >
                <option value="">Select</option>
                {STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="zip" className="text-sm text-slate-700">ZIP Code</Label>
              <Input
                id="zip"
                value={addressComponents.zip}
                onChange={(e) => handleDetailedInputChange('zip', e.target.value)}
                placeholder="12345"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex justify-between pt-2">
            <button 
              type="button"
              onClick={toggleMode}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Switch to single line
            </button>
            
            <Button
              type="button"
              onClick={handleVerifyAddress}
              variant="outline"
              size="sm"
              disabled={isVerifying}
              className="h-8 text-xs"
            >
              {isVerifying ? 'Verifying...' : 'Verify Address'}
            </Button>
          </div>
        </div>
      )}
      
      {validationError && (
        <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
      
      {verificationMessage && (
        <div className={`flex items-center gap-1 mt-1 text-sm ${
          verificationMessage.type === 'success' ? 'text-green-600' : 
          verificationMessage.type === 'error' ? 'text-red-500' : 
          'text-amber-500'
        }`}>
          {verificationMessage.type === 'success' ? (
            <Check className="w-4 h-4 flex-shrink-0" />
          ) : verificationMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Info className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{verificationMessage.text}</span>
        </div>
      )}
    </div>
  );
} 