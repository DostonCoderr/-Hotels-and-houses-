'use client';

import { useEffect, useState } from 'react';
import { THEMES, applyTheme, getSavedTheme, ThemeKey } from '@/lib/theme';

export function ThemeCustomizer() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeKey>('dark');

  useEffect(() => {
    setTheme(getSavedTheme());
  }, []);

  const pick = (key: ThemeKey) => {
    setTheme(key);
    applyTheme(key);
  };

  return (
    <>
      <button
        className="ic"
        onClick={() => setOpen(!open)}
        title="Конструктор тем"
        aria-label="Конструктор тем"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
          <circle cx="12" cy="12" r="9" />
          <circle cx="9" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="9" cy="15" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="15" r="1.2" fill="currentColor" stroke="none" />
          <path d="M12 3a9 9 0 000 18" />
        </svg>
      </button>

      <div className={`customizer ${open ? 'on' : ''}`}>
        <div className="cust-title">Выберите тему</div>
        <div className="theme-presets">
          {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
            const t = THEMES[key];
            return (
              <button
                key={key}
                className={`theme-preset ${theme === key ? 'on' : ''}`}
                data-theme={key}
                onClick={() => pick(key)}
              >
                <span className="tp-swatch" style={{ background: t.vars['--g'] }} />
                <span className="tp-swatch" style={{ background: t.vars['--bg'] }} />
                <span className="tp-swatch" style={{ background: t.vars['--tx'] }} />
                <span className="tp-name">{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}