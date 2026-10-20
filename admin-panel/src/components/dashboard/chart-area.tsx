'use client';

import { useId, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ChartDataPoint } from '@/types';

interface ChartAreaProps {
  data: ChartDataPoint[];
  title?: string;
  delay?: number;
}

const SERIES = [
  { key: 'applications', name: 'Zayavkalar', color: 'hsl(var(--primary))' },
  { key: 'users', name: 'Foydalanuvchilar', color: '#3B82F6' },
  { key: 'views', name: "Ko'rishlar", color: '#10B981' },
] as const;

const fmtDate = (v: string) => {
  const d = new Date(v);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

export function ChartArea({ data, title = 'Statistika', delay = 0 }: ChartAreaProps) {
  const uid = useId().replace(/:/g, '');
  const [hidden, setHidden] = useState<string[]>([]);

  const totals = useMemo(
    () =>
      Object.fromEntries(
        SERIES.map((s) => [s.key, data.reduce((a, r) => a + Number((r as any)[s.key] || 0), 0)])
      ) as Record<string, number>,
    [data]
  );

  const toggle = (key: string) =>
    setHidden((h) => (h.includes(key) ? h.filter((k) => k !== key) : h.length === SERIES.length - 1 ? h : [...h, key]));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}>
      <Card className="overflow-hidden rounded-3xl border-0 bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-6 pb-2">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <div className="flex flex-wrap gap-2">
            {SERIES.map((s) => {
              const off = hidden.includes(s.key);
              return (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={!off}
                  onClick={() => toggle(s.key)}
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                    off ? 'border-border/60 text-muted-foreground/60' : 'border-transparent bg-muted/70 text-foreground'
                  )}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: off ? 'hsl(var(--muted-foreground))' : s.color, opacity: off ? 0.4 : 1 }} />
                  {s.name}
                  <span className="tabular-nums text-muted-foreground">{formatNumber(totals[s.key])}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-2 pb-4 pt-2">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
              <defs>
                {SERIES.map((s) => (
                  <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" style={{ stopColor: s.color, stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: s.color, stopOpacity: 0 }} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="2 6" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={fmtDate} minTickGap={24} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={44} />
              <Tooltip
                cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeOpacity: 0.25 }}
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="min-w-[160px] rounded-xl border border-border bg-card px-3 py-2.5 shadow-lg">
                      <p className="mb-1.5 text-[11px] text-muted-foreground">{fmtDate(String(label))}</p>
                      {payload.map((p) => (
                        <div key={String(p.dataKey)} className="flex items-center justify-between gap-4 text-xs">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                            {p.name}
                          </span>
                          <span className="font-semibold tabular-nums text-foreground">{formatNumber(Number(p.value))}</span>
                        </div>
                      ))}
                    </div>
                  ) : null
                }
              />
              {SERIES.filter((s) => !hidden.includes(s.key)).map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2.25}
                  fill={`url(#${uid}-${s.key})`}
                  dot={false}
                  activeDot={{ r: 4.5, strokeWidth: 2, stroke: 'hsl(var(--card))', fill: s.color }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}