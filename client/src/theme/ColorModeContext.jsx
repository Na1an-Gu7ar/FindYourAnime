import { createContext, useContext, useMemo, useState } from 'react';
import { buildTheme } from './theme.js';

const ColorModeContext = createContext(null);

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('color-mode') || 'dark');

  const value = useMemo(() => {
    const nextTheme = buildTheme(mode);

    return {
      mode,
      theme: nextTheme,
      toggleMode: () => {
        setMode((current) => {
          const next = current === 'dark' ? 'light' : 'dark';
          localStorage.setItem('color-mode', next);
          return next;
        });
      }
    };
  }, [mode]);

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode() {
  const context = useContext(ColorModeContext);

  if (!context) {
    throw new Error('useColorMode must be used inside ColorModeProvider');
  }

  return context;
}
