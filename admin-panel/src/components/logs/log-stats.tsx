'use client';

import { motion } from 'framer-motion';
import { FileText, Calendar, TrendingUp, Activity } from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import type { LogStats } from '@/lib/api-logs';
import { CountUp, Delta, useLooseT } from '@/components/dashboard/dashboard-kit';

interface LogStatsCardsProps {
  stats: LogStats | null;
}

const pct = (v: number, base: number) => (base > 0 ? Math.round(((v - base) / base) * 100) : null);

export function LogStatsCards({ stats }: LogStatsCardsProps) {
  const { t } = useTranslation();
  const T = useLooseT();

  // Backend faqat jami raqam beradi — o'rtachaga nisbatan farqni shundan hisoblaymiz
  const dayAvg = stats ? stats.month / 30 : 0;
  const weekAvg = dayAvg * 7;

  const cards = [
    { label: t.total, value: stats?.total, icon: FileText, color: 'hsl(var(--primary))', delta: null as number | null, hint: null as string | null },
    { label: t.today, value: stats?.today, icon: Calendar, color: '#10b981', delta: stats ? pct(stats.today, dayAvg) : null, hint: T.vsDailyAvg ?? "kunlik o'rtachaga nisbatan" },
    { label: t.thisWeek, value: stats?.week, icon: TrendingUp, color: '#f59e0b', delta: stats ? pct(stats.week, weekAvg) : null, hint: T.vsWeeklyAvg ?? "haftalik o'rtachaga nisbatan" },
    { label: t.thisMonth, value: stats?.month, icon: Activity, color: '#3b82f6', delta: null, hint: stats ? `≈ ${Math.round(dayAvg)} / ${T.perDay ?? 'kuniga'}` : null },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border/40 lg:grid-cols-4"
    >
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="bg-card p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Icon className="h-4 w-4" style={{ color: c.color }} />
              {c.label}
            </p>
            <div className="mt-3 flex items-end gap-2">
              {c.value === undefined ? (
                <span className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
              ) : (
                <span className="text-3xl font-bold tabular-nums leading-none text-foreground">
                  <CountUp value={c.value} />
                </span>
              )}
              {c.delta !== null && <Delta value={c.delta} className="mb-0.5" />}
            </div>
            {c.hint && <p className="mt-2 text-xs text-muted-foreground">{c.hint}</p>}
          </div>
        );
      })}
    </motion.div>
  );
}