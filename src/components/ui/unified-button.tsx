import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigation } from "../../providers/SmoothNavigationProvider";

// Define comprehensive button variants with consistent styling
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary actions - brand blue
        default: "bg-brand-blue text-white hover:bg-brand-blue/90 focus-visible:ring-brand-blue shadow-md hover:shadow-lg",
        
        // Secondary actions - brand gold (amber)
        secondary: "bg-amber-500 text-gray-900 hover:bg-amber-600 focus-visible:ring-amber-500 shadow-md hover:shadow-lg font-semibold",
        
        // Destructive actions - red
        destructive: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-md hover:shadow-lg",
        
        // Outline variants
        outline: "border border-brand-blue bg-transparent hover:bg-brand-blue/10 text-brand-blue focus-visible:ring-brand-blue",
        secondaryOutline: "border border-brand-gold bg-transparent hover:bg-brand-gold/10 text-brand-gold focus-visible:ring-brand-gold",
        
        // Ghost variants
        ghost: "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900",
        
        // Link style
        link: "underline-offset-4 hover:underline text-brand-blue hover:text-brand-blue/80 p-0 h-auto shadow-none",
        
        // Glass effects
        glass: "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 shadow-md hover:shadow-lg",
        
        // Hero variant (inverted)
        hero: "bg-white hover:bg-white/90 text-brand-blue shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 py-1.5 text-sm",
        lg: "h-11 px-6 py-2.5 text-lg",
        xl: "h-12 px-8 py-3 text-xl",
        icon: "h-10 w-10 p-2",
      },
      radius: {
        default: "rounded-md",
        full: "rounded-full",
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
      fullWidth: {
        true: "w-full",
      },
      withAnimation: {
        true: "transform transition-transform",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
      fullWidth: false,
      withAnimation: false,
    },
  }
);

export interface UnifiedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  to?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  withAnimation?: boolean;
}

/**
 * Unified Button Component
 * 
 * A flexible button component that consolidates all button variants from the project
 * including standard buttons, glass buttons, hero buttons, and shadcn/ui buttons.
 * 
 * Features:
 * - Multiple variants (default, secondary, destructive, outline, glass, hero)
 * - Size options (sm, default, lg, xl, icon)
 * - Border radius options (default, full, lg, xl)
 * - Optional animations with framer-motion
 * - Link capability with SmoothNavigationProvider
 * - Loading state
 * - Icon support (left or right position)
 * - Full width option
 */
const UnifiedButton = React.forwardRef<HTMLButtonElement, UnifiedButtonProps>(
  ({ 
    className,
    variant,
    size,
    radius,
    fullWidth,
    asChild = false,
    to,
    icon,
    iconPosition = "left",
    loading = false,
    withAnimation = false,
    children,
    type = "button",
    ...props 
  }, ref) => {
    const { Link } = useNavigation();
    
    // Loading spinner component
    const loadingSpinner = (
      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );

    // Button content
    const buttonContent = (
      <>
        {loading ? loadingSpinner : (iconPosition === "left" && icon)}
        {children}
        {!loading && iconPosition === "right" && icon}
      </>
    );

    // Use motion.div for animation if withAnimation is true
    const ButtonWrapper = withAnimation ? motion.div : React.Fragment;
    const animationProps = withAnimation
      ? {
          whilehover:{ scale: 1.02 },
          whileTap: { scale: 0.98 },
        }
      : {};

    // If it's a link
    if (to) {
      return (
        <ButtonWrapper {...animationProps}>
          <Link
            to={to}
            className={cn(
              buttonVariants({
                variant,
                size,
                radius,
                fullWidth,
              }),
              className
            )}
          >
            {buttonContent}
          </Link>
        </ButtonWrapper>
      );
    }

    // If it's a button
    const Comp = asChild ? Slot : "button";
    return (
      <ButtonWrapper {...animationProps}>
        <Comp
          type={type}
          className={cn(
            buttonVariants({
              variant,
              size,
              radius,
              fullWidth,
            }),
            className
          )}
          ref={ref}
          disabled={props.disabled || loading}
          {...props}
        >
          {buttonContent}
        </Comp>
      </ButtonWrapper>
    );
  }
);

UnifiedButton.displayName = "UnifiedButton";

export { UnifiedButton, buttonVariants };
