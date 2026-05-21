import { createTheme } from '@mui/material/styles';

const shared = {
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(','),
    h1: { fontWeight: 800, letterSpacing: 0 },
    h2: { fontWeight: 800, letterSpacing: 0 },
    h3: { fontWeight: 800, letterSpacing: 0 },
    button: { fontWeight: 700, textTransform: 'none' }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 44
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true
      }
    }
  }
};

export function buildTheme(mode) {
  const isDark = mode === 'dark';

  return createTheme({
    ...shared,
    palette: {
      mode,
      primary: {
        main: isDark ? '#00e5ff' : '#006b7a'
      },
      secondary: {
        main: '#e94560'
      },
      background: {
        default: isDark ? '#070914' : '#f7f9fc',
        paper: isDark ? 'rgba(18, 24, 43, 0.78)' : 'rgba(255, 255, 255, 0.86)'
      },
      text: {
        primary: isDark ? '#f7fbff' : '#101624',
        secondary: isDark ? '#a8b3c7' : '#5d6878'
      }
    }
  });
}
