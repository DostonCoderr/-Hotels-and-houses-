'use client';

import { useEffect } from 'react';
import { applyTheme, getSavedTheme } from '@/lib/theme';
import { LanguageProvider } from '@/lib/i18n'; // ✅ Import

export function SiteProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme(getSavedTheme());
  }, []);

  return (
    <LanguageProvider> {/* ✅ O'rab oldik */}
      {children}
    </LanguageProvider>
  );
}