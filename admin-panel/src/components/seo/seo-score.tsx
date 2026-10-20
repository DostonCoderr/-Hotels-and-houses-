'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scoreTone, type SeoCheck } from '@/lib/seo-utils';

export function ScoreRing({ score, size = 96, stroke = 9 }: { score: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const tone = scoreTone(score);

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full -rotate-90"
        role="img"
        aria-label={`SEO ball: ${score} / 100`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone.hex}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - score / 100) }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            'font-bold tabular-nums leading-none',
            tone.text,
            size >= 90 ? 'text-3xl' : 'text-lg'
          )}
        >
          {score}
        </span>
        {size >= 90 && (
          <span className="mt-0.5 text-[10px] text-muted-foreground">/ 100</span>
        )}
      </div>
    </div>
  );
}

const ICON = {
  ok: { Icon: CheckCircle2, cls: 'text-emerald-500' },
  warn: { Icon: AlertTriangle, cls: 'text-amber-500' },
  bad: { Icon: XCircle, cls: 'text-rose-500' },
};

export function Checklist({ checks }: { checks: SeoCheck[] }) {
  const order = { bad: 0, warn: 1, ok: 2 } as const;
  const sorted = [...checks].sort((a, b) => order[a.level] - order[b.level]);

  return (
    <ul className="space-y-1">
      {sorted.map((c) => {
        const { Icon, cls } = ICON[c.level];
        return (
          <li key={c.id} className="flex items-start gap-2.5 rounded-xl px-2 py-1.5">
            <Icon className={cn('mt-0.5 h-4 w-4 flex-shrink-0', cls)} aria-hidden />
            <div className="min-w-0">
              <p className={cn('text-sm', c.level === 'ok' ? 'text-muted-foreground' : 'font-medium text-foreground')}>{c.label}</p>
              {c.hint && <p className="text-xs text-muted-foreground">{c.hint}</p>}
            </div>
            <span className="sr-only">{c.level === 'ok' ? 'yaxshi' : c.level === 'warn' ? 'ogohlantirish' : 'muammo'}</span>
          </li>
        );
      })}
    </ul>
  );
}