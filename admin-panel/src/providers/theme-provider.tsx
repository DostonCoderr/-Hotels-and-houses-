'use client';

import { useEffect } from 'react';
import { useThemeStore, applyTheme } from '@/store/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const accent = useThemeStore((s) => s.accent);
  const radius = useThemeStore((s) => s.radius);
  const sidebarStyle = useThemeStore((s) => s.sidebarStyle);
  const fontSize = useThemeStore((s) => s.fontSize);

  // Apply theme on mount + on change
  useEffect(() => {
    applyTheme({ mode, accent, radius, sidebarStyle, fontSize });
  }, [mode, accent, radius, sidebarStyle, fontSize]);

  // Listen to system theme changes
  useEffect(() => {
    if (mode !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      applyTheme({ mode, accent, radius, sidebarStyle, fontSize });
    };

    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [mode, accent, radius, sidebarStyle, fontSize]);

  return <>{children}</>;
}