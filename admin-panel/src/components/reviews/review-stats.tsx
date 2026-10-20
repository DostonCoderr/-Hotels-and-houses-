'use client';

import { motion } from 'framer-motion';
import { Star, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReviewStats } from '@/lib/api-reviews';
import { useTranslation } from '@/lib/translations';

interface ReviewStatsCardsProps {
  stats: ReviewStats | null;
}

export function ReviewStatsCards({ stats }: ReviewStatsCardsProps) {
  const { t } = useTranslation();

  const cards = [
    {
      label: t.reviewsTotal,
      value: stats?.total || 0,
      icon: MessageSquare,
      color: 'primary',
    },
    {
      label: t.reviewsAvgRating,
      value: stats?.avgRating ? stats.avgRating.toFixed(1) : '0.0',
      icon: Star,
      color: 'amber',
      isRating: true,
    },
    {
      label: t.published,
      value: stats?.published || 0,
      icon: CheckCircle2,
      color: 'emerald',
    },
    {
      label: t.pending,
      value: stats?.pending || 0,
      icon: Clock,
      color: 'rose',
    },
  ];

  const COLORS = {
    primary: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      gradient: 'from-primary/20 to-primary/5',
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
    rose: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-500',
      gradient: 'from-rose-500/20 to-rose-500/5',
    },
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const color = COLORS[card.color as keyof typeof COLORS];

        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -2 }}
          >
            <Card className="relative border-0 bg-card rounded-2xl overflow-hidden">
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
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}