import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon: Icon,
  fullWidth = false,
  className = '',
  placeholder,
  ...props
}, ref) => {
  const baseStyles = 'block w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all duration-300';
  const errorStyles = error
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-brand-gold focus:ring-brand-gold/20';
  const width = fullWidth ? 'w-full' : '';
  const iconPadding = Icon ? 'pl-11' : '';

  return (
    <div className={`${width}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          placeholder={placeholder}
          className={`${baseStyles} ${errorStyles} ${iconPadding} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
