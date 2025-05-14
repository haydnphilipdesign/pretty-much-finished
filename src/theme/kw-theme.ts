// Keller Williams brand theme configuration

export const kwTheme = {
  colors: {
    primary: '#B40101', // KW Red
    secondary: '#000000', // Black
    background: '#FFFFFF', // White
    text: '#333333',
    border: '#E5E5E5',
    success: '#28A745',
    error: '#DC3545',
    warning: '#FFC107'
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif', // KW typically uses Montserrat
    heading: {
      fontWeight: 600,
      lineHeight: 1.2
    },
    body: {
      fontWeight: 400,
      lineHeight: 1.5
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md:'1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md:'0.5rem',
    lg: '1rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md:'0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)'
  },
  transitions: {
    default: '0.3s ease-in-out',
    fast: '0.15s ease-in-out',
    slow: '0.5s ease-in-out'
  },
  components: {
    button: {
      primary: {
        backgroundColor: '#B40101',
        color: '#FFFFFF',
        hoverBg: '#8B0000'
      },
      secondary: {
        backgroundColor: '#333333',
        color: '#FFFFFF',
        hoverBg: '#1A1A1A'
      }
    },
    input: {
      borderColor: '#E5E5E5',
      focusBorderColor: '#B40101',
      borderRadius: '0.25rem',
      padding: '0.5rem 1rem'
    },
    progressBar: {
      height: '0.5rem',
      backgroundColor: '#E5E5E5',
      fillColor: '#B40101',
      borderRadius: '9999px'
    },
    tooltip: {
      backgroundColor: '#333333',
      color: '#FFFFFF',
      borderRadius: '0.25rem',
      padding: '0.5rem 1rem'
    }
  }
};