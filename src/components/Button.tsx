import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1';
  
  const variants = {
    primary: 'bg-brand-gold text-white hover:bg-brand-gold/90',
    secondary: 'bg-brand-blue text-white hover:bg-brand-blue/90',
    outline: 'border-2 border-brand-gold text-brand-gold hover:bg-brand-gold/10'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md:'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
