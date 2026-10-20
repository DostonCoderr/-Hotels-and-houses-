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

export function DashboardStickyStats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    views: 0,
    favorites: 0,
    applications: 0,
    scheduled: 0,
  });
  const [chartData, setChartData] = useState<{views: number, favorites: number, applications: number}[]>([]);

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
        console.error("Sticky stats xatosi:", err);
      }
    }
    load();
  }, []);

  const STAT_CARDS = [
    { key: 'views', label: t.totalViews, icon: 'eye', raw: stats.views, spark: chartData.map(c => c.views) },
    { key: 'favorites', label: t.savedFavorites, icon: 'heart', raw: stats.favorites, spark: chartData.map(c => c.favorites) },
    { key: 'inquiries', label: t.inquiries, icon: 'message', raw: stats.applications, spark: chartData.map(c => c.applications) },
    { key: 'scheduled', label: t.scheduledViewings, icon: 'calendar', raw: stats.scheduled, spark: chartData.map(c => c.applications) }, // Taxminiy
  ] as const;

  return (
    <div className="w-full overflow-hidden bg-card border border-border/40 shadow-sm">
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/40">
        {STAT_CARDS.map((s) => {
          const Icon = ICONS[s.icon];
          const color = COLORS[s.icon];
          
          return (
            <div 
              key={s.key} 
              className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors"
            >
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="h-3.5 w-3.5" style={{ color }} />
                  <p className="text-[11px] font-medium text-muted-foreground truncate uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
                <p className="text-xl font-bold tabular-nums text-foreground">
                  <CountUp value={s.raw} />
                </p>
              </div>
              
              {s.spark && s.spark.length > 0 && (
                <div className="w-16 sm:w-20 shrink-0 opacity-80">
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