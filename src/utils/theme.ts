export type Theme = 'light' | 'dark';

const THEME_KEY = 'portfolio-theme';
const THEME_ATTR = 'data-theme';

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored) return stored;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  
  document.documentElement.setAttribute(THEME_ATTR, theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function toggleTheme(): Theme {
  const current = getInitialTheme();
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  return next;
}

export function initTheme(): void {
  if (typeof window === 'undefined') return;
  
  const theme = getInitialTheme();
  applyTheme(theme);
  
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const stored = localStorage.getItem(THEME_KEY);
    if (!stored) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}