'use client';

import { useEffect, useState } from 'react';
import { applyTheme } from '@/lib/theme';

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.dataset.theme === 'light');
  }, []);

  const toggle = () => {
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    setIsLight(!isLight);
  };

  return (
    <button className="ic" onClick={toggle} aria-label="Тема">
      {isLight ? '☾' : '☀'}
    </button>
  );
}