'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { useThemeStore, type ThemeMode } from '@/store/theme';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const MODES: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export function ThemeSwitcher() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const CurrentIcon =
    mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-muted/50"
          title="Theme mode"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentIcon className="h-5 w-5" />
            </motion.div>
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 z-[110]">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MODES.map((m) => {
          const Icon = m.icon;
          const active = mode === m.value;
          return (
            <DropdownMenuItem
              key={m.value}
              onClick={() => setMode(m.value)}
              className={cn(
                'cursor-pointer',
                active && 'bg-primary/10 text-primary'
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span className="flex-1">{m.label}</span>
              {active && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}