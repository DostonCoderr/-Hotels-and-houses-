'use client';

import { motion } from 'framer-motion';
import {
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ApplicationStats } from '@/lib/api-applications';
import { useTranslation } from '@/lib/translations';

interface ApplicationStatsProps {
  stats: ApplicationStats | null;
}

const COLORS = {
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    gradient: 'from-primary/20 to-primary/5',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    gradient: 'from-blue-500/20 to-blue-500/5',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    gradient: 'from-amber-500/20 to-amber-500/5',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
  },
};

export function ApplicationStatsCards({ stats }: ApplicationStatsProps) {
  const { t } = useTranslation();

  const CARDS = [
    {
      key: 'total' as const,
      label: t.total,
      icon: Inbox,
      color: 'primary',
    },
    {
      key: 'new' as const,
      label: t.statusNew,
      icon: Sparkles,
      color: 'blue',
    },
    {
      key: 'in_work' as const,
      label: t.statusInWork,
      icon: Clock,
      color: 'amber',
    },
    {
      key: 'done' as const,
      label: t.statusDone,
      icon: CheckCircle2,
      color: 'emerald',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {CARDS.map((card, index) => {
        const Icon = card.icon;
        const color = COLORS[card.color as keyof typeof COLORS];
        const value = stats?.[card.key] || 0;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -2 }}
          >
            <Card className="relative border-0 bg-card rounded-2xl overflow-hidden">
              {/* Gradient dekoratsiya */}
              <div
                className={cn(
                  'absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-30 -translate-y-1/2 translate-x-1/2 bg-gradient-to-br',
                  color.gradient
                )}
              />

              <CardContent className="p-4 relative">
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center mb-3',
                    color.bg
                  )}
                >
                  <Icon className={cn('h-5 w-5', color.text)} />
                </div>

                <p className="text-2xl font-bold text-foreground tabular-nums mb-1">
                  {value.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{card.label}</p>

                {/* Davr ma'lumoti */}
                {(card.key === 'total' || card.key === 'new') && stats && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {t.today}: {stats.today}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}