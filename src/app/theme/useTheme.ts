import { use } from 'react';

import { ThemeContext, type ThemeContextValue } from './themeContext';

export function useTheme(): ThemeContextValue {
  const theme = use(ThemeContext);

  if (!theme) {
    throw new Error('useTheme precisa estar dentro de <ThemeProvider>.');
  }

  return theme;
}
