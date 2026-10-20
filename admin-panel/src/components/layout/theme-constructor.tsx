'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Palette,
  X,
  RotateCcw,
  Sun,
  Moon,
  Monitor,
  Check,
} from 'lucide-react';
import {
  useThemeStore,
  ACCENT_COLORS,
  RADIUS_VALUES,
  FONT_SIZE_VALUES,
  type AccentColor,
  type ThemeMode,
  type BorderRadius,
  type SidebarStyle,
  type FontSize,
} from '@/store/theme';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemeConstructor() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    mode,
    accent,
    radius,
    sidebarStyle,
    fontSize,
    setMode,
    setAccent,
    setRadius,
    setSidebarStyle,
    setFontSize,
    reset,
  } = useThemeStore();

  // Next.js SSR / Hydration xatolarini oldini olish uchun mount bo'lganini tekshiramiz
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
        title="Theme Constructor"
      >
        <Palette className="h-5 w-5" />
      </Button>

      {/* Portal orqali drawer paneli body darajasiga ko'chiriladi */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                {/* Overlay — z-[9999] */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
                />

                {/* Drawer Panel — z-[10000] */}
                <motion.div
                  initial={{ x: '100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '100%', opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="fixed right-0 top-0 bottom-0 z-[10000] w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur-xl shrink-0">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%)`,
                        }}
                      >
                        <Palette
                          className="h-5 w-5"
                          style={{ color: 'hsl(var(--primary-foreground))' }}
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">
                          Theme Constructor
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          Dizaynni sozlang
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setOpen(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Content — Scroll bo'ladigan qism */}
                  <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                    {/* 1. MODE */}
                    <Section title="Rejim" subtitle="Light / Dark / System">
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'light' as ThemeMode, label: 'Light', icon: Sun },
                          { value: 'dark' as ThemeMode, label: 'Dark', icon: Moon },
                          { value: 'system' as ThemeMode, label: 'System', icon: Monitor },
                        ].map((m) => {
                          const Icon = m.icon;
                          const active = mode === m.value;
                          return (
                            <button
                              key={m.value}
                              onClick={() => setMode(m.value)}
                              className={cn(
                                'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all',
                                active
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50 bg-card'
                              )}
                            >
                              <Icon
                                className={cn(
                                  'h-5 w-5',
                                  active ? 'text-primary' : 'text-muted-foreground'
                                )}
                              />
                              <span
                                className={cn(
                                  'text-xs font-medium',
                                  active ? 'text-foreground' : 'text-muted-foreground'
                                )}
                              >
                                {m.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </Section>

                    {/* 2. ACCENT */}
                    <Section title="Asosiy rang" subtitle="Accent color">
                      <div className="grid grid-cols-6 gap-3">
                        {(Object.keys(ACCENT_COLORS) as AccentColor[]).map((key) => {
                          const color = ACCENT_COLORS[key];
                          const active = accent === key;
                          return (
                            <button
                              key={key}
                              onClick={() => setAccent(key)}
                              title={color.name}
                              className={cn(
                                'relative w-full aspect-square rounded-2xl border-2 transition-all',
                                active
                                  ? 'border-foreground scale-110'
                                  : 'border-transparent hover:scale-105'
                              )}
                              style={{ backgroundColor: color.primaryHex }}
                            >
                              {active && (
                                <motion.div
                                  layoutId="accent-check"
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <Check className="h-5 w-5 text-white" />
                                </motion.div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </Section>

                    {/* 3. RADIUS */}
                    <Section title="Burchaklar" subtitle="Border radius">
                      <div className="grid grid-cols-4 gap-3">
                        {(Object.keys(RADIUS_VALUES) as BorderRadius[]).map((key) => {
                          const active = radius === key;
                          return (
                            <button
                              key={key}
                              onClick={() => setRadius(key)}
                              className={cn(
                                'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                                active
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              )}
                            >
                              <div
                                className="w-8 h-8 bg-primary"
                                style={{ borderRadius: RADIUS_VALUES[key] }}
                              />
                              <span
                                className={cn(
                                  'text-xs capitalize',
                                  active ? 'text-foreground' : 'text-muted-foreground'
                                )}
                              >
                                {key}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </Section>

                    {/* 4. SIDEBAR */}
                    <Section title="Sidebar" subtitle="Sidebar style">
                      <div className="grid grid-cols-3 gap-3">
                        {(['dark', 'light', 'gradient'] as SidebarStyle[]).map(
                          (key) => {
                            const active = sidebarStyle === key;
                            return (
                              <button
                                key={key}
                                onClick={() => setSidebarStyle(key)}
                                className={cn(
                                  'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                                  active
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50'
                                )}
                              >
                                <div
                                  className={cn(
                                    'w-full h-12 rounded-lg',
                                    key === 'dark' && 'bg-black',
                                    key === 'light' && 'bg-white border border-border',
                                    key === 'gradient' &&
                                      'bg-gradient-to-b from-black to-primary/30'
                                  )}
                                />
                                <span
                                  className={cn(
                                    'text-xs capitalize',
                                    active ? 'text-foreground' : 'text-muted-foreground'
                                  )}
                                >
                                  {key}
                                </span>
                              </button>
                            );
                          }
                        )}
                      </div>
                    </Section>

                    {/* 5. FONT SIZE */}
                    <Section title="Shrift o'lchami" subtitle="Font size">
                      <div className="grid grid-cols-3 gap-3">
                        {(Object.keys(FONT_SIZE_VALUES) as FontSize[]).map((key) => {
                          const active = fontSize === key;
                          return (
                            <button
                              key={key}
                              onClick={() => setFontSize(key)}
                              className={cn(
                                'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                                active
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              )}
                            >
                              <span
                                className="font-bold text-foreground"
                                style={{
                                  fontSize:
                                    key === 'small'
                                      ? '14px'
                                      : key === 'medium'
                                      ? '20px'
                                      : '26px',
                                }}
                              >
                                Aa
                              </span>
                              <span
                                className={cn(
                                  'text-xs capitalize',
                                  active ? 'text-foreground' : 'text-muted-foreground'
                                )}
                              >
                                {key}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </Section>

                    {/* RESET */}
                    <div className="pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        onClick={reset}
                        className="w-full h-12"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset (default)
                      </Button>
                    </div>

                    {/* Preview */}
                    <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                      <p className="text-xs text-muted-foreground mb-2">Preview</p>
                      <div className="flex items-center gap-2">
                        <Button size="sm">Primary</Button>
                        <Button size="sm" variant="secondary">
                          Secondary
                        </Button>
                        <Button size="sm" variant="outline">
                          Outline
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}