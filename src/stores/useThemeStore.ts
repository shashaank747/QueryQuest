import { create } from 'zustand';

export type ThemeMode = 'slate-100' | 'slate-950';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('queryquest_theme') as ThemeMode;
    if (saved === 'slate-100' || saved === 'slate-950') {
      return saved;
    }
  }
  // Default to slate-100 as requested
  return 'slate-100';
};

const applyThemeToDOM = (theme: ThemeMode) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;

  if (theme === 'slate-100') {
    root.classList.remove('dark');
    root.classList.add('theme-slate-100');
    body.classList.remove('bg-slate-950', 'text-slate-100');
    body.classList.add('bg-slate-100', 'text-slate-800');
  } else {
    root.classList.add('dark');
    root.classList.remove('theme-slate-100');
    body.classList.add('bg-slate-950', 'text-slate-100');
    body.classList.remove('bg-slate-100', 'text-slate-800');
  }
};

export const useThemeStore = create<ThemeState>((set, get) => {
  const initialTheme = getInitialTheme();
  applyThemeToDOM(initialTheme);

  return {
    theme: initialTheme,

    toggleTheme: () => {
      const next: ThemeMode = get().theme === 'slate-100' ? 'slate-950' : 'slate-100';
      if (typeof window !== 'undefined') {
        localStorage.setItem('queryquest_theme', next);
      }
      applyThemeToDOM(next);
      set({ theme: next });
    },

    setTheme: (theme: ThemeMode) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('queryquest_theme', theme);
      }
      applyThemeToDOM(theme);
      set({ theme });
    },
  };
});
