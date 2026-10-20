'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Inbox, User, AlertCircle, CheckCircle2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/translations';
import { fetchNotifications, markAllAsRead, markAsRead, type Notification } from '@/lib/api-notifications';
import { formatRelativeTime } from '@/lib/format';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const ICONS = {
  application: { icon: Inbox, bg: 'bg-blue-500/10', color: 'text-blue-500' },
  user: { icon: User, bg: 'bg-purple-500/10', color: 'text-purple-500' },
  system: { icon: AlertCircle, bg: 'bg-amber-500/10', color: 'text-amber-500' },
  success: { icon: CheckCircle2, bg: 'bg-emerald-500/10', color: 'text-emerald-500' },
};

export default function NotificationsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications(100);
      setNotifications(data.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    loadData();
  };

  const handleClick = async (notif: Notification) => {
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.notifications}</h1>
          <p className="text-muted-foreground mt-1">{t.notificationsSubtitle || 'Barcha bildirishnomalar'}</p>
        </div>
        <Button variant="outline" onClick={handleMarkAllRead} className="rounded-full">
          <Check className="mr-2 h-4 w-4" />
          {t.markAllRead}
        </Button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-muted-foreground py-10">{t.loading}</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">{t.noNotifications}</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const config = ICONS[notif.type] || ICONS.system;
            const Icon = config.icon;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handleClick(notif)}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-colors border',
                  notif.isRead
                    ? 'bg-card border-border/40 hover:bg-muted/50'
                    : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                )}
              >
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', config.bg)}>
                  <Icon className={cn('h-6 w-6', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{notif.title}</h3>
                    {!notif.isRead && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{notif.message}</p>
                  <p className="text-xs text-muted-foreground/70 mt-2">
                    {formatRelativeTime(notif.createdAt)}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}