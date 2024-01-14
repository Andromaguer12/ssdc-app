import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003994',
      dark: '#002157'
    },
    secondary: {
      main: '#ffffff',
      dark: '#003994'
    },
    error: {
      main: '#FF4D4F',
      light: '#FF9495'
    },
    warning: {
      main: '#F9F136',
      light: '#FBF686'
    },
    success: {
      main: '#52C41A',
      light: '#97DB75'
    },
    info: {
      main: '#FFFFFF',
      light: '#B8B8B8'
    }
  },
  breakpoints: {
    values: {
      xs: 361,
      sm: 601,
      md: 769,
      lg: 900,
      xl: 1201
    }
  }
});

export default theme;
