'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from './constants';

const TRANSITION_CLASS = 'theme-transition';
const TRANSITION_MS = 220;

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const readTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

const readStored = (): Theme | null => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const timer = useRef<number>();

  useEffect(() => {
    setThemeState(readTheme());

    const media = window.matchMedia('(prefers-color-scheme: light)');
    const followSystem = (event: MediaQueryListEvent) => {
      if (readStored()) return;
      const next: Theme = event.matches ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      setThemeState(next);
    };

    media.addEventListener('change', followSystem);
    return () => media.removeEventListener('change', followSystem);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;

    if (!prefersReducedMotion()) {
      window.clearTimeout(timer.current);
      root.classList.add(TRANSITION_CLASS);
      timer.current = window.setTimeout(() => root.classList.remove(TRANSITION_CLASS), TRANSITION_MS);
    }

    root.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(readTheme() === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export default ThemeProvider;
