import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import './integration.css';

/**
 * Type definitions for integration style options
 */
interface IntegrationOptions {
  // Color options
  bg?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'accent-light' |
       'success' | 'warning' | 'error' | null;
  
  text?: 'primary' | 'secondary' | 'tertiary' | 'accent' |
         'success' | 'warning' | 'error' | null;
  
  // Border options
  border?: boolean | 'top' | 'right' | 'bottom' | 'left' | null;
  borderAccent?: boolean;
  
  // Border radius options
  radius?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | null;
  
  // Shadow options
  shadow?: 'sm' | 'md' | 'lg' | null;
  
  // State options
  focus?: boolean;
  active?: boolean;
  
  // Transition options
  transition?: boolean | 'fast' | 'normal' | 'slow';
  
  // Spacing options
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | null;
  
  // Typography options
  font?: 'sans' | 'serif' | 'mono' | null;
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | null;
  
  // Component integration
  component?: 'form-container' | 'form-header' | 'wizard-container' | 
              'form-content' | 'mobile-nav' | null;
  
  // Connection options
  connect?: 'top' | 'bottom' | null;
  
  // Animation options
  animation?: 'fade-in' | 'slide-up' | 'loading' | null;
  
  // Responsive options
  responsive?: {
    sm?: boolean;
    md?: boolean;
    lg?: boolean;
    hideOnMobile?: boolean;
    hideOnDesktop?: boolean;
  };
}

/**
 * Hook to generate integration CSS classes based on options
 * @param options The integration style options
 * @param additionalClasses Additional TailwindCSS classes to include
 * @returns A string of CSS classes to apply to the component
 */
export function useIntegrationStyles(
  options: IntegrationOptions = {},
  additionalClasses: string = ''
): string {
  return useMemo(() => {
    const classes: string[] = [];
    
    // Background color classes
    if (options.bg) {
      classes.push(`int-bg-${options.bg}`);
    }
    
    // Text color classes
    if (options.text) {
      classes.push(`int-text-${options.text}`);
    }
    
    // Border classes
    if (options.border) {
      if (options.border === true) {
        classes.push('int-border');
      } else {
        classes.push(`int-border-${options.border}`);
      }
    }
    
    if (options.borderAccent) {
      classes.push('int-border-accent');
    }
    
    // Border radius classes
    if (options.radius) {
      classes.push(`int-radius-${options.radius}`);
    }
    
    // Shadow classes
    if (options.shadow) {
      classes.push(`int-shadow-${options.shadow}`);
    }
    
    // State classes
    if (options.focus) {
      classes.push('int-focus');
    }
    
    if (options.active) {
      classes.push('int-active');
    }
    
    // Transition classes
    if (options.transition) {
      classes.push('int-transition');
      
      if (options.transition !== true) {
        classes.push(`int-transition-${options.transition}`);
      }
    }
    
    // Spacing classes
    if (options.spacing) {
      classes.push(`int-spacing-${options.spacing}`);
    }
    
    // Typography classes
    if (options.font) {
      classes.push(`int-font-${options.font}`);
    }
    
    if (options.weight) {
      classes.push(`int-font-${options.weight}`);
    }
    
    // Component integration
    if (options.component) {
      classes.push(`int-${options.component}`);
    }
    
    // Connection classes
    if (options.connect) {
      classes.push(`int-connect-${options.connect}`);
    }
    
    // Animation classes
    if (options.animation) {
      classes.push(`int-${options.animation}`);
    }
    
    // Responsive classes
    if (options.responsive) {
      if (options.responsive.sm) {
        classes.push('int-sm\\:form-container');
      }
      
      if (options.responsive.md) {
        classes.push('int-md\\:form-container');
      }
      
      if (options.responsive.lg) {
        classes.push('int-lg\\:form-container');
      }
      
      if (options.responsive.hideOnMobile) {
        classes.push('int-md\\:hide-mobile');
      }
      
      if (options.responsive.hideOnDesktop) {
        classes.push('int-max-md\\:hide-desktop');
      }
    }
    
    // Combine with additional classes using the cn utility
    return cn(...classes, additionalClasses);
  }, [options, additionalClasses]);
}

/**
 * Component integration utilities to easily apply integration styles to common components
 */
export const integrationUtils = {
  /**
   * Get classes for form container integration
   */
  formContainer: (additionalClasses: string = '') => {
    return useIntegrationStyles({
      component: 'form-container',
      bg: 'primary',
      border: true,
      shadow: 'md',
      responsive: {
        sm: true,
        md:true,
        lg: true
      }
    }, additionalClasses);
  },
  
  /**
   * Get classes for form header integration
   */
  formHeader: (additionalClasses: string = '') => {
    return useIntegrationStyles({
      component: 'form-header',
      bg: 'primary',
      border: 'bottom',
      connect: 'bottom'
    }, additionalClasses);
  },
  
  /**
   * Get classes for wizard container integration
   */
  wizardContainer: (additionalClasses: string = '') => {
    return useIntegrationStyles({
      component: 'wizard-container',
      bg: 'secondary',
      border: 'bottom'
    }, additionalClasses);
  },
  
  /**
   * Get classes for form content integration
   */
  formContent: (additionalClasses: string = '') => {
    return useIntegrationStyles({
      component: 'form-content',
      bg: 'primary'
    }, additionalClasses);
  },
  
  /**
   * Get classes for mobile navigation integration
   */
  mobileNav: (additionalClasses: string = '') => {
    return useIntegrationStyles({
      component: 'mobile-nav',
      bg: 'accent',
      text: 'primary',
      responsive: {
        hideOnDesktop: true
      }
    }, additionalClasses);
  }
};

/**
 * Shorthand function to apply integration styles
 * @param options Integration style options or a predefined component style
 * @param additionalClasses Additional TailwindCSS classes to include
 * @returns A string of CSS classes to apply to the component
 */
export function int(
  options: IntegrationOptions | keyof typeof integrationUtils,
  additionalClasses: string = ''
): string {
  if (typeof options === 'string') {
    // Handle predefined component styles
    if (options in integrationUtils) {
      return integrationUtils[options as keyof typeof integrationUtils](additionalClasses);
    }
    // If it's not a valid component, return just the additional classes
    return additionalClasses;
  }
  
  // Handle custom options
  return useIntegrationStyles(options, additionalClasses);
}