'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/translations';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Tiplar                                                             */
/* ------------------------------------------------------------------ */

export type MetricKey = 'views' | 'favorites' | 'inquiries' | 'scheduled';
export type Totals = Record<MetricKey, number>;
export interface SeriesPoint extends Totals {
  label: string;
}

export const METRIC_COLORS: Record<MetricKey, string> = {
  views: 'hsl(var(--primary))',
  favorites: '#f43f5e',
  inquiries: '#10b981',
  scheduled: '#f59e0b',
};

const KEYS: MetricKey[] = ['views', 'favorites', 'inquiries', 'scheduled'];

export const sumOf = (rows: SeriesPoint[], k: MetricKey) =>
  rows.reduce((a, r) => a + r[k], 0);

export const pctChange = (now: number, before: number) =>
  before > 0 ? ((now - before) / before) * 100 : 0;

/* ------------------------------------------------------------------ */
/*  Chart                                                              */
/* ------------------------------------------------------------------ */

const RANGES = [7, 30, 90] as const;

interface Props {
  data: SeriesPoint[];
}

export function PropertyStatsChart({ data }: Props) {
  const { t } = useTranslation();
  const T = t as unknown as Record<string, string | undefined>;

  const [metric, setMetric] = useState<MetricKey>('views');
  const [range, setRange] = useState<(typeof RANGES)[number]>(30);

  const labels: Record<MetricKey, string> = {
    views: T.totalViews ?? "Ko'rishlar",
    favorites: T.savedFavorites ?? 'Saqlanganlar',
    inquiries: T.inquiries ?? "So'rovlar",
    scheduled: T.scheduledViewings ?? "Ko'rikka yozilganlar",
  };

  const color = METRIC_COLORS[metric];

  const { rows, total, avg, peak, delta } = useMemo(() => {
    const safeData = data || []; // Xavfsizlik uchun
    const rows = safeData.slice(-range);
    const prev = safeData.slice(-range * 2, -range);
    
    const total = sumOf(rows, metric);
    const peak = rows.length > 0 
      ? rows.reduce((m, r) => (r[metric] > m[metric] ? r : m), rows[0])
      : { label: '—', [metric]: 0 }; // Agar ma'lumot bo'lmasa

    return {
      rows,
      total,
      avg: total / Math.max(rows.length, 1),
      peak,
      delta: pctChange(total, sumOf(prev, metric)),
    };
  }, [data, metric, range]);

  const up = delta >= 0;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-0 bg-card rounded-3xl shadow-sm overflow-hidden">
        {/* ... (sarlavha va tablar o'zgarmaydi) ... */}
        <div className="flex flex-wrap items-start justify-between gap-4 p-6 pb-2">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {T.propertyChartTitle ?? 'Qiziqish dinamikasi'}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {T.chartSubtitle ?? "Oxirgi kunlar bo'yicha ko'rsatkichlar"}
            </p>
          </div>

          <div className="flex items-center rounded-full bg-muted/60 p-1" role="group" aria-label="Davr">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={range === r}
                onClick={() => setRange(r)}
                className={cn(
                  'relative rounded-full px-3.5 py-1 text-xs font-medium transition-colors',
                  range === r ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {range === r && (
                  <motion.span
                    layoutId="range-pill"
                    className="absolute inset-0 rounded-full bg-background shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{r}{T.dayShort ?? 'k'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto px-6 pt-3 pb-1 [scrollbar-width:none]">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={metric === k}
              onClick={() => setMetric(k)}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
                metric === k
                  ? 'border-transparent bg-foreground text-background'
                  : 'border-border/60 text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: METRIC_COLORS[k] }} />
              {labels[k]}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-3 px-6 pt-5">
          <motion.p
            key={`${metric}-${range}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tabular-nums text-foreground leading-none"
          >
            {formatNumber(total)}
          </motion.p>
          <span
            className={cn(
              'mb-0.5 flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
              up ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
            )}
          >
            {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="mb-0.5 text-xs text-muted-foreground">{T.vsPrevPeriod ?? 'oldingi davrga nisbatan'}</span>
        </div>

        <div className="px-2 pt-4 pb-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart key={metric} data={rows} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
              {/* ... (chart sozlamalari o'zgarmaydi) ... */}
              <defs>
                <linearGradient id={`grad-${metric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.35 }} />
                  <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 6" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} width={44} />
              <ReferenceLine y={avg} stroke={color} strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: `${T.average ?? "o'rtacha"} ${avg.toFixed(avg < 10 ? 1 : 0)}`, position: 'insideTopRight', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip cursor={{ stroke: color, strokeOpacity: 0.3, strokeWidth: 1 }} content={({ active, payload, label }) => active && payload?.length ? (<div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg"><p className="text-[11px] text-muted-foreground">{label}</p><p className="text-sm font-semibold text-foreground tabular-nums">{formatNumber(Number(payload[0].value))}{' '}<span className="font-normal text-muted-foreground">{labels[metric].toLowerCase()}</span></p></div>) : null} />
              <Area type="monotone" dataKey={metric} stroke={color} strokeWidth={2.5} fill={`url(#grad-${metric})`} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: 'hsl(var(--card))', fill: color }} animationDuration={700} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ... (pastki xulosa o'zgarmaydi) ... */}
        <div className="grid grid-cols-3 gap-px bg-border/40">
          {[
            { k: T.average ?? "O'rtacha", v: avg.toFixed(avg < 10 ? 1 : 0), s: T.perDay ?? 'kuniga' },
            { k: T.bestDay ?? 'Eng yaxshi kun', v: formatNumber(peak?.[metric] ?? 0), s: peak?.label ?? '—' },
            { k: T.period ?? 'Davr', v: `${range}`, s: T.days ?? 'kun' },
          ].map((x) => (
            <div key={x.k} className="bg-card px-6 py-4">
              <p className="text-xs text-muted-foreground">{x.k}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{x.v} <span className="text-xs font-normal text-muted-foreground">{x.s}</span></p>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}