'use client';

import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { UserStats } from '@/lib/api-users';
import { useTranslation } from '@/lib/translations';

interface UserStatsCardsProps {
  stats: UserStats | null;
}

const COLORS = {
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-500' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
};

export function UserStatsCards({ stats }: UserStatsCardsProps) {
  const { t } = useTranslation();

  const CARDS = [
    {
      key: 'total' as const,
      label: t.totalUsers,
      icon: Users,
      color: 'primary',
    },
    {
      key: 'active' as const,
      label: t.active,
      icon: UserCheck,
      color: 'emerald',
    },
    {
      key: 'blocked' as const,
      label: t.blocked,
      icon: UserX,
      color: 'rose',
    },
    {
      key: 'today' as const,
      label: t.userToday,
      icon: UserPlus,
      color: 'blue',
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
            <Card className="border-0 bg-card rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      color.bg
                    )}
                  >
                    <Icon className={cn('h-5 w-5', color.text)} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground tabular-nums mb-1">
                  {value.toLocaleString()}
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