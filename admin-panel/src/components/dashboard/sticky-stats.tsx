'use client';

import { useEffect, useState } from 'react';
import { Eye, Heart, MessageSquare, Calendar } from 'lucide-react';
import { CountUp, Spark } from '@/components/dashboard/dashboard-kit';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/translations';
import { cn } from '@/lib/utils';

const ICONS = { eye: Eye, heart: Heart, message: MessageSquare, calendar: Calendar };
const COLORS = {
  eye: 'hsl(var(--primary))',
  heart: '#f43f5e',
  message: '#10b981',
  calendar: '#f59e0b',
};

export function StickyStats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ views: 0, favorites: 0, applications: 0, scheduled: 0 });
  const [chartData, setChartData] = useState<{ views: number; favorites: number; applications: number }[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const { data: s } = await api.get('/stats/dashboard?period=7d');
        if (s && s.counts) {
          setStats({
            views: s.counts.views || 0,
            favorites: s.counts.favorites || 0,
            applications: s.counts.applications.total || 0,
            scheduled: s.counts.applications.new || 0,
          });
        }
        const { data: chart } = await api.get('/stats/chart?period=7d');
        if (Array.isArray(chart)) {
          setChartData(chart);
        }
      } catch (err) {
        console.error('Sticky stats xatosi:', err);
      }
    }
    load();
  }, []);

  const STAT_CARDS = [
    { key: 'views', label: t.totalViews, icon: 'eye', raw: stats.views, spark: chartData.map((c) => c.views) },
    { key: 'favorites', label: t.savedFavorites, icon: 'heart', raw: stats.favorites, spark: chartData.map((c) => c.favorites) },
    { key: 'inquiries', label: t.inquiries, icon: 'message', raw: stats.applications, spark: chartData.map((c) => c.applications) },
    { key: 'scheduled', label: t.scheduledViewings, icon: 'calendar', raw: stats.scheduled, spark: chartData.map((c) => c.applications) },
  ] as const;

  return (
    <div className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto [scrollbar-width:none]">
        {STAT_CARDS.map((s) => {
          const Icon = ICONS[s.icon];
          const color = COLORS[s.icon];
          return (
            <div
              key={s.key}
              className="flex flex-1 min-w-[200px] items-center justify-between gap-3 rounded-2xl border border-border/50 bg-card px-4 py-2 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground truncate">
                    {s.label}
                  </p>
                  <p className="text-xl font-bold tabular-nums text-foreground leading-tight">
                    <CountUp value={s.raw} />
                  </p>
                </div>
              </div>
              {s.spark && s.spark.length > 0 && (
                <div className="hidden w-16 shrink-0 sm:block opacity-80">
                  <Spark data={s.spark} color={color} height={24} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}