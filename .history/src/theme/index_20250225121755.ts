import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#23374f', // brand.blue500
      light: '#91a0b2', // brand.blue300
      dark: '#15212f', // brand.blue700
    },
    secondary: {
      main: '#e9c476', // brand.gold500
      light: '#efd18a', // brand.gold300
      dark: '#8c7647', // brand.gold700
    },
    error: {
      main: '#ca2b28', // brand.red
    },
    text: {
      primary: '#000000',
      secondary: '#e9c476',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontFamily: "'Merriweather', serif",
      color: '#23374f',
    },
    h2: {
      fontFamily: "'Merriweather', serif",
      color: '#23374f',
    },
    h3: {
      fontFamily: "'Merriweather', serif",
      color: '#23374f',
    },
    h4: {
      fontFamily: "'Merriweather', serif",
      color: '#23374f',
    },
    h5: {
      fontFamily: "'Merriweather', serif",
      color: '#23374f',
    },
    h6: {
      fontFamily: "'Merriweather', serif",
      color: '#23374f',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
      variants: [
        {
          props: { variant: 'primary' },
          style: {
            backgroundColor: '#23374f',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1c2c3f',
            },
          },
        },
        {
          props: { variant: 'secondary' },
          style: {
            backgroundColor: '#e9c476',
            color: '#23374f',
            '&:hover': {
              backgroundColor: '#ba9d5e',
            },
          },
        },
      ],
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#23374f',
          '&:hover': {
            color: '#e9c476',
            textDecoration: 'none',
          },
        },
      },
    },
  },
});

export default customTheme;
