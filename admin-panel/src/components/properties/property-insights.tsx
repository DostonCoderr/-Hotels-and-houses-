'use client';

import { useEffect, useState } from 'react';
import { animate, motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/translations';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { METRIC_COLORS, type Totals } from './property-stats-chart';

/* ---------------- Count-up ---------------- */
export function CountUp({ value }: { value: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(0, value, {
      duration: 1.1,
      ease: 'easeOut',
      onUpdate: (x) => setV(Math.round(x)),
    });
    return () => c.stop();
  }, [value]);
  return <>{formatNumber(v)}</>;
}

/* ---------------- Delta badge ---------------- */
export function Delta({ value, suffix }: { value: number; suffix?: string }) {
  const up = value >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium', up ? 'text-emerald-500' : 'text-rose-500')}>
      <Icon className="h-3 w-3" />
      {up ? '+' : '−'}
      {Math.abs(value).toFixed(1)}%
      {suffix && <span className="font-normal text-muted-foreground">{suffix}</span>}
    </span>
  );
}

/* ---------------- Sparkline ---------------- */
export function Sparkline({ data, color, id }: { data: number[]; color: string; id: string }) {
  const rows = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={44}>
      <AreaChart data={rows} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.75}
          fill={`url(#spark-${id})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ---------------- Qiziqish indeksi (ring) ---------------- */
export function InterestScore({ totals }: { totals: Totals }) {
  const { t } = useTranslation();
  const T = t as unknown as Record<string, string | undefined>;

  const engagement = totals.views > 0 ? (totals.favorites + totals.inquiries * 2 + totals.scheduled * 3) / totals.views : 0;
  const score = Math.min(100, Math.round(engagement * 1000));

  const tier =
    score >= 65
      ? { text: T.interestHigh ?? 'Yuqori talab', color: '#10b981' }
      : score >= 35
        ? { text: T.interestMedium ?? "O'rtacha talab", color: '#f59e0b' }
        : { text: T.interestLow ?? 'Past talab', color: '#f43f5e' };

  const R = 54;
  const C = 2 * Math.PI * R;

  return (
    <Card className="border-0 bg-card rounded-3xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{T.interestIndex ?? 'Qiziqish indeksi'}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 128 128" className="-rotate-90 h-full w-full" role="img" aria-label={`${score} / 100`}>
            <circle cx="64" cy="64" r={R} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
            <motion.circle
              cx="64"
              cy="64"
              r={R}
              fill="none"
              stroke={tier.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C * (1 - score / 100) }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tabular-nums text-foreground">{score}</span>
            <span className="text-[10px] text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold" style={{ color: tier.color }}>{tier.text}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {T.interestHint ?? "Saqlash, so'rov va ko'rik so'rovlarining ko'rishlarga nisbati asosida hisoblanadi."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- Voronka ---------------- */
export function PropertyFunnel({ totals }: { totals: Totals }) {
  const { t } = useTranslation();
  const T = t as unknown as Record<string, string | undefined>;

  const stages = [
    { key: 'views', label: T.totalViews ?? "Ko'rishlar", value: totals.views, color: METRIC_COLORS.views },
    { key: 'favorites', label: T.savedFavorites ?? 'Saqlanganlar', value: totals.favorites, color: METRIC_COLORS.favorites },
    { key: 'inquiries', label: T.inquiries ?? "So'rovlar", value: totals.inquiries, color: METRIC_COLORS.inquiries },
    { key: 'scheduled', label: T.scheduledViewings ?? "Ko'rikka yozilganlar", value: totals.scheduled, color: METRIC_COLORS.scheduled },
  ];

  // Logarifmik shkala: kichik qiymatlar ham ko'rinib tursin
  const base = Math.log10(Math.max(totals.views, 2) + 1);
  const width = (v: number) => Math.max(14, (Math.log10(v + 1) / base) * 100);

  return (
    <Card className="border-0 bg-card rounded-3xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{T.funnelTitle ?? "Mijozgacha yo'l"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stages.map((s, i) => {
          const prev = i > 0 ? stages[i - 1].value : 0;
          const conv = i > 0 && prev > 0 ? (s.value / prev) * 100 : null;
          return (
            <div key={s.key}>
              <div className="mb-1.5 flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-semibold tabular-nums text-foreground">
                  {formatNumber(s.value)}
                  {conv !== null && (
                    <span className="ml-2 font-normal text-muted-foreground">{conv.toFixed(1)}%</span>
                  )}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-muted/60">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: s.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${width(s.value)}%` }}
                  transition={{ duration: 0.9, delay: 0.1 * i, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}