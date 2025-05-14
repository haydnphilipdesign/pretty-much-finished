import { ChangeEvent, useState, useEffect } from "react";
import { Input } from "./input";
import { cn } from "../../lib/utils";
import { Info } from "lucide-react";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

// Extended list of common email domains
const EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'comcast.net',
  'verizon.net',
  'protonmail.com',
  'mail.com',
  'zoho.com',
  'me.com',
  'live.com',
  'msn.com',
  'att.net',
  'sbcglobal.net',
  'ymail.com',
  'mac.com'
];

// RFC 5322 compliant email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const EmailInput = ({
  value,
  onChange,
  placeholder = "client@example.com",
  className = "",
  required = false,
  onVal$fields = @(
    # Date Field
    @{
        name = "Date Submitted"
        description = "Date when the form was submitted"
        type = "date"
        options = @{}  # Required empty object
    },

    # Checkbox Fields
    @{
        name = "Resale Certificate Required"
        description = "Whether a resale certificate is required"
        type = "checkbox"
        options = @{
            icon = "check"
            color = "greenBright"
        }
    },
    @{
        name = "CO Required"
        description = "Whether a Certificate of Occupancy is required"
        type = "checkbox"
        options = @{
            icon = "check"
            color = "greenBright"
        }
    },
    @{
        name = "First Right of Refusal"
        description = "Whether first right of refusal applies"
        type = "checkbox"
        options = @{
            icon = "check"
            color = "greenBright"
        }
    },
    @{
        name = "Attorney Representation"
        description = "Whether attorney representation is required"
        type = "checkbox"
        options = @{
            icon = "check"
            color = "greenBright"
        }
    },
    @{
        name = "Home Warranty Purchased"
        description = "Whether a home warranty was purchased"
        type = "checkbox"
        options = @{
            icon = "check"
            color = "greenBright"
        }
    },
    @{
        name = "Update MLS"
        description = "Whether to update MLS status"
        type = "checkbox"
        options = @{
            icon = "check"
            color = "greenBright"
        }
    },
    @{
        name = "Acknowledge Documents"
        description = "Confirmation that all required documents have been reviewed"
        type = "checkbox"
        options = @{
            icon = "check"
            color = "greenBright"
        }
    },
    @{
        name = "Confirmation Checked"
        description = "Final confirmation of form submission"
        type = "checkbox"
        options = @{
            icon = "check"
            color = "greenBright"
        }
    }

    # ... rest of your existing fields
)idationChange
}: EmailInputProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isTouched, setIsTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Validate email and update state
  const validateEmail = (email: string): boolean => {
    if (!email && !required) {
      setErrorMessage("");
      return true;
    }

    if (!email && required) {
      setErrorMessage("Email is required");
      return false;
    }

    if (!email.includes('@')) {
      setErrorMessage("Email must contain @");
      return false;
    }

    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toLowerCase().trim();
    onChange(newValue);
    setIsTouched(true);

    if (newValue.includes('@')) {
      const [localPart, domainPart] = newValue.split('@');
      
      // Show suggestions based on domain part
      if (!domainPart || domainPart === '') {
        setSuggestions(EMAIL_DOMAINS.map(domain => `${localPart}@${domain}`));
        setIsOpen(true);
      } else {
        const filtered = EMAIL_DOMAINS
          .filter(domain => domain.toLowerCase().startsWith(domainPart.toLowerCase()))
          .map(domain => `${localPart}@${domain}`);
        setSuggestions(filtered);
        setIsOpen(filtered.length > 0);
      }
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }

    const valid = validateEmail(newValue);
    setIsValid(valid);
    onValidationChange?.(valid);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setSuggestions([]);
    const valid = validateEmail(suggestion);
    setIsValid(valid);
    onValidationChange?.(valid);
  };

  // Validate on blur
  const handleBlur = () => {
    setIsTouched(true);
    const valid = validateEmail(value);
    setIsValid(valid);
    onValidationChange?.(valid);
  };

  // Effect to validate initial value
  useEffect(() => {
    if (value) {
      const valid = validateEmail(value);
      setIsValid(valid);
      onValidationChange?.(valid);
    }
  }, []);

  return (
    <div className="relative">
      <Input
        type="email"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn(
          className,
          !isValid && isTouched && "border-red-500 focus:ring-red-500",
          isValid && value && "border-green-500 focus:ring-green-500"
        )}
        required={required}
        aria-invalid={!isValid}
        aria-describedby={errorMessage ? "email-error" : undefined}
      />
      
      {/* Error message */}
      {!isValid && isTouched && errorMessage && (
        <div className="flex items-center gap-1 mt-1 text-sm text-red-500" id="email-error">
          <Info className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div 
          className="absolute w-full z-50 mt-1 rounded-md border bg-popover shadow-md"
          role="listbox"
          aria-label="Email suggestions"
        >
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                role="option"
                aria-selected={value === suggestion}
                className="px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
