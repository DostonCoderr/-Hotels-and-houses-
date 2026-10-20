'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CountUp, Delta, Spark } from './dashboard-kit';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: 'primary' | 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  delay?: number;
  /** Mini grafik uchun ixtiyoriy seriya */
  spark?: number[];
}

const COLORS = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', hex: 'hsl(var(--primary))' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', hex: '#3b82f6' },
  green: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', hex: '#10b981' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', hex: '#a855f7' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', hex: '#f97316' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-500', hex: '#ec4899' },
};

export function StatsCard({ title, value, icon: Icon, trend, color = 'primary', delay = 0, spark }: StatsCardProps) {
  const c = COLORS[color];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}>
      <Card className="overflow-hidden rounded-3xl border-0 bg-card shadow-sm">
        <CardContent className="p-5 pb-0">
          <div className="flex items-start justify-between">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-2xl', c.bg)}>
              <Icon className={cn('h-5 w-5', c.text)} />
            </div>
            {trend && <Delta value={trend.value} />}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">{title}</p>
          <p className="mt-0.5 text-3xl font-bold tabular-nums text-foreground">
            {typeof value === 'number' ? <CountUp value={value} /> : value}
          </p>
          {trend && <p className="mt-1 text-xs text-muted-foreground">{trend.label}</p>}

          {spark ? (
            <div className="-mx-5 mt-2"><Spark data={spark} color={c.hex} height={44} /></div>
          ) : (
            <div className="h-5" />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}