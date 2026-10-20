'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  Settings,
  Globe,
  Check,
  Inbox,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import {
  useLanguageStore,
  LANGUAGE_LABELS,
  type Language,
} from '@/store/language';
import { useTranslation } from '@/lib/translations';
import { ThemeSwitcher } from '@/components/layout/theme-switcher';
import { ThemeConstructor } from '@/components/layout/theme-constructor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { getFullImageUrl } from '@/components/profile/profile-header';
import { formatRelativeTime } from '@/lib/format';
import {
  fetchNotifications,
  markAllAsRead,
  markAsRead,
  type Notification,
} from '@/lib/api-notifications';

interface HeaderProps {
  onMenuClick?: () => void;
}

// ============================================================
// NOTIFICATION ICON
// ============================================================
function NotificationIcon({ type }: { type: Notification['type'] }) {
  const config = {
    application: { icon: Inbox, bg: 'bg-blue-500/10', color: 'text-blue-500' },
    user: { icon: User, bg: 'bg-purple-500/10', color: 'text-purple-500' },
    system: { icon: AlertCircle, bg: 'bg-amber-500/10', color: 'text-amber-500' },
    success: { icon: CheckCircle2, bg: 'bg-emerald-500/10', color: 'text-emerald-500' },
  };

  const { icon: Icon, bg, color } = config[type] || config.system; 

  return (
    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', bg)}>
      <Icon className={cn('h-4 w-4', color)} />
    </div>
  );
}

// ============================================================
// HEADER
// ============================================================
export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const admin = useAuthStore((s) => s.admin);
  const logout = useAuthStore((s) => s.logout);
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifPosition, setNotifPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Backend'dan yuklash
  const loadNotifications = useCallback(async () => {
    try {
      const data = await fetchNotifications(10);
      setNotifications(data.items);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error('❌ Notification load error:', err);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [mounted, loadNotifications]);

  // Pozitsiyani hisoblash
  useEffect(() => {
    if (!notifOpen) return;

    const updatePosition = () => {
      const btn = document.getElementById('notif-button');
      if (btn) {
        const rect = btn.getBoundingClientRect();
        setNotifPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [notifOpen]);

  const handleMarkRead = async (notif: Notification) => {
    try {
      if (!notif.isRead) {
        await markAsRead(notif.id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      }
      if (notif.link) {
        setNotifOpen(false);
        router.push(notif.link);
      }
    } catch (err) {
      console.error('❌ Mark as read error:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('❌ Mark all read error:', err);
    }
  };

  const segments = pathname.split('/').filter(Boolean);
  const pageKey = segments[0] || 'dashboard';
  const pageTitle = (t as any)[pageKey] || 'Admin';

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const avatarUrl = getFullImageUrl((admin as any)?.avatar);
  const initials = (admin?.name || 'A')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const notificationDropdown = notifOpen ? (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setNotifOpen(false)}
        className="fixed inset-0 z-[9998] bg-transparent"
      />

      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'fixed',
          top: `${notifPosition.top}px`,
          right: `${notifPosition.right}px`,
        }}
        className="w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl z-[9999] overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">
              {t.notifications}
            </h3>
            {unreadCount > 0 && (
              <Badge variant="outline" className="border-0 bg-rose-500/10 text-rose-500 text-xs">
                {unreadCount} {t.newNotifications}
              </Badge>
            )}
          </div>
          <button
            onClick={() => setNotifOpen(false)}
            className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <Bell className="h-7 w-7 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                {t.noNotifications}
              </p>
            </div>
          ) : (
            notifications.map((notif, index) => (
              <motion.button
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleMarkRead(notif)}
                className={cn(
                  'w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors border-b border-border/20 last:border-0',
                  !notif.isRead && 'bg-primary/5'
                )}
              >
                <NotificationIcon type={notif.type as any} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {notif.title}
                    </p>
                    {!notif.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {notif.message}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {formatRelativeTime(notif.createdAt)}
                  </p>
                </div>
              </motion.button>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center justify-between p-3 border-t border-border/40 bg-muted/20">
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-primary hover:underline font-medium"
            >
              {t.markAllRead}
            </button>
            <Link
              href="/notifications"
              onClick={() => setNotifOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground hover:underline font-medium"
            >
              {t.viewAll}
            </Link>
          </div>
        )}
      </motion.div>
    </>
  ) : null;

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-30 h-16 border-b border-border backdrop-blur-xl shrink-0"
        style={{
          backgroundColor: 'hsl(var(--background) / 0.8)',
          borderColor: 'hsl(var(--border))',
        }}
      >
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div>
              <motion.h1
                key={`${pageTitle}-${language}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-lg font-semibold text-foreground"
              >
                {pageTitle}
              </motion.h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Доверия {t.adminPanel}
              </p>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.search}
                className="pl-10 h-10 rounded-full bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-primary/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* TIL */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-muted/50 hover:bg-muted border border-border transition-colors">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">
                    {LANGUAGE_LABELS[language].native}
                  </span>
                  <span className="text-base">
                    {LANGUAGE_LABELS[language].flag}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 z-[110]">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {t.language}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      'cursor-pointer',
                      language === lang && 'bg-primary/10 text-primary'
                    )}
                  >
                    <span className="text-lg mr-2">
                      {LANGUAGE_LABELS[lang].flag}
                    </span>
                    <span className="flex-1">{LANGUAGE_LABELS[lang].name}</span>
                    {language === lang && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeSwitcher />
            <ThemeConstructor />

            {/* NOTIFICATIONS */}
            <Button
              id="notif-button"
              variant="ghost"
              size="icon"
              onClick={() => setNotifOpen(!notifOpen)}
              className={cn(
                'relative text-muted-foreground hover:text-foreground hover:bg-muted/50',
                notifOpen && 'bg-muted/50 text-foreground'
              )}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>

            {/* USER MENU */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-muted/50 transition-colors">
                  <Avatar className="w-8 h-8">
                    {avatarUrl ? (
                      <AvatarImage
                        src={avatarUrl}
                        alt={admin?.name || 'Admin'}
                      />
                    ) : null}
                    <AvatarFallback
                      className="text-xs font-bold"
                      style={{
                        background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%)`,
                        color: 'hsl(var(--primary-foreground))',
                      }}
                    >
                      {initials || '?'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-foreground truncate max-w-[100px]">
                      {admin?.name || 'Admin'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                      {admin?.email || ''}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-[110]">
                <DropdownMenuLabel>{t.myAccount}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    {t.profile}
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    {t.settings}
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      {mounted && notificationDropdown && createPortal(notificationDropdown, document.body)}
    </>
  );
}