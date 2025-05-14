import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  variant = 'primary',
  size = 'md',
  label,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1';
  
  const variants = {
    primary: 'bg-brand-gold text-white hover:bg-brand-gold/90',
    secondary: 'bg-brand-blue text-white hover:bg-brand-blue/90',
    outline: 'border-2 border-brand-gold text-brand-gold hover:bg-brand-gold/10',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 shadow-none hover:shadow-none'
  };

  const sizes = {
    sm: 'p-2',
    md:'p-3',
    lg: 'p-4'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md:'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      aria-label={label}
      type="button"
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};

function CustomIconButton() {
  return (
    <IconButton
      icon={FaBeer}
      colorScheme="teal"
      aria-label="Beer"
    />
  );
}

export default IconButton;
