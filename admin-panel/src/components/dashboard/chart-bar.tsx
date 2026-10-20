'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { formatNumber } from '@/lib/format';

interface ChartBarProps {
  data: { name: string; value: number; color?: string }[];
  title?: string;
  delay?: number;
}

const DEFAULT_COLORS = ['hsl(var(--primary))', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444', '#14B8A6'];

export function ChartBar({ data, title = 'Statistika', delay = 0 }: ChartBarProps) {
  const [active, setActive] = useState<number | null>(null);

  const { total, top } = useMemo(() => {
    const total = data.reduce((a, d) => a + d.value, 0);
    const top = data.reduce((m, d) => (d.value > m.value ? d : m), data[0] ?? { name: '—', value: 0 });
    return { total, top };
  }, [data]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}>
      <Card className="overflow-hidden rounded-3xl border-0 bg-card shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3 p-6 pb-2">
          <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Jami <span className="font-semibold tabular-nums text-foreground">{formatNumber(total)}</span>
              {top && data.length > 1 && (
                <> · eng yuqori: <span className="font-semibold text-foreground">{top.name}</span></>
              )}
            </p>
          </div>
        </div>

        <div className="px-2 pb-4 pt-2">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 10, right: 16, left: -8, bottom: 0 }} onMouseLeave={() => setActive(null)}>
              <CartesianGrid strokeDasharray="2 6" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={44} />
              <Tooltip
                cursor={false}
                content={({ active: a, payload, label }) =>
                  a && payload?.length ? (
                    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg">
                      <p className="text-[11px] text-muted-foreground">{label}</p>
                      <p className="text-sm font-semibold tabular-nums text-foreground">{formatNumber(Number(payload[0].value))}</p>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="value" radius={[10, 10, 4, 4]} maxBarSize={44} onMouseEnter={(_, i) => setActive(i)} animationDuration={700}>
                {data.map((entry, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={entry.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                    fillOpacity={active === null || active === i ? 1 : 0.35}
                    style={{ transition: 'fill-opacity 150ms' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}