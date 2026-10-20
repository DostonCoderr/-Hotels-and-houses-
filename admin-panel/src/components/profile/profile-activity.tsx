'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  LogIn,
  LogOut,
  Edit,
  Plus,
  Trash2,
  Upload,
  FileText,
  Clock,
  Globe,
  Loader2,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/format';
import { fetchMyActivity } from '@/lib/api-profile';
import type { ActivityLog } from '@/types';

const ACTION_ICONS: Record<string, any> = {
  login: LogIn,
  logout: LogOut,
  update: Edit,
  create: Plus,
  delete: Trash2,
  upload: Upload,
};

export function ProfileActivity() {
  const { t } = useTranslation();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // YUKLASH
  // ============================================================
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchMyActivity({ limit: 10 });
        setActivities(data.items || []);
      } catch (err) {
        console.error('Activity load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ============================================================
  // AMAL YORLIQLARI
  // ============================================================
  const actionLabels: Record<string, string> = {
    login: t.logActionLogin,
    logout: t.logActionLogout,
    update: t.logActionUpdate,
    create: t.logActionCreate,
    delete: t.logActionDelete,
    upload: t.logActionUpload,
  };

  const actionColors: Record<string, string> = {
    login: 'text-blue-500 bg-blue-500/10',
    logout: 'text-muted-foreground bg-muted',
    update: 'text-amber-500 bg-amber-500/10',
    create: 'text-emerald-500 bg-emerald-500/10',
    delete: 'text-rose-500 bg-rose-500/10',
    upload: 'text-purple-500 bg-purple-500/10',
  };

  const timeLabels = {
    now: t.timeNow,
    minutesAgo: t.timeMinutesAgo,
    hoursAgo: t.timeHoursAgo,
    daysAgo: t.timeDaysAgo,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="border-0 bg-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            {t.recentActivityLog}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <Activity className="h-7 w-7 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                {t.noActivity}
              </p>
            </div>
          ) : (
            <div className="space-y-3 relative">
              {/* Timeline chizig'i */}
              <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border" />

              {activities.map((activity, index) => {
                const Icon = ACTION_ICONS[activity.action] || FileText;
                const colorClass =
                  actionColors[activity.action] ||
                  'text-muted-foreground bg-muted';
                const [textColor, bgColor] = colorClass.split(' ');

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="relative flex items-start gap-3"
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 z-10 border-4 border-card',
                        bgColor
                      )}
                    >
                      <Icon className={cn('h-4 w-4', textColor)} />
                    </div>

                    {/* Ma'lumot */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs border-0',
                            bgColor,
                            textColor
                          )}
                        >
                          {actionLabels[activity.action] || activity.action}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {activity.entity}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-1">
                        {activity.details || t.noDetails}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(activity.createdAt, timeLabels)}
                        </span>
                        {activity.ip && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {activity.ip}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}