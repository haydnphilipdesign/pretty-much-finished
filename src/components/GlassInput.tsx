import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  onPasswordToggle?: () => void;
  isPasswordVisible?: boolean;
}

/**
 * GlassInput - A frosted glass styled input component
 */
const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ 
    label, 
    error, 
    icon, 
    className = '', 
    showPasswordToggle = false,
    onPasswordToggle,
    isPasswordVisible,
    ...props 
  }, ref) => {
    // Base input styles
    const inputClasses = `
      bg-white/10 
      backdrop-blur-sm 
      border 
      border-white/20 
      focus:border-blue-400 
      text-white 
      rounded-lg 
      w-full 
      px-4 
      py-2.5 
      transition-all 
      duration-300
      ${error ? 'border-red-500' : ''}
      ${icon ? 'pl-10' : ''}
      ${showPasswordToggle ? 'pr-10' : ''}
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-white/90 font-medium mb-1.5 text-sm">
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
              {icon}
            </div>
          )}
          
          {/* Input */}
          <input
            ref={ref}
            className={inputClasses}
            style={{ 
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
            {...props}
          />
          
          {/* Password toggle */}
          {showPasswordToggle && onPasswordToggle && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white/90 transition-colors duration-200"
              onClick={onPasswordToggle}
              tabIndex={-1}
            >
              {isPasswordVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

export default GlassInput;
