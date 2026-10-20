import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================
// TIPLAR
// ============================================================
export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'orange' | 'blue' | 'purple' | 'green' | 'red' | 'pink';
export type BorderRadius = 'none' | 'small' | 'medium' | 'large';
export type SidebarStyle = 'dark' | 'light' | 'gradient';
export type FontSize = 'small' | 'medium' | 'large';

interface ThemeState {
  // Mode
  mode: ThemeMode;
  // Accent
  accent: AccentColor;
  // Radius
  radius: BorderRadius;
  // Sidebar
  sidebarStyle: SidebarStyle;
  // Font
  fontSize: FontSize;
  // Actions
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  setRadius: (radius: BorderRadius) => void;
  setSidebarStyle: (style: SidebarStyle) => void;
  setFontSize: (size: FontSize) => void;
  reset: () => void;
}

// ============================================================
// ACCENT COLORS
// ============================================================
export const ACCENT_COLORS: Record<AccentColor, {
  name: string;
  primary: string;
  primaryHex: string;
  gradient: string;
}> = {
  orange: {
    name: 'Orange',
    primary: '25 95% 53%',
    primaryHex: '#F97316',
    gradient: 'from-orange-500 to-red-500',
  },
  blue: {
    name: 'Blue',
    primary: '217 91% 60%',
    primaryHex: '#3B82F6',
    gradient: 'from-blue-500 to-cyan-500',
  },
  purple: {
    name: 'Purple',
    primary: '262 83% 58%',
    primaryHex: '#8B5CF6',
    gradient: 'from-purple-500 to-pink-500',
  },
  green: {
    name: 'Green',
    primary: '142 71% 45%',
    primaryHex: '#10B981',
    gradient: 'from-green-500 to-emerald-500',
  },
  red: {
    name: 'Red',
    primary: '0 84% 60%',
    primaryHex: '#EF4444',
    gradient: 'from-red-500 to-rose-500',
  },
  pink: {
    name: 'Pink',
    primary: '330 81% 60%',
    primaryHex: '#EC4899',
    gradient: 'from-pink-500 to-rose-500',
  },
};

// ============================================================
// BORDER RADIUS
// ============================================================
export const RADIUS_VALUES: Record<BorderRadius, string> = {
  none: '0rem',
  small: '0.375rem',
  medium: '0.75rem',
  large: '1.25rem',
};

// ============================================================
// FONT SIZE
// ============================================================
export const FONT_SIZE_VALUES: Record<FontSize, string> = {
  small: '14px',
  medium: '16px',
  large: '18px',
};

// ============================================================
// STORE
// ============================================================
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      accent: 'orange',
      radius: 'medium',
      sidebarStyle: 'dark',
      fontSize: 'medium',

      setMode: (mode) => set({ mode }),
      setAccent: (accent) => set({ accent }),
      setRadius: (radius) => set({ radius }),
      setSidebarStyle: (sidebarStyle) => set({ sidebarStyle }),
      setFontSize: (fontSize) => set({ fontSize }),
      reset: () =>
        set({
          mode: 'dark',
          accent: 'orange',
          radius: 'medium',
          sidebarStyle: 'dark',
          fontSize: 'medium',
        }),
    }),
    {
      name: 'etagi-theme',
    }
  )
);

// ============================================================
// APPLY THEME
// ============================================================
export function applyTheme(state: {
  mode: ThemeMode;
  accent: AccentColor;
  radius: BorderRadius;
  sidebarStyle: SidebarStyle;
  fontSize: FontSize;
}) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Mode
  if (state.mode === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', isDark);
  } else {
    root.classList.toggle('dark', state.mode === 'dark');
  }

  // Accent
  const accent = ACCENT_COLORS[state.accent];
  root.style.setProperty('--primary', accent.primary);

  // Radius
  root.style.setProperty('--radius', RADIUS_VALUES[state.radius]);

  // Font size
  root.style.setProperty('--base-font-size', FONT_SIZE_VALUES[state.fontSize]);
  root.style.fontSize = FONT_SIZE_VALUES[state.fontSize];

  // Sidebar style
  root.setAttribute('data-sidebar', state.sidebarStyle);
}