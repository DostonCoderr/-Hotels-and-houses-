'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation, Language } from '@/lib/i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGS: { code: Language; label: string; short: string; flag: string }[] = [
  { code: 'ru', label: 'Русский', short: 'RU', flag: '🇷🇺' },
  { code: 'uz', label: "O'zbekcha", short: 'UZ', flag: '🇺🇿' },
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = LANGS.find((l) => l.code === lang) || LANGS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change language"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 12px',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--bd)',
          color: 'var(--fg)',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 500,
          transition: 'all 0.2s',
        }}
      >
        <Globe size={16} color="var(--gold)" />
        <span style={{ fontSize: 16, lineHeight: 1 }}>{current.flag}</span>
        <span style={{ textTransform: 'uppercase' }}>{current.short}</span>
        <ChevronDown
          size={14}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: 200,
            // ✅ AYNAN SHU YERDA LIGHT/DARK RANGNI OLADI:
            background: 'var(--bg2)',
            border: '1px solid var(--bd)',
            borderRadius: 16,
            padding: 6,
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {LANGS.map((l) => {
            const active = lang === l.code;
            return (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: active ? 'rgba(201,163,106,0.15)' : 'transparent',
                  border: 'none',
                  color: active ? 'var(--gold)' : 'var(--fg)',
                  cursor: 'pointer',
                  fontSize: 14,
                  textAlign: 'left',
                  fontWeight: active ? 600 : 400,
                  transition: 'background 0.15s',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = 'rgba(201,163,106,0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: 20, lineHeight: 1 }}>{l.flag}</span>
                <span style={{ flex: 1 }}>{l.label}</span>
                {active && <Check size={16} color="var(--gold)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}