'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Inbox } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Application } from '@/types';
import { STATUS_COLORS } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translations';

interface RecentApplicationsProps {
  applications: Application[];
  delay?: number;
}

export function RecentApplications({ applications, delay = 0 }: RecentApplicationsProps) {
  const { t } = useTranslation();

  const statusLabels: Record<string, string> = {
    new: t.statusNew,
    in_work: t.statusInWork,
    done: t.statusDone,
    closed: t.statusClosed,
  };
  const timeLabels = { now: t.timeNow, minutesAgo: t.timeMinutesAgo, hoursAgo: t.timeHoursAgo, daysAgo: t.timeDaysAgo };

  const initials = (name: string) =>
    (name || '?').split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join('');

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}>
      <Card className="rounded-3xl border-0 bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between px-3 pb-2 pt-3">
          <h3 className="text-base font-semibold text-foreground">{t.recentApplications}</h3>
          <Link href="/applications">
            <Button variant="ghost" size="sm" className="gap-1 rounded-full">
              {t.viewAll}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Inbox className="mb-2 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{t.noApplications}</p>
          </div>
        ) : (
          <ul>
            {applications.slice(0, 5).map((app, i) => (
              <motion.li
                key={app.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + i * 0.05 }}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-muted/50"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">{initials(app.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{app.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{app.phone}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className={cn('border-0 text-xs', STATUS_COLORS[app.status] || 'bg-muted')}>
                    {statusLabels[app.status] || app.status}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">{formatRelativeTime(app.createdAt, timeLabels)}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </Card>
    </motion.div>
  );
}