import React, { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// Enhanced Button Component
interface ButtonProps extends Omit<HTMLMotionProps<"button">, keyof ButtonHTMLAttributes<HTMLButtonElement>> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    isLoading?: boolean;
    fullWidth?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    isLoading,
    fullWidth,
    className = '',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
        outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
        ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md:"px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg"
    };

    return (
        <motion.button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...props}
        >
            {isLoading ? (
                <span className="animate-spin mr-2">⚪</span>
            ) : Icon && (
                <Icon className="w-5 h-5 mr-2" />
            )}
            {children}
        </motion.button>
    );
};

// Enhanced Card Component
interface CardProps extends HTMLMotionProps<"div"> {
    depth?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    depth = 'md',
    hover = true,
    className = '',
    ...props
}) => {
    const depthStyles = {
        none: '',
        sm: 'shadow-sm hover:shadow',
        md:'shadow-md hover:shadow-lg',
        lg: 'shadow-lg hover:shadow-xl'
    };

    return (
        <motion.div
            className={`bg-white rounded-xl p-6 transition-all duration-200 ${depthStyles[depth]} ${hover ? 'hover:-translate-y-1' : ''} ${className}`}
            whileHover={hover ? { scale: 1.02 } : undefined}
            {...props}
        >
            {children}
        </motion.div>
    );
};

// Enhanced Input Component
interface InputProps extends Omit<HTMLMotionProps<"input">, keyof InputHTMLAttributes<HTMLInputElement>> {
    label?: string;
    error?: string;
    icon?: LucideIcon;
    className?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <motion.input
                    className={`
            block w-full rounded-lg border-gray-300 shadow-sm
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
                    whileFocus={{ scale: 1.01 }}
                    {...props}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

// Enhanced Divider Component
interface DividerProps {
    className?: string;
    label?: string;
}

export const Divider: React.FC<DividerProps> = ({
    className = '',
    label
}) => {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
            </div>
            {label && (
                <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-sm text-gray-500">
                        {label}
                    </span>
                </div>
            )}
        </div>
    );
};

// Enhanced Badge Component
interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'error';
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    children,
    className = ''
}) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800'
    };

    return (
        <motion.span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
            whileHover={{ scale: 1.05 }}
        >
            {children}
        </motion.span>
    );
};

// Enhanced IconButton Component
interface IconButtonProps extends Omit<HTMLMotionProps<"button">, keyof ButtonHTMLAttributes<HTMLButtonElement>> {
    icon: LucideIcon;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
    icon: Icon,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
        ghost: "text-gray-600 hover:bg-gray-100"
    };

    const sizes = {
        sm: "p-1",
        md:"p-2",
        lg: "p-3"
    };

    const iconSizes = {
        sm: "w-4 h-4",
        md:"w-5 h-5",
        lg: "w-6 h-6"
    };

    return (
        <motion.button
            className={`rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${variants[variant]} ${sizes[size]} ${className}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            {...props}
        >
            <Icon className={iconSizes[size]} />
        </motion.button>
    );
}; 