/**
 * Global Theme Configuration for PA Real Estate Support Services
 */

export const themeColors = {
  brand: {
    blue: '#3B82F6',
    darkBlue: '#2563EB',
    gold: '#F59E0B',
    darkGold: '#D97706',
  },
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    light: '#9CA3AF',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    accent: '#EFF6FF',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  }
};

export const typography = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  }
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md:'1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

export const animations = {
  duration: {
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
  },
  ease: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
};

export const breakpoints = {
  sm: '640px',
  md:'768px',
  lg: '1024px',
  xl: '1280px',
};

// Global theme object that combines all theme values
export const globalTheme = {
  colors: themeColors,
  typography,
  spacing,
  animations,
  breakpoints,
};

export default globalTheme;