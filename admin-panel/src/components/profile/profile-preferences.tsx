'use client';

import { motion } from 'framer-motion';
import {
  Globe,
  Palette,
  Bell,
  Moon,
  Sun,
  Monitor,
  Check,
  Mail,
  MessageSquare,
  Smartphone,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/lib/translations';
import {
  useLanguageStore,
  LANGUAGE_LABELS,
  type Language,
} from '@/store/language';
import { useThemeStore } from '@/store/theme';
import { cn } from '@/lib/utils';

export function ProfilePreferences() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  // ⚠️ TUZATILDI: theme → mode, setTheme → setMode
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const notifications = [
    {
      id: 'email',
      icon: Mail,
      label: t.emailNotifications,
      description: t.emailNotificationsDesc,
      enabled: true,
    },
    {
      id: 'push',
      icon: Smartphone,
      label: t.pushNotifications,
      description: t.pushNotificationsDesc,
      enabled: true,
    },
    {
      id: 'messages',
      icon: MessageSquare,
      label: t.messageNotifications,
      description: t.messageNotificationsDesc,
      enabled: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {/* TIL */}
      <Card className="border-0 bg-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            {t.language}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left',
                language === lang
                  ? 'bg-primary/10 ring-2 ring-inset ring-primary/30'
                  : 'hover:bg-muted/50'
              )}
            >
              <span className="text-2xl">{LANGUAGE_LABELS[lang].flag}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {LANGUAGE_LABELS[lang].name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {LANGUAGE_LABELS[lang].native}
                </p>
              </div>
              {language === lang && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* MAVZU */}
      <Card className="border-0 bg-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            {t.theme}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            {
              id: 'light' as const,
              icon: Sun,
              label: t.themeLight,
              description: t.themeLightDesc,
            },
            {
              id: 'dark' as const,
              icon: Moon,
              label: t.themeDark,
              description: t.themeDarkDesc,
            },
            {
              id: 'system' as const,
              icon: Monitor,
              label: t.themeSystem,
              description: t.themeSystemDesc,
            },
          ].map((option) => {
            const Icon = option.icon;
            const isActive = mode === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setMode(option.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left',
                  isActive
                    ? 'bg-primary/10 ring-2 ring-inset ring-primary/30'
                    : 'hover:bg-muted/50'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    isActive ? 'bg-primary/20' : 'bg-muted'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {option.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* BILDIRISHNOMALAR */}
      <Card className="border-0 bg-card rounded-2xl lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            {t.notificationSettings}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {notif.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notif.description}
                  </p>
                </div>
                <Switch defaultChecked={notif.enabled} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}