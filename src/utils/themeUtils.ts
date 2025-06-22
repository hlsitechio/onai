
export type Theme = 'dark' | 'light' | 'system';

export const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getResolvedTheme = (theme: Theme): 'dark' | 'light' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const applyThemeToDocument = (theme: Theme) => {
  const root = window.document.documentElement;
  const resolvedTheme = getResolvedTheme(theme);
  
  // Remove existing theme classes
  root.classList.remove('light', 'dark');
  
  // Apply the resolved theme
  root.classList.add(resolvedTheme);
  
  return resolvedTheme;
};

export const toggleTheme = (currentTheme: Theme): Theme => {
  // Simple toggle between light and dark (ignore system for toggle)
  const resolvedTheme = getResolvedTheme(currentTheme);
  return resolvedTheme === 'dark' ? 'light' : 'dark';
};

export const isDarkMode = (theme: Theme): boolean => {
  return getResolvedTheme(theme) === 'dark';
};
